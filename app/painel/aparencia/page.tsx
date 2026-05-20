"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AlertCircle, ArrowLeft, Eye, EyeOff, Palette, Save } from "lucide-react";
import { toast } from "@/components/Toast";
import type { Lawyer } from "@/lib/data/lawyer-mapper";

/**
 * /painel/aparencia — Controles de exibição da Página Profissional.
 *
 * Permite ao advogado escolher o que aparece e o que fica oculto na sua
 * página pública: endereço completo, e-mail, telefone, cidades adicionais,
 * documentos úteis, artigos, perguntas, FAQs.
 *
 * Defensive: se a migration 0006 não foi aplicada, o save retorna erro mas
 * o painel continua usando os defaults (tudo visível). Mensagem amigável.
 *
 * Maio/2026 — Fase 3 da Página Profissional.
 */

type Prefs = {
  showAddress: boolean;
  showAddressFull: boolean;
  showEmail: boolean;
  showPhone: boolean;
  showExtraCities: boolean;
  showUsefulDocs: boolean;
  showArticles: boolean;
  showQuestions: boolean;
  showFaqs: boolean;
  allowQuestions: boolean;
};

const DEFAULT_PREFS: Prefs = {
  showAddress: true,
  showAddressFull: true,
  showEmail: true,
  showPhone: true,
  showExtraCities: true,
  showUsefulDocs: true,
  showArticles: true,
  showQuestions: true,
  showFaqs: true,
  allowQuestions: true
};

const TOGGLES: Array<{
  key: keyof Prefs;
  label: string;
  description: string;
}> = [
  {
    key: "showAddress",
    label: "Exibir endereço",
    description: "Cidade base sempre aparece. Esse toggle controla a linha completa."
  },
  {
    key: "showAddressFull",
    label: "Exibir endereço completo",
    description:
      "Quando desativado, mostra apenas cidade e UF (oculta rua, número e bairro)."
  },
  {
    key: "showEmail",
    label: "Exibir e-mail",
    description: "Visitantes podem clicar pra abrir o app de e-mail."
  },
  {
    key: "showPhone",
    label: "Exibir telefone",
    description: "Visitantes podem clicar pra discar direto."
  },
  {
    key: "showExtraCities",
    label: "Exibir cidades adicionais",
    description: "Lista de cidades onde você também atende."
  },
  {
    key: "showUsefulDocs",
    label: "Exibir documentos úteis",
    description: "Lista informativa de documentos típicos por área."
  },
  {
    key: "showArticles",
    label: "Exibir artigos próprios",
    description: "Mostra seus artigos publicados na Página Profissional."
  },
  {
    key: "showQuestions",
    label: "Exibir perguntas respondidas",
    description: "Mostra perguntas de leitores que você já respondeu."
  },
  {
    key: "allowQuestions",
    label: "Aceitar novas perguntas",
    description:
      "Quando desativado, visitantes não veem o formulário de pergunta. Você ainda pode responder as antigas."
  },
  {
    key: "showFaqs",
    label: "Exibir perguntas frequentes",
    description: "Bloco padrão com 5 dúvidas comuns sobre o primeiro contato."
  }
];

export default function PainelAparenciaPage() {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/painel/profile", { cache: "no-store" });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        lawyer?: Lawyer;
      };
      if (data.lawyer) {
        const l = data.lawyer;
        setPrefs({
          showAddress: l.showAddress ?? true,
          showAddressFull: l.showAddressFull ?? true,
          showEmail: l.showEmail ?? true,
          showPhone: l.showPhone ?? true,
          showExtraCities: l.showExtraCities ?? true,
          showUsefulDocs: l.showUsefulDocs ?? true,
          showArticles: l.showArticles ?? true,
          showQuestions: l.showQuestions ?? true,
          showFaqs: l.showFaqs ?? true,
          allowQuestions: l.allowQuestions ?? true
        });
      }
    } catch (err) {
      console.error("[painel/aparencia] load failed", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/painel/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.ok === false) {
        toast(data.error || "Não foi possível salvar.", "error");
      } else {
        toast("Preferências de aparência salvas.");
      }
    } catch (err) {
      console.error("[painel/aparencia] save failed", err);
      toast("Erro de conexão.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container-tight py-10 max-w-2xl">
      <div className="mb-6">
        <Link
          href="/painel"
          className="inline-flex items-center gap-1 text-sm text-brand-deep hover:text-brand-accent2 mb-2"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden />
          Voltar ao painel
        </Link>
        <h1 className="font-display text-3xl font-bold text-brand-ink inline-flex items-center gap-2">
          <Palette className="w-7 h-7 text-brand-deep" aria-hidden />
          Aparência
        </h1>
        <p className="text-sm text-brand-ink/65 mt-1">
          Controle o que aparece na sua Página Profissional pública. As
          alterações são aplicadas em poucos segundos.
        </p>
      </div>

      {loading ? (
        <div className="card text-center py-10">
          <div
            aria-hidden
            className="mx-auto w-8 h-8 border-4 border-brand-line border-t-brand-deep rounded-full animate-spin"
          />
        </div>
      ) : (
        <>
          <div className="card divide-y divide-brand-line">
            {TOGGLES.map((t) => {
              const value = prefs[t.key];
              return (
                <label
                  key={t.key}
                  className="flex items-start justify-between gap-3 py-3 cursor-pointer"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-brand-ink">{t.label}</p>
                    <p className="text-xs text-brand-ink/65 mt-0.5 leading-relaxed">
                      {t.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPrefs({ ...prefs, [t.key]: !value })}
                    role="switch"
                    aria-checked={value}
                    className={`relative w-11 h-6 rounded-full transition flex-shrink-0 ${
                      value ? "bg-emerald-500" : "bg-brand-line"
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`absolute top-0.5 left-0.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-white shadow transition-transform ${
                        value ? "translate-x-5" : "translate-x-0"
                      }`}
                    >
                      {value ? (
                        <Eye className="w-3 h-3 text-emerald-600" aria-hidden />
                      ) : (
                        <EyeOff className="w-3 h-3 text-brand-ink/55" aria-hidden />
                      )}
                    </span>
                  </button>
                </label>
              );
            })}
          </div>

          <div className="flex justify-end mt-4">
            <button onClick={save} disabled={saving} className="btn-primary">
              <Save className="w-4 h-4" aria-hidden />
              {saving ? "Salvando..." : "Salvar preferências"}
            </button>
          </div>

          <p className="text-xs text-brand-ink/55 mt-4 flex items-start gap-2">
            <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" aria-hidden />
            Caso o salvamento falhe com mensagem &ldquo;migration pendente&rdquo;,
            avise o suporte — algumas opções dependem de uma atualização do banco
            que ainda não foi aplicada.
          </p>
        </>
      )}
    </div>
  );
}
