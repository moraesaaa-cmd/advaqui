"use client";

import { useCallback, useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import { trackEvent } from "@/lib/analytics/track-event";

type Comentario = { id: string; nome: string; texto: string; createdAt: string };

/**
 * Espaço de comentários das páginas de decisão (aba Notícias).
 *
 * Client component de propósito: a página da decisão é ISR — buscando os
 * aprovados via API, o comentário novo aparece sem esperar o cache da página.
 * Envio cai em moderação (nada publica sozinho).
 */
export function ComentariosDecisao({
  tribunal,
  slug
}: {
  tribunal: string;
  slug: string;
}) {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [nome, setNome] = useState("");
  const [texto, setTexto] = useState("");
  const [hp, setHp] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState<{ tipo: "ok" | "erro"; msg: string } | null>(null);

  const carregar = useCallback(async () => {
    try {
      const r = await fetch(
        `/api/jurisprudencia/comentarios?tribunal=${encodeURIComponent(tribunal)}&slug=${encodeURIComponent(slug)}`,
        { cache: "no-store" }
      );
      const j = await r.json();
      if (j.ok) setComentarios(j.comentarios || []);
    } catch {
      // sem rede: seção fica vazia, página segue funcionando
    } finally {
      setCarregando(false);
    }
  }, [tribunal, slug]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (enviando) return;
    setAviso(null);
    setEnviando(true);
    try {
      const r = await fetch("/api/jurisprudencia/comentarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tribunal, slug, nome, texto, hp })
      });
      const j = await r.json();
      if (j.ok) {
        setAviso({
          tipo: "ok",
          msg: "Comentário enviado! Ele aparece aqui assim que for aprovado pela moderação."
        });
        setTexto("");
        trackEvent("comentario-decisao");
      } else {
        setAviso({ tipo: "erro", msg: j.error || "Não foi possível enviar. Tente de novo." });
      }
    } catch {
      setAviso({ tipo: "erro", msg: "Falha de conexão. Tente de novo." });
    } finally {
      setEnviando(false);
    }
  };

  const fmtData = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
    } catch {
      return "";
    }
  };

  return (
    <section id="comentarios" className="card mt-8 scroll-mt-24">
      <h2 className="font-display text-xl font-bold text-brand-ink mb-1 inline-flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-brand-deep" aria-hidden />
        Comentários
        {comentarios.length > 0 && (
          <span className="text-sm font-normal text-brand-ink/50">({comentarios.length})</span>
        )}
      </h2>
      <p className="text-sm text-brand-ink/60 mb-5">
        Espaço aberto para observações sobre esta decisão. Comentários passam por
        moderação e não substituem orientação jurídica.
      </p>

      {carregando ? (
        <p className="text-sm text-brand-ink/50 italic">Carregando comentários…</p>
      ) : comentarios.length === 0 ? (
        <p className="text-sm text-brand-ink/55 mb-5">
          Ainda não há comentários. Seja a primeira pessoa a comentar esta decisão.
        </p>
      ) : (
        <ul className="space-y-4 mb-6">
          {comentarios.map((c) => (
            <li key={c.id} className="rounded-xl border border-brand-line bg-white p-4">
              <div className="flex items-baseline justify-between gap-3 mb-1.5">
                <span className="font-semibold text-sm text-brand-ink">{c.nome}</span>
                <span className="text-xs text-brand-ink/45">{fmtData(c.createdAt)}</span>
              </div>
              <p className="text-sm leading-relaxed text-brand-ink/85 whitespace-pre-line">
                {c.texto}
              </p>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={enviar} className="space-y-3">
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="coment-nome">Seu nome</label>
            <input
              id="coment-nome"
              className="input"
              value={nome}
              maxLength={60}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Como quer aparecer"
              required
            />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="coment-texto">Comentário</label>
          <textarea
            id="coment-texto"
            className="input min-h-[110px]"
            value={texto}
            maxLength={800}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="O que esta decisão muda na prática? Sem links."
            required
          />
          <p className="text-xs text-brand-ink/45 mt-1">{texto.length}/800 · sem links</p>
        </div>
        {/* honeypot invisível para robôs de spam */}
        <input
          type="text"
          value={hp}
          onChange={(e) => setHp(e.target.value)}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
        {aviso && (
          <p
            className={`text-sm rounded-lg px-3 py-2 border ${
              aviso.tipo === "ok"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            {aviso.msg}
          </p>
        )}
        <button type="submit" disabled={enviando} className="btn-primary text-sm disabled:opacity-50">
          {enviando ? "Enviando…" : "Enviar comentário"}
        </button>
      </form>
    </section>
  );
}
