import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { BadgeCheck, ArrowRight, Globe, Shield, TrendingUp, Copy } from "lucide-react";

export const metadata = buildMetadata({
  title: "Selo de Advogado Verificado",
  description:
    "Exiba o selo de Advogado Verificado no AdvAqui no seu site e passe mais credibilidade para quem visita. Disponivel para advogados Premium.",
  path: "/selo"
});

const EMBED_CODE = `<a href="https://advaqui.com?utm_source=selo&utm_medium=badge" rel="noopener" target="_blank" style="display:inline-block;max-width:250px;text-decoration:none;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif"><div style="display:flex;align-items:center;gap:8px;background:#0F1B2D;color:#fff;padding:10px 16px;border-radius:8px;border:2px solid #C8A24A;font-size:13px;line-height:1.3"><span style="color:#C8A24A;font-size:18px;flex-shrink:0">&#10003;</span><span><strong style="color:#C8A24A">Advogado Verificado</strong><br><span style="color:#ffffffcc;font-size:11px">no AdvAqui</span></span></div></a>`;

const BENEFITS = [
  {
    Icon: Shield,
    title: "Credibilidade instantanea",
    text: "O selo mostra que voce tem OAB validada e perfil completo no AdvAqui. Visitantes do seu site veem isso antes de entrar em contato."
  },
  {
    Icon: TrendingUp,
    title: "Backlink para seu perfil",
    text: "O selo linka de volta para o AdvAqui, e o AdvAqui linka para o seu site. Essa troca de links fortalece o SEO de ambos."
  },
  {
    Icon: Globe,
    title: "Funciona em qualquer site",
    text: "O codigo e HTML puro com CSS inline. Cole em WordPress, Wix, blog, landing page ou onde quiser. Nao precisa de plugin."
  }
];

function CopyButton() {
  return (
    <button
      type="button"
      className="btn-accent inline-flex items-center gap-2 text-sm"
      id="copy-embed-btn"
    >
      <Copy className="w-4 h-4" aria-hidden />
      Copiar codigo
    </button>
  );
}

