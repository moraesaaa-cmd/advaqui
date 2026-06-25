"use client";

/**
 * Painel do cliente do recurso de multa (/recurso/painel).
 *
 * O cliente entra pelo token (link salvo após o cadastro, em ?t= ou no
 * localStorage). Aqui ele:
 *   - vê o status do acesso e quantos recursos restam (de 3);
 *   - preenche os dados da multa e GERA o recurso por IA na hora;
 *   - revê e baixa/imprime as peças que já gerou (histórico).
 *
 * Backend: GET /api/recurso-acesso?token= (status), POST /api/recurso-ia
 * modo:"completo" (gera + decrementa + salva), GET /api/recurso-pecas?token=.
 * Tudo gated por cliente ATIVO — a liberação é feita pelo admin após o Pix.
 */

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { INFRACOES, FASES } from "@/lib/data/multas";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";

const ACCENT = "#F4631A";
const DARK = "#15171C";
const TOKEN_KEY = "recurso_token";
const SANS = "var(--rm-body), system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
const DISPLAY = "var(--rm-display), system-ui, -apple-system, Segoe UI, Roboto, sans-serif";

type Status = "aguardando" | "ativo" | "expirado" | "cancelado";
type Acesso = {
  status: Status;
  recursos_restantes: number;
  nome: string | null;
};
type Peca = {
  id: string;
  fase: string | null;
  infracao: string | null;
  texto: string;
  created_at: string;
};

const faseLabel = (v: string | null) => FASES.find((f) => f.value === v)?.label ?? v ?? "Recurso";
const infracaoLabel = (v: string | null) =>
  INFRACOES.find((i) => i.slug === v)?.label ?? v ?? "Infração";

