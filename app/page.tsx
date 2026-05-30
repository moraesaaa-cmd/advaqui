import Link from "next/link";
import {
  Search,
  ShieldCheck,
  MapPin,
  Briefcase,
  BookOpen,
  FileText,
  Target,
  Sparkles,
  Download,
  Scale,
  Compass,
  HelpCircle,
  ArrowRight
} from "lucide-react";
import { SearchBox } from "@/components/SearchBox";
import { STATES } from "@/lib/data/states";
import { SPECIALTIES } from "@/lib/data/specialties";
import { SITE } from "@/lib/config";
import { PremiumValueSection } from "@/components/PremiumValueSection";
import { ProvaSocialHome } from "@/components/ProvaSocialHome";
import { IntentGrid } from "@/components/IntentGrid";
import { getAllArticles } from "@/lib/data/articles";
import { getAllMarketingArticles } from "@/lib/data/marketing-articles";
import { PROBLEMAS } from "@/lib/data/problemas-juridicos";
import { ResolverAgora } from "@/components/ResolverAgora";
import { HomeFaq } from "@/components/HomeFaq";

export const revalidate = 600;

// Sinônimos em linguagem leiga para reforçar o match do classificador de caso.
const PROBLEMA_KEYWORDS: Record<string, string> = {
  "nome-negativado-indevidamente":
    "spc serasa nome sujo divida negativado restricao credito protesto",
  "fui-vitima-de-golpe-do-pix":
    "golpe pix fraude estorno transferencia banco roubo enganado",
  "fui-demitido-sem-receber-direitos":
    "demitido demissao mandado embora rescisao verbas fgts aviso previo trabalho emprego patrao acerto",
  "beneficio-do-inss-foi-negado":
    "inss aposentadoria auxilio doenca beneficio negado pericia loas bpc previdencia",
  "plano-de-saude-negou-cirurgia":
    "plano saude convenio negou cirurgia tratamento exame medicamento carencia",
  "quero-me-divorciar": "divorcio separacao casamento separar guarda partilha",
  "pai-nao-paga-pensao":
    "pensao alimenticia filho nao paga atraso alimentos sustento",
  "comprei-produto-com-defeito":
    "produto defeito troca garantia comprei loja consumidor quebrado vicio",
  "fui-cobrado-juros-abusivos":
    "juros abusivos banco cartao financiamento divida emprestimo cobranca",
  "fui-vitima-de-acidente-de-transito":
    "acidente transito carro batida indenizacao seguro dpvat colisao"
};

