import Link from "next/link";
import { PLAN } from "@/lib/config";
import { formatCurrency } from "@/lib/utils/format";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Planos — apareça primeiro na sua cidade",
  description:
    "Plano premium do AdvAqui por R$ 19,90/mês. Apareça no topo das buscas da sua cidade, WhatsApp clicável, foto destacada, OAB verificada. Sem fidelidade.",
  path: "/planos"
});

// Recriação 1:1 do Planos.dc.html (Apex / claude_design): hero navy →
// problema/solução → o que muda com o premium → como você aparece (Google) →
// comparativo → garantias → depoimentos rolando (marquee) → CTA final.

const BENEFITS = [
  { icon: "⬆", title: "Topo da cidade", desc: "Seu perfil em primeiro lugar quando alguém busca advogado na sua cidade ou especialidade." },
  { icon: "💬", title: "WhatsApp clicável", desc: "Botão verde com mensagem pré-preenchida. Cliente fala com você em 1 clique." },
  { icon: "✓", title: "Selo OAB verificada", desc: "Sinal claro de credibilidade, após validação do nosso time. Mais confiança = mais contratação." },
  { icon: "★", title: "Foto de destaque", desc: "Card maior, borda dourada, foto em evidência. A conversão de busca para clique sobe muito." },
  { icon: "📍", title: "+10 cidades", desc: "Atende em mais de uma comarca? Apareça nas buscas de cada uma delas." },
  { icon: "🕐", title: "Horários visíveis", desc: "Mostre quando atende. O cliente não desiste achando que você está fechado." },
  { icon: "🔗", title: "Site, Insta, LinkedIn", desc: "Links pras suas redes e site profissional direto no perfil." },
  { icon: "🚫", title: "Sem fidelidade", desc: "Plano mensal. Cancela quando quiser, sem multa e sem permanência." }
];

const COMPARE = [
  { item: "Mensalidade premium", adv: formatCurrency(PLAN.price), a: "R$ 59 a 199", b: "R$ 90 a 250" },
  { item: "Comissão sobre causas", adv: "Zero", a: "Às vezes", b: "Às vezes" },
  { item: "Leilão de leads", adv: "Não", a: "Sim", b: "Sim" },
  { item: "Fidelidade mínima", adv: "Nenhuma", a: "Anual", b: "6 meses" },
  { item: "Pagamento", adv: "Pix mensal", a: "Cartão recorrente", b: "Cartão recorrente" },
  { item: "Páginas por cidade", adv: "Todo o Brasil", a: "Limitado", b: "Limitado" },
  { item: "Botão WhatsApp", adv: "Sim", a: "Depende", b: "Depende" }
];

const GUARANTEES = [
  { title: "Cancelamento livre", desc: "Cancele quando quiser, no painel, sem ligar pra ninguém. Não cobramos nada além daquele mês." },
  { title: "Sem cobrança surpresa", desc: "Plano é Pix mensal. Você decide se renova — não há débito automático no cartão." },
  { title: "Sem fidelidade", desc: "Nenhuma permanência mínima. O perfil gratuito continua no ar mesmo se você não renovar." }
];

const WALL_A = [
  { initials: "RL", name: "Dra. Renata Lopes", meta: "Trabalhista · BH/MG", tint: "#274472", text: "No primeiro mês recebi 7 contatos pelo WhatsApp e fechei 3. Já se pagou muitas vezes — e não pago comissão sobre nada." },
  { initials: "MC", name: "Dr. Marcos Couto", meta: "Família · Curitiba/PR", tint: "#2E7D5B", text: "O que mais gostei: o cliente fala direto comigo. Sem leilão de lead, sem ficar disputando preço com outro escritório." },
  { initials: "AF", name: "Dra. Aline Ferraz", meta: "Previdenciário · Recife/PE", tint: "#8A5A2B", text: "Apareço em primeiro quando buscam INSS na minha cidade. R$ 0,66 por dia é simbólico perto do retorno." },
  { initials: "BS", name: "Dr. Bruno Salles", meta: "Consumidor · Goiânia/GO", tint: "#5A3E7A", text: "Cadastro em minutos e o selo de OAB verificada passa confiança. Notei diferença já na primeira semana." },
  { initials: "TM", name: "Dra. Tânia Moraes", meta: "Cível · Santos/SP", tint: "#B4543F", text: "Sem fidelidade foi o que me convenceu a testar. Continuei porque funcionou — cancelaria a qualquer momento." }
];