export function RecursoPainelView() {
  const [token, setToken] = useState("");
  const [estado, setEstado] = useState<"carregando" | "sem_token" | "ok" | "erro">("carregando");
  const [acesso, setAcesso] = useState<Acesso | null>(null);
  const [pecas, setPecas] = useState<Peca[]>([]);
  const [erro, setErro] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [isPremium, setIsPremium] = useState(false);

  // formulário de geração
  const [fase, setFase] = useState(FASES[0]?.value ?? "defesa-previa");
  const [infracao, setInfracao] = useState(INFRACOES[0]?.slug ?? "outra");
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [placa, setPlaca] = useState("");
  const [ait, setAit] = useState("");
  const [orgao, setOrgao] = useState("");
  const [data, setData] = useState("");
  const [cidade, setCidade] = useState("");
  const [relato, setRelato] = useState("");
  const [gerando, setGerando] = useState(false);
  const [gerErro, setGerErro] = useState("");
  const [novaPeca, setNovaPeca] = useState<string>("");
  const novaRef = useRef<HTMLDivElement | null>(null);

  const carregar = useCallback(async (tk: string) => {
    setEstado("carregando");
    setErro("");
    try {
      const [accRes, pecRes] = await Promise.all([
        fetch(`/api/recurso-acesso?token=${encodeURIComponent(tk)}`),
        fetch(`/api/recurso-pecas?token=${encodeURIComponent(tk)}`)
      ]);
      const acc = await accRes.json();
      if (!acc.ok) {
        setErro("Não encontramos o seu acesso. Confira o link recebido após o pagamento.");
        setEstado("erro");
        return;
      }
      setAcesso({
        status: acc.status as Status,
        recursos_restantes: acc.recursos_restantes ?? 0,
        nome: acc.nome ?? null
      });
      if (acc.nome && !nome) setNome(acc.nome);
      const pec = await pecRes.json().catch(() => ({ ok: false }));
      if (pec.ok && Array.isArray(pec.pecas)) setPecas(pec.pecas as Peca[]);
      setEstado("ok");
    } catch {
      setErro("Não foi possível carregar agora. Tente novamente.");
      setEstado("erro");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lê o token de ?t= ou do localStorage (sem useSearchParams p/ evitar Suspense).
  // Advogados premium AdvAqui entram sem token.
  useEffect(() => {
    let tk = "";
    try {
      tk = new URLSearchParams(window.location.search).get("t") || "";
      if (!tk) tk = window.localStorage.getItem(TOKEN_KEY) || "";
      else window.localStorage.setItem(TOKEN_KEY, tk);
    } catch {
      /* ambiente sem window/localStorage */
    }

    // Verifica se é advogado premium AdvAqui.
    (async () => {
      try {
        const supabase = createSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from("lawyers")
            .select("plan_status,name")
            .eq("id", user.id)
            .maybeSingle();
          if (data?.plan_status === "active") {
            setIsPremium(true);
            setAcesso({ status: "ativo", recursos_restantes: 999, nome: data.name ?? null });
            setEstado("ok");
            return;
          }
        }
      } catch {
        // Sem sessão — segue fluxo normal.
      }

      if (!tk) {
        setEstado("sem_token");
        return;
      }
      setToken(tk);
      void carregar(tk);
    })();
  }, [carregar]);

  const entrarComToken = useCallback(() => {
    const tk = tokenInput.trim();
    if (tk.length < 6) {
      setErro("Cole o código de acesso completo.");
      return;
    }
    try {
      window.localStorage.setItem(TOKEN_KEY, tk);
    } catch {
      /* ignore */
    }
    setToken(tk);
    void carregar(tk);
  }, [tokenInput, carregar]);

  const gerar = useCallback(async () => {
    if ((!token && !isPremium) || gerando) return;
    setGerando(true);
    setGerErro("");
    setNovaPeca("");
    try {
      const payload: Record<string, unknown> = {
        modo: "completo",
        fase,
        infracao,
        nome,
        cpf,
        placa,
        ait,
        orgao,
        data,
        cidade,
        relato
      };
      if (token && !isPremium) payload.token = token;
      const res = await fetch("/api/recurso-ia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.ok && json.texto) {
        setNovaPeca(json.texto);
        setAcesso((a) =>
          a ? { ...a, recursos_restantes: json.recursos_restantes ?? a.recursos_restantes } : a
        );
        void carregar(token);
        window.setTimeout(() => novaRef.current?.scrollIntoView({ behavior: "smooth" }), 120);
      } else {
        setGerErro(json.mensagem || "Não foi possível gerar agora. Tente novamente.");
        if (json.motivo === "aguardando" || json.motivo === "esgotado") void carregar(token);
      }
    } catch {
      setGerErro("Falha de conexão. Tente novamente.");
    } finally {
      setGerando(false);
    }
  }, [token, isPremium, gerando, fase, infracao, nome, cpf, placa, ait, orgao, data, cidade, relato, carregar]);

  const copiar = useCallback((texto: string) => {
    if (navigator.clipboard) navigator.clipboard.writeText(texto).catch(() => undefined);
  }, []);

  const restantes = acesso?.recursos_restantes ?? 0;
  const podeGerar = acesso?.status === "ativo" && (isPremium || restantes > 0);

  // Documento HTML formatado da peça (margens ABNT, títulos centralizados,
  // parágrafos justificados). Reaproveitado por imprimir (PDF) e baixar Word.
  const corpoHtml = useCallback((texto: string) => {
    const esc = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return texto
      .split(/\n/)
      .map((linha) => {
        const t = linha.trim();
        if (!t) return "";
        const ehTitulo =
          t.length <= 80 && t === t.toUpperCase() && /[A-ZÀ-Ú]/.test(t);
        if (ehTitulo) {
          return `<p style="text-align:center;font-weight:bold;margin:20px 0 10px;">${esc(t)}</p>`;
        }
        return `<p style="text-align:justify;text-indent:2.5em;margin:0 0 10px;line-height:1.6;">${esc(t)}</p>`;
      })
      .join("");
  }, []);

  const docHtml = useCallback(
    (texto: string) =>
      `<!doctype html><html><head><meta charset="utf-8"><title>Recurso de Multa — AdvAqui</title>` +
      `<style>@page{margin:2.5cm 2cm;}body{font-family:'Times New Roman',Georgia,serif;font-size:12pt;color:#16181D;max-width:760px;margin:0 auto;padding:24px;}</style>` +
      `</head><body>${corpoHtml(texto)}</body></html>`,
    [corpoHtml]
  );

  const imprimir = useCallback(
    (texto: string) => {
      const w = window.open("", "_blank", "width=820,height=1000");
      if (!w) return;
      w.document.write(docHtml(texto));
      w.document.close();
      w.focus();
      w.setTimeout(() => w.print(), 300);
    },
    [docHtml]
  );

  const baixarWord = useCallback(
    (texto: string) => {
      const html =
        `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"></head><body>` +
        corpoHtml(texto) +
        `</body></html>`;
      const blob = new Blob(["﻿", html], { type: "application/msword" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "recurso-de-multa.doc";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    },
    [corpoHtml]
  );

  const wrap: CSSProperties = { maxWidth: 760, margin: "0 auto", padding: "0 20px" };
  const input: CSSProperties = {
    width: "100%",
    padding: "12px 13px",
    border: "1px solid #D5D8DF",
    borderRadius: 9,
    fontSize: 15,
    background: "#F7F8FA",
    color: "#16181D",
    fontFamily: SANS
  };
  const label: CSSProperties = {
    display: "block",
    fontSize: 12.5,
    fontWeight: 500,
    color: "#44474F",
    marginBottom: 6
  };
  const cta: CSSProperties = {
    background: ACCENT,
    color: "#fff",
    border: "none",
    padding: 15,
    borderRadius: 11,
    fontSize: 15.5,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: SANS
  };

  return (
    <div style={{ background: "#F4F5F7", color: "#16181D", minHeight: "100vh", fontFamily: SANS }}>
      {/* Topo */}
      <header style={{ background: "rgba(21,23,28,0.97)" }}>
        <div
          style={{
            ...wrap,
            maxWidth: 1100,
            display: "flex",
            alignItems: "center",
            gap: 11,
            paddingTop: 14,
            paddingBottom: 14
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              background: ACCENT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: "0 0 auto"
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
            <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 17, color: "#F4F5F7" }}>
              Meu painel de recursos
            </span>
            <span style={{ fontSize: 11, color: "#8A8F99", fontWeight: 500, marginTop: 4 }}>
              Recurso de Multa · por AdvAqui
            </span>
          </div>
        </div>
      </header>

      <main style={{ ...wrap, paddingTop: 36, paddingBottom: 70 }}>
        {estado === "carregando" && (
          <p style={{ textAlign: "center", color: "#5A5F6A", padding: "60px 0" }}>Carregando…</p>
        )}

        {estado === "sem_token" && (
          <div style={{ background: "#fff", border: "1px solid #E6E7EB", borderRadius: 16, padding: 28, maxWidth: 480, margin: "30px auto" }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 22, margin: "0 0 8px" }}>
              Entrar no meu painel
            </h1>
            <p style={{ fontSize: 14, color: "#5A5F6A", margin: "0 0 18px", lineHeight: 1.6 }}>
              Cole o código de acesso que você recebeu após o pagamento. Ele também fica salvo no
              link que abriu este painel.
            </p>
            <label style={label}>Código de acesso</label>
            <input
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="Cole aqui o seu código"
              style={input}
            />
            {erro && <p style={{ color: "#B42318", fontSize: 13, marginTop: 10 }}>{erro}</p>}
            <button type="button" onClick={entrarComToken} style={{ ...cta, width: "100%", marginTop: 16 }}>
              Entrar
            </button>
            <p style={{ fontSize: 12.5, color: "#9AA0AA", marginTop: 16, textAlign: "center" }}>
              Ainda não pediu um recurso?{" "}
              <a href="/multas" style={{ color: ACCENT, fontWeight: 600 }}>Analisar minha multa</a>
            </p>
          </div>
        )}

        {estado === "erro" && (
          <div style={{ background: "#fff", border: "1px solid #E6E7EB", borderRadius: 16, padding: 28, maxWidth: 480, margin: "30px auto", textAlign: "center" }}>
            <p style={{ color: "#B42318", fontSize: 14.5, margin: "0 0 16px" }}>{erro}</p>
            <a href="/multas" style={{ ...cta, display: "inline-block", textDecoration: "none" }}>
              Voltar para o início
            </a>
          </div>
        )}

        {estado === "ok" && acesso && (
          <>
            {/* Cartão de status */}
            <div style={{ background: "#fff", border: "1px solid #E6E7EB", borderRadius: 16, padding: 24, marginBottom: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <div>
                  <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 22, margin: "0 0 4px" }}>
                    Olá{acesso.nome ? `, ${acesso.nome.split(" ")[0]}` : ""}!
                  </h1>
                  <p style={{ fontSize: 13.5, color: "#5A5F6A", margin: 0 }}>
                    {acesso.status === "ativo"
                      ? "Seu acesso está liberado."
                      : acesso.status === "aguardando"
                      ? "Estamos confirmando o seu pagamento."
                      : "Seu acesso não está ativo."}
                  </p>
                </div>
                <div
                  style={{
                    textAlign: "center",
                    background: isPremium ? "linear-gradient(135deg, #FFF8E6, #FFF1EA)" : podeGerar ? "#FFF1EA" : "#F2F3F5",
                    border: `1px solid ${isPremium ? "rgba(200,162,74,0.4)" : podeGerar ? "rgba(244,99,26,0.3)" : "#E6E7EB"}`,
                    borderRadius: 12,
                    padding: "10px 18px"
                  }}
                >
                  {isPremium ? (
                    <>
                      <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 18, color: "#B8860B" }}>
                        ★ Premium
                      </div>
                      <div style={{ fontSize: 11, color: "#5A5F6A" }}>ilimitado</div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 26, color: podeGerar ? ACCENT : "#8A8F99" }}>
                        {restantes}
                      </div>
                      <div style={{ fontSize: 11, color: "#5A5F6A" }}>de 3 recursos</div>
                    </>
                  )}
                </div>
              </div>

              {acesso.status === "aguardando" && (
                <div style={{ marginTop: 16, fontSize: 13.5, color: "#8A6D00", background: "#FFF8E6", border: "1px solid #F4E2A8", borderRadius: 10, padding: "12px 15px" }}>
                  Assim que o pagamento for confirmado, o seu painel é liberado para gerar os
                  recursos. Já pagou?{" "}
                  <button
                    type="button"
                    onClick={() => token && carregar(token)}
                    style={{ background: "none", border: "none", color: ACCENT, fontWeight: 700, cursor: "pointer", padding: 0, fontFamily: SANS }}
                  >
                    Atualizar status
                  </button>
                </div>
              )}
              {acesso.status === "ativo" && restantes === 0 && (
                <div style={{ marginTop: 16, background: "#F7F8FA", border: "1px solid #E6E7EB", borderRadius: 10, padding: "14px 16px" }}>
                  <p style={{ fontSize: 13.5, color: "#5A5F6A", margin: "0 0 12px" }}>
                    Você já usou os 3 recursos do seu plano. As peças geradas continuam disponíveis
                    abaixo para baixar quando quiser. Precisa de mais?
                  </p>
                  <a
                    href="/multas#planos"
                    style={{ ...cta, display: "inline-block", textDecoration: "none", padding: "12px 22px", fontSize: 14.5 }}
                  >
                    Comprar mais recursos
                  </a>
                </div>
              )}
            </div>

            {/* Formulário de geração */}
            {podeGerar && (
              <div style={{ background: "#fff", border: "1px solid #E6E7EB", borderRadius: 16, padding: "clamp(20px,4vw,30px)", marginBottom: 22 }}>
                <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 19, margin: "0 0 4px" }}>
                  Gerar um novo recurso
                </h2>
                <p style={{ fontSize: 13.5, color: "#5A5F6A", margin: "0 0 20px" }}>
                  Preencha os dados da multa. A IA gera a peça com a tese e a fundamentação corretas.
                </p>

                <div style={{ marginBottom: 16 }}>
                  <label style={label}>Fase do recurso</label>
                  <select value={fase} onChange={(e) => setFase(e.target.value)} style={{ ...input, cursor: "pointer" }}>
                    {FASES.map((f) => (
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </select>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={label}>Tipo de infração</label>
                  <select value={infracao} onChange={(e) => setInfracao(e.target.value)} style={{ ...input, cursor: "pointer" }}>
                    {INFRACOES.map((i) => (
                      <option key={i.slug} value={i.slug}>{i.label}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 }}>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={label}>Nome completo</label>
                    <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Maria da Silva" style={input} />
                  </div>
                  <div><label style={label}>CPF</label><input value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="000.000.000-00" style={input} /></div>
                  <div><label style={label}>Placa</label><input value={placa} onChange={(e) => setPlaca(e.target.value)} placeholder="ABC1D23" style={input} /></div>
                  <div><label style={label}>Nº do Auto (AIT)</label><input value={ait} onChange={(e) => setAit(e.target.value)} placeholder="A0000000000" style={input} /></div>
                  <div><label style={label}>Órgão autuador</label><input value={orgao} onChange={(e) => setOrgao(e.target.value)} placeholder="DETRAN-SP / DER" style={input} /></div>
                  <div><label style={label}>Data da infração</label><input value={data} onChange={(e) => setData(e.target.value)} type="date" style={input} /></div>
                  <div><label style={label}>Cidade/UF</label><input value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="São Paulo/SP" style={input} /></div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={label}>Relato dos fatos <span style={{ color: "#9AA0AA" }}>(opcional)</span></label>
                    <textarea value={relato} onChange={(e) => setRelato(e.target.value)} rows={3} placeholder="O que aconteceu, na sua visão." style={{ ...input, resize: "vertical" }} />
                  </div>
                </div>

                <button type="button" onClick={gerar} disabled={gerando} style={{ ...cta, width: "100%", marginTop: 22, opacity: gerando ? 0.7 : 1, cursor: gerando ? "default" : "pointer" }}>
                  {gerando ? "Gerando o seu recurso…" : isPremium ? "Gerar recurso com IA — Premium" : `Gerar recurso com IA (resta${restantes === 1 ? "" : "m"} ${restantes})`}
                </button>
                {gerErro && <p style={{ color: "#B42318", fontSize: 13, marginTop: 12, textAlign: "center" }}>{gerErro}</p>}
                <p style={{ fontSize: 11.5, color: "#9AA0AA", marginTop: 12, textAlign: "center", lineHeight: 1.5 }}>
                  Revise o texto antes de protocolar. A decisão final é do órgão de trânsito.
                </p>
              </div>
            )}

            {/* Peça recém-gerada em destaque */}
            {novaPeca && (
              <div ref={novaRef} style={{ background: "#fff", border: `2px solid ${ACCENT}`, borderRadius: 16, padding: "clamp(20px,4vw,28px)", marginBottom: 22 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
                  <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 16, color: "#1E8E54" }}>✓ Recurso gerado</span>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button type="button" onClick={() => copiar(novaPeca)} style={{ background: DARK, color: "#fff", border: "none", padding: "9px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: SANS }}>Copiar</button>
                    <button type="button" onClick={() => baixarWord(novaPeca)} style={{ background: "#1E5BB8", color: "#fff", border: "none", padding: "9px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: SANS }}>Baixar Word</button>
                    <button type="button" onClick={() => imprimir(novaPeca)} style={{ ...cta, padding: "9px 16px", fontSize: 13 }}>Baixar PDF</button>
                  </div>
                </div>
                <div style={{ whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.7, color: "#16181D", maxHeight: 420, overflow: "auto", background: "#F7F8FA", border: "1px solid #E6E7EB", borderRadius: 10, padding: "18px 20px" }}>
                  {novaPeca}
                </div>
              </div>
            )}

            {/* Histórico */}
            {pecas.length > 0 && (
              <div>
                <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 18, margin: "0 0 14px" }}>
                  Meus recursos ({pecas.length})
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {pecas.map((p) => (
                    <details key={p.id} style={{ background: "#fff", border: "1px solid #E6E7EB", borderRadius: 12, padding: "4px 18px" }}>
                      <summary style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "15px 0", cursor: "pointer", listStyle: "none" }}>
                        <span style={{ fontWeight: 600, fontSize: 14.5, color: "#16181D" }}>
                          {infracaoLabel(p.infracao)} · {faseLabel(p.fase)}
                        </span>
                        <span style={{ fontSize: 12, color: "#8A8F99", whiteSpace: "nowrap" }}>
                          {new Date(p.created_at).toLocaleDateString("pt-BR")}
                        </span>
                      </summary>
                      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                        <button type="button" onClick={() => copiar(p.texto)} style={{ background: DARK, color: "#fff", border: "none", padding: "8px 14px", borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: SANS }}>Copiar</button>
                        <button type="button" onClick={() => baixarWord(p.texto)} style={{ background: "#1E5BB8", color: "#fff", border: "none", padding: "8px 14px", borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: SANS }}>Word</button>
                        <button type="button" onClick={() => imprimir(p.texto)} style={{ ...cta, padding: "8px 14px", fontSize: 12.5 }}>PDF</button>
                      </div>
                      <div style={{ whiteSpace: "pre-wrap", fontSize: 13.5, lineHeight: 1.7, color: "#2A2E36", maxHeight: 360, overflow: "auto", background: "#F7F8FA", border: "1px solid #E6E7EB", borderRadius: 10, padding: "16px 18px", marginBottom: 14 }}>
                        {p.texto}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {pecas.length === 0 && acesso.status === "ativo" && !novaPeca && (
              <p style={{ textAlign: "center", color: "#9AA0AA", fontSize: 13.5, marginTop: 8 }}>
                Você ainda não gerou nenhum recurso. Preencha os dados acima para começar.
              </p>
            )}
          </>
        )}
      </main>
    </div>
  );
}
