import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminRequest } from "@/lib/auth/adminSession";
import { ADMIN_CREDENTIALS } from "@/lib/config";
import { callAI } from "@/lib/ai/core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

/**
 * POST /api/admin/ai-diagnostico
 *
 * Diagnóstico inteligente do site para o admin: coleta números REAIS do banco
 * (perfis incompletos, artigos, leads, saúde dos agentes) e pede à camada de
 * IA um relatório priorizado de ações. Nada é inventado — a IA só organiza e
 * prioriza os dados coletados aqui.
 *
 * Auth: cookie HMAC do admin OU sessão Supabase com o e-mail do admin
 * (mesmo critério da página /painel/agentes).
 */

async function isAdmin(): Promise<boolean> {
  if (isAdminRequest()) return true;
  try {
    const supabase = createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();
    return (
      !!user?.email &&
      user.email.toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase()
    );
  } catch {
    return false;
  }
}

export async function POST() {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient({ noStore: true });
  const seteDiasAtras = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  /* ── Coleta de dados reais (tolerante a falha parcial) ── */
  const [lawyersRes, articlesRes, leadsRes, logsRes, auditsRes] = await Promise.all([
    admin
      .from("lawyers")
      .select("plan_status,bio,photo_url,specialties,verified_oab,is_public,page_status"),
    admin.from("blog_articles").select("status"),
    admin
      .from("leads")
      .select("created_at,ai_resumo,matched_lawyer_id,status")
      .gte("created_at", seteDiasAtras),
    admin
      .from("agent_logs")
      .select("agent_name,status,tokens_used,cost_usd,duration_ms")
      .gte("created_at", seteDiasAtras),
    admin.from("site_audits").select("audit_type").eq("resolved", false)
  ]);

  type LRow = {
    plan_status: string;
    bio: string | null;
    photo_url: string | null;
    specialties: string[] | null;
    verified_oab: boolean;
    is_public?: boolean | null;
    page_status?: string | null;
  };
  const lawyers = (lawyersRes.data || []) as LRow[];
  const incompletos = lawyers.filter(
    (l) =>
      !l.photo_url ||
      !(l.bio && l.bio.trim().length >= 20) ||
      !(Array.isArray(l.specialties) && l.specialties.length > 0)
  ).length;

  const artigos = (articlesRes.data || []) as Array<{ status: string }>;
  const leads = (leadsRes.data || []) as Array<{
    ai_resumo: string | null;
    matched_lawyer_id: string | null;
    status: string;
  }>;
  const logs = (logsRes.data || []) as Array<{
    agent_name: string;
    status: string;
    tokens_used: number;
    cost_usd: number;
    duration_ms: number;
  }>;

  // Agrega agentes: runs, erros, tokens, custo (últimos 7 dias)
  const porAgente: Record<
    string,
    { runs: number; erros: number; tokens: number; custoUsd: number }
  > = {};
  for (const l of logs) {
    const a = (porAgente[l.agent_name] ||= { runs: 0, erros: 0, tokens: 0, custoUsd: 0 });
    a.runs += 1;
    if (l.status === "error") a.erros += 1;
    a.tokens += l.tokens_used || 0;
    a.custoUsd += Number(l.cost_usd) || 0;
  }

  const stats = {
    advogados: {
      total: lawyers.length,
      premiumAtivos: lawyers.filter((l) => l.plan_status === "active").length,
      oabVerificada: lawyers.filter((l) => l.verified_oab).length,
      perfisIncompletos: incompletos
    },
    blog: {
      total: artigos.length,
      publicados: artigos.filter((a) => a.status === "published").length
    },
    leadsUltimos7Dias: {
      total: leads.length,
      semAnaliseIA: leads.filter((l) => !l.ai_resumo).length,
      semAdvogadoDesignado: leads.filter((l) => !l.matched_lawyer_id).length
    },
    agentesUltimos7Dias: porAgente,
    auditoriasPendentes: (auditsRes.data || []).length
  };

  /* ── Diagnóstico via camada central de IA ── */
  const r = await callAI({
    feature: "admin_diagnostico",
    action: "diagnostico_site",
    messages: [
      {
        role: "system",
        content:
          "Você é o analista de operações do AdvAqui (diretório de advogados brasileiro). " +
          "Receberá métricas REAIS do site e deve devolver um diagnóstico curto e acionável em português, " +
          "em texto puro (sem markdown, sem asteriscos). Estrutura: 1) SAÚDE GERAL em uma frase; " +
          "2) PRIORIDADES — até 5 ações concretas em ordem de impacto, cada uma em 1-2 linhas, " +
          "citando o número que a justifica; 3) MONITORAR — até 3 pontos de atenção. " +
          "Não invente números nem funcionalidades; use apenas os dados fornecidos. " +
          "Seja direto e específico — nada de conselho genérico."
      },
      {
        role: "user",
        content: `Métricas do AdvAqui (agora):\n${JSON.stringify(stats, null, 2)}`
      }
    ],
    maxTokens: 900,
    temperature: 0.4,
    details: { origem: "painel_agentes" }
  });

  if (!r.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: "Não foi possível gerar o diagnóstico agora. Tente novamente.",
        stats
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, diagnostico: r.text, stats });
}
