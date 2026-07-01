"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, HelpCircle, Palette, CreditCard, BookOpen, Users, Bot, User, BarChart3 } from "lucide-react";

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

export function PainelNav({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const active = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const visibleTabs = isAdmin ? TABS : TABS.filter((t) => !t.adminOnly);

  return (
    <div className="sticky top-16 z-30 bg-brand-bg/95 backdrop-blur border-b border-brand-line">
      <div className="relative">
      <nav className="container-tight flex items-center gap-1 overflow-x-auto scroll-smooth" aria-label="Painel">
        {visibleTabs.map((t) => {
          const on = active(t.href, t.exact);
          return (
            <Link
              key={t.href}
              href={t.href}
              aria-current={on ? "page" : undefined}
              className={`relative inline-flex items-center gap-2 px-3.5 py-3 text-sm font-medium whitespace-nowrap transition ${
                on ? "text-brand-ink" : "text-brand-ink/70 hover:text-brand-ink"
              }`}
            >
              <t.Icon className="w-4 h-4" aria-hidden />
              {t.label}
              {on && (
                <span
                  className="absolute left-2 right-2 bottom-0 h-0.5 rounded-full"
                  style={{ background: "#C8A24A" }}
                />
              )}
            </Link>
          );
        })}
      </nav>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-brand-bg to-transparent sm:hidden"
        />
      </div>
    </div>
  );
}
