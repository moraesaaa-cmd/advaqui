import { NextResponse } from "next/server";
import { analiseIA, pecaCompletaIA, type DadosRecurso } from "@/lib/ai/recurso";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/recurso-ia  { modo: "analise" | "completo", ...dados }
 *
 * Gera, via OpenAI (server-side), a análise das teses ou a peça completa do
 * recurso de multa. A chave fica só no servidor. Rate-limit por IP para conter
 * custo/abuso (endpoint usa API paga).
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Geração da peça completa = até ~85s por bloco (3 em paralelo). maxDuration
// dá folga para o Next abortar ANTES do Nginx (proxy_read_timeout 180s), de
// modo que o estorno do recurso rode mesmo no pior caso, evitando cobrança órfã.
export const maxDuration = 170;

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

/** Traduz código de erro da IA para mensagem amigável em português. */
function mensagemErroIA(erro?: string): string {
  if (!erro) return "Não foi possível gerar agora. Use o gerador padrão abaixo.";
  if (erro === "sem_chave")
    return "O serviço está temporariamente indisponível. Use o gerador padrão abaixo.";
  if (erro === "vazio")
    return "Não foi possível gerar o texto agora. Tente novamente ou use o gerador padrão.";
  if (/timeout|abort/i.test(erro))
    return "A geração demorou mais que o esperado. Tente novamente em alguns instantes.";
  if (/_429/.test(erro))
    return "O serviço está com muita demanda no momento. Aguarde um minuto e tente novamente.";
  if (/_5\d{2}/.test(erro))
    return "O serviço está instável no momento. Tente novamente em alguns instantes.";
  return "Não foi possível gerar agora. Use o gerador padrão abaixo.";
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
    console.log(`[recurso-ia] RATE_LIMIT modo=${modo} ip=${ip.slice(0, 8)}***`);
    const msgRL =
      modo === "analise"
        ? "Muitas análises seguidas. Aguarde um minuto antes de tentar novamente."
        : "Muitas gerações seguidas. Aguarde um minuto antes de tentar novamente.";
    return NextResponse.json({ ok: false, mensagem: msgRL }, { status: 429 });
  }

  // A PEÇA COMPLETA é o recurso pago: exige um token de cliente ATIVO (liberado
  // pelo admin após o pagamento) com recursos restantes. A ANÁLISE é gratuita.
  // EXCEÇÃO: advogados com plano Premium AdvAqui (plan_status=active) geram
  // sem pagar — o recurso de multa está incluso no plano mensal.
  let cliente: { id: string; recursos_restantes: number; token: string } | null = null;
  let premiumBypass = false;
  if (modo === "completo") {
    // Tenta bypass premium via sessão Supabase (cookie auth).
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const admin = createAdminClient();
        const { data: lawyer } = await admin
          .from("lawyers")
          .select("plan_status")
          .eq("id", user.id)
          .maybeSingle();
        if (lawyer?.plan_status === "active") {
          premiumBypass = true;
          cliente = { id: user.id, recursos_restantes: 999, token: `premium_${user.id}` };
        }
      }
    } catch {
      // Sem sessão ou erro de auth — segue para o fluxo normal com token.
    }

    if (!premiumBypass) {
      const token = clamp(body.token, 80);
      if (!token) {
        return NextResponse.json(
          { ok: false, motivo: "sem_acesso", mensagem: "Para gerar a peça completa, finalize o cadastro e o pagamento." },
          { status: 402 }
        );
      }
      try {
        const admin = createAdminClient();
        const { data: cli } = await admin
          .from("recurso_clientes")
          .select("id,status,recursos_restantes")
          .eq("access_token", token)
          .maybeSingle();
        if (!cli) {
          return NextResponse.json(
            { ok: false, motivo: "sem_acesso", mensagem: "Acesso não encontrado. Refaça o cadastro." },
            { status: 403 }
          );
        }
        if (cli.status !== "ativo") {
          return NextResponse.json(
            { ok: false, motivo: "aguardando", mensagem: "Seu acesso ainda não foi liberado. Assim que confirmarmos o pagamento, você poderá gerar a peça." },
            { status: 402 }
          );
        }
        if (cli.recursos_restantes <= 0) {
          return NextResponse.json(
            { ok: false, motivo: "esgotado", mensagem: "Você já usou todos os recursos do seu plano." },
            { status: 402 }
          );
        }
        // RESERVA ATÔMICA: desconta 1 recurso ANTES de chamar a IA paga, com
        // decremento condicional (filtra pelo saldo lido). Em corrida (duas
        // requisições simultâneas com o mesmo token), só UMA consegue reservar —
        // a outra não afeta linha e é barrada. Evita gerar N peças pagas
        // descontando só uma (abuso de custo da OpenAI). Estornamos se a IA falhar.
        const { data: reserva } = await admin
          .from("recurso_clientes")
          .update({ recursos_restantes: cli.recursos_restantes - 1 })
          .eq("access_token", token)
          .eq("status", "ativo")
          .eq("recursos_restantes", cli.recursos_restantes)
          .select("id")
          .maybeSingle();
        if (!reserva) {
          return NextResponse.json(
            { ok: false, motivo: "ocupado", mensagem: "Já há uma geração em andamento para o seu acesso. Aguarde alguns segundos e tente de novo." },
            { status: 409 }
          );
        }
        cliente = { id: cli.id, recursos_restantes: cli.recursos_restantes - 1, token };
      } catch {
        return NextResponse.json(
          { ok: false, motivo: "erro", mensagem: "Não foi possível verificar o seu acesso agora." },
          { status: 500 }
        );
      }
    }
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

  const t0 = Date.now();
  const r = modo === "completo" ? await pecaCompletaIA(dados) : await analiseIA(dados);

  if (!r.ok) {
    // A IA falhou: ESTORNA a reserva (devolve o recurso descontado), de forma
    // condicional para não estornar em duplicidade. Premium não tem reserva.
    if (cliente && !premiumBypass) {
      try {
        const admin = createAdminClient();
        await admin
          .from("recurso_clientes")
          .update({ recursos_restantes: cliente.recursos_restantes + 1 })
          .eq("access_token", cliente.token)
          .eq("recursos_restantes", cliente.recursos_restantes);
      } catch {
        /* estorno best-effort */
      }
    }
    // sem_chave ou erro → o cliente cai no gerador determinístico (não-IA).
    console.log(`[recurso-ia] FAIL modo=${modo} ip=${ip.slice(0, 8)}*** erro=${r.erro}`);
    const semChave = r.erro === "sem_chave";
    return NextResponse.json(
      {
        ok: false,
        fallback: true,
        mensagem: mensagemErroIA(r.erro)
      },
      { status: semChave ? 503 : 502 }
    );
  }

  const elapsed = Date.now() - t0;
  console.log(`[recurso-ia] OK modo=${modo} ip=${ip.slice(0, 8)}*** ms=${elapsed}`);

  // Peça gerada com sucesso: a reserva já descontou o recurso. Só guardamos a
  // peça no histórico para o cliente rever/baixar no painel (/recurso/painel).
  let restantes: number | undefined;
  if (cliente) {
    restantes = cliente.recursos_restantes;
    try {
      const admin = createAdminClient();
      await admin.from("recurso_pecas").insert({
        cliente_id: cliente.id,
        fase: dados.fase || null,
        infracao: dados.infracao || null,
        titulo: null,
        texto: r.texto
      });
    } catch {
      /* histórico é best-effort; não bloqueia a entrega da peça */
    }
  }

  return NextResponse.json({ ok: true, modo, texto: r.texto, recursos_restantes: restantes, premium: premiumBypass, ms: elapsed });
}
