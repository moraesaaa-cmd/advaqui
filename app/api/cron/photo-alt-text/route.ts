import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const CRON_SECRET = process.env.CRON_SECRET || "";

/** Máximo de fotos processadas por execução (custo/latência). */
const MAX_BATCH = 10;

/** Tamanho máximo de imagem enviada à OpenAI (bytes). */
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

/** Tamanho máximo do alt_text gravado (descrição + nome). */
const MAX_ALT_LENGTH = 180;

type Candidate = {
  id: string;
  name: string;
  photo_url: string | null;
  city_name: string;
  uf: string;
  specialties: string[] | null;
};

/**
 * Detecta "coluna não existe" (migration 0018 pendente). PostgREST retorna
 * mensagens como `column lawyers.alt_text does not exist` (42703) ou
 * `Could not find the 'alt_text' column` no cache de schema.
 */
const COLUMN_MISSING_RE = /column .* does not exist|could not find .* column/i;

/** Resposta que parece recusa do modelo (não descreveu a imagem). */
const REFUSAL_RE =
  /não posso|nao posso|não consigo|nao consigo|desculpe|i can'?t|i cannot|i'?m sorry|unable to/i;

const VISION_SYSTEM_PROMPT = `Você escreve texto alternativo (alt) de fotos de perfil de advogados para um diretório jurídico brasileiro. Receberá a foto e o nome do profissional.

Escreva UMA descrição curta e profissional da foto, em português, no formato:
<descrição objetiva> — <Nome do profissional>

Exemplo de estilo: "Advogada sorridente em escritório, blazer azul — Maria Silva".

Regras:
- Máximo de 120 caracteres na descrição (antes do nome).
- Descreva só o que está visível: postura, vestimenta, ambiente (escritório, fundo neutro etc.).
- Sem termos subjetivos de aparência (ex.: bonito, elegante, jovem, atraente).
- Sem superlativos, sem qualificar competência, sem promessa de resultado.
- Responda SOMENTE com o texto do alt, sem aspas, sem markdown, sem explicações.`;

const TEXT_SYSTEM_PROMPT = `Você escreve texto alternativo (alt) de fotos de perfil de advogados para um diretório jurídico brasileiro. Você NÃO tem acesso à imagem — receberá apenas nome, cidade e áreas de atuação.

Escreva UM alt curto e profissional, em português, no formato:
<descrição factual> — <Nome do profissional>

Exemplo de estilo: "Advogada em Belo Horizonte/MG, atuação em Direito de Família — Maria Silva".

Regras:
- Máximo de 120 caracteres na descrição (antes do nome).
- Use apenas os dados fornecidos (cidade/UF e no máximo 2 áreas). Não invente nada visual.
- Sem termos subjetivos de aparência, sem superlativos, sem qualificar competência, sem promessa de resultado.
- Responda SOMENTE com o texto do alt, sem aspas, sem markdown, sem explicações.`;

