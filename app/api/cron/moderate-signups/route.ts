import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const CRON_SECRET = process.env.CRON_SECRET || "";

/** Máximo de cadastros avaliados por execução (custo/latência). */
const MAX_BATCH = 40;

/** Janela de busca: cadastros das últimas 26h (cron roda 1x/dia; 2h de folga). */
const WINDOW_HOURS = 26;

type Candidate = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  whatsapp: string | null;
  oab: string;
  oab_uf: string;
  city_name: string;
  uf: string;
  created_at: string;
};

type ModerationVerdict = { id: string; status: "ok" | "suspect"; note: string | null };

const SYSTEM_PROMPT = `Você é um moderador de cadastros de um diretório de advogados brasileiro. Recebe uma lista de cadastros recém-criados e classifica cada um como "ok" ou "suspeito", com um motivo curto (máx. 100 caracteres) quando suspeito.

Sinais de cadastro suspeito:
- E-mail descartável/temporário (ex.: tuamaeaquelaursa, noproposal, mailinator, guerrillamail, yopmail, temp-mail, 10minutemail, trashmail, dispostable, sharklasers e similares).
- Telefone/WhatsApp inválido: só zeros (000000...), dígitos todos repetidos (111111..., 999999999), sequências óbvias (123456789), curto demais (<10 dígitos com DDD).
- Número de OAB com formato impossível: mais de 7 dígitos, só zeros, ou claramente não numérico.
- Nome não-plausível como nome de pessoa: teclado aleatório (asdf, qwerty), palavrões, nomes de teste (Teste, Fulano, asd asd), uma letra só, marca/empresa em vez de pessoa.

Regras:
- Na dúvida, classifique "ok" — falso positivo incomoda um advogado real. Marque "suspeito" só com sinal claro.
- Nome estrangeiro, e-mail em provedor comum (gmail, hotmail, outlook, uol, bol, yahoo, domínio próprio de escritório) e telefone plausível NÃO são sinais de suspeita.
- Responda SOMENTE com JSON válido, sem markdown, sem texto fora do JSON, no formato:
{"results":[{"id":"<id recebido>","status":"ok"|"suspeito","motivo":"<curto ou null>"}]}
- Inclua TODOS os ids recebidos, exatamente como vieram.`;

/** Parse tolerante: aceita code fences, texto em volta, e valida item a item. */
function parseVerdicts(raw: string, validIds: Set<string>): ModerationVerdict[] {
  let text = raw.trim();
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced?.[1]) text = fenced[1].trim();
  // Recorta do primeiro { ao último } — tolera prefixo/sufixo de prosa.
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return [];
  text = text.slice(start, end + 1);

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return [];
  }

  const list = Array.isArray(parsed)
    ? parsed
    : Array.isArray((parsed as { results?: unknown[] })?.results)
      ? (parsed as { results: unknown[] }).results
      : [];

  const out: ModerationVerdict[] = [];
  for (const item of list) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const id = typeof o.id === "string" ? o.id : "";
    if (!validIds.has(id)) continue;
    const rawStatus = typeof o.status === "string" ? o.status.trim().toLowerCase() : "";
    const status: "ok" | "suspect" | null =
      rawStatus === "ok"
        ? "ok"
        : rawStatus === "suspeito" || rawStatus === "suspect"
          ? "suspect"
          : null;
    if (!status) continue;
    const motivo =
      typeof o.motivo === "string" && o.motivo.trim()
        ? o.motivo.trim().slice(0, 200)
        : typeof o.note === "string" && o.note.trim()
          ? o.note.trim().slice(0, 200)
          : null;
    out.push({ id, status, note: status === "suspect" ? motivo || "Sinais de cadastro suspeito" : null });
  }
  return out;
}

/**
 * Detecta "coluna não existe" (migration 0016 pendente). PostgREST retorna
 * mensagens como `column lawyers.moderation_status does not exist` (42703) ou
 * `Could not find the 'moderation_status' column` no cache de schema.
 */
const COLUMN_MISSING_RE = /column .* does not exist|could not find .* column/i;

