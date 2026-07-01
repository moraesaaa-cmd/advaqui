"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  HelpCircle,
  Palette,
  CreditCard,
  BookOpen,
  Users,
  Bot,
  User,
  BarChart3,
  MoreHorizontal,
} from "lucide-react";
import { useState } from "react";

type Tab = {
  href: string;
  label: string;
  Icon: typeof BarChart3;
  exact?: boolean;
  adminOnly?: boolean;
};

const TABS: Tab[] = [
  { href: "/painel", label: "Dashboard", Icon: BarChart3, exact: true, adminOnly: true },
  { href: "/painel/advogado", label: "Meu painel", Icon: LayoutDashboard },
  { href: "/painel/meu-perfil", label: "Meu perfil", Icon: User },
  { href: "/painel/pagamento", label: "Pagamento", Icon: CreditCard },
  { href: "/painel/artigos", label: "Artigos", Icon: FileText },
  { href: "/painel/perguntas", label: "Perguntas", Icon: HelpCircle },
  { href: "/painel/aparencia", label: "Aparência", Icon: Palette },
  { href: "/painel/blog", label: "Blog", Icon: BookOpen, adminOnly: true },
  { href: "/painel/leads", label: "Leads", Icon: Users, adminOnly: true },
  { href: "/painel/agentes", label: "Agentes", Icon: Bot, adminOnly: true },
];

export function PainelShell({
  isAdmin = false,
  children,
}: {
  isAdmin?: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const active = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const visibleTabs = isAdmin ? TABS : TABS.filter((t) => !t.adminOnly);
  const current = visibleTabs.find((t) => active(t.href, t.exact));

  // Bottom bar (mobile): 4 primeiros itens + "Mais" com o restante
  const barTabs = visibleTabs.slice(0, 4);
  const moreTabs = visibleTabs.slice(4);

  return (
    <div className="lg:flex lg:items-start" style={{ background: "#FAF7F0" }}>
      {/* ============ SIDEBAR (desktop) ============ */}
      <aside
        className="hidden lg:flex flex-col w-60 flex-shrink-0 sticky top-16 self-start border-r border-brand-line bg-white"
        style={{ height: "calc(100vh - 4rem)" }}
        aria-label="Navegação do painel"
      >
        <div className="px-5 pt-6 pb-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-brand-ink/40">
            Painel do advogado
          </p>
        </div>
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto pb-6">
          {visibleTabs.map((t) => {
            const on = active(t.href, t.exact);
            return (
              <Link
                key={t.href}
                href={t.href}
                aria-current={on ? "page" : undefined}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  on
                    ? "bg-brand-deep/[0.06] text-brand-ink font-semibold"
                    : "text-brand-ink/60 font-medium hover:text-brand-ink hover:bg-brand-bg"
                }`}
              >
                {on && (
                  <span
                    aria-hidden
                    className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full"
                    style={{ background: "#C8A24A" }}
                  />
                )}
                <t.Icon
                  className="w-[18px] h-[18px] flex-shrink-0"
                  style={on ? { color: "#C8A24A" } : undefined}
                  aria-hidden
                />
                {t.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* ============ MAIN ============ */}
      <div className="flex-1 min-w-0 pb-20 lg:pb-0">
        {/* Barra de contexto (mobile): mostra a página atual */}
        <div className="lg:hidden sticky top-16 z-30 bg-white/95 backdrop-blur border-b border-brand-line px-4 py-3">
          <p className="text-sm font-semibold text-brand-ink flex items-center gap-2">
            {current && <current.Icon className="w-4 h-4" style={{ color: "#C8A24A" }} aria-hidden />}
            {current?.label ?? "Painel"}
          </p>
        </div>

        {children}
      </div>

      {/* ============ BOTTOM BAR (mobile) ============ */}
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-brand-line"
        aria-label="Navegação do painel"
      >
        {moreOpen && moreTabs.length > 0 && (
          <div className="absolute bottom-full inset-x-0 bg-white border-t border-brand-line shadow-[0_-8px_24px_rgba(15,27,45,0.08)] p-2 grid grid-cols-2 gap-1">
            {moreTabs.map((t) => {
              const on = active(t.href, t.exact);
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  onClick={() => setMoreOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm ${
                    on
                      ? "bg-brand-deep/[0.06] text-brand-ink font-semibold"
                      : "text-brand-ink/70 font-medium"
                  }`}
                >
                  <t.Icon
                    className="w-4 h-4"
                    style={on ? { color: "#C8A24A" } : undefined}
                    aria-hidden
                  />
                  {t.label}
                </Link>
              );
            })}
          </div>
        )}
        <div className="grid grid-cols-5">
          {barTabs.map((t) => {
            const on = active(t.href, t.exact);
            return (
              <Link
                key={t.href}
                href={t.href}
                onClick={() => setMoreOpen(false)}
                aria-current={on ? "page" : undefined}
                className={`relative flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium ${
                  on ? "text-brand-ink" : "text-brand-ink/50"
                }`}
              >
                {on && (
                  <span
                    aria-hidden
                    className="absolute top-0 left-1/4 right-1/4 h-0.5 rounded-full"
                    style={{ background: "#C8A24A" }}
                  />
                )}
                <t.Icon
                  className="w-5 h-5"
                  style={on ? { color: "#C8A24A" } : undefined}
                  aria-hidden
                />
                {t.label}
              </Link>
            );
          })}
          {moreTabs.length > 0 && (
            <button
              type="button"
              onClick={() => setMoreOpen((v) => !v)}
              aria-expanded={moreOpen}
              className={`flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium ${
                moreOpen ? "text-brand-ink" : "text-brand-ink/50"
              }`}
            >
              <MoreHorizontal className="w-5 h-5" aria-hidden />
              Mais
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}