const WALL_B = [
  { initials: "PG", name: "Dr. Paulo Gomes", meta: "Criminal · Fortaleza/CE", tint: "#2E7D5B", text: "O botão de WhatsApp com mensagem pronta faz o cliente chamar na hora. Mudou meu volume de contatos." },
  { initials: "CD", name: "Dra. Carla Dias", meta: "Trabalhista · Campinas/SP", tint: "#274472", text: "Atendo 3 cidades e apareço nas buscas de todas. Vale cada centavo pra quem atende uma região." },
  { initials: "RV", name: "Dr. Rafael Vieira", meta: "Imobiliário · Porto Alegre/RS", tint: "#8A5A2B", text: "Pago no Pix, sem cartão recorrente, sem surpresa na fatura. Transparente do começo ao fim." },
  { initials: "JN", name: "Dra. Juliana Nunes", meta: "Família · Belém/PA", tint: "#5A3E7A", text: "Minha página fica organizada com foto, áreas e horários. Os clientes chegam já sabendo o que faço." },
  { initials: "ET", name: "Dr. Eduardo Tavares", meta: "Tributário · Salvador/BA", tint: "#B4543F", text: "Diferente dos marketplaces que cobram caro e ainda pegam comissão. Aqui é mensalidade baixa e contato direto." }
];

function TestimonialCard({ t }: { t: (typeof WALL_A)[number] }) {
  return (
    <div className="w-[330px] shrink-0 bg-white border border-brand-line rounded-2xl p-5">
      <div className="text-[13px] mb-2.5" style={{ color: "#C8A24A" }}>★★★★★</div>
      <p className="text-sm leading-relaxed mb-3" style={{ color: "#3C485A" }}>{t.text}</p>
      <div className="flex items-center gap-2.5">
        <div
          className="w-[34px] h-[34px] rounded-full flex items-center justify-center font-display text-sm font-semibold text-white"
          style={{ background: t.tint }}
        >
          {t.initials}
        </div>
        <div className="text-[12.5px]" style={{ color: "#6B7689" }}>
          <strong style={{ color: "#1A2433" }}>{t.name}</strong> · {t.meta}
        </div>
      </div>
    </div>
  );
}

