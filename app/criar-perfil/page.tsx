"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  MessageCircle,
  Camera,
  Clock,
  Instagram,
  Globe,
  Sparkles,
  AlertTriangle,
  Copy,
  Star,
  Phone
} from "lucide-react";
import { SPECIALTIES } from "@/lib/data/specialties";
import { PLAN } from "@/lib/config";

/**
 * /criar-perfil — Assistente guiado de perfil (robô de onboarding).
 *
 * Entrevista o advogado em passos curtos, monta uma ficha profissional pronta
 * com bio sugerida (gerada por modelo/regra, sem IA externa), aponta o que
 * falta no perfil e mostra a diferença entre perfil comum e destacado,
 * vendendo o premium de forma natural.
 *
 * Tudo client-side: não grava nada, não envia dados. É uma vitrine que termina
 * com CTA para /cadastro (criar de verdade) e /planos. Texto da bio é sóbrio,
 * sem promessa de resultado, adequado às regras de publicidade da advocacia.
 */

const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS",
  "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC",
  "SP", "SE", "TO"
];

const STEPS = ["Você", "Onde atua", "Áreas", "Contato", "Sua ficha"] as const;

type Form = {
  name: string;
  oab: string;
  oabUf: string;
  city: string;
  uf: string;
  nearby: string;
  specialties: string[];
  whatsapp: string;
  instagram: string;
  site: string;
  hours: string;
  hasPhoto: boolean;
};

const EMPTY: Form = {
  name: "",
  oab: "",
  oabUf: "MG",
  city: "",
  uf: "MG",
  nearby: "",
  specialties: [],
  whatsapp: "",
  instagram: "",
  site: "",
  hours: "",
  hasPhoto: false
};

function listToPt(arr: string[]): string {
  if (arr.length === 0) return "";
  if (arr.length === 1) return arr[0];
  return `${arr.slice(0, -1).join(", ")} e ${arr[arr.length - 1]}`;
}

function specialtyNames(slugs: string[]): string[] {
  return slugs
    .map((s) => SPECIALTIES.find((x) => x.slug === s)?.name)
    .filter((x): x is string => Boolean(x));
}

function gerarBio(f: Form): string {
  const areas = specialtyNames(f.specialties);
  const cidade = f.city ? `${f.city}/${f.uf}` : "sua cidade";
  const nome = f.name.trim() || "Advogado(a)";
  const oab = f.oab.trim() ? ` nº ${f.oab.trim()}` : "";
  const parts: string[] = [];
  parts.push(`${nome}, advogado(a) inscrito(a) na OAB/${f.oabUf}${oab}.`);
  parts.push(
    areas.length
      ? `Atua em ${cidade} e região, com foco em ${listToPt(areas)}.`
      : `Atua em ${cidade} e região.`
  );
  parts.push(
    "Atendimento próximo e direto, com orientação clara sobre os caminhos de cada caso."
  );
  if (f.hours.trim()) parts.push(`Atende ${f.hours.trim()}.`);
  parts.push("Fale diretamente pelos canais de contato do perfil.");
  return parts.join(" ");
}

type Gap = { sev: "alta" | "media" | "baixa"; txt: string };

function diagnostico(f: Form): Gap[] {
  const gaps: Gap[] = [];
  if (!f.hasPhoto)
    gaps.push({
      sev: "alta",
      txt: "Sem foto, sua taxa de contato tende a cair — perfis com foto recebem mais cliques."
    });
  if (!f.whatsapp.trim())
    gaps.push({
      sev: "alta",
      txt: "Sem WhatsApp clicável, o cliente precisa copiar o número — e muitos desistem no caminho."
    });
  if (f.specialties.length < 2)
    gaps.push({
      sev: "media",
      txt: "Com poucas áreas, você aparece de forma genérica. Marque as áreas específicas em que atua."
    });
  if (!f.site.trim() && !f.instagram.trim())
    gaps.push({
      sev: "media",
      txt: "Sem site ou Instagram, o cliente não consegue te conhecer antes de ligar."
    });
  if (!f.hours.trim())
    gaps.push({
      sev: "baixa",
      txt: "Sem horários visíveis, o cliente pode achar que você está fechado e procurar outro."
    });
  return gaps;
}

const SEV_STYLE: Record<Gap["sev"], string> = {
  alta: "border-red-200 bg-red-50 text-red-800",
  media: "border-amber-200 bg-amber-50 text-amber-900",
  baixa: "border-sky-200 bg-sky-50 text-sky-900"
};

