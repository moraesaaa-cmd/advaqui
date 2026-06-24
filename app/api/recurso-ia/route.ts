import { NextResponse } from "next/server";
import { analiseIA, pecaCompletaIA, type DadosRecurso } from "@/lib/ai/recurso";

/**
 * POST /api/recurso-ia  { modo: "analise" | "completo", ...dados }
 *
 * Gera, via OpenAI (server-side), a análise das teses ou a peça completa do
 * recurso de multa. A chave fica só no servidor. Rate-limit por IP para conter
 * custo/abuso (endpoint usa API paga).
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WINDOW_MS = 60_000;
const MAX_ANALISE = 8; // análises por IP/min
const MAX_COMPLETO = 4; // peças completas por IP/min
const hits = new Map<string, number[]>();

function rateLimited(ip: string, max: number): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }
  return arr.length > max;
}

function clamp(v: unknown, n: number): string {
  return typeof v === "string" ? v.trim().slice(0, n) : "";
}

export async function POST(req: Request) {
  const xff = (req.headers.get("x-forwarded-for") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const ip =
    req.headers.get("x-real-ip") || (xff.length ? xff[xff.length - 1] : "") || "anon";

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, mensagem: "Requisição inválida." }, { status: 400 });
  }

  const modo = body.modo === "completo" ? "completo" : "analise";
  if (rateLimited(ip, modo === "completo" ? MAX_COMPLETO : MAX_ANALISE)) {
    return NextResponse.json(
      { ok: false, mensagem: "Muitas gerações seguidas. Aguarde um minuto." },
      { status: 429 }
    );
  }

  const dados: DadosRecurso = {
    fase: clamp(body.fase, 30) || "defesa-previa",
    infracao: clamp(body.infracao, 40) || "outra",
    nome: clamp(body.nome, 120),
    cpf: clamp(body.cpf, 20),
    placa: clamp(body.placa, 10),
    ait: clamp(body.ait, 40),
    orgao: clamp(body.orgao, 80),
    data: clamp(body.data, 20),
    cidade: clamp(body.cidade, 80),
    relato: clamp(body.relato, 1500)
  };

  const r = modo === "completo" ? await pecaCompletaIA(dados) : await analiseIA(dados);

  if (!r.ok) {
    // sem_chave ou erro → o cliente cai no gerador determinístico (não-IA).
    const semChave = r.erro === "sem_chave";
    return NextResponse.json(
      {
        ok: false,
        fallback: true,
        mensagem: semChave
          ? "IA indisponível no momento — use o gerador padrão abaixo."
          : "Não foi possível gerar com IA agora. Use o gerador padrão abaixo."
      },
      { status: semChave ? 503 : 502 }
    );
  }

  return NextResponse.json({ ok: true, modo, texto: r.texto });
}
