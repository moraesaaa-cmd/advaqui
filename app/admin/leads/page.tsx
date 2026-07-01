import { redirect } from "next/navigation";
import { isAdminRequest } from "@/lib/auth/adminSession";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildMetadata } from "@/lib/seo/metadata";

/**
 * /admin/leads — caixa de entrada dos leads captados (chat "Advogado Online",
 * ferramentas e formulários). Mostra nome, contato, cidade, área e resumo,
 * com botão de WhatsApp em 1 clique. Protegido pelo cookie HMAC de admin.
 */
export const metadata = buildMetadata({
  title: "Leads recebidos (admin)",
  description: "Caixa de entrada dos leads captados no site.",
  path: "/admin/leads",
  noIndex: true
});

export const dynamic = "force-dynamic";

type Lead = {
  id: string;
  nome: string | null;
  telefone: string | null;
  email: string | null;
  cidade: string | null;
  uf: string | null;
  area_juridica: string | null;
  resumo: string | null;
  origem: string | null;
  ferramenta: string | null;
  created_at: string | null;
};

function toWa(raw: string): string {
  let d = (raw || "").replace(/\D/g, "");
  if (!d) return "";
  if (d.length <= 11) d = "55" + d;
  return d;
}

function fmtData(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch {
    return iso.slice(0, 16).replace("T", " ");
  }
}

export default async function AdminLeadsPage() {
  if (!isAdminRequest()) {
    redirect("/login?redirect=/admin/leads");
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("leads")
    .select(
      "id,nome,telefone,email,cidade,uf,area_juridica,resumo,origem,ferramenta,created_at"
    )
    .order("created_at", { ascending: false })
    .limit(200);

  const leads = (data || []) as Lead[];

  return (
    <div className="container-narrow max-w-4xl py-10">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="font-display text-2xl font-bold text-brand-ink">
          Leads recebidos
        </h1>
        <span className="text-sm text-brand-ink/60">
          {leads.length} {leads.length === 1 ? "lead" : "leads"}
        </span>
      </div>
      <p className="text-sm text-brand-ink/70 mt-2">
        Pessoas que pediram contato pelo chat Advogado Online, por ferramentas
        ou formulários. Fale com cada uma no WhatsApp em 1 clique.
      </p>

      {error && (
        <div className="mt-6 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm px-4 py-3">
          Erro ao carregar leads: {error.message}
        </div>
      )}

      {!error && leads.length === 0 && (
        <div className="mt-6 rounded-xl bg-brand-bg border border-brand-line text-brand-ink/70 text-sm px-4 py-4">
          Nenhum lead ainda. Assim que alguém concluir uma conversa no chat com
          nome e WhatsApp, aparece aqui.
        </div>
      )}

      <div className="mt-6 space-y-3">
        {leads.map((l) => {
          const wa = toWa(l.telefone || "");
          const waUrl = wa
            ? `https://wa.me/${wa}?text=${encodeURIComponent(
                `Olá${l.nome ? ", " + l.nome.split(" ")[0] : ""}! Sou do AdvAqui, recebi seu contato sobre ${
                  l.area_juridica || "sua questão jurídica"
                }. Posso te ajudar?`
              )}`
            : "";
          return (
            <div
              key={l.id}
              className="rounded-2xl border border-brand-line bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <p className="font-semibold text-brand-ink">
                    {l.nome || "Sem nome"}
                    {l.area_juridica && (
                      <span className="ml-2 inline-block text-[11px] font-medium uppercase tracking-wide px-2 py-0.5 rounded-full bg-brand-deep/10 text-brand-deep">
                        {l.area_juridica}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-brand-ink/60 mt-0.5">
                    {[l.cidade, l.uf].filter(Boolean).join("/") || "cidade não informada"} ·{" "}
                    {fmtData(l.created_at)} · via {l.origem || l.ferramenta || "site"}
                  </p>
                  <p className="text-sm text-brand-ink/80 mt-1.5">
                    {l.telefone ? `📱 ${l.telefone}` : "sem telefone"}
                    {l.email ? ` · ✉ ${l.email}` : ""}
                  </p>
                  {l.resumo && (
                    <p className="text-sm text-brand-ink/70 mt-2 bg-brand-bg rounded-lg px-3 py-2">
                      {l.resumo}
                    </p>
                  )}
                </div>
                {waUrl && (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold shrink-0"
                    style={{ background: "#25D366" }}
                  >
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
