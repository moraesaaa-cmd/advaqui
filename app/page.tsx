import Link from "next/link";
import {
  Search,
  ShieldCheck,
  Sparkles,
  MapPin,
  Briefcase,
  CreditCard,
  Eye,
  Users
} from "lucide-react";
import { SearchBox } from "@/components/SearchBox";
import { STATES } from "@/lib/data/states";
import { SPECIALTIES } from "@/lib/data/specialties";
import { getLawyerCount } from "@/lib/data/lawyers";
import { SITE, PLAN } from "@/lib/config";
import { formatCurrency } from "@/lib/utils/format";

export const revalidate = 600;

export default async function HomePage() {
  const totalLawyers = await getLawyerCount();

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
                <Users className="w-4 h-4 text-brand-accent" aria-hidden />
                {totalLawyers}+ advogados cadastrados
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-accent" aria-hidden />
                Todas as regiões do Brasil
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-accent" aria-hidden />
                OAB verificada
              </span>
            </div>
          </div>
        </div>
      </section>

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
            { Icon: Briefcase, title: "Filtre por especialidade", text: "Trabalhista, família, previdenciário, criminal, civil — 15 áreas mapeadas." },
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
              27 estados, cidades capitais e do interior já cobertas.
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

      <section className="bg-brand-ink text-white py-20">
        <div className="container-tight">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-brand-accent text-brand-ink mb-4">
                Para advogados
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight">
                Apareça no topo das buscas da sua cidade
              </h2>
              <p className="mt-4 text-brand-bg/85 text-lg">
                Plano premium por {formatCurrency(PLAN.price)} ao mês. Sem fidelidade.
                Pagamento via Pix, ativação manual em até {PLAN.activationHours} horas.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/planos" className="btn-accent">Ver o plano premium</Link>
                <Link href="/cadastro" className="btn-ghost text-white hover:bg-white/10">
                  Cadastrar gratuitamente
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { Icon: Eye, title: "Visibilidade", text: "Topo das buscas da sua cidade" },
                { Icon: Sparkles, title: "Destaque visual", text: "Selo dourado no diretório" },
                { Icon: Briefcase, title: "Perfil completo", text: "Bio, áreas, WhatsApp, endereço" },
                { Icon: CreditCard, title: "Sem fidelidade", text: "Cancele quando quiser" }
              ].map(({ Icon, title, text }, idx) => (
                <div key={idx} className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <Icon className="w-6 h-6 text-brand-accent mb-2" aria-hidden />
                  <p className="font-semibold">{title}</p>
                  <p className="text-sm text-brand-bg/70 mt-1">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
