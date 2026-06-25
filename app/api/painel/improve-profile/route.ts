import { NextResponse } from "next/server";
import { getCurrentLawyer } from "@/lib/painel/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ── Rate limit: 3 chamadas por dia por advogado ── */

const DAY_MS = 86_400_000;
const MAX_PER_DAY = 3;
const hits = new Map<string, number[]>();

function rateLimited(userId: string): boolean {
  const now = Date.now();
  const arr = (hits.get(userId) || []).filter((t) => now - t < DAY_MS);
  arr.push(now);
  hits.set(userId, arr);
  // Limpeza periódica para não vazar memória
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= DAY_MS)) hits.delete(k);
    }
  }
  return arr.length > MAX_PER_DAY;
}

export async function POST(req: Request) {
  /* ── Auth ── */
  const current = await getCurrentLawyer();
  if (!current.ok) {
    return NextResponse.json(current, { status: current.status });
  }

  /* ── Premium gate ── */
  if (current.lawyer.plan_status !== "active") {
    return NextResponse.json(
      { ok: false, error: "Recurso disponível apenas para advogados Premium." },
      { status: 403 }
    );
  }

  /* ── Rate limit ── */
  if (rateLimited(current.lawyer.id)) {
    return NextResponse.json(
      { ok: false, error: "Limite de 3 usos por dia atingido. Tente novamente amanhã." },
      { status: 429 }
    );
  }

  /* ── Body (overrides opcionais) ── */
  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    // Body vazio é aceitável — usamos os dados do banco
  }

  const lawyer = current.lawyer;

  const name =
    typeof body.name === "string" && body.name.trim()
      ? body.name.trim()
      : lawyer.name;
  const oab =
    typeof body.oab === "string" && body.oab.trim()
      ? body.oab.trim()
      : lawyer.oab;
  const city =
    typeof body.city === "string" && body.city.trim()
      ? body.city.trim()
      : lawyer.city_name;
  const specialties = Array.isArray(body.specialties)
    ? (body.specialties.filter(
        (s): s is string => typeof s === "string" && s.trim().length > 0
      ) as string[])
    : lawyer.specialties || [];
  const bio =
    typeof body.bio === "string" && body.bio.trim()
      ? body.bio.trim()
      : lawyer.bio || "";

  /* ── Prompt OpenAI ── */
  const systemPrompt =
    "Você é um especialista em marketing jurídico e copywriting. " +
    "Transforme os dados básicos de um perfil de advogado em uma apresentação profissional, " +
    "persuasiva e otimizada para SEO. Escreva em português brasileiro. Seja conciso (máximo 3 parágrafos na bio). " +
    "Não use juridiquês excessivo. Destaque a expertise e como o advogado pode ajudar clientes. " +
    "Não invente informações — use apenas os dados fornecidos.";

  const userPrompt = [
    `Nome: ${name || "Não informado"}`,
    `OAB: ${oab || "Não informado"}/${lawyer.oab_uf || lawyer.uf || ""}`,
    `Cidade: ${city || "Não informada"}/${lawyer.uf || ""}`,
    `Especialidades: ${specialties.length ? specialties.join(", ") : "Não informadas"}`,
    `Bio atual: ${bio || "Nenhuma"}`,
    "",
    "Retorne um JSON com esta estrutura:",
    "{",
    '  "bio": "texto da bio melhorada (máximo 500 caracteres)",',
    '  "shortSummary": "resumo curto para SEO (máximo 160 caracteres)",',
    '  "suggestedTitle": "título profissional, ex: Advogado Trabalhista em Almenara/MG"',
    "}"
  ].join("\n");

  /* ── Chamada OpenAI ── */
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY não configurada");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 1500,
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[improve-profile] OpenAI error", response.status, errText);
      return NextResponse.json(
        { ok: false, error: "Não foi possível gerar sugestões agora. Tente novamente em alguns instantes." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      console.error("[improve-profile] OpenAI returned empty content");
      return NextResponse.json(
        { ok: false, error: "Não foi possível gerar sugestões agora. Tente novamente em alguns instantes." },
        { status: 502 }
      );
    }

    const parsed = JSON.parse(content) as {
      bio: string;
      shortSummary: string;
      suggestedTitle: string;
    };

    // Clamp
    const suggestions = {
      bio: (parsed.bio || "").slice(0, 500),
      shortSummary: (parsed.shortSummary || "").slice(0, 160),
      suggestedTitle: parsed.suggestedTitle || ""
    };

    return NextResponse.json({ ok: true, suggestions });
  } catch (err) {
    console.error("[improve-profile] unexpected error", err);
    return NextResponse.json(
      { ok: false, error: "Não foi possível gerar sugestões agora. Tente novamente em alguns instantes." },
      { status: 502 }
    );
  }
}
