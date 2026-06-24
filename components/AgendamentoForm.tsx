"use client";

import { useState } from "react";
import { CalendarCheck, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

/**
 * Formulário público de pedido de agendamento. Envia para /api/agendamento,
 * que grava no Supabase (o advogado/admin vê em /admin/agenda). Sem login.
 */

const AREAS = [
  "Trabalhista", "Família", "Consumidor", "Previdenciário (INSS)",
  "Cível / contratos", "Criminal", "Imobiliário", "Empresarial",
  "Trânsito", "Outro / não sei"
];

const INP =
  "w-full rounded-lg border-2 border-brand-line bg-white px-3 py-2 text-sm text-brand-ink focus:border-brand-accent focus:outline-none";

export function AgendamentoForm() {
  const [form, setForm] = useState({
    nome: "", contato: "", area: "", assunto: "", data_preferida: "", periodo: "", mensagem: "", website: ""
  });
  const [enviando, setEnviando] = useState(false);
  const [okMsg, setOkMsg] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const enviar = async () => {
    if (enviando) return;
    setErro(null);
    if (form.nome.trim().length < 2 || form.contato.trim().length < 5) {
      setErro("Preencha pelo menos o nome e um contato (WhatsApp ou e-mail).");
      return;
    }
    setEnviando(true);
    try {
      const res = await fetch("/api/agendamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const json = await res.json();
      if (json.ok) setOkMsg(true);
      else setErro(json.mensagem || "Não foi possível enviar.");
    } catch {
      setErro("Falha de conexão. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  };

  if (okMsg) {
    return (
      <section className="card mb-6 border-2 border-emerald-300 bg-emerald-50">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-7 h-7 text-emerald-600 flex-shrink-0 mt-0.5" aria-hidden />
          <div>
            <h2 className="font-display text-xl font-bold text-emerald-900">
              Pedido enviado!
            </h2>
            <p className="text-sm text-emerald-950 mt-1 leading-relaxed">
              Seu pedido de agendamento foi registrado. O retorno é feito pelo
              contato que você informou. Enquanto isso, você pode usar as
              ferramentas gratuitas do AdvAqui ou encontrar um advogado na sua
              cidade.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="card mb-6 border-2 border-brand-accent/40" aria-label="Pedido de agendamento">
      <h2 className="font-display text-xl font-bold text-brand-ink mb-1 inline-flex items-center gap-2">
        <CalendarCheck className="w-5 h-5 text-brand-deep" aria-hidden />
        Pedir um horário
      </h2>
      <p className="text-sm text-brand-ink/65 mb-4">
        Conte o que precisa e quando prefere. O contato é feito pelo WhatsApp ou
        e-mail que você informar.
      </p>

      {/* Honeypot — escondido de humanos */}
      <input
        type="text"
        name="website"
        value={form.website}
        onChange={(e) => set("website", e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-brand-ink mb-1">Seu nome *</label>
          <input className={INP} value={form.nome} onChange={(e) => set("nome", e.target.value)} placeholder="Nome completo" />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-ink mb-1">WhatsApp ou e-mail *</label>
          <input className={INP} value={form.contato} onChange={(e) => set("contato", e.target.value)} placeholder="(00) 90000-0000 ou voce@email.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-ink mb-1">Área do assunto</label>
          <select className={INP} value={form.area} onChange={(e) => set("area", e.target.value)}>
            <option value="">Selecione (opcional)</option>
            {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-ink mb-1">Assunto resumido</label>
          <input className={INP} value={form.assunto} onChange={(e) => set("assunto", e.target.value)} placeholder="Ex.: rescisão, divórcio, cobrança..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-ink mb-1">Data preferida</label>
          <input className={INP} type="date" value={form.data_preferida} onChange={(e) => set("data_preferida", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-brand-ink mb-1">Período</label>
          <select className={INP} value={form.periodo} onChange={(e) => set("periodo", e.target.value)}>
            <option value="">Indiferente</option>
            <option value="manha">Manhã</option>
            <option value="tarde">Tarde</option>
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-brand-ink mb-1">Mensagem (opcional)</label>
        <textarea
          className={`${INP} min-h-[90px]`}
          value={form.mensagem}
          onChange={(e) => set("mensagem", e.target.value)}
          placeholder="Conte em poucas linhas o que está acontecendo."
        />
      </div>

      {erro && (
        <div className="mt-4 rounded-xl border-l-4 border-amber-400 bg-amber-50 p-3 text-sm text-amber-900 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden />
          <span>{erro}</span>
        </div>
      )}

      <button
        onClick={enviar}
        disabled={enviando}
        className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-deep px-6 py-3 text-sm font-bold text-white hover:bg-brand-ink transition disabled:opacity-40"
      >
        {enviando ? (
          <><Loader2 className="w-4 h-4 animate-spin" aria-hidden /> Enviando...</>
        ) : (
          <><CalendarCheck className="w-4 h-4" aria-hidden /> Enviar pedido de horário</>
        )}
      </button>

      <p className="mt-3 text-xs text-brand-ink/50 leading-relaxed">
        Ao enviar, você concorda que seus dados de contato sejam usados para
        retornar sobre este pedido. Não compartilhamos com terceiros.
      </p>
    </section>
  );
}