export default function SeloPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-brand-ink via-brand-deep to-brand-primary text-white overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 50%, rgba(201,162,76,0.45) 0%, transparent 50%), radial-gradient(circle at 85% 25%, rgba(232,184,86,0.3) 0%, transparent 45%)"
          }}
        />
        <div className="relative container-tight py-16 md:py-24">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-brand-accent text-brand-ink mb-5">
              <BadgeCheck className="w-3.5 h-3.5" aria-hidden />
              Premium
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight text-balance">
              Selo de Advogado Verificado
            </h1>
            <p className="mt-5 text-lg md:text-xl text-brand-bg/85 leading-relaxed max-w-2xl">
              Exiba no seu site que voce e um advogado verificado no AdvAqui.
              Transmita credibilidade, ganhe um backlink e destaque-se entre os
              colegas.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#embed"
                className="btn-accent inline-flex items-center gap-2 text-base"
              >
                <BadgeCheck className="w-5 h-5" aria-hidden />
                Pegar o codigo do selo
              </a>
              <Link
                href="/planos"
                className="btn-ghost text-white border border-white/25 hover:bg-white/10 inline-flex items-center gap-2"
              >
                Ver plano Premium
                <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Preview do selo */}
      <section className="container-tight py-16">
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
            Veja como o selo aparece
          </h2>
          <p className="text-brand-ink/65 mt-3 text-base md:text-lg">
            Um badge compacto que cabe em qualquer canto do seu site.
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          {/* Card com preview */}
          <div className="rounded-2xl border border-brand-line bg-white p-8 flex flex-col items-center gap-6">
            <p className="text-xs uppercase tracking-wider text-brand-ink/50 font-bold">
              Preview do selo
            </p>

            {/* Renderizacao real do badge */}
            <div className="p-6 bg-brand-bg rounded-xl flex items-center justify-center">
              <a
                href="https://advaqui.com?utm_source=selo&utm_medium=badge"
                rel="noopener"
                target="_blank"
                style={{
                  display: "inline-block",
                  maxWidth: 250,
                  textDecoration: "none",
                  fontFamily:
                    "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "#0F1B2D",
                    color: "#fff",
                    padding: "10px 16px",
                    borderRadius: 8,
                    border: "2px solid #C8A24A",
                    fontSize: 13,
                    lineHeight: 1.3
                  }}
                >
                  <span
                    style={{
                      color: "#C8A24A",
                      fontSize: 18,
                      flexShrink: 0
                    }}
                  >
                    {"✓"}
                  </span>
                  <span>
                    <strong style={{ color: "#C8A24A" }}>
                      Advogado Verificado
                    </strong>
                    <br />
                    <span style={{ color: "#ffffffcc", fontSize: 11 }}>
                      no AdvAqui
                    </span>
                  </span>
                </div>
              </a>
            </div>

            <p className="text-sm text-brand-ink/60 text-center max-w-sm">
              Fundo escuro com borda dourada. Funciona sobre fundo claro ou
              escuro.
            </p>
          </div>
        </div>
      </section>

      {/* Codigo para copiar */}
      <section
        id="embed"
        className="bg-white border-y border-brand-line py-16"
      >
        <div className="container-tight max-w-3xl">
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
              Copie e cole no seu site
            </h2>
            <p className="text-brand-ink/65 mt-3">
              HTML puro com CSS inline. Nao precisa de plugin, script ou CDN.
            </p>
          </div>

          <div className="rounded-2xl border border-brand-line bg-brand-bg p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider text-brand-ink/50 font-bold">
                Codigo HTML
              </span>
              <CopyButton />
            </div>
            <pre
              id="embed-code"
              className="text-sm text-brand-ink/80 bg-white border border-brand-line rounded-xl p-4 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed select-all"
            >
              {EMBED_CODE}
            </pre>
          </div>

          <div className="mt-6 rounded-xl border border-brand-accent/30 bg-brand-accent/5 p-4 text-sm text-brand-ink/75 leading-relaxed">
            <strong className="text-brand-ink">Como usar:</strong> copie o
            codigo acima e cole no HTML do seu site, rodape ou pagina
            &quot;Sobre&quot;. O selo aparece automaticamente e linka para o
            AdvAqui.
          </div>
        </div>
      </section>

      {/* Script para copiar */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', function() {
              var btn = document.getElementById('copy-embed-btn');
              var code = document.getElementById('embed-code');
              if (btn && code) {
                btn.addEventListener('click', function() {
                  var text = code.textContent || '';
                  navigator.clipboard.writeText(text).then(function() {
                    btn.textContent = 'Copiado!';
                    setTimeout(function() {
                      btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg> Copiar codigo';
                    }, 2000);
                  });
                });
              }
            });
          `
        }}
      />

      {/* Beneficios */}
      <section className="container-tight py-16">
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-ink">
            Por que usar o selo
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {BENEFITS.map(({ Icon, title, text }, i) => (
            <div key={i} className="card">
              <div className="w-12 h-12 rounded-xl bg-brand-accent/15 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-brand-accent2" aria-hidden />
              </div>
              <h3 className="font-display text-xl font-bold text-brand-ink mb-1">
                {title}
              </h3>
              <p className="text-sm text-brand-ink/70 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quem pode usar */}
      <section className="bg-brand-bg py-16">
        <div className="container-tight max-w-3xl">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-ink text-center mb-8">
            Quem pode usar o selo
          </h2>
          <div className="rounded-2xl border border-brand-line bg-white p-6 md:p-8">
            <ul className="space-y-3">
              {[
                "Advogados com plano Premium ativo no AdvAqui",
                "OAB validada pelo nosso time",
                "Perfil completo (foto, areas, contatos)"
              ].map((t) => (
                <li
                  key={t}
                  className="flex items-start gap-2.5 text-sm text-brand-ink/85"
                >
                  <BadgeCheck
                    className="w-5 h-5 text-brand-accent2 flex-shrink-0 mt-0.5"
                    aria-hidden
                  />
                  {t}
                </li>
              ))}
            </ul>
            <p className="text-sm text-brand-ink/60 mt-5 leading-relaxed">
              O selo e um beneficio exclusivo do plano Premium. Se sua assinatura
              expirar, o badge continua no seu site, mas a verificacao no AdvAqui
              deixa de ser exibida ate a renovacao.
            </p>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="container-tight pb-16">
        <div className="rounded-3xl bg-gradient-to-br from-brand-ink to-brand-deep text-white p-8 md:p-12 text-center relative overflow-hidden">
          <div
            aria-hidden
            className="absolute -top-1/3 left-1/2 -translate-x-1/2 w-2/3 aspect-square rounded-full bg-brand-accent/20 blur-3xl"
          />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight">
              Ainda nao e Premium?
            </h2>
            <p className="text-brand-bg/85 mt-3 text-base md:text-lg max-w-xl mx-auto">
              O selo e so um dos beneficios. Apareca no topo da sua cidade,
              tenha WhatsApp clicavel, foto em destaque e muito mais.
            </p>
            <div className="mt-7 flex flex-wrap gap-3 justify-center">
              <Link
                href="/planos"
                className="btn-accent inline-flex items-center gap-2 text-base"
              >
                <BadgeCheck className="w-5 h-5" aria-hidden />
                Ver plano Premium
              </Link>
              <Link
                href="/cadastro"
                className="btn-ghost text-white border border-white/25 hover:bg-white/10 inline-flex items-center gap-2"
              >
                Criar perfil gratis
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