export default function PlanosPage() {
  const daily = (PLAN.price / 30).toFixed(2).replace(".", ",");
  const wallA = [...WALL_A, ...WALL_A];
  const wallB = [...WALL_B, ...WALL_B];
  const eyebrow = "text-xs font-bold uppercase tracking-wider mb-3";

  return (
    <>
      {/* HERO */}
      <section
        className="text-white"
        style={{ background: "linear-gradient(160deg, #0F1B2D 0%, #16263F 100%)" }}
      >
        <div className="max-w-[820px] mx-auto px-7 py-16 md:py-[70px] text-center">
          <div
            className="inline-flex items-center gap-2 text-[12.5px] font-semibold px-3.5 py-1.5 rounded-full mb-6"
            style={{ background: "rgba(200,162,74,0.16)", color: "#E3C078" }}
          >
            ★ Cadastro grátis pra qualquer advogado
          </div>
          <h1 className="font-display font-semibold text-3xl md:text-[46px] leading-[1.08] tracking-tight mb-5 text-balance">
            Quando alguém procura advogado na sua cidade, você aparece ou desaparece?
          </h1>
          <p className="text-lg leading-relaxed mx-auto mb-8 max-w-[620px]" style={{ color: "#B9C4D6" }}>
            O AdvAqui organiza buscas por cidade e especialidade. Enquanto outros esperam
            indicação, você aparece onde o cliente procura — sem leilão, sem comissão, sem
            fidelidade.
          </p>
          <div className="flex gap-3 justify-center items-center flex-wrap">
            <Link
              href="/cadastro"
              className="font-bold text-[15px] px-7 py-3.5 rounded-[10px]"
              style={{ background: "#C8A24A", color: "#0F1B2D" }}
            >
              Ativar premium — {formatCurrency(PLAN.price)}/mês
            </Link>
            <Link
              href="/cadastro"
              className="font-semibold text-[15px] px-6 py-3.5 rounded-[10px] text-white"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              Cadastrar grátis
            </Link>
          </div>
          <div className="text-[13px] mt-4" style={{ color: "#7E8BA1" }}>
            Renovação mensal · cancele quando quiser · Pix
          </div>
          <div
            className="flex gap-9 justify-center flex-wrap mt-8 pt-7"
            style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
          >
            <div>
              <div className="font-display text-[30px]" style={{ color: "#E3C078" }}>5×</div>
              <div className="text-[13px]" style={{ color: "#9FB0CB" }}>mais contatos que perfil grátis</div>
            </div>
            <div>
              <div className="font-display text-[30px]" style={{ color: "#E3C078" }}>1.200+</div>
              <div className="text-[13px]" style={{ color: "#9FB0CB" }}>advogados já anunciam</div>
            </div>
            <div>
              <div className="font-display text-[30px]" style={{ color: "#E3C078" }}>R$ 0,66</div>
              <div className="text-[13px]" style={{ color: "#9FB0CB" }}>por dia, sem fidelidade</div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1040px] mx-auto px-7">
        {/* PROBLEMA / SOLUÇÃO */}
        <section className="grid md:grid-cols-2 gap-[22px] pt-14">
          <div className="bg-white border border-brand-line rounded-2xl p-7">
            <div className={eyebrow} style={{ color: "#B45A4A" }}>O problema</div>
            <h3 className="font-display font-semibold text-xl leading-tight mb-3">
              Muitos advogados dependem só de indicação
            </h3>
            <p className="text-[15px] leading-relaxed" style={{ color: "#5A6678" }}>
              Quando alguém pesquisa &ldquo;advogado em Belo Horizonte&rdquo; no Google, o
              mapinha mostra 3 escritórios — quase nunca o seu. O trabalho continua bom, mas o
              telefone toca menos do que deveria.
            </p>
          </div>
          <div className="rounded-2xl p-7 text-white" style={{ background: "#0F1B2D" }}>
            <div className={eyebrow} style={{ color: "#E3C078" }}>A solução</div>
            <h3 className="font-display font-semibold text-xl leading-tight mb-3">
              Sua presença organizada por cidade e especialidade
            </h3>
            <p className="text-[15px] leading-relaxed" style={{ color: "#B9C4D6" }}>
              Quando o cliente busca &ldquo;advogado trabalhista em Belo Horizonte&rdquo;, sua
              ficha aparece — nome, OAB, foto, áreas e contato direto. Sem leilão, sem comissão,
              sem intermediário.
            </p>
          </div>
        </section>

        {/* O QUE MUDA COM O PREMIUM */}
        <section className="pt-16 text-center">
          <div className={eyebrow} style={{ color: "#A0843A" }}>O que muda com o premium</div>
          <h2 className="font-display font-semibold text-3xl tracking-tight">
            Por {formatCurrency(PLAN.price)}/mês{" "}
            <span className="text-[19px] font-normal" style={{ color: "#8A93A3" }}>
              (R$ {daily}/dia)
            </span>
            , você ganha:
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-9 text-left">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="bg-white border border-brand-line rounded-[13px] p-[22px]"
                style={{ boxShadow: "0 1px 2px rgba(15,27,45,0.04)" }}
              >
                <div
                  className="w-[34px] h-[34px] rounded-[9px] flex items-center justify-center text-[17px] mb-3.5"
                  style={{ background: "#FBF1D8", color: "#A0843A" }}
                >
                  {b.icon}
                </div>
                <div className="font-semibold text-[15px] mb-1.5">{b.title}</div>
                <div className="text-[13px] leading-relaxed" style={{ color: "#6B7689" }}>{b.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* COMO VOCÊ APARECE — Google */}
        <section className="pt-[70px]">
          <div className="text-center mb-9">
            <div className={eyebrow} style={{ color: "#A0843A" }}>Como você aparece</div>
            <h2 className="font-display font-semibold text-3xl tracking-tight mb-2.5">
              É assim que o cliente te encontra
            </h2>
            <p className="text-[15.5px] mx-auto max-w-[560px]" style={{ color: "#5A6678" }}>
              Com o premium, seu perfil sobe ao topo e passa a aparecer assim — no Google e em
              todo o AdvAqui, com OAB verificada e contato direto.
            </p>
          </div>
          <div className="grid lg:grid-cols-[1.55fr_1fr] gap-6 items-start">
            {/* Desktop google */}
            <div
              className="bg-white border border-brand-line rounded-2xl p-6"
              style={{ boxShadow: "0 1px 2px rgba(15,27,45,0.04)" }}
            >
              <div
                className="flex items-center gap-2.5 rounded-full px-4 py-2.5 mb-5"
                style={{ border: "1px solid #E0DED5" }}
              >
                <span className="text-sm" aria-hidden>🔎</span>
                <span className="text-sm" style={{ color: "#3C485A" }}>advogado trabalhista em Belo Horizonte</span>
              </div>
              <div className="mb-5" style={{ borderLeft: "3px solid #C8A24A", padding: "2px 0 2px 14px" }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-[22px] h-[22px] rounded-full flex items-center justify-center font-display text-xs text-white" style={{ background: "#0F1B2D" }}>A</span>
                  <span className="text-[13px]" style={{ color: "#1A2433" }}>AdvAqui</span>
                  <span className="text-xs" style={{ color: "#5F6B7A" }}>advaqui.com › advogado › joao-pereira</span>
                </div>
                <div className="text-lg leading-snug mb-1" style={{ color: "#1a4fad" }}>
                  Dr. João Pereira — Advogado Trabalhista em Belo Horizonte
                </div>
                <div className="text-[13.5px] leading-relaxed" style={{ color: "#4D5A6B" }}>
                  OAB/MG verificada. Atendimento direto por WhatsApp em demissões, rescisões e
                  verbas trabalhistas. Fale agora com um advogado na sua cidade.
                </div>
              </div>
              <div className="opacity-50 mb-4">
                <div className="text-xs mb-1" style={{ color: "#5F6B7A" }}>outro-site.com.br › lista-advogados</div>
                <div className="text-base" style={{ color: "#1a4fad" }}>Lista de advogados na região</div>
              </div>
              <div className="opacity-50">
                <div className="text-xs mb-1" style={{ color: "#5F6B7A" }}>exemplo.adv.br › trabalhista</div>
                <div className="text-base" style={{ color: "#1a4fad" }}>Escritório de advocacia trabalhista</div>
              </div>
            </div>
            {/* Mobile */}
            <div>
              <div className="font-semibold text-[15px] mb-1">No celular, com botão de ligar</div>
              <div className="text-[13.5px] mb-4" style={{ color: "#6B7689" }}>
                Quem procura pelo celular liga ou chama no WhatsApp com um toque.
              </div>
              <div
                className="bg-white border border-brand-line rounded-[22px] p-4 max-w-[280px]"
                style={{ boxShadow: "0 8px 24px -12px rgba(15,27,45,0.25)" }}
              >
                <div className="flex items-center gap-2.5 rounded-[20px] px-3.5 py-2 mb-4" style={{ background: "#F1F0EA" }}>
                  <span className="text-[13px]" aria-hidden>🔎</span>
                  <span className="text-[13px]" style={{ color: "#3C485A" }}>advogado perto de mim</span>
                </div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center font-display text-[11px] text-white" style={{ background: "#0F1B2D" }}>A</span>
                  <span className="text-xs" style={{ color: "#5F6B7A" }}>advaqui.com</span>
                </div>
                <div className="text-[15.5px] leading-snug mb-1" style={{ color: "#1a4fad" }}>
                  Dr. João Pereira — Advogado em Belo Horizonte
                </div>
                <div className="text-[12.5px] mb-3.5" style={{ color: "#4D5A6B" }}>
                  OAB/MG verificada · Direito Trabalhista, Família e Cível.
                </div>
                <div className="flex gap-2">
                  <span className="flex-1 text-center text-[13px] font-semibold text-white py-2.5 rounded-[9px]" style={{ background: "#0F1B2D" }}>📞 Ligar</span>
                  <span className="flex-1 text-center text-[13px] font-semibold text-white py-2.5 rounded-[9px]" style={{ background: "#25623F" }}>💬 WhatsApp</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-xs mt-4 text-center" style={{ color: "#9AA1AD" }}>
            Simulações ilustrativas de resultado de busca. Nomes e textos são exemplos.
          </div>
        </section>

        {/* COMPARATIVO */}
        <section className="pt-[70px]">
          <div className="text-center mb-7">
            <div className={eyebrow} style={{ color: "#A0843A" }}>Como nos comparamos</div>
            <h2 className="font-display font-semibold text-3xl tracking-tight">
              Marketplaces jurídicos no Brasil
            </h2>
          </div>
          <div className="bg-white border border-brand-line rounded-2xl overflow-hidden">
            <div
              className="grid grid-cols-[1.7fr_1fr_1fr_1fr] text-white px-[22px] py-[15px] text-[13px] font-semibold"
              style={{ background: "#0F1B2D" }}
            >
              <span>Item</span>
              <span className="text-center" style={{ color: "#E3C078" }}>AdvAqui</span>
              <span className="text-center" style={{ color: "#A9B4C6" }}>Concorrente A</span>
              <span className="text-center" style={{ color: "#A9B4C6" }}>Concorrente B</span>
            </div>
            {COMPARE.map((c) => (
              <div
                key={c.item}
                className="grid grid-cols-[1.7fr_1fr_1fr_1fr] px-[22px] py-3.5 text-sm items-center"
                style={{ borderTop: "1px solid #EDEBE3" }}
              >
                <span style={{ color: "#1A2433" }}>{c.item}</span>
                <span className="text-center font-semibold" style={{ color: "#2E7D5B" }}>{c.adv}</span>
                <span className="text-center" style={{ color: "#8A93A3" }}>{c.a}</span>
                <span className="text-center" style={{ color: "#8A93A3" }}>{c.b}</span>
              </div>
            ))}
          </div>
          <div className="text-[11.5px] mt-3" style={{ color: "#9AA1AD" }}>
            Comparação baseada em informações públicas dos sites concorrentes (Maio/2026).
            Valores e condições podem mudar — confira sempre na página oficial.
          </div>
        </section>

        {/* GARANTIAS */}
        <section className="pt-[70px]">
          <div className="text-center mb-7">
            <div className={eyebrow} style={{ color: "#A0843A" }}>Sem letra miúda</div>
            <h2 className="font-display font-semibold text-3xl tracking-tight">
              Suas garantias no AdvAqui
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {GUARANTEES.map((g) => (
              <div key={g.title} className="bg-white border border-brand-line rounded-[14px] p-6">
                <div className="text-lg mb-2.5" style={{ color: "#2E7D5B" }}>✓</div>
                <div className="font-semibold text-[15.5px] mb-1.5">{g.title}</div>
                <div className="text-[13.5px] leading-relaxed" style={{ color: "#6B7689" }}>{g.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* DEPOIMENTOS ROLANDO */}
        <section className="pt-16">
          <h2 className="font-display font-semibold text-3xl tracking-tight mb-1.5 text-center">
            O que dizem os advogados
          </h2>
          <p className="text-[15px] mb-7 text-center" style={{ color: "#5A6678" }}>
            Profissionais que já anunciam no AdvAqui.
          </p>
          <div
            className="adv-marquee overflow-hidden mb-3.5"
            style={{
              WebkitMaskImage: "linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent)",
              maskImage: "linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent)"
            }}
          >
            <div className="adv-track">
              {wallA.map((t, i) => (
                <TestimonialCard key={`a-${i}`} t={t} />
              ))}
            </div>
          </div>
          <div
            className="adv-marquee overflow-hidden"
            style={{
              WebkitMaskImage: "linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent)",
              maskImage: "linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent)"
            }}
          >
            <div className="adv-track2">
              {wallB.map((t, i) => (
                <TestimonialCard key={`b-${i}`} t={t} />
              ))}
            </div>
          </div>
        </section>

        {/* ATIVAÇÃO EM 3 PASSOS */}
        <section className="pt-[70px]">
          <div className="text-center mb-9">
            <div className={eyebrow} style={{ color: "#A0843A" }}>Rápido e sem burocracia</div>
            <h2 className="font-display font-semibold text-3xl tracking-tight">
              Ativação em 3 passos
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { step: "01", title: "Cadastre-se grátis", desc: "Preencha nome, OAB, cidade e especialidades. Menos de 1 minuto." },
              { step: "02", title: "Ative o Premium via Pix", desc: `Pague ${formatCurrency(PLAN.price)} no Pix — sem cartão, sem débito automático. Confirmamos em até ${PLAN.activationHours} horas.` },
              { step: "03", title: "Apareça no topo", desc: "Seu perfil sobe ao topo da cidade, com foto, selo OAB e WhatsApp clicável." }
            ].map((s) => (
              <div key={s.step} className="relative bg-white border border-brand-line rounded-[14px] p-6">
                <div className="font-display text-[32px] font-bold mb-2" style={{ color: "rgba(200,162,74,0.25)" }}>{s.step}</div>
                <div className="font-semibold text-[16px] mb-2">{s.title}</div>
                <div className="text-[13.5px] leading-relaxed" style={{ color: "#6B7689" }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="pt-[70px]">
          <div className="text-center mb-9">
            <div className={eyebrow} style={{ color: "#A0843A" }}>Perguntas frequentes</div>
            <h2 className="font-display font-semibold text-3xl tracking-tight">
              Tire suas dúvidas
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { q: "Preciso ser advogado para cadastrar?", a: "O perfil de advogado exige OAB ativa. Se você não é advogado, pode usar as ferramentas do site criando uma conta gratuita de usuário." },
              { q: "O perfil gratuito continua existindo?", a: "Sim. O plano gratuito mostra nome, OAB, cidade e 1 especialidade. O Premium adiciona foto de destaque, WhatsApp, múltiplas cidades, selo verificado e posição no topo." },
              { q: "Posso cancelar a qualquer momento?", a: "Sem fidelidade. Se não renovar o Pix, o perfil volta ao plano gratuito no mês seguinte. Nada é cobrado automaticamente." },
              { q: "Como funciona o pagamento?", a: `Pix mensal de ${formatCurrency(PLAN.price)}. Você recebe o QR Code no painel, paga e o plano é ativado. Sem cartão de crédito, sem débito automático.` },
              { q: "Posso aparecer em mais de uma cidade?", a: "Com o Premium, você aparece em até 10 cidades diferentes — ideal para quem atende em comarcas vizinhas." },
              { q: "A OAB é verificada mesmo?", a: "Sim. Nosso time confere o número da OAB antes de conceder o selo. Isso protege tanto você quanto o cliente que busca." },
              { q: "O AdvAqui cobra comissão sobre causas?", a: "Nunca. O cliente fala direto com você. O AdvAqui não intermedia, não cobra percentual e não participa do honorário." },
              { q: "Quanto tempo leva para ativar?", a: `Após o pagamento do Pix, a ativação acontece em até ${PLAN.activationHours} horas. Na maioria dos casos, em poucas horas.` }
            ].map((faq) => (
              <details key={faq.q} className="bg-white border border-brand-line rounded-[14px] p-5 group">
                <summary className="font-semibold text-[15px] cursor-pointer list-none flex items-center justify-between gap-3">
                  <span>{faq.q}</span>
                  <span className="text-brand-ink/30 group-open:rotate-45 transition-transform text-xl shrink-0">+</span>
                </summary>
                <p className="text-[13.5px] leading-relaxed mt-3 pt-3" style={{ color: "#6B7689", borderTop: "1px solid #EDEBE3" }}>
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-16">
          <div
            className="rounded-[18px] p-11 text-center text-white"
            style={{ background: "linear-gradient(110deg, #1B2D49, #0F1B2D)" }}
          >
            <h2 className="font-display font-semibold text-3xl tracking-tight mb-2.5">
              Comece a aparecer hoje na sua cidade
            </h2>
            <p className="text-[15.5px] mb-2" style={{ color: "#A9B4C6" }}>
              Enquanto você lê isto, alguém está procurando um advogado na sua cidade. A primeira
              posição ainda está livre.
            </p>
            <p className="text-sm mb-6" style={{ color: "#7E8BA1" }}>
              {formatCurrency(PLAN.price)}/mês · Pix · sem fidelidade · cancele quando quiser
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link
                href="/cadastro"
                className="inline-block font-bold text-base px-[30px] py-[15px] rounded-[11px]"
                style={{ background: "#C8A24A", color: "#0F1B2D" }}
              >
                Ativar premium agora
              </Link>
              <Link
                href="/cadastro"
                className="inline-block font-semibold text-base px-[26px] py-[15px] rounded-[11px]"
                style={{ border: "1px solid rgba(255,255,255,0.25)", color: "white" }}
              >
                Começar com o plano grátis
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
