import Link from "next/link";
import { CheckSquare, Download, Sparkles, ArrowLeft, Target } from "lucide-react";
import {
  CHECKLIST_SECTIONS,
  buildChecklistTxt
} from "@/lib/data/checklist-content";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { ContentGate } from "@/components/ContentGate";
import { ChecklistDownload } from "@/components/ChecklistDownload";

export const revalidate = 3600;

export const metadata = buildMetadata({
  title: "Checklist: Como melhorar sua presença digital jurídica",
  description:
    "21 itens práticos pra advogado configurar Google Business, perfil em diretórios, WhatsApp profissional e bio em uma manhã. Material gratuito, download em .txt.",
  path: "/checklist"
});

export default function ChecklistPage() {
  const txtContent = buildChecklistTxt();

  // Preview: 2 primeiras seções aparecem completas, o resto fica no gate.
  const previewSections = CHECKLIST_SECTIONS.slice(0, 2);
  const lockedSections = CHECKLIST_SECTIONS.slice(2);

  return (
    <>
      {/* HERO */}
      <section className="relative bg-brand-ink text-white overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "none"
          }}
        />
        <div className="relative container-tight py-12 md:py-16">
          <Breadcrumb
            items={[
              { label: "Marketing jurídico", href: "/marketing-juridico" },
              { label: "Checklist" }
            ]}
          />
          <div className="mt-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-brand-accent text-brand-ink mb-4">
              <Sparkles className="w-3.5 h-3.5" aria-hidden />
              Material gratuito
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold leading-tight">
              Como melhorar sua presença digital jurídica
            </h1>
            <p className="text-lg md:text-xl text-brand-bg/85 mt-4 leading-relaxed">
              Itens práticos divididos por área. Cobre o essencial: Google
              Business Profile, diretórios, WhatsApp, bio e primeiros passos de
              conteúdo. Você pode aplicar em uma manhã.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-brand-bg/80">
              <span className="inline-flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-brand-accent" aria-hidden />
                Itens acionáveis
              </span>
              <span className="inline-flex items-center gap-2">
                <Target className="w-4 h-4 text-brand-accent" aria-hidden />
                Foco em ROI real
              </span>
              <span className="inline-flex items-center gap-2">
                <Download className="w-4 h-4 text-brand-accent" aria-hidden />
                Download em .txt
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="container-tight py-10">
        <div className="max-w-3xl mx-auto">
          {/* Preview público */}
          {previewSections.map((section, idx) => (
            <ChecklistSectionRender key={idx} section={section} index={idx} />
          ))}

          {/* Gate + resto */}
          {lockedSections.length > 0 && (
            <div className="mt-8">
              <ContentGate
                title="Liberar checklist completo + download"
                description={`Cadastro grátis libera as ${lockedSections.length} seções restantes (${
                  lockedSections.reduce((s, sec) => s + sec.items.length, 0)
                } itens) + download .txt + acesso ao painel com todos os materiais.`}
                ctaLabel="Cadastrar grátis para baixar"
                previewLines={20}
              >
                {lockedSections.map((section, idx) => (
                  <ChecklistSectionRender
                    key={idx + 100}
                    section={section}
                    index={idx + previewSections.length}
                  />
                ))}
              </ContentGate>
            </div>
          )}

          {/* Download (só funciona se conteúdo estiver visível — gate cobre) */}
          <section className="mt-10 rounded-2xl border-2 border-brand-accent bg-brand-bg p-6 md:p-8 text-center">
            <h2 className="font-display text-2xl font-bold text-brand-ink">
              Pronto pra usar?
            </h2>
            <p className="text-brand-ink/70 mt-2 mb-5 text-sm md:text-base">
              Baixe o checklist em .txt e imprima ou abra no celular pra ir marcando os itens.
            </p>
            <ChecklistDownload content={txtContent} />
            <p className="text-xs text-brand-ink/55 mt-3">
              Cadastro grátis necessário para download — libera todo o material de uma vez.
            </p>
          </section>

          {/* Próximos passos */}
          <section className="mt-12 rounded-2xl bg-brand-ink text-white p-6 md:p-8">
            <h2 className="font-display text-xl md:text-2xl font-bold leading-tight">
              Aprofunde em cada tópico
            </h2>
            <p className="text-brand-bg/85 mt-2 text-sm md:text-base">
              Cada item do checklist tem um guia completo no Marketing Jurídico:
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link
                  href="/marketing-juridico/como-advogados-podem-melhorar-presenca-digital"
                  className="text-brand-accent hover:text-brand-accent2"
                >
                  → Como advogados podem melhorar sua presença digital
                </Link>
              </li>
              <li>
                <Link
                  href="/marketing-juridico/como-aparecer-em-buscas-locais"
                  className="text-brand-accent hover:text-brand-accent2"
                >
                  → Como aparecer em buscas locais do Google
                </Link>
              </li>
              <li>
                <Link
                  href="/marketing-juridico/como-preencher-perfil-juridico-profissional"
                  className="text-brand-accent hover:text-brand-accent2"
                >
                  → Como preencher um perfil jurídico profissional
                </Link>
              </li>
              <li>
                <Link
                  href="/marketing-juridico/o-que-colocar-na-bio-de-advogado"
                  className="text-brand-accent hover:text-brand-accent2"
                >
                  → O que colocar na bio de advogado
                </Link>
              </li>
              <li>
                <Link
                  href="/marketing-juridico/como-facilitar-contato-com-cliente"
                  className="text-brand-accent hover:text-brand-accent2"
                >
                  → Como facilitar o contato com cliente
                </Link>
              </li>
            </ul>
          </section>

          <div className="mt-8">
            <Link
              href="/marketing-juridico"
              className="inline-flex items-center gap-2 text-sm text-brand-deep hover:text-brand-accent2"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden />
              Voltar para Marketing jurídico
            </Link>
          </div>
        </div>
      </div>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Brasil", url: "/" },
          { name: "Marketing jurídico", url: "/marketing-juridico" },
          { name: "Checklist", url: "/checklist" }
        ])}
      />
    </>
  );
}

function ChecklistSectionRender({
  section,
  index
}: {
  section: (typeof CHECKLIST_SECTIONS)[number];
  index: number;
}) {
  return (
    <section className="mb-8 rounded-2xl border border-brand-line bg-white p-5 md:p-6">
      <div className="flex items-start gap-3 mb-4 pb-3 border-b border-brand-line">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-accent/20 flex items-center justify-center font-display font-bold text-brand-deep">
          {index + 1}
        </div>
        <div className="flex-1">
          <h2 className="font-display text-xl md:text-2xl font-bold text-brand-ink leading-tight">
            {section.title.replace(/^\d+\.\s*/, "")}
          </h2>
          <p className="text-sm text-brand-ink/60 mt-1">{section.description}</p>
        </div>
      </div>

      <ul className="space-y-3">
        {section.items.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-3 p-3 rounded-xl hover:bg-brand-bg/60 transition"
          >
            <span className="flex-shrink-0 w-5 h-5 rounded border-2 border-brand-line mt-0.5" aria-hidden />
            <div className="flex-1">
              <p className="font-semibold text-brand-ink text-sm md:text-base">
                {item.title}
              </p>
              <p className="text-xs md:text-sm text-brand-ink/65 mt-0.5 leading-relaxed">
                {item.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
