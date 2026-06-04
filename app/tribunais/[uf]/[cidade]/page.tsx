import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Scale,
  MapPin,
  Users,
  Building2,
  ExternalLink,
  Gavel,
  Briefcase,
  ShieldCheck
} from "lucide-react";
import { findTribunalUf, ORGAOS_FEDERAIS } from "@/lib/data/tribunais";
import {
  getCidadesPrioritarias,
  cidadesPrioritariasMesmaRegiao
} from "@/lib/data/cidades-prioritarias";
import { findCity, findCapital } from "@/lib/data/cities";
import { findState } from "@/lib/data/states";
import { getLawyersForCity } from "@/lib/data/lawyers";
import { LawyerCard } from "@/components/LawyerCard";
import { Breadcrumb } from "@/components/Breadcrumb";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

/**
 * /tribunais/[uf]/[cidade] — guia local de tribunais, fóruns, defensoria,
 * Procon, OAB seccional para uma cidade específica.
 *
 * 5571 cidades IBGE = 5571 URLs cauda longa (1 por cidade).
 *
 * Estratégia híbrida:
 *  - SSG nas 50 cidades prioritárias
 *  - ISR (dynamicParams = true) nas 5521 restantes
 *
 * Conteúdo único por cidade:
 *  - TJ, TRT, TRE da UF com links oficiais
 *  - Capital (sede do TJ) com link
 *  - Justiça Federal de referência
 *  - OAB seccional do estado
 *  - Defensoria pública (link estadual)
 *  - Procon (link estadual)
 *  - Juizado Especial Cível
 *  - Órgãos federais (STF, STJ, TST, TSE, TCU)
 *  - Advogados que atuam na cidade
 */

// force-dynamic: renderiza sob demanda SEM gravar em disco — impede o disco de
// reencher conforme o Google rastreia milhares de cidades. URL funciona normal.
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  const cidades = getCidadesPrioritarias();
  return cidades.map((c) => ({
    uf: c.uf.toLowerCase(),
    cidade: c.slug
  }));
}

export async function generateMetadata({
  params
}: {
  params: { uf: string; cidade: string };
}) {
  const st = findState(params.uf);
  const city = findCity(params.uf, params.cidade);
  if (!st || !city) {
    return buildMetadata({
      title: "Página não encontrada",
      description: "Página não encontrada",
      noIndex: true
    });
  }
  return buildMetadata({
    title: `Tribunais e órgãos de justiça em ${city.name}, ${st.uf}`,
    description: `Onde está o fórum, defensoria pública, OAB, Procon e juizado especial em ${city.name}/${st.uf}. Links oficiais do TJ-${st.uf}, TRT, TRE.`,
    path: `/tribunais/${st.uf.toLowerCase()}/${city.slug}`
  });
}

