import { redirect } from "next/navigation";
import { isAdminRequest } from "@/lib/auth/adminSession";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildMetadata } from "@/lib/seo/metadata";

/**
 * /admin/crescimento — Robô de crescimento (prospecção OAB-safe).
 *
 * Gera, via OpenAI, uma mensagem de WhatsApp personalizada convidando cada
 * advogado em plano GRÁTIS a assinar o premium. É captação B2B (vender o
 * AdvAqui a advogados) — NÃO é captação de cliente final, que é vedada pela
 * OAB (Provimento 205/2021). O envio é em 1 clique (wa.me) e MANUAL: o admin
 * revisa e dispara. Sem auto-envio em massa.
 *
 * Proteção: cookie HMAC de admin (isAdminRequest). Sem sessão admin → /login.
 */
export const metadata = buildMetadata({
  title: "Crescimento — prospecção de advogados (admin)",
  description: "Gera convites de upgrade para advogados em plano grátis.",
  path: "/admin/crescimento",
  noIndex: true
});

export const dynamic = "force-dynamic";
export const maxDuration = 120;

const PLAN_PRICE = process.env.NEXT_PUBLIC_PIX_AMOUNT || "19.90";

type FreeLawyer = {
  id: string;
  name: string;
  whatsapp: string | null;
  phone: string | null;
  city_name: string | null;
  uf: string | null;
  specialties: string[] | null;
};

/** Mantém só dígitos e garante DDI 55 (Brasil) para o link wa.me. */
function toWaNumber(raw: string): string {
  let d = (raw || "").replace(/\D/g, "");
  if (!d) return "";
  if (d.length <= 11) d = "55" + d; // sem DDI → adiciona Brasil
  return d;
}

/** Mensagem-modelo (fallback) caso a IA falhe — sóbria e dentro da OAB. */
function fallbackPitch(l: FreeLawyer): string {
  const cidade = l.city_name ? ` em ${l.city_name}` : "";
  const primeiro = (l.name || "").split(" ")[0] || "Doutor(a)";
  return (
    `Olá, ${primeiro}! Aqui é do AdvAqui. Seu perfil já aparece no nosso diretório${cidade}. ` +
    `Quem busca advogado${cidade} hoje vê primeiro os perfis Premium. Por R$ ${PLAN_PRICE}/mês ` +
    `seu perfil sobe ao topo, ganha WhatsApp clicável e selo de verificação. Quer ativar?`
  );
}

async function generatePitch(l: FreeLawyer, apiKey: string): Promise<string> {
  const areas = Array.isArray(l.specialties) ? l.specialties.slice(0, 3).join(", ") : "";
  const prompt =
    `Escreva UMA mensagem curta de WhatsApp (máx. 55 palavras, tom profissional e cordial, ` +
    `português do Brasil, sem emojis exagerados) do AdvAqui (diretório de advogados) para o(a) ` +
    `advogado(a) ${l.name}${l.city_name ? `, de ${l.city_name}/${l.uf || ""}` : ""}` +
    `${areas ? `, que atua em ${areas}` : ""}. ` +
    `Objetivo: convidá-lo(a) a assinar o plano Premium (R$ ${PLAN_PRICE}/mês) para aparecer no topo ` +
    `das buscas da cidade dele(a), com WhatsApp clicável e selo de OAB verificada. ` +
    `É oferta B2B ao próprio advogado (não a clientes). Não prometa resultado. Não invente dados. ` +
    `Comece com "Olá, ${(l.name || "").split(" ")[0]}!". Termine com uma pergunta convidando a ativar.`;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 180,
        temperature: 0.8
      })
    });
    if (!res.ok) return fallbackPitch(l);
    const data = await res.json();
    const text = (data.choices?.[0]?.message?.content || "").trim();
    return text || fallbackPitch(l);
  } catch {
    return fallbackPitch(l);
  }
}

export default async function AdminCrescimentoPage() {
  if (!isAdminRequest()) {
    redirect("/login?redirect=/admin/crescimento");
  }

  const apiKey = process.env.OPENAI_API_KEY || "";
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("lawyers")
    .select("id,name,whatsapp,phone,city_name,uf,specialties")
    .eq("plan_status", "free")
    .order("created_at", { ascending: false })
    .limit(20);

  const lawyers = (data || []) as FreeLawyer[];
  const withContact = lawyers.filter((l) => (l.whatsapp || l.phone || "").replace(/\D/g, ""));

  // Gera os discursos em paralelo (rápido; cap de 20). Sem chave → só fallback.
  const pitches = await Promise.all(
    withContact.map(async (l) =>
      apiKey ? await generatePitch(l, apiKey) : fallbackPitch(l)
    )
  );

  return (
    <div className="container-narrow max-w-3xl py-10">
      <h1 className="font-display text-2xl font-bold text-brand-ink">
        Crescimento — convites de Premium
      </h1>
      <p className="text-sm text-brand-ink/70 mt-2">
        Mensagens geradas por IA para convidar advogados em plano grátis a
        assinar o Premium. Revise e envie em 1 clique pelo WhatsApp. É oferta ao
        próprio advogado (B2B) — não é captação de cliente final.
      </p>

      {error && (
        <div className="mt-6 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm px-4 py-3">
          Erro ao carregar advogados: {error.message}
        </div>
      )}

      {!error && withContact.length === 0 && (
        <div className="mt-6 rounded-xl bg-brand-bg border border-brand-line text-brand-ink/70 text-sm px-4 py-3">
          Nenhum advogado em plano grátis com WhatsApp/telefone no momento. À
          medida que novos advogados se cadastram, eles aparecem aqui.
        </div>
      )}

      <div className="mt-6 space-y-4">
        {withContact.map((l, i) => {
          const wa = toWaNumber(l.whatsapp || l.phone || "");
          const pitch = pitches[i];
          const waUrl = wa
            ? `https://wa.me/${wa}?text=${encodeURIComponent(pitch)}`
            : "";
          return (
            <div
              key={l.id}
              className="rounded-2xl border border-brand-line bg-white p-4"
            >
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="font-semibold text-brand-ink">{l.name}</p>
                  <p className="text-xs text-brand-ink/60">
                    {l.city_name || "—"}
                    {l.uf ? `/${l.uf}` : ""} ·{" "}
                    {(l.specialties || []).slice(0, 3).join(", ") || "sem áreas"}
                  </p>
                </div>
                {waUrl ? (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold"
                    style={{ background: "#25D366" }}
                  >
                    Abrir no WhatsApp
                  </a>
                ) : (
                  <span className="text-xs text-brand-ink/50">sem WhatsApp</span>
                )}
              </div>
              <p className="mt-3 text-sm text-brand-ink/80 bg-brand-bg rounded-xl px-3 py-2.5 whitespace-pre-wrap">
                {pitch}
              </p>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-brand-ink/40 mt-8 leading-relaxed">
        Para automação total (envio sem clique, 24/7) é preciso configurar um
        canal de envio (Resend/e-mail ou API de WhatsApp). A maior alavanca de
        leads continua sendo o tráfego (SEO/anúncios) que alimenta o chatbot.
      </p>
    </div>
  );
}