/** Normaliza a resposta do modelo e garante que o nome está presente. */
function sanitizeAlt(raw: string, name: string): string | null {
  let alt = raw.trim().replace(/^["'`]+|["'`]+$/g, "").replace(/\s+/g, " ").trim();
  if (!alt) return null;
  if (REFUSAL_RE.test(alt) && alt.length < 120) return null;
  // Garante o nome no final (o modelo pode omitir).
  if (!alt.toLowerCase().includes(name.toLowerCase())) {
    alt = `${alt} — ${name}`;
  }
  alt = alt.slice(0, MAX_ALT_LENGTH).trim();
  // Alt curto demais não descreve nada útil — melhor manter o fallback padrão.
  if (alt.length < 15) return null;
  return alt;
}

/** Baixa a foto e devolve como data URL base64 (ou null se falhar). */
async function fetchImageAsDataUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length === 0 || buf.length > MAX_IMAGE_BYTES) return null;
    return `data:${contentType.split(";")[0]};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

/**
 * Gera alt-text descritivo para as fotos de perfil dos advogados
 * (roda 1x/dia via crontab do VPS).
 *
 * Busca lawyers com photo_url preenchido e alt_text ainda vazio (máx. 10 por
 * execução), baixa a foto e pede uma descrição curta e profissional via visão
 * (gpt-5.4-mini). Se a imagem não puder ser baixada ou o modelo recusar,
 * cai para um alt gerado só do contexto textual (nome + cidade + áreas),
 * sem visão. Grava em lawyers.alt_text; o site usa esse texto no atributo
 * alt das fotos, com fallback "Foto de {nome}" quando ausente.
 *
 * Se a migration 0018 ainda não foi aplicada (coluna alt_text ausente),
 * loga e retorna sem processar — não há onde persistir o resultado.
 */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") || "";
  if (!CRON_SECRET || token !== CRON_SECRET) {
    return NextResponse.json({ ok: false, error: "Não autorizado" }, { status: 401 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("[cron:photo-alt-text] OPENAI_API_KEY não configurada");
    return NextResponse.json(
      { ok: false, error: "OPENAI_API_KEY não configurada" },
      { status: 503 }
    );
  }

  // noStore: a URL do SELECT é idêntica entre execuções; sem isso o fetch
  // patchado do Next serviria o mesmo lote já processado do Data Cache.
  const supabase = createAdminClient({ noStore: true });

  const { data, error } = await supabase
    .from("lawyers")
    .select("id, name, photo_url, city_name, uf, specialties, alt_text")
    .not("photo_url", "is", null)
    .is("alt_text", null)
    .order("created_at", { ascending: true })
    .limit(MAX_BATCH);

  if (error && COLUMN_MISSING_RE.test(error.message)) {
    console.warn(
      "[cron:photo-alt-text] migration 0018 pendente — nada a processar:",
      error.message
    );
    return NextResponse.json({
      ok: true,
      processed: 0,
      persisted: false,
      message: "Coluna alt_text ausente (migration 0018 pendente)."
    });
  }
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const candidates = ((data || []) as Candidate[]).filter(
    (c) => typeof c.photo_url === "string" && c.photo_url.trim() !== ""
  );

  if (candidates.length === 0) {
    return NextResponse.json({ ok: true, processed: 0, generated: 0, results: [] });
  }

  const callOpenAI = (payload: Record<string, unknown>) =>
    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

  /** Extrai o texto da resposta ou null em erro HTTP/resposta vazia. */
  const contentOf = async (res: Response, label: string): Promise<string | null> => {
    if (!res.ok) {
      const errText = await res.text();
      console.error(`[cron:photo-alt-text] ${label} ${res.status}: ${errText.slice(0, 300)}`);
      return null;
    }
    const json = await res.json();
    return (json.choices?.[0]?.message?.content as string | undefined) || null;
  };

  const results: Array<{ ok: boolean; id: string; mode?: "vision" | "texto"; error?: string }> =
    [];
  let generated = 0;

  for (const lawyer of candidates) {
    try {
      let alt: string | null = null;
      let mode: "vision" | "texto" = "vision";

      // ---- Tentativa 1: visão (gpt-5.4-mini) -------------------------------
      const dataUrl = await fetchImageAsDataUrl(lawyer.photo_url as string);
      if (dataUrl) {
        const res = await callOpenAI({
          model: "gpt-5.4-mini",
          messages: [
            { role: "system", content: VISION_SYSTEM_PROMPT },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Foto de perfil de ${lawyer.name}. Escreva o alt.`
                },
                { type: "image_url", image_url: { url: dataUrl } }
              ]
            }
          ],
          max_completion_tokens: 300
        });
        const content = await contentOf(res, "vision gpt-5.4-mini");
        if (content) alt = sanitizeAlt(content, lawyer.name);
      }

      // ---- Fallback: contexto textual, sem visão ----------------------------
      if (!alt) {
        mode = "texto";
        const areas = (lawyer.specialties || []).slice(0, 2).join(", ");
        const userText = JSON.stringify({
          nome: lawyer.name,
          cidade: `${lawyer.city_name}/${lawyer.uf}`,
          areas: areas || null
        });
        let res = await callOpenAI({
          model: "gpt-5.4-mini",
          messages: [
            { role: "system", content: TEXT_SYSTEM_PROMPT },
            { role: "user", content: `Dados do profissional:\n${userText}` }
          ],
          max_completion_tokens: 300
        });
        let content = await contentOf(res, "texto gpt-5.4-mini");
        if (!content) {
          res = await callOpenAI({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: TEXT_SYSTEM_PROMPT },
              { role: "user", content: `Dados do profissional:\n${userText}` }
            ],
            max_tokens: 300,
            temperature: 0.3
          });
          content = await contentOf(res, "texto gpt-4o-mini");
        }
        if (content) alt = sanitizeAlt(content, lawyer.name);
      }

      if (!alt) {
        results.push({ ok: false, id: lawyer.id, error: "Não foi possível gerar o alt." });
        continue;
      }

      const { error: updErr } = await supabase
        .from("lawyers")
        .update({ alt_text: alt })
        .eq("id", lawyer.id);

      if (updErr) {
        if (COLUMN_MISSING_RE.test(updErr.message)) {
          console.warn(
            "[cron:photo-alt-text] migration 0018 pendente no UPDATE — interrompendo:",
            updErr.message
          );
          results.push({ ok: false, id: lawyer.id, error: "Coluna alt_text ausente." });
          break;
        }
        results.push({ ok: false, id: lawyer.id, error: updErr.message });
        continue;
      }

      generated += 1;
      results.push({ ok: true, id: lawyer.id, mode });

      // Pausa curta entre chamadas (rate limit / gentileza com a API).
      await new Promise((r) => setTimeout(r, 1500));
    } catch (err) {
      results.push({
        ok: false,
        id: lawyer.id,
        error: err instanceof Error ? err.message : "Erro"
      });
    }
  }

  return NextResponse.json({
    ok: true,
    processed: candidates.length,
    generated,
    failed: results.filter((r) => !r.ok).length,
    results
  });
}