export default async function TribunaisCidadePage({
  params
}: {
  params: { uf: string; cidade: string };
}) {
  const st = findState(params.uf);
  const city = findCity(params.uf, params.cidade);
  if (!st || !city) notFound();

  const tribunal = findTribunalUf(st.uf);
  const capital = findCapital(st.uf);
  const isCapital = city.isCapital;

  let lawyers: Awaited<ReturnType<typeof getLawyersForCity>> = [];
  try {
    lawyers = await getLawyersForCity(st.uf, city.slug);
  } catch {
    lawyers = [];
  }
  const lawyersTop = lawyers.slice(0, 4);

  const cidadeRegional = cidadesPrioritariasMesmaRegiao(st.uf, city.slug, 6);
  const ufLower = st.uf.toLowerCase();

  return (
    <div className="container-narrow py-10">
      <Breadcrumb
        items={[
          { label: "Tribunais", href: "/tribunais" },
          { label: `${city.name}, ${st.uf}` }
        ]}
      />

      <article className="card mb-6">
        <div className="flex items-start gap-3 mb-3">
          <Scale className="w-7 h-7 text-brand-deep flex-shrink-0 mt-1" aria-hidden />
          <div className="flex-1">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              Tribunais e órgãos de justiça em {city.name}, {st.uf}
            </h1>
            <p className="text-sm text-brand-ink/55 mt-1 inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" aria-hidden />
              {city.name} · {st.name}
              {isCapital && (
                <span className="ml-2 chip text-xs text-brand-accent2 border-brand-accent/40">
                  Capital
                </span>
              )}
            </p>
            <p className="text-base text-brand-ink/85 mt-3 leading-relaxed">
              Guia rápido de onde resolver questões jurídicas em {city.name}/
              {st.uf}. Inclui contatos oficiais do tribunal estadual, justiça
              do trabalho, justiça eleitoral, defensoria pública, Procon, OAB
              seccional e órgãos federais. Para a maior parte das demandas
              do cidadão, o juizado especial cível ou a defensoria pública
              resolvem sem custo.
            </p>
          </div>
        </div>
      </article>

      {/* Tribunal de Justiça Estadual */}
      {tribunal && (
        <section className="card mb-6">
          <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
            <Gavel className="w-5 h-5 text-brand-deep" aria-hidden />
            Tribunal de Justiça — {tribunal.tj_nome}
          </h2>
          <p className="text-sm text-brand-ink/85 leading-relaxed mb-3">
            O {tribunal.tj_nome} é responsável por toda a justiça estadual de{" "}
            {st.name}, organizada em {tribunal.qtd_comarcas} comarcas. A sede
            fica em <strong>{tribunal.tj_sede}</strong>.
          </p>
          {!isCapital && capital && (
            <p className="text-sm text-brand-ink/85 leading-relaxed mb-3">
              Os processos de {city.name}/{st.uf} tramitam na comarca local
              quando há fórum próprio, ou na comarca mais próxima. A 2ª
              instância (Câmaras e Plenário) fica em {tribunal.tj_sede}.
            </p>
          )}
          <a
            href={tribunal.tj_site}
            target="_blank"
            rel="noopener nofollow"
            className="inline-flex items-center gap-1 text-sm text-brand-deep hover:underline font-medium"
          >
            Acessar {tribunal.tj_nome}
            <ExternalLink className="w-3.5 h-3.5" aria-hidden />
          </a>
        </section>
      )}

      {/* Justiça do Trabalho */}
      {tribunal && (
        <section className="card mb-6">
          <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-brand-deep" aria-hidden />
            Justiça do Trabalho — TRT da {tribunal.trt_numero}ª Região
          </h2>
          <p className="text-sm text-brand-ink/85 leading-relaxed mb-3">
            Questões trabalhistas em {city.name}/{st.uf} (rescisão, horas
            extras, FGTS, danos morais por assédio) são da Justiça do
            Trabalho — TRT da {tribunal.trt_numero}ª Região, com sede em{" "}
            <strong>{tribunal.trt_sede}</strong>. A 1ª instância (Vara do
            Trabalho) costuma ter unidade na comarca da região. No 1º grau,
            o trabalhador é isento de custas.
          </p>
          <a
            href={tribunal.trt_site}
            target="_blank"
            rel="noopener nofollow"
            className="inline-flex items-center gap-1 text-sm text-brand-deep hover:underline font-medium"
          >
            Acessar TRT-{tribunal.trt_numero}
            <ExternalLink className="w-3.5 h-3.5" aria-hidden />
          </a>
        </section>
      )}

      {/* Justiça Eleitoral */}
      {tribunal && (
        <section className="card mb-6">
          <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
            <Scale className="w-5 h-5 text-brand-deep" aria-hidden />
            Justiça Eleitoral — TRE-{st.uf}
          </h2>
          <p className="text-sm text-brand-ink/85 leading-relaxed mb-3">
            Título de eleitor, biometria, justificativa de ausência e
            zonas eleitorais em {city.name}/{st.uf} são do TRE-{st.uf}.
            Em períodos eleitorais, é também o foro de impugnação de
            candidatura e crimes eleitorais.
          </p>
          <a
            href={tribunal.tre_site}
            target="_blank"
            rel="noopener nofollow"
            className="inline-flex items-center gap-1 text-sm text-brand-deep hover:underline font-medium"
          >
            Acessar TRE-{st.uf}
            <ExternalLink className="w-3.5 h-3.5" aria-hidden />
          </a>
        </section>
      )}

      {/* Defensoria e OAB */}
      <section className="card mb-6">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-brand-deep" aria-hidden />
          Acesso gratuito à justiça em {city.name}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-brand-line bg-white p-4">
            <h3 className="font-display font-bold text-brand-ink">
              Defensoria Pública de {st.uf}
            </h3>
            <p className="text-sm text-brand-ink/80 mt-1 leading-relaxed">
              Atende cidadãos com renda baixa em ações cíveis, criminais,
              de família e previdenciárias. O atendimento é gratuito.
              Telefone e endereço da unidade mais próxima em {city.name}
              podem ser consultados no site da defensoria estadual.
            </p>
          </div>
          <div className="rounded-xl border border-brand-line bg-white p-4">
            <h3 className="font-display font-bold text-brand-ink">
              OAB Seccional de {st.uf}
            </h3>
            <p className="text-sm text-brand-ink/80 mt-1 leading-relaxed">
              A subseção da OAB-{st.uf} em {city.name} ou na cidade-sede da
              comarca pode orientar sobre advogados credenciados, fornecer
              certidão de regularidade e organizar plantões de atendimento
              jurídico gratuito em mutirões.
            </p>
          </div>
          <div className="rounded-xl border border-brand-line bg-white p-4">
            <h3 className="font-display font-bold text-brand-ink">
              Juizado Especial Cível (JEC)
            </h3>
            <p className="text-sm text-brand-ink/80 mt-1 leading-relaxed">
              Causas de até 20 salários mínimos podem ser ajuizadas sem
              advogado. Causas de 20 a 40 salários precisam de advogado.
              O JEC é gratuito na 1ª instância. Indicado pra negativação
              indevida, cobrança até R$ 24.000, vícios em produtos.
            </p>
          </div>
          <div className="rounded-xl border border-brand-line bg-white p-4">
            <h3 className="font-display font-bold text-brand-ink">
              Procon-{st.uf}
            </h3>
            <p className="text-sm text-brand-ink/80 mt-1 leading-relaxed">
              Antes de processar uma empresa por relação de consumo, vale
              tentar resolver no Procon. A reclamação é gratuita, a
              empresa é notificada e tem prazo para responder. Resolve a
              maioria dos casos sem precisar de ação judicial.
            </p>
          </div>
        </div>
      </section>

      {/* Órgãos federais */}
      <section className="card mb-6">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
          <Building2 className="w-5 h-5 text-brand-deep" aria-hidden />
          Órgãos federais aplicáveis em {city.name}
        </h2>
        <p className="text-sm text-brand-ink/75 leading-relaxed mb-4">
          Estes tribunais e órgãos atuam em todo o Brasil e podem ser
          acessados por moradores de {city.name}/{st.uf} quando o caso
          envolve as competências de cada um.
        </p>
        <ul className="space-y-3">
          {ORGAOS_FEDERAIS.map((o) => (
            <li
              key={o.sigla}
              className="rounded-xl border border-brand-line bg-white p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-display font-bold text-brand-ink">
                    {o.nome} ({o.sigla})
                  </h3>
                  <p className="text-sm text-brand-ink/80 mt-1 leading-relaxed">
                    {o.alcance}
                  </p>
                </div>
                <a
                  href={o.site}
                  target="_blank"
                  rel="noopener nofollow"
                  className="text-xs text-brand-deep hover:underline font-medium whitespace-nowrap inline-flex items-center gap-1"
                >
                  {o.sigla}
                  <ExternalLink className="w-3 h-3" aria-hidden />
                </a>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Advogados em CIDADE */}
      <section className="card mb-6">
        <h2 className="font-display text-xl font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
          <Users className="w-5 h-5 text-brand-deep" aria-hidden />
          Advogados que atuam em {city.name}
        </h2>
        {lawyersTop.length === 0 ? (
          <p className="text-sm text-brand-ink/80 leading-relaxed">
            Ainda não temos advogados cadastrados em {city.name}/{st.uf}.{" "}
            <Link href="/cadastro" className="text-brand-deep underline">
              Cadastre-se como o primeiro
            </Link>
            .
          </p>
        ) : (
          <>
            <p className="text-sm text-brand-ink/75 mb-4 leading-relaxed">
              Profissionais cadastrados em {city.name}/{st.uf}, conhecedores
              das varas locais e práticas forenses da região.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {lawyersTop.map((lawyer) => (
                <LawyerCard key={lawyer.id} lawyer={lawyer} />
              ))}
            </div>
            <p className="mt-4 text-sm">
              <Link
                href={`/advogados/${ufLower}/${city.slug}`}
                className="text-brand-deep hover:underline font-medium"
              >
                Ver todos os advogados em {city.name} →
              </Link>
            </p>
          </>
        )}
      </section>

      {/* Cidades vizinhas */}
      {cidadeRegional.length > 0 && (
        <section className="card mb-6">
          <h2 className="font-display text-lg font-bold text-brand-ink mb-3 inline-flex items-center gap-2">
            <MapPin className="w-5 h-5 text-brand-deep" aria-hidden />
            Tribunais nas cidades vizinhas
          </h2>
          <div className="flex flex-wrap gap-2">
            {cidadeRegional.map((c) => (
              <Link
                key={c.slug}
                href={`/tribunais/${c.uf.toLowerCase()}/${c.slug}`}
                className="chip text-brand-ink hover:bg-brand-deep hover:text-white hover:border-brand-deep transition text-xs"
              >
                {c.nome_completo}
              </Link>
            ))}
          </div>
        </section>
      )}

      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: "/" },
          { name: "Tribunais", url: "/tribunais" },
          {
            name: `${city.name}, ${st.uf}`,
            url: `/tribunais/${ufLower}/${city.slug}`
          }
        ])}
      />
    </div>
  );
}