export default function CriarPerfilPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(EMPTY);
  const [copied, setCopied] = useState(false);

  const u = <K extends keyof Form>(k: K, v: Form[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const toggleSpec = (slug: string) =>
    u(
      "specialties",
      form.specialties.includes(slug)
        ? form.specialties.filter((x) => x !== slug)
        : [...form.specialties, slug]
    );

  const bio = useMemo(() => gerarBio(form), [form]);
  const gaps = useMemo(() => diagnostico(form), [form]);
  const areaNames = specialtyNames(form.specialties);

  const canNext = (): boolean => {
    if (step === 0) return form.name.trim().length >= 3 && form.oab.trim().length >= 1;
    if (step === 1) return form.city.trim().length >= 2;
    if (step === 2) return form.specialties.length >= 1;
    return true;
  };

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const copyBio = async () => {
    try {
      await navigator.clipboard.writeText(bio);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const waLink = form.whatsapp.trim()
    ? `https://wa.me/55${form.whatsapp.replace(/\D/g, "")}`
    : null;

  return (
    <main className="container-narrow py-10 md:py-14">
      {/* Cabeçalho */}
      <div className="text-center mb-8">
        <span className="chip border-brand-accent/40 bg-brand-accent/10 text-brand-ink mb-3">
          <Sparkles className="w-3.5 h-3.5" aria-hidden /> Assistente de perfil
        </span>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-ink text-balance">
          Monte seu perfil de advogado em 2 minutos
        </h1>
        <p className="text-brand-ink/70 mt-3 max-w-xl mx-auto">
          Responda algumas perguntas e veja sua ficha profissional pronta — com
          bio sugerida e o que falta para o cliente te encontrar e te chamar.
        </p>
      </div>

      {/* Progresso */}
      <ol className="flex items-center justify-center gap-2 mb-8" aria-label="Etapas">
        {STEPS.map((label, i) => (
          <li key={label} className="flex items-center gap-2">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${
                i < step
                  ? "bg-brand-deep text-white"
                  : i === step
                  ? "bg-brand-ink text-white"
                  : "bg-brand-line/70 text-brand-ink/50"
              }`}
            >
              {i < step ? <Check className="w-4 h-4" aria-hidden /> : i + 1}
            </span>
            {i < STEPS.length - 1 && (
              <span
                className={`hidden sm:block h-0.5 w-8 rounded ${
                  i < step ? "bg-brand-deep" : "bg-brand-line"
                }`}
              />
            )}
          </li>
        ))}
      </ol>

      <div className="card">
        {/* PASSO 0 — Você */}
        {step === 0 && (
          <div className="space-y-5">
            <h2 className="font-display text-xl font-bold text-brand-ink">
              Quem é você?
            </h2>
            <div>
              <label className="label" htmlFor="name">Nome completo</label>
              <input
                id="name"
                className="input"
                placeholder="Ex.: Maria Joana da Silva"
                value={form.name}
                onChange={(e) => u("name", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="label" htmlFor="oab">Número da OAB</label>
                <input
                  id="oab"
                  className="input"
                  placeholder="Ex.: 195349"
                  value={form.oab}
                  onChange={(e) => u("oab", e.target.value)}
                />
              </div>
              <div>
                <label className="label" htmlFor="oabUf">UF da OAB</label>
                <select
                  id="oabUf"
                  className="input"
                  value={form.oabUf}
                  onChange={(e) => u("oabUf", e.target.value)}
                >
                  {UFS.map((uf) => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* PASSO 1 — Onde atua */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="font-display text-xl font-bold text-brand-ink">
              Onde você atende?
            </h2>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="label" htmlFor="city">Cidade principal</label>
                <input
                  id="city"
                  className="input"
                  placeholder="Ex.: Almenara"
                  value={form.city}
                  onChange={(e) => u("city", e.target.value)}
                />
              </div>
              <div>
                <label className="label" htmlFor="uf">UF</label>
                <select
                  id="uf"
                  className="input"
                  value={form.uf}
                  onChange={(e) => u("uf", e.target.value)}
                >
                  {UFS.map((uf) => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="label" htmlFor="nearby">
                Cidades próximas onde também atende{" "}
                <span className="text-brand-ink/45 font-normal">(opcional)</span>
              </label>
              <input
                id="nearby"
                className="input"
                placeholder="Ex.: Jequitinhonha, Salto da Divisa, Jacinto"
                value={form.nearby}
                onChange={(e) => u("nearby", e.target.value)}
              />
              <p className="text-xs text-brand-ink/55 mt-1.5">
                No premium, você aparece nas buscas de até 10 cidades — não só na principal.
              </p>
            </div>
          </div>
        )}

        {/* PASSO 2 — Áreas */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold text-brand-ink">
              Em quais áreas você atua?
            </h2>
            <p className="text-sm text-brand-ink/65">
              Marque todas que se aplicam. Quanto mais específico, melhor você
              aparece nas buscas certas.
            </p>
            <div className="flex flex-wrap gap-2">
              {SPECIALTIES.map((s) => {
                const on = form.specialties.includes(s.slug);
                return (
                  <button
                    key={s.slug}
                    type="button"
                    onClick={() => toggleSpec(s.slug)}
                    aria-pressed={on}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${
                      on
                        ? "bg-brand-ink text-white border-brand-ink"
                        : "bg-white text-brand-ink border-brand-line hover:border-brand-deep"
                    }`}
                  >
                    {on && <Check className="inline w-3.5 h-3.5 mr-1 -mt-0.5" aria-hidden />}
                    {s.name}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-brand-ink/55">
              {form.specialties.length} selecionada(s)
            </p>
          </div>
        )}

        {/* PASSO 3 — Contato & presença */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="font-display text-xl font-bold text-brand-ink">
              Como o cliente fala com você?
            </h2>
            <div>
              <label className="label" htmlFor="whatsapp">
                <MessageCircle className="inline w-4 h-4 mr-1 -mt-0.5 text-emerald-600" aria-hidden />
                WhatsApp <span className="text-brand-ink/45 font-normal">(com DDD)</span>
              </label>
              <input
                id="whatsapp"
                className="input"
                placeholder="Ex.: 33 98813-9274"
                value={form.whatsapp}
                onChange={(e) => u("whatsapp", e.target.value)}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="label" htmlFor="instagram">
                  <Instagram className="inline w-4 h-4 mr-1 -mt-0.5 text-pink-600" aria-hidden />
                  Instagram <span className="text-brand-ink/45 font-normal">(opcional)</span>
                </label>
                <input
                  id="instagram"
                  className="input"
                  placeholder="@seuperfil"
                  value={form.instagram}
                  onChange={(e) => u("instagram", e.target.value)}
                />
              </div>
              <div>
                <label className="label" htmlFor="site">
                  <Globe className="inline w-4 h-4 mr-1 -mt-0.5 text-brand-deep" aria-hidden />
                  Site <span className="text-brand-ink/45 font-normal">(opcional)</span>
                </label>
                <input
                  id="site"
                  className="input"
                  placeholder="www.seusite.com.br"
                  value={form.site}
                  onChange={(e) => u("site", e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="hours">
                <Clock className="inline w-4 h-4 mr-1 -mt-0.5 text-brand-deep" aria-hidden />
                Horário de atendimento <span className="text-brand-ink/45 font-normal">(opcional)</span>
              </label>
              <input
                id="hours"
                className="input"
                placeholder="Ex.: seg a sex, 9h às 18h"
                value={form.hours}
                onChange={(e) => u("hours", e.target.value)}
              />
            </div>
            <label className="flex items-center gap-3 p-3 rounded-xl border border-brand-line bg-brand-bg/40 cursor-pointer">
              <input
                type="checkbox"
                checked={form.hasPhoto}
                onChange={(e) => u("hasPhoto", e.target.checked)}
                className="w-5 h-5 accent-brand-deep"
              />
              <span className="text-sm text-brand-ink">
                <Camera className="inline w-4 h-4 mr-1 -mt-0.5" aria-hidden />
                Tenho uma foto profissional para usar no perfil
              </span>
            </label>
          </div>
        )}

        {/* PASSO 4 — Ficha gerada */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="font-display text-xl font-bold text-brand-ink">
              Sua ficha está pronta
            </h2>

            {/* Preview do card destacado */}
            <div className="rounded-2xl border-2 border-brand-accent bg-gradient-to-br from-brand-accent/10 via-white to-white p-5 shadow-card">
              <div className="flex items-start gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-deep text-white font-bold text-lg">
                  {(form.name.trim()[0] || "A").toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-lg font-bold text-brand-ink">
                      {form.name.trim() || "Seu nome"}
                    </h3>
                    <span className="chip border-brand-accent/50 bg-brand-accent/15 text-brand-ink">
                      <Star className="w-3 h-3" aria-hidden /> Destaque
                    </span>
                  </div>
                  <p className="text-sm text-brand-ink/70">
                    OAB/{form.oabUf} {form.oab || "000000"}
                    {form.city ? ` · ${form.city}/${form.uf}` : ""}
                  </p>
                </div>
              </div>

              {areaNames.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {areaNames.map((n) => (
                    <span key={n} className="chip">{n}</span>
                  ))}
                </div>
              )}

              <p className="text-sm text-brand-ink/85 mt-3 leading-relaxed">{bio}</p>

              <div className="mt-3 space-y-1 text-sm text-brand-ink/75">
                {form.hours.trim() && (
                  <p><Clock className="inline w-4 h-4 mr-1.5 -mt-0.5 text-brand-deep" aria-hidden />{form.hours.trim()}</p>
                )}
                {(form.site.trim() || form.instagram.trim()) && (
                  <p>
                    <Globe className="inline w-4 h-4 mr-1.5 -mt-0.5 text-brand-deep" aria-hidden />
                    {[form.site.trim(), form.instagram.trim()].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {waLink ? (
                  <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-accent text-sm">
                    <MessageCircle className="w-4 h-4" aria-hidden /> WhatsApp
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-line/60 text-brand-ink/55 text-sm">
                    <Phone className="w-4 h-4" aria-hidden /> Contato direto (no premium)
                  </span>
                )}
              </div>
            </div>

            {/* Bio copiável */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="label mb-0">Bio sugerida</span>
                <button type="button" onClick={copyBio} className="btn-ghost text-xs">
                  <Copy className="w-3.5 h-3.5" aria-hidden /> {copied ? "Copiado!" : "Copiar"}
                </button>
              </div>
              <p className="text-sm text-brand-ink/80 p-3 rounded-xl border border-brand-line bg-brand-bg/30 leading-relaxed">
                {bio}
              </p>
              <p className="text-xs text-brand-ink/50 mt-1">
                {bio.length} caracteres · grátis aceita até 200, premium até 500.
                Ajuste como quiser ao criar seu perfil.
              </p>
            </div>

            {/* Diagnóstico — o que falta */}
            <div>
              <h3 className="font-display text-base font-bold text-brand-ink mb-2">
                {gaps.length === 0 ? "Seu perfil está completo" : "O que ainda falta"}
              </h3>
              {gaps.length === 0 ? (
                <p className="text-sm text-brand-ink/70">
                  Tudo o que mais converte está preenchido. Hora de publicar.
                </p>
              ) : (
                <ul className="space-y-2">
                  {gaps.map((g, i) => (
                    <li
                      key={i}
                      className={`flex items-start gap-2 text-sm p-3 rounded-xl border ${SEV_STYLE[g.sev]}`}
                    >
                      <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden />
                      <span>{g.txt}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Comum x destacado */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="rounded-2xl border border-brand-line p-4">
                <p className="text-sm font-bold text-brand-ink/70 mb-2">Perfil comum (grátis)</p>
                <ul className="space-y-1.5 text-sm text-brand-ink/70">
                  <li>Nome, OAB e cidade</li>
                  <li>Telefone clicável</li>
                  <li>Até 5 áreas</li>
                  <li className="text-brand-ink/40">Aparece depois dos destacados</li>
                </ul>
              </div>
              <div className="rounded-2xl border-2 border-brand-accent bg-brand-accent/5 p-4">
                <p className="text-sm font-bold text-brand-ink mb-2">
                  Perfil destacado · {PLAN.priceLabel}/mês
                </p>
                <ul className="space-y-1.5 text-sm text-brand-ink">
                  <li><Check className="inline w-4 h-4 mr-1 text-brand-deep" aria-hidden />Topo da página da cidade</li>
                  <li><Check className="inline w-4 h-4 mr-1 text-brand-deep" aria-hidden />WhatsApp clicável + selo OAB</li>
                  <li><Check className="inline w-4 h-4 mr-1 text-brand-deep" aria-hidden />Foto, bio 500, +10 cidades</li>
                  <li><Check className="inline w-4 h-4 mr-1 text-brand-deep" aria-hidden />Site, Instagram e horários</li>
                </ul>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link href="/cadastro" className="btn-primary flex-1">
                Criar meu perfil grátis <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
              <Link href="/planos" className="btn-accent flex-1">
                Ver o premium ({PLAN.priceLabel}/mês)
              </Link>
            </div>
            <p className="text-xs text-brand-ink/45 text-center">
              Este assistente não salva nada — é só uma prévia. Seu perfil real é
              criado no cadastro, onde você confirma os dados.
            </p>
          </div>
        )}

        {/* Navegação */}
        {step < STEPS.length - 1 && (
          <div className="flex items-center justify-between mt-8 pt-5 border-t border-brand-line">
            <button
              type="button"
              onClick={back}
              disabled={step === 0}
              className="btn-ghost text-sm disabled:opacity-40"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden /> Voltar
            </button>
            <button
              type="button"
              onClick={next}
              disabled={!canNext()}
              className="btn-primary text-sm disabled:opacity-40"
            >
              {step === STEPS.length - 2 ? "Ver minha ficha" : "Continuar"}
              <ArrowRight className="w-4 h-4" aria-hidden />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
