"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Check } from "lucide-react";
import { STATES } from "@/lib/data/states";
import { SPECIALTIES } from "@/lib/data/specialties";
import {
  isValidCpf,
  isValidEmail,
  isValidOab,
  isValidPhone,
  isStrongPassword
} from "@/lib/utils/validation";
import { formatCpf, formatPhone, formatCep } from "@/lib/utils/format";
import { slugify } from "@/lib/utils/slug";
import { toast } from "@/components/Toast";
import { createClient } from "@/lib/supabase/client";

type FormState = {
  name: string;
  cpf: string;
  oab: string;
  oabUf: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  uf: string;
  cep: string;
  specialties: string[];
  bio: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  acceptLgpd: boolean;
  honeypot: string;
};

const STEPS = ["Dados pessoais", "Profissionais", "Acesso"] as const;

export default function CadastroPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>({
    name: "",
    cpf: "",
    oab: "",
    oabUf: "MG",
    email: "",
    phone: "",
    whatsapp: "",
    address: "",
    city: "",
    uf: "MG",
    cep: "",
    specialties: [],
    bio: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    acceptLgpd: false,
    honeypot: ""
  });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const u = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const toggleSpec = (slug: string) =>
    u(
      "specialties",
      form.specialties.includes(slug)
        ? form.specialties.filter((x) => x !== slug)
        : [...form.specialties, slug]
    );

  const [citySuggestions, setCitySuggestions] = useState<
    Array<{ name: string; slug: string; uf: string; isCapital: boolean }>
  >([]);

  useEffect(() => {
    const term = form.city.trim();
    if (term.length < 2) {
      setCitySuggestions([]);
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      fetch(`/api/cities?q=${encodeURIComponent(term)}&limit=10`, { signal: ctrl.signal })
        .then((r) => (r.ok ? r.json() : []))
        .then((data: Array<{ name: string; slug: string; uf: string; isCapital: boolean }>) => {
          // Filtra pela UF escolhida no formulário para autocomplete contextual.
          setCitySuggestions(data.filter((c) => c.uf === form.uf).slice(0, 6));
        })
        .catch(() => undefined);
    }, 200);
    return () => {
      ctrl.abort();
      clearTimeout(t);
    };
  }, [form.city, form.uf]);

  const validate = (which: number): boolean => {
    const e: Record<string, string> = {};
    if (which >= 0) {
      if (!form.name.trim()) e.name = "Informe seu nome completo";
      if (!isValidCpf(form.cpf)) e.cpf = "CPF inválido";
      if (!isValidEmail(form.email)) e.email = "E-mail inválido";
      if (!isValidPhone(form.phone)) e.phone = "Telefone inválido (com DDD)";
    }
    if (which >= 1) {
      if (!isValidOab(form.oab)) e.oab = "Número da OAB inválido";
      if (!form.city.trim()) e.city = "Informe sua cidade";
      if (form.specialties.length === 0) e.specialties = "Escolha ao menos uma especialidade";
    }
    if (which >= 2) {
      if (!isStrongPassword(form.password))
        e.password = "Mínimo 8 caracteres, com letras e números";
      if (form.password !== form.confirmPassword)
        e.confirmPassword = "Senhas não coincidem";
      if (!form.acceptTerms) e.acceptTerms = "Aceite os termos para continuar";
      if (!form.acceptLgpd) e.acceptLgpd = "Aceite o consentimento LGPD";
      // Duplicidade de e-mail é verificada pelo Supabase Auth no signUp.
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validate(step)) {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.honeypot) return;
    if (!validate(2)) return;
    if (submitting) return;

    setSubmitting(true);
    const citySlug = slugify(form.city);
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email: form.email.toLowerCase().trim(),
      password: form.password,
      options: {
        // Esses dados são lidos pelo trigger handle_new_user() no Supabase,
        // que cria a linha em public.lawyers automaticamente.
        data: {
          name: form.name,
          oab: form.oab,
          oab_uf: form.oabUf,
          cpf: form.cpf,
          phone: form.phone,
          whatsapp: form.whatsapp || form.phone,
          address: form.address,
          city_name: form.city,
          city_slug: citySlug,
          uf: form.uf,
          specialties: form.specialties,
          bio: form.bio
        }
      }
    });

    setSubmitting(false);

    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes("already") || msg.includes("registered")) {
        setErrors({ email: "Este e-mail já está cadastrado" });
        setStep(0);
        return;
      }
      setErrors({ password: error.message });
      return;
    }

    if (data.user) {
      toast("Cadastro realizado! Bem-vindo ao AdvAqui.");
      router.push("/painel");
      router.refresh();
    }
  };

  return (
    <div className="container-narrow py-12">
      <h1 className="font-display text-4xl font-bold text-brand-ink">Cadastro de advogado</h1>
      <p className="text-brand-ink/60 mt-2 mb-6">
        Crie seu perfil em 3 passos. O cadastro é gratuito e leva menos de 5 minutos.
      </p>

      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((label, idx) => (
          <div key={idx} className="flex-1 flex items-center gap-2">
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                idx <= step ? "bg-brand-deep text-white" : "bg-brand-line text-brand-ink/50"
              }`}
            >
              {idx < step ? <Check className="w-4 h-4" /> : idx + 1}
            </div>
            <span
              className={`text-xs ${
                idx <= step ? "text-brand-ink font-medium" : "text-brand-ink/40"
              } hidden sm:inline`}
            >
              {label}
            </span>
            {idx < STEPS.length - 1 && (
              <div className="flex-1 h-0.5 bg-brand-line">
                <div
                  className="h-full bg-brand-deep transition-all"
                  style={{ width: idx < step ? "100%" : "0%" }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={submit} className="card space-y-5" noValidate>
        <input
          type="text"
          name="company"
          value={form.honeypot}
          onChange={(e) => u("honeypot", e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden
        />

        {step === 0 && (
          <>
            <div>
              <label htmlFor="r-name" className="label">Nome completo</label>
              <input
                id="r-name"
                className="input"
                value={form.name}
                onChange={(e) => u("name", e.target.value)}
                autoComplete="name"
                required
              />
              {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="r-cpf" className="label">CPF</label>
                <input
                  id="r-cpf"
                  className="input"
                  value={form.cpf}
                  onChange={(e) => u("cpf", formatCpf(e.target.value))}
                  inputMode="numeric"
                  required
                />
                {errors.cpf && <p className="text-red-600 text-xs mt-1">{errors.cpf}</p>}
              </div>
              <div>
                <label htmlFor="r-phone" className="label">Telefone</label>
                <input
                  id="r-phone"
                  className="input"
                  value={form.phone}
                  onChange={(e) => u("phone", formatPhone(e.target.value))}
                  inputMode="tel"
                  required
                />
                {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>
            <div>
              <label htmlFor="r-email" className="label">E-mail</label>
              <input
                id="r-email"
                type="email"
                className="input"
                value={form.email}
                onChange={(e) => u("email", e.target.value)}
                autoComplete="email"
                required
              />
              {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="r-whatsapp" className="label">WhatsApp (opcional, com DDD)</label>
              <input
                id="r-whatsapp"
                className="input"
                value={form.whatsapp}
                onChange={(e) => u("whatsapp", formatPhone(e.target.value))}
                placeholder="Se diferente do telefone"
                inputMode="tel"
              />
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="r-oab" className="label">Número da OAB</label>
                <input
                  id="r-oab"
                  className="input"
                  value={form.oab}
                  onChange={(e) => u("oab", e.target.value)}
                  placeholder="Ex.: 123.456"
                  required
                />
                {errors.oab && <p className="text-red-600 text-xs mt-1">{errors.oab}</p>}
              </div>
              <div>
                <label htmlFor="r-oabuf" className="label">Seccional</label>
                <select
                  id="r-oabuf"
                  className="input"
                  value={form.oabUf}
                  onChange={(e) => u("oabUf", e.target.value)}
                >
                  {STATES.map((s) => (
                    <option key={s.uf} value={s.uf}>{s.uf}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="r-address" className="label">Endereço profissional</label>
              <input
                id="r-address"
                className="input"
                value={form.address}
                onChange={(e) => u("address", e.target.value)}
                placeholder="Rua, número, sala, bairro"
                autoComplete="street-address"
              />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 relative">
                <label htmlFor="r-city" className="label">Cidade de atuação</label>
                <input
                  id="r-city"
                  className="input"
                  value={form.city}
                  onChange={(e) => u("city", e.target.value)}
                  autoComplete="address-level2"
                  required
                />
                {citySuggestions.length > 0 && form.city.length >= 2 && (
                  <ul className="absolute z-10 left-0 right-0 mt-1 bg-white rounded-xl shadow-cardHover border border-brand-line overflow-hidden">
                    {citySuggestions.map((c) => (
                      <li key={c.slug}>
                        <button
                          type="button"
                          onClick={() => u("city", c.name)}
                          className="w-full text-left px-3 py-2 hover:bg-brand-line/40 text-sm"
                        >
                          {c.name}, {c.uf}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {errors.city && <p className="text-red-600 text-xs mt-1">{errors.city}</p>}
              </div>
              <div>
                <label htmlFor="r-uf" className="label">UF</label>
                <select
                  id="r-uf"
                  className="input"
                  value={form.uf}
                  onChange={(e) => u("uf", e.target.value)}
                >
                  {STATES.map((s) => (
                    <option key={s.uf} value={s.uf}>{s.uf}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="r-cep" className="label">CEP (opcional)</label>
              <input
                id="r-cep"
                className="input"
                value={form.cep}
                onChange={(e) => u("cep", formatCep(e.target.value))}
                inputMode="numeric"
              />
            </div>
            <div>
              <span className="label">Áreas de atuação</span>
              <div className="flex flex-wrap gap-2">
                {SPECIALTIES.map((s) => (
                  <button
                    key={s.slug}
                    type="button"
                    onClick={() => toggleSpec(s.slug)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                      form.specialties.includes(s.slug)
                        ? "bg-brand-deep text-white border-brand-deep"
                        : "bg-white text-brand-ink border-brand-line hover:border-brand-deep"
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
              {errors.specialties && (
                <p className="text-red-600 text-xs mt-2">{errors.specialties}</p>
              )}
            </div>
            <div>
              <label htmlFor="r-bio" className="label">Bio curta (opcional, até 500 caracteres)</label>
              <textarea
                id="r-bio"
                className="input min-h-24 resize-y"
                value={form.bio}
                onChange={(e) => u("bio", e.target.value.slice(0, 500))}
                placeholder="Atuação, formação, diferencial..."
              />
              <p className="text-xs text-brand-ink/50 mt-1">{form.bio.length}/500</p>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="relative">
                <label htmlFor="r-pass" className="label">Senha</label>
                <input
                  id="r-pass"
                  type={showPass ? "text" : "password"}
                  className="input pr-10"
                  value={form.password}
                  onChange={(e) => u("password", e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-9 text-brand-ink/40"
                  aria-label={showPass ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
              </div>
              <div>
                <label htmlFor="r-pass2" className="label">Confirmar senha</label>
                <input
                  id="r-pass2"
                  type="password"
                  className="input"
                  value={form.confirmPassword}
                  onChange={(e) => u("confirmPassword", e.target.value)}
                  autoComplete="new-password"
                  required
                />
                {errors.confirmPassword && (
                  <p className="text-red-600 text-xs mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>
            <p className="text-xs text-brand-ink/60">
              Mínimo 8 caracteres, com letras e números. A senha será armazenada de forma segura
              (hash) no banco de dados de produção.
            </p>
            <div className="space-y-2 pt-2 border-t border-brand-line">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.acceptTerms}
                  onChange={(e) => u("acceptTerms", e.target.checked)}
                  className="mt-1"
                />
                <span className="text-sm text-brand-ink/80">
                  Li e aceito os{" "}
                  <Link href="/termos" className="text-brand-deep underline">
                    Termos de uso
                  </Link>{" "}
                  e a{" "}
                  <Link href="/privacidade" className="text-brand-deep underline">
                    Política de privacidade
                  </Link>
                  .
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="text-red-600 text-xs ml-6">{errors.acceptTerms}</p>
              )}
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.acceptLgpd}
                  onChange={(e) => u("acceptLgpd", e.target.checked)}
                  className="mt-1"
                />
                <span className="text-sm text-brand-ink/80">
                  Consinto com o tratamento dos meus dados pessoais conforme a LGPD (Lei
                  13.709/2018) para as finalidades descritas na Política de privacidade.
                </span>
              </label>
              {errors.acceptLgpd && (
                <p className="text-red-600 text-xs ml-6">{errors.acceptLgpd}</p>
              )}
            </div>
          </>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="btn-ghost border border-brand-line"
            >
              ← Voltar
            </button>
          ) : (
            <span />
          )}
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={next} className="btn-primary">
              Continuar →
            </button>
          ) : (
            <button type="submit" className="btn-accent">
              Criar meu perfil
            </button>
          )}
        </div>
        <p className="text-center text-sm text-brand-ink/60">
          Já tem conta?{" "}
          <Link href="/login" className="text-brand-deep font-medium">
            Faça login
          </Link>
        </p>
      </form>
    </div>
  );
}
