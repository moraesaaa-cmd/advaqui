import { NextResponse } from "next/server";
import { getCurrentLawyer } from "@/lib/painel/server";
import { revisarPeticaoIA, type ModoPeticao } from "@/lib/ai/peticao";

/**
 * POST /api/painel/revisar-peticao — revisor/humanizador de petições por IA.
 *
 * Recurso do plano PREMIUM ativo do advogado logado (gasta tokens da OpenAI):
 *   - 401 se não autenticado;
 *   - 403 se o plano não estiver "active";
 *   - 429 se estourar o limite por hora.
 *
 * Body: { texto: string, modo: "revisar" | "humanizar" }
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIN_CHARS = 40;
const MAX_CHARS = 8000;

// Rate-limit leve em memória, por advogado (reinicia a cada deploy).
const hits = new Map<string, number[]>();
function rateLimited(id: string, max = 15, janelaMs = 60 * 60 * 1000): boolean {
  const now = Date.now();
  const arr = (hits.get(id) || []).filter((t) => now - t < janelaMs);
  if (arr.length >= max) {
    hits.set(id, arr);
    return true;
  }
  arr.push(now);
  hits.set(id, arr);
  return false;
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { ok: false, code: "invalid_json", error: "Requisição inválida." },
      { status: 400 }
    );
  }

  const current = await getCurrentLawyer();
  if (!current.ok) return NextResponse.json(current, { status: current.status });

  if (current.lawyer.plan_status !== "active") {
    return NextResponse.json(
      {
        ok: false,
        code: "premium_required",
        error: "O revisor de petições por IA é um recurso do plano premium ativo."
      },
      { status: 403 }
    );
  }

  const texto = typeof body.texto === "string" ? body.texto.trim() : "";
  if (texto.length < MIN_CHARS) {
    return NextResponse.json(
      { ok: false, code: "texto_curto", error: `Cole um texto com pelo menos ${MIN_CHARS} caracteres.` },
      { status: 400 }
    );
  }
  if (texto.length > MAX_CHARS) {
    return NextResponse.json(
      {
        ok: false,
        code: "texto_longo",
        error: `O texto excede ${MAX_CHARS.toLocaleString("pt-BR")} caracteres. Revise por partes.`
      },
      { status: 400 }
    );
  }

  const modo: ModoPeticao = body.modo === "humanizar" ? "humanizar" : "revisar";

  if (rateLimited(current.lawyer.id)) {
    return NextResponse.json(
      { ok: false, code: "rate_limited", error: "Muitas revisões na última hora. Tente novamente em instantes." },
      { status: 429 }
    );
  }

  // Limite mensal de uso do revisor por IA (controle de custo do plano premium).
  const LIMITE_MES = 3;
  const mesRef = new Date().toISOString().slice(0, 7);
  const usosMes =
    current.lawyer.revisor_usos_ref === mesRef ? current.lawyer.revisor_usos ?? 0 : 0;
  if (usosMes >= LIMITE_MES) {
    return NextResponse.json(
      {
        ok: false,
        code: "limite",
        error: "Você atingiu o limite de revisões por IA deste mês. Tente novamente no próximo mês."
      },
      { status: 429 }
    );
  }

  const r = await revisarPeticaoIA(texto, modo);
  if (!r.ok) {
    const code =
      r.erro === "sem_chave"
        ? "ia_indisponivel"
        : r.erro === "timeout"
        ? "timeout"
        : "erro_ia";
    const error =
      code === "ia_indisponivel"
        ? "A IA não está configurada no momento. Avise o suporte."
        : code === "timeout"
        ? "A revisão demorou demais. Tente um texto menor."
        : "Não foi possível revisar agora. Tente novamente.";
    return NextResponse.json({ ok: false, code, error }, { status: 503 });
  }

  // Contabiliza o uso do mês (silencioso) — controle de custo do plano premium.
  try {
    await current.admin
      .from("lawyers")
      .update({ revisor_usos: usosMes + 1, revisor_usos_ref: mesRef })
      .eq("id", current.lawyer.id);
  } catch {
    /* não bloqueia a entrega já gerada */
  }

  return NextResponse.json({ ok: true, texto: r.texto, modo });
}
