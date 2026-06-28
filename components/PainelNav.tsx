"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, HelpCircle, Palette, CreditCard, BookOpen, Users, Bot } from "lucide-react";

const TABS = [
  { href: "/painel", label: "Meu perfil", Icon: LayoutDashboard, exact: true },
  { href: "/painel/pagamento", label: "Pagamento", Icon: CreditCard },
  { href: "/painel/artigos", label: "Artigos", Icon: FileText },
  { href: "/painel/blog", label: "Blog", Icon: BookOpen },
  { href: "/painel/perguntas", label: "Perguntas", Icon: HelpCircle },
  { href: "/painel/aparencia", label: "Aparência", Icon: Palette },
  { href: "/painel/leads", label: "Leads", Icon: Users },
  { href: "/painel/agentes", label: "Agentes", Icon: Bot }
];

export function PainelNav() {
  const pathname = usePathname();
  const active = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="sticky top-16 z-30 bg-brand-bg/95 backdrop-blur border-b border-brand-line">
      <nav className="container-tight flex items-center gap-1 overflow-x-auto" aria-label="Painel">
        {TABS.map((t) => {
          const on = active(t.href, t.exact);
          return (
            <Link
              key={t.href}
              href={t.href}
              aria-current={on ? "page" : undefined}
              className={`relative inline-flex items-center gap-2 px-3.5 py-3 text-sm font-medium whitespace-nowrap transition ${
                on ? "text-brand-ink" : "text-brand-ink/55 hover:text-brand-ink"
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
    </div>
  );
}
