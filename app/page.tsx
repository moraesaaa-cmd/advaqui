import Link from "next/link";
import {
  Search,
  ShieldCheck,
  MapPin,
  Briefcase,
  BookOpen,
  FileText,
  Scale,
  ArrowRight
} from "lucide-react";
import { SearchBox } from "@/components/SearchBox";
import { SITE } from "@/lib/config";
import { IntentGrid } from "@/components/IntentGrid";
import { getAllArticles } from "@/lib/data/articles";
import { HomeFaq } from "@/components/HomeFaq";
import { ResolverAgora } from "@/components/ResolverAgora";
import { getProblemaIndex } from "@/lib/data/problema-index";

export const revalidate = 600;

export default async function HomePage() {
  const latestArticles = getAllArticles().slice(0, 3);
  const problemaIndex = getProblemaIndex();

  return (
    <>
      <section className="relative bg-gradient-to-br from-brand-ink via-brand-deep to-brand-primary text-white">
        <div
          aria-hidden
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(201,162,76,0.45) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(232,184,86,0.3) 0%, transparent 40%)"
          }}
        />
        <div className="relative container-tight py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-brand-bg/90 mb-4">
              {SITE.tagline}
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight text-balance">
              Encontre o advogado certo na sua cidade
            </h1>
            <p className="mt-4 text-lg md:text-xl text-brand-bg/85 max-w-2xl mx-auto">
              Diretório nacional de advogados verificados. Por cidade, por especialidade,
              direto com quem pode resolver seu caso.
            </p>
            <div className="mt-8 max-w-xl mx-auto">
              <SearchBox />
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-brand-bg/75">
              <span className="inline-flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-accent" aria-hidden />
                Todas as regiões do Brasil
              </span>
            </div>
          </div>
        </div>
      </section>

      <ResolverAgora items={problemaIndex} />

      <IntentGrid />

      <section className="container-tight py-16">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
            Como funciona
          </h2>
          <p className="text-brand-ink/60 mt-2 max-w-xl mx-auto">
            Sem cadastro do cliente, sem intermediação. Você busca, encontra, contrata direto.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { Icon: Search, title: "Busque por cidade", text: "Digite o nome da sua cidade ou escolha o estado no mapa do Brasil." },
            { Icon: Briefcase, title: "Filtre por especialidade", text: "Trabalhista, família, previdenciário, criminal, civil — as principais áreas do direito." },
            { Icon: ShieldCheck, title: "Fale direto pelo WhatsApp", text: "Cada perfil traz telefone, e-mail e WhatsApp clicável. Sem taxa, sem comissão." }
          ].map(({ Icon, title, text }, idx) => (
            <div key={idx} className="card">
              <div className="w-12 h-12 rounded-xl bg-brand-deep/10 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-brand-deep" aria-hidden />
              </div>
              <h3 className="font-display text-xl font-bold text-brand-ink mb-1">{title}</h3>
              <p className="text-sm text-brand-ink/70 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Blog + Modelos: bloco duplo de conteúdo / autoridade (E-E-A-T) */}
      <section className="bg-white border-y border-brand-line py-16">
        <div className="container-tight">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-accent/15 text-brand-deep border border-brand-accent/30 mb-3">
                <BookOpen className="w-3.5 h-3.5" aria-hidden />
                Blog jurídico
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-ink leading-tight">
                Seus direitos explicados sem juridiquês
              </h2>
              <p className="text-brand-ink/65 mt-2">
                Guias práticos sobre as situações mais comuns — rescisão,
                divórcio, pensão, INSS, dívida indevida, despejo e mais.
              </p>
              <ul className="mt-4 space-y-2.5">
                {latestArticles.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/blog/${a.slug}`}
                      className="block group hover:bg-brand-line/40 -mx-2 px-2 py-1.5 rounded-lg transition"
                    >
                      <span className="text-xs text-brand-ink/55 uppercase tracking-wide">
                        {a.category} · {a.readingMinutes} min
                      </span>
                      <p className="text-sm font-semibold text-brand-ink group-hover:text-brand-deep leading-snug">
                        {a.title}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/blog"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-deep hover:text-brand-accent2"
              >
                Ver todos os artigos →
              </Link>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-accent/15 text-brand-deep border border-brand-accent/30 mb-3">
                <FileText className="w-3.5 h-3.5" aria-hidden />
                Modelos de documentos
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-ink leading-tight">
                Modelos prontos pra baixar
              </h2>
              <p className="text-brand-ink/65 mt-2">
                Procuração, contrato de locação, recibo, distrato, declaração
                de união estável, autorização de viagem — preencha os campos
                entre colchetes e use.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {[
                  { slug: "procuracao-particular-geral", label: "Procuração particular" },
                  { slug: "contrato-de-locacao-residencial-simples", label: "Contrato de locação" },
                  { slug: "recibo-pagamento-quitacao", label: "Recibo de pagamento" },
                  { slug: "declaracao-de-uniao-estavel", label: "União estável" },
                  { slug: "autorizacao-viagem-menor-nacional", label: "Autorização de viagem" },
                  { slug: "notificacao-extrajudicial-cobranca", label: "Notificação de cobrança" }
                ].map((t) => (
                  <Link
                    key={t.slug}
                    href={`/modelos/${t.slug}`}
                    className="text-sm text-brand-ink/85 hover:text-brand-deep hover:bg-brand-line/40 px-2 py-1.5 rounded-lg border border-brand-line transition"
                  >
                    {t.label}
                  </Link>
                ))}
              </div>
              <Link
                href="/modelos"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-deep hover:text-brand-accent2"
              >
                Ver todos os modelos →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <HomeFaq />

      {/* CTA para advogados — "quero aparecer aqui" → planos (sem citar valor) */}
      <section className="container-tight py-6">
        <div className="rounded-3xl bg-gradient-to-br from-brand-ink to-brand-deep text-white p-8 md:p-10 relative overflow-hidden">
          <div
            aria-hidden
            className="absolute -top-1/4 -right-1/4 w-1/2 aspect-square rounded-full bg-brand-accent/20 blur-3xl"
          />
          <div className="relative max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-brand-accent text-brand-ink mb-4">
              <Scale className="w-3.5 h-3.5" aria-hidden />
              Para advogados
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight">
              Sou advogado e quero aparecer aqui
            </h2>
            <p className="text-brand-bg/85 mt-3 text-base md:text-lg leading-relaxed">
              Apareça quando alguém procura advogado na sua cidade.{" "}
              <strong className="text-brand-accent">Leva menos de 30 segundos. Sem pagar nada ao AdvAqui.</strong>
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/planos" className="btn-accent inline-flex items-center gap-2">
                Quero aparecer no AdvAqui
                <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
              <Link
                href="/exemplo-perfil-premium"
                className="btn-ghost text-white border border-white/25 hover:bg-white/10 inline-flex items-center gap-2"
              >
                Ver um perfil de exemplo
              </Link>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