/**
 * Modera cadastros recentes de advogados (roda 1x/dia via crontab do VPS).
 *
 * Busca lawyers criados nas últimas 26h ainda sem moderação, envia os dados
 * cadastrais para classificação (ok | suspect + motivo curto) e grava o
 * resultado em moderation_status/moderation_note. Se a migration 0016 ainda
 * não foi aplicada (colunas ausentes), loga e segue sem falhar — mesmo
 * padrão de tolerância do painel de perfil.
 *
 * Modo backfill: com ?backfill=1, ignora a janela de 26h e busca TODOS os
 * lawyers com moderation_status IS NULL (histórico ainda não moderado),
 * mantendo o limite de 40 por execução. Rode repetidamente até `checked: 0`.
 * Se a migration 0016 estiver pendente, o backfill não se aplica (não há
 * coluna para filtrar) e o retry usa a janela de 26h normal.
 */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") || "";
  if (!CRON_SECRET || token !== CRON_SECRET) {
    return NextResponse.json({ ok: false, error: "Não autorizado" }, { status: 401 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("[cron:moderate-signups] OPENAI_API_KEY não configurada");
    return NextResponse.json(
      { ok: false, error: "OPENAI_API_KEY não configurada" },
      { status: 503 }
    );
  }

  const backfill = req.nextUrl.searchParams.get("backfill") === "1";
  // noStore: no modo backfill a URL do SELECT é idêntica entre chamadas (sem
  // o cutoff de created_at), então o fetch patchado do Next serve o resultado
  // do Data Cache — a rota relia sempre o mesmo lote já moderado.
  const supabase = createAdminClient({ noStore: true });
  const cutoffIso = new Date(Date.now() - WINDOW_HOURS * 60 * 60 * 1000).toISOString();
  const baseCols =
    "id, name, email, phone, whatsapp, oab, oab_uf, city_name, uf, created_at";

  // Tenta filtrar por moderation_status IS NULL (só não-moderados). Se a
  // coluna não existe (migration 0016 pendente), refaz só pela janela de 26h.
  // No modo backfill, ignora a janela e pega qualquer não-moderado.
  let moderationColsAvailable = true;
  let candidates: Candidate[] = [];

  let firstQuery = supabase.from("lawyers").select(baseCols);
  if (!backfill) firstQuery = firstQuery.gte("created_at", cutoffIso);
  const first = await firstQuery
    .is("moderation_status", null)
    .order("created_at", { ascending: true })
    .limit(MAX_BATCH);

  if (first.error && COLUMN_MISSING_RE.test(first.error.message)) {
    console.warn(
      "[cron:moderate-signups] migration 0016 pendente — seguindo sem filtro/gravação de moderação:",
      first.error.message
    );
    moderationColsAvailable = false;
    const retry = await supabase
      .from("lawyers")
      .select(baseCols)
      .gte("created_at", cutoffIso)
      .order("created_at", { ascending: true })
      .limit(MAX_BATCH);
    if (retry.error) {
      return NextResponse.json({ ok: false, error: retry.error.message }, { status: 500 });
    }
    candidates = (retry.data || []) as Candidate[];
  } else if (first.error) {
    return NextResponse.json({ ok: false, error: first.error.message }, { status: 500 });
  } else {
    candidates = (first.data || []) as Candidate[];
  }

  if (candidates.length === 0) {
    return NextResponse.json({
      ok: true,
      checked: 0,
      suspects: 0,
      persisted: moderationColsAvailable,
      lawyers: []
    });
  }

  // ---- Chamada OpenAI (padrão triage: gpt-5.4-mini → fallback gpt-4o-mini) --
  const userPrompt = JSON.stringify(
    candidates.map((c) => ({
      id: c.id,
      nome: c.name,
      email: c.email,
      telefone: c.phone || c.whatsapp || null,
      oab: `${c.oab}/${c.oab_uf}`,
      cidade: `${c.city_name}/${c.uf}`
    }))
  );

  const chatMessages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: `Cadastros para moderar:\n${userPrompt}` }
  ];

  const callOpenAI = (payload: Record<string, unknown>) =>
    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

  let content = "";
  try {
    // Modelo novo primeiro; se a API recusar (nome/params), cai pro antigo.
    let response = await callOpenAI({
      model: "gpt-5.4-mini",
      messages: chatMessages,
      max_completion_tokens: 2000
    });
    if (!response.ok) {
      const errText = await response.text();
      console.error(
        `[cron:moderate-signups] gpt-5.4-mini ${response.status}: ${errText} — fallback gpt-4o-mini`
      );
      response = await callOpenAI({
        model: "gpt-4o-mini",
        messages: chatMessages,
        max_tokens: 2000,
        temperature: 0
      });
    }

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[cron:moderate-signups] OpenAI ${response.status}: ${errText}`);
      return NextResponse.json(
        { ok: false, error: "Falha na classificação (OpenAI)." },
        { status: 502 }
      );
    }

    const data = await response.json();
    content = data.choices?.[0]?.message?.content || "";
    const usage = data.usage;
    if (usage) {
      console.log(
        `[cron:moderate-signups] tokens — prompt: ${usage.prompt_tokens}, completion: ${usage.completion_tokens}, total: ${usage.total_tokens}`
      );
    }
  } catch (err) {
    console.error("[cron:moderate-signups] exception na chamada OpenAI", err);
    return NextResponse.json(
      { ok: false, error: "Erro ao classificar cadastros." },
      { status: 500 }
    );
  }

  const validIds = new Set(candidates.map((c) => c.id));
  const verdicts = parseVerdicts(content, validIds);

  if (verdicts.length === 0) {
    console.error(
      `[cron:moderate-signups] resposta sem JSON parseável (${content.slice(0, 300)})`
    );
    return NextResponse.json(
      { ok: false, error: "Resposta da classificação inválida.", checked: candidates.length },
      { status: 502 }
    );
  }

  // ---- Persistência (tolerante a coluna ausente) ---------------------------
  let updated = 0;
  if (moderationColsAvailable) {
    for (const v of verdicts) {
      const { error: updErr } = await supabase
        .from("lawyers")
        .update({
          moderation_status: v.status,
          moderation_note: v.note
        })
        .eq("id", v.id);
      if (updErr) {
        if (COLUMN_MISSING_RE.test(updErr.message)) {
          console.warn(
            "[cron:moderate-signups] migration 0016 pendente no UPDATE — resultados não persistidos:",
            updErr.message
          );
          moderationColsAvailable = false;
          break;
        }
        console.error(`[cron:moderate-signups] update falhou para ${v.id}:`, updErr.message);
        continue;
      }
      updated += 1;
    }
  }

  const suspects = verdicts.filter((v) => v.status === "suspect");
  const byId = new Map(candidates.map((c) => [c.id, c]));

  return NextResponse.json({
    ok: true,
    checked: candidates.length,
    classified: verdicts.length,
    suspects: suspects.length,
    updated,
    persisted: moderationColsAvailable,
    lawyers: suspects.map((v) => ({
      id: v.id,
      name: byId.get(v.id)?.name || null,
      email: byId.get(v.id)?.email || null,
      note: v.note
    }))
  });
}