export default async function HomePage() {
  const latestArticles = getAllArticles().slice(0, 3);
  const latestMkt = getAllMarketingArticles().slice(0, 3);

  // Índice leve dos problemas (texto normalizado no servidor) para o
  // classificador de caso interativo da home (ResolverAgora).
  const normalizeHay = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const problemaIndex = PROBLEMAS.map((p) => ({
    slug: p.slug,
    titulo: p.titulo,
    intencao: p.intencao_curta,
    hay: normalizeHay(
      [
        p.titulo,
        p.intencao_curta,
        p.resumo,
        p.areas.join(" "),
        PROBLEMA_KEYWORDS[p.slug] || ""
      ].join(" ")
    )
  }));

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

      <section className="bg-white border-y border-brand-line py-16">
        <div className="container-tight">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              Busque pelo seu estado
            </h2>
            <p className="text-brand-ink/60 mt-2">
              Capitais e cidades do interior de todo o Brasil já cobertas.
            </p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2">
            {STATES.map((st) => (
              <Link
                key={st.uf}
                href={`/advogados/${st.uf.toLowerCase()}`}
                className="px-3 py-3 rounded-xl bg-brand-bg border border-brand-line hover:border-brand-accent hover:bg-brand-accent/10 transition text-center group"
              >
                <span className="block text-lg font-bold text-brand-deep group-hover:text-brand-accent2 transition">
                  {st.uf}
                </span>
                <span className="block text-xs text-brand-ink/60 mt-0.5 truncate">
                  {st.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-tight py-16">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
            Por especialidade
          </h2>
          <p className="text-brand-ink/60 mt-2">
            Encontre profissionais com atuação declarada na área que você precisa.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {SPECIALTIES.map((sp) => (
            <Link
              key={sp.slug}
              href={`/advogados/sp/sao-paulo/${sp.slug}`}
              className="chip text-brand-ink hover:bg-brand-deep hover:text-white hover:border-brand-deep transition"
            >
              {sp.name}
            </Link>
          ))}
        </div>
        <p className="text-center mt-4 text-xs text-brand-ink/50">
          Os exemplos apontam para São Paulo. Em cada cidade existe uma página por especialidade.
        </p>
      </section>

      <ProvaSocialHome />

      {/* Jurisprudência STF e STJ — acesso público ao módulo */}
      <section className="bg-white border-y border-brand-line py-14">
        <div className="container-tight">
          <div className="rounded-2xl bg-brand-bg border border-brand-line p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 rounded-xl bg-brand-deep/10 flex items-center justify-center flex-shrink-0">
                <Scale className="w-6 h-6 text-brand-deep" aria-hidden />
              </div>
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-ink leading-tight">
                  Pesquise jurisprudência STF e STJ
                </h2>
                <p className="text-brand-ink/70 mt-2 text-sm md:text-base leading-relaxed max-w-2xl">
                  Consulte decisões judiciais por tema, tribunal, relator, classe,
                  número do processo e palavras da ementa, sempre com link para
                  a fonte oficial.
                </p>
              </div>
            </div>
            <Link
              href="/jurisprudencia"
              className="btn-primary inline-flex items-center gap-2 whitespace-nowrap"
            >
              Acessar jurisprudência
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Hub de conteúdo educativo — Glossário, Problemas, Guias */}
      <section className="bg-brand-bg py-14">
        <div className="container-tight">
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-ink leading-tight">
              Entenda seus direitos sem juridiquês
            </h2>
            <p className="text-brand-ink/70 mt-2 text-sm md:text-base max-w-2xl mx-auto">
              Glossário, problemas jurídicos do dia a dia e guias pilar
              conectados a decisões reais do STJ. Tudo em linguagem clara.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Link
              href="/problemas-juridicos"
              className="group rounded-2xl bg-white border border-brand-line p-6 hover:border-brand-deep/40 hover:shadow-card transition"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-deep/10 flex items-center justify-center mb-3">
                <HelpCircle className="w-5 h-5 text-brand-deep" aria-hidden />
              </div>
              <h3 className="font-display text-lg font-bold text-brand-ink group-hover:text-brand-deep transition">
                Problemas jurídicos
              </h3>
              <p className="text-sm text-brand-ink/70 mt-1 leading-relaxed">
                Divórcio, pensão, demissão, plano de saúde e mais — passo a
                passo do que fazer.
              </p>
            </Link>
            <Link
              href="/guias"
              className="group rounded-2xl bg-white border border-brand-line p-6 hover:border-brand-deep/40 hover:shadow-card transition"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-deep/10 flex items-center justify-center mb-3">
                <Compass className="w-5 h-5 text-brand-deep" aria-hidden />
              </div>
              <h3 className="font-display text-lg font-bold text-brand-ink group-hover:text-brand-deep transition">
                Guias por área
              </h3>
              <p className="text-sm text-brand-ink/70 mt-1 leading-relaxed">
                Direito do consumidor, família, trabalho, INSS, civil, criminal
                e mais — visão geral por ramo.
              </p>
            </Link>
            <Link
              href="/glossario"
              className="group rounded-2xl bg-white border border-brand-line p-6 hover:border-brand-deep/40 hover:shadow-card transition"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-deep/10 flex items-center justify-center mb-3">
                <BookOpen className="w-5 h-5 text-brand-deep" aria-hidden />
              </div>
              <h3 className="font-display text-lg font-bold text-brand-ink group-hover:text-brand-deep transition">
                Glossário jurídico
              </h3>
              <p className="text-sm text-brand-ink/70 mt-1 leading-relaxed">
                Dano moral, prescrição, usucapião, inventário — termos
                jurídicos em linguagem clara.
              </p>
            </Link>
          </div>
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
                Modelos gratuitos
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

      {/* ===================== ZONA PARA ADVOGADOS ===================== */}
      <section className="container-tight pt-16 pb-2">
        <div className="flex items-center gap-4 max-w-3xl mx-auto">
          <span className="h-px flex-1 bg-brand-line" aria-hidden />
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide bg-brand-deep text-white">
            <Scale className="w-4 h-4 text-brand-accent" aria-hidden />
            Você é advogado?
          </span>
          <span className="h-px flex-1 bg-brand-line" aria-hidden />
        </div>
        <p className="text-center text-brand-ink/60 mt-4 max-w-xl mx-auto text-sm md:text-base">
          Tudo acima é para quem busca ajuda jurídica. A partir daqui é a área
          para profissionais — apareça quando alguém procura advogado na sua cidade.
        </p>
      </section>

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

      <PremiumValueSection />

      {/* Bloco "Para advogados" — Marketing jurídico + Checklist isca */}
      <section className="bg-brand-bg py-16">
        <div className="container-tight">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-accent text-brand-ink mb-3">
              <Target className="w-3.5 h-3.5" aria-hidden />
              Conteúdo para advogados
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-ink leading-tight">
              Material gratuito para você crescer
            </h2>
            <p className="text-brand-ink/65 mt-3 text-base md:text-lg">
              O AdvAqui não é só diretório — é parceiro de crescimento. Veja os guias
              de marketing jurídico e baixe o checklist de presença digital.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card isca: checklist */}
            <div className="md:col-span-1 rounded-2xl bg-gradient-to-br from-brand-accent2/20 via-white to-brand-accent/10 border-2 border-brand-accent p-6 shadow-cardHover relative overflow-hidden">
              <div
                aria-hidden
                className="absolute -top-px left-4 right-4 h-1 bg-gradient-to-r from-brand-accent2 via-brand-accent to-brand-accent2 rounded-b"
              />
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide bg-brand-accent text-brand-ink mb-3">
                <Sparkles className="w-3 h-3" aria-hidden />
                Material grátis
              </span>
              <h3 className="font-display text-xl font-bold text-brand-ink leading-snug">
                Checklist: Como melhorar sua presença digital jurídica
              </h3>
              <p className="text-sm text-brand-ink/70 mt-3 leading-relaxed">
                Itens práticos pra aplicar em uma manhã. Google Business, diretórios,
                WhatsApp, bio e conteúdo. Download .txt liberado após cadastro grátis.
              </p>
              <Link
                href="/checklist"
                className="mt-5 btn-accent w-full justify-center inline-flex items-center gap-2"
              >
                <Download className="w-4 h-4" aria-hidden />
                Pegar o checklist
              </Link>
            </div>

            {/* Cards de marketing jurídico */}
            <div className="md:col-span-2 grid sm:grid-cols-2 gap-4">
              {latestMkt.map((a, idx) => (
                <Link
                  key={a.slug}
                  href={`/marketing-juridico/${a.slug}`}
                  className="rounded-2xl border border-brand-line bg-white p-5 hover:border-brand-accent transition shadow-card hover:shadow-cardHover group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-accent/15 text-brand-deep text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-xs text-brand-ink/55">{a.readingMinutes} min</span>
                  </div>
                  <h3 className="font-display text-base font-bold text-brand-ink group-hover:text-brand-deep leading-snug">
                    {a.title}
                  </h3>
                  <p className="text-xs text-brand-ink/65 mt-2 line-clamp-2">
                    {a.excerpt}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-deep group-hover:text-brand-accent2">
                    Ler guia →
                  </span>
                </Link>
              ))}
              <Link
                href="/marketing-juridico"
                className="sm:col-span-2 rounded-2xl border-2 border-dashed border-brand-line bg-white hover:border-brand-accent hover:bg-brand-accent/5 transition p-5 inline-flex items-center justify-center gap-2 text-sm font-semibold text-brand-deep"
              >
                <Target className="w-4 h-4" aria-hidden />
                Ver todos os guias de marketing jurídico
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
