"use client";

/**
 * Landing standalone do recurso de multa (multas.advaqui.com), feita para
 * Google Ads. Reproduz fielmente o design escuro (laranja #F4631A, dark
 * #15171C, Bricolage Grotesque + Plus Jakarta Sans) com estilos inline —
 * NÃO usa as classes de marca do site.
 *
 * Máquina de estados do funil:
 *   form -> analyzing -> result -> unlock -> cadastro -> payment -> done
 *   (e, quando o acesso é liberado, geração da peça completa)
 *
 * Backend:
 *   POST /api/recurso-ia        modo:"analise"  -> texto da análise (grátis)
 *   POST /api/recurso-acesso    -> { token, pix, valor } (token no localStorage)
 *   GET  /api/recurso-acesso?token=  -> { status, recursos_restantes }
 *   POST /api/recurso-ia        modo:"completo" (com token) -> peça completa
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode
} from "react";
import QRCode from "qrcode";
import { INFRACOES, FASES } from "@/lib/data/multas";

const ACCENT = "#F4631A";
const DARK = "#15171C";
const TOKEN_KEY = "recurso_token";

// As fontes do design são carregadas via next/font em app/multas/page.tsx, que
// expõe estas variáveis CSS (auto-hospedadas, sem violar a CSP `style-src 'self'`).
const SANS = "var(--rm-body), system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
const DISPLAY = "var(--rm-display), system-ui, -apple-system, Segoe UI, Roboto, sans-serif";

type Step =
  | "form"
  | "analyzing"
  | "result"
  | "unlock"
  | "cadastro"
  | "payment"
  | "done";

type Acesso = "idle" | "checking" | "aguardando" | "ativo" | "erro";

type FormState = {
  fase: string;
  infracao: string;
  nome: string;
  cpf: string;
  placa: string;
  ait: string;
  orgao: string;
  data: string;
  cidade: string;
  relato: string;
};

const AZ_STEPS = [
  "Verificando o enquadramento legal da infração",
  "Conferindo prazos e a tempestividade (CTB)",
  "Cruzando súmulas do STJ aplicáveis",
  "Avaliando vícios no auto e na notificação"
];

const FASES_CARDS: { n: string; t: string; d: string }[] = [
  {
    n: "FASE 01",
    t: "Defesa Prévia",
    d: "Primeira chance, logo após a Notificação da Autuação e antes de a multa ser aplicada. É onde se aponta vício no auto ou na notificação."
  },
  {
    n: "FASE 02",
    t: "Recurso à JARI",
    d: "Recurso de 1ª instância, apresentado depois da Notificação da Penalidade, à Junta Administrativa de Recursos de Infrações."
  },
  {
    n: "FASE 03",
    t: "Recurso ao CETRAN",
    d: "2ª instância, cabível se a JARI negar. Vai ao Conselho Estadual de Trânsito."
  }
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "A análise é mesmo gratuita?",
    a: "Sim. Você descreve a multa e mostramos as teses cabíveis sem custo. Você só paga R$9,90 se quiser gerar o recurso completo, pronto para protocolar."
  },
  {
    q: "Como eu gero o meu recurso?",
    a: "Depois do pagamento via Pix e do cadastro, o seu painel é liberado. Lá você preenche os dados da multa e a inteligência artificial gera o recurso na hora, pronto para baixar, imprimir e protocolar."
  },
  {
    q: "O recurso garante o cancelamento da multa?",
    a: "Nenhum recurso pode garantir o resultado — a decisão é do órgão de trânsito. O que você gera é uma peça tecnicamente sólida, com os fundamentos certos para o seu caso."
  },
  {
    q: "O que está incluso no plano de R$9,90?",
    a: "Pagamento único, sem renovação automática, que libera o seu painel para gerar até 3 recursos completos com a IA, na hora, com a fundamentação do CTB, das súmulas do STJ e das Resoluções do CONTRAN."
  },
  {
    q: "Preciso de advogado para recorrer de multa?",
    a: "No recurso administrativo não é obrigatório — você mesmo pode protocolar. Em casos graves (suspensão do direito de dirigir, lei seca, cassação da CNH), vale procurar um advogado."
  }
];

const FASE_SUB: Record<string, string> = {
  "defesa-previa": "Após a Notificação da Autuação",
  jari: "Após a Notificação da Penalidade",
  cetran: "2ª instância, se a JARI negar"
};

export function RecursoMultaLanding(): ReactNode {
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState<FormState>({
    fase: FASES[0]?.value ?? "defesa-previa",
    infracao: INFRACOES[0]?.slug ?? "outra",
    nome: "",
    cpf: "",
    placa: "",
    ait: "",
    orgao: "",
    data: "",
    cidade: "",
    relato: ""
  });

  // análise
  const [az, setAz] = useState(0);
  const [analise, setAnalise] = useState("");
  const [analiseErro, setAnaliseErro] = useState("");

  // cadastro
  const [cadNome, setCadNome] = useState("");
  const [cadEmail, setCadEmail] = useState("");
  const [cadTel, setCadTel] = useState("");
  const [saving, setSaving] = useState(false);
  const [cadErro, setCadErro] = useState("");

  // pagamento
  const [pixPayload, setPixPayload] = useState("");
  const [pixValor, setPixValor] = useState("R$ 9,90");
  const [qrUrl, setQrUrl] = useState("");
  const [pixCopied, setPixCopied] = useState(false);
  const [token, setToken] = useState("");

  // acesso / peça completa
  const [acesso, setAcesso] = useState<Acesso>("idle");
  const [acessoMsg, setAcessoMsg] = useState("");
  const [peca, setPeca] = useState("");
  const [gerando, setGerando] = useState(false);
  const [pecaErro, setPecaErro] = useState("");

  const azTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const pixCopyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Recupera token salvo de uma visita anterior (acesso pendente/ativo).
  useEffect(() => {
    try {
      const t = window.localStorage.getItem(TOKEN_KEY);
      if (t) setToken(t);
    } catch {
      /* localStorage indisponível */
    }
  }, []);

  // Gera o QR Code (data URL) a partir do payload Pix devolvido pelo backend.
  useEffect(() => {
    if (!pixPayload) {
      setQrUrl("");
      return;
    }
    let alive = true;
    QRCode.toDataURL(pixPayload, { width: 280, margin: 1 })
      .then((url) => {
        if (alive) setQrUrl(url);
      })
      .catch(() => {
        if (alive) setQrUrl("");
      });
    return () => {
      alive = false;
    };
  }, [pixPayload]);

  useEffect(() => {
    return () => {
      if (azTimer.current) clearInterval(azTimer.current);
      if (pixCopyTimer.current) clearTimeout(pixCopyTimer.current);
    };
  }, []);

  const setField = useCallback(
    (key: keyof FormState) =>
      (e: { target: { value: string } }) =>
        setForm((s) => ({ ...s, [key]: e.target.value })),
    []
  );

  const dadosBase = useCallback(
    () => ({
      fase: form.fase,
      infracao: form.infracao,
      nome: form.nome,
      cpf: form.cpf,
      placa: form.placa,
      ait: form.ait,
      orgao: form.orgao,
      data: form.data,
      cidade: form.cidade,
      relato: form.relato
    }),
    [form]
  );

  // ---- ANÁLISE (grátis) -------------------------------------------------
  const startAnalysis = useCallback(async () => {
    if (azTimer.current) clearInterval(azTimer.current);
    setAnalise("");
    setAnaliseErro("");
    setAz(0);
    setStep("analyzing");

    azTimer.current = setInterval(() => {
      setAz((i) => (i + 1 < AZ_STEPS.length ? i + 1 : i));
    }, 850);

    try {
      const res = await fetch("/api/recurso-ia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modo: "analise", ...dadosBase() })
      });
      const json: { ok?: boolean; texto?: string; mensagem?: string } =
        await res.json();
      if (json.ok && json.texto) {
        setAnalise(json.texto);
      } else {
        // Fallback honesto: não afirma êxito; informa que a análise automática
        // falhou e que a peça pode ser gerada mesmo assim.
        setAnaliseErro(
          json.mensagem ||
            "Não foi possível gerar a análise automática agora. Você ainda pode gerar o recurso completo, montado com a fundamentação do CTB e das súmulas aplicáveis."
        );
      }
    } catch {
      setAnaliseErro(
        "Não foi possível conectar agora. Tente novamente em instantes — a análise é gratuita."
      );
    } finally {
      if (azTimer.current) {
        clearInterval(azTimer.current);
        azTimer.current = null;
      }
      setAz(AZ_STEPS.length - 1);
      // pequena pausa para a barra completar antes de revelar o resultado
      window.setTimeout(() => setStep("result"), 650);
    }
  }, [dadosBase]);

  // ---- CADASTRO + PIX ---------------------------------------------------
  const submitCadastro = useCallback(async () => {
    setCadErro("");
    if (cadNome.trim().length < 2 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(cadEmail)) {
      setCadErro("Informe um nome e um e-mail válidos.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/recurso-acesso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...dadosBase(),
          nome: cadNome,
          email: cadEmail,
          telefone: cadTel
        })
      });
      const json: {
        ok?: boolean;
        token?: string;
        pix?: string;
        valor?: string;
        mensagem?: string;
      } = await res.json();
      if (json.ok && json.token) {
        try {
          window.localStorage.setItem(TOKEN_KEY, json.token);
        } catch {
          /* localStorage indisponível */
        }
        setToken(json.token);
        if (json.pix) setPixPayload(json.pix);
        if (json.valor) setPixValor(json.valor);
        setStep("payment");
      } else {
        setCadErro(json.mensagem || "Não foi possível registrar. Tente novamente.");
      }
    } catch {
      setCadErro("Não foi possível conectar agora. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }, [cadNome, cadEmail, cadTel, dadosBase]);

  const copyPix = useCallback(() => {
    if (!pixPayload) return;
    if (navigator.clipboard) navigator.clipboard.writeText(pixPayload).catch(() => undefined);
    setPixCopied(true);
    if (pixCopyTimer.current) clearTimeout(pixCopyTimer.current);
    pixCopyTimer.current = setTimeout(() => setPixCopied(false), 1800);
  }, [pixPayload]);

  // ---- ACESSO / PEÇA COMPLETA ------------------------------------------
  const checkAcesso = useCallback(async () => {
    if (!token) {
      setAcesso("erro");
      setAcessoMsg("Não encontramos o seu acesso. Refaça o cadastro acima.");
      return;
    }
    setAcesso("checking");
    setAcessoMsg("");
    try {
      const res = await fetch(`/api/recurso-acesso?token=${encodeURIComponent(token)}`);
      const json: { ok?: boolean; status?: string } = await res.json();
      if (json.ok && json.status === "ativo") {
        setAcesso("ativo");
      } else if (json.ok) {
        setAcesso("aguardando");
        setAcessoMsg(
          "Ainda não liberado. Assim que confirmarmos o pagamento, você poderá gerar a peça aqui mesmo."
        );
      } else {
        setAcesso("erro");
        setAcessoMsg("Não encontramos o seu acesso. Refaça o cadastro acima.");
      }
    } catch {
      setAcesso("erro");
      setAcessoMsg("Não foi possível verificar agora. Tente de novo em instantes.");
    }
  }, [token]);

  const gerarPeca = useCallback(async () => {
    if (!token) return;
    setGerando(true);
    setPecaErro("");
    try {
      const res = await fetch("/api/recurso-ia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modo: "completo", token, ...dadosBase() })
      });
      const json: { ok?: boolean; texto?: string; mensagem?: string; motivo?: string } =
        await res.json();
      if (json.ok && json.texto) {
        setPeca(json.texto);
      } else if (json.motivo === "aguardando") {
        setAcesso("aguardando");
        setAcessoMsg(
          json.mensagem ||
            "Seu acesso ainda não foi liberado. Assim que confirmarmos o pagamento, você poderá gerar a peça."
        );
      } else {
        setPecaErro(json.mensagem || "Não foi possível gerar a peça agora. Tente novamente.");
      }
    } catch {
      setPecaErro("Não foi possível conectar agora. Tente novamente.");
    } finally {
      setGerando(false);
    }
  }, [token, dadosBase]);

  const copyPeca = useCallback(() => {
    if (peca && navigator.clipboard) navigator.clipboard.writeText(peca).catch(() => undefined);
  }, [peca]);

  const printPeca = useCallback(() => {
    if (!peca) return;
    const w = window.open("", "_blank", "width=820,height=1000");
    if (!w) return;
    const safe = peca.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    w.document.write(
      `<!doctype html><html><head><meta charset="utf-8"><title>Recurso de Multa</title>` +
        `<style>body{font-family:Georgia,'Times New Roman',serif;line-height:1.65;color:#16181D;max-width:720px;margin:40px auto;padding:0 24px;white-space:pre-wrap;font-size:15px;}@media print{body{margin:0;}}</style>` +
        `</head><body>${safe}</body></html>`
    );
    w.document.close();
    w.focus();
    w.setTimeout(() => w.print(), 300);
  }, [peca]);

  // ---- step bar ---------------------------------------------------------
  const stepsBar = useMemo(() => {
    const order: number = {
      form: 1,
      analyzing: 2,
      result: 2,
      unlock: 3,
      cadastro: 3,
      payment: 3,
      done: 5
    }[step];
    const labels = ["Dados", "Análise", "Plano", "Cadastro", "Pronto"];
    return labels.map((label, i) => {
      const on = i + 1 <= order;
      return { label, bar: on ? ACCENT : "#E2E4E9", txt: on ? "#16181D" : "#AAB0BA" };
    });
  }, [step]);

  const azPct = `${Math.round(((az + 1) / AZ_STEPS.length) * 100)}%`;

  // estilos reaproveitados
  const wrap: CSSProperties = {
    maxWidth: 1160,
    margin: "0 auto",
    paddingLeft: 24,
    paddingRight: 24
  };
  const ctaPrimary: CSSProperties = {
    background: ACCENT,
    color: "#fff",
    border: "none",
    padding: 16,
    borderRadius: 11,
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 10px 24px rgba(244,99,26,0.32)",
    fontFamily: SANS
  };
  const inputStyle: CSSProperties = {
    width: "100%",
    padding: "12px 13px",
    border: "1px solid #D5D8DF",
    borderRadius: 9,
    fontSize: 15,
    background: "#F7F8FA",
    color: "#16181D",
    fontFamily: SANS
  };
  const labelStyle: CSSProperties = {
    display: "block",
    fontSize: 12.5,
    fontWeight: 500,
    color: "#44474F",
    marginBottom: 6
  };
  const fieldTitle: CSSProperties = {
    fontSize: 12.5,
    fontWeight: 700,
    color: "#16181D",
    marginBottom: 11
  };

  return (
    <div style={{ background: "#F4F5F7", color: "#16181D", overflowX: "hidden", fontFamily: SANS }}>
      <style>{`
        .rm-scope ::selection { background:${ACCENT}; color:#fff; }
        .rm-scope details > summary { list-style:none; cursor:pointer; }
        .rm-scope details > summary::-webkit-details-marker { display:none; }
        @keyframes rm-spin { to { transform:rotate(360deg); } }
        @keyframes rm-pop { 0%{ transform:scale(0.8); opacity:0; } 100%{ transform:scale(1); opacity:1; } }
        @keyframes rm-fadeUp { 0%{ transform:translateY(10px); opacity:0; } 100%{ transform:translateY(0); opacity:1; } }
        @media (max-width:880px){
          .rm-hero-grid,.rm-cards-3,.rm-plans-2,.rm-prazo-grid { grid-template-columns:1fr !important; }
          .rm-nav-links a:not(.rm-nav-cta){ display:none !important; }
        }
        @media (max-width:540px){
          .rm-field-2 { grid-template-columns:1fr !important; }
        }
      `}</style>

      <div className="rm-scope">
        {/* NAV */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            background: "rgba(21,23,28,0.96)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid rgba(255,255,255,0.08)"
          }}
        >
          <div
            style={{
              ...wrap,
              paddingTop: 14,
              paddingBottom: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
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
                {/* Ícone de trânsito (escudo/cone) — comunica "multas", não diretório */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
                <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 18, color: "#F4F5F7" }}>
                  Recurso de Multa
                </span>
                <span style={{ fontSize: 11, color: "#8A8F99", fontWeight: 500, marginTop: 4 }}>
                  por AdvAqui
                </span>
              </div>
            </div>
            <nav className="rm-nav-links" style={{ display: "flex", gap: 28, alignItems: "center" }}>
              <a href="#fases" style={{ color: "#C2C7D0", textDecoration: "none", fontSize: 14 }}>
                Como funciona
              </a>
              <a href="#planos" style={{ color: "#C2C7D0", textDecoration: "none", fontSize: 14 }}>
                Preço
              </a>
              <a
                className="rm-nav-cta"
                href="#gerador"
                style={{
                  background: ACCENT,
                  color: "#fff",
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 700,
                  padding: "10px 18px",
                  borderRadius: 9
                }}
              >
                Analisar minha multa
              </a>
            </nav>
          </div>
        </header>

        {/* HERO */}
        <section style={{ background: DARK, color: "#F4F5F7" }}>
          <div style={{ ...wrap, paddingTop: 14 }}>
            <div style={{ fontSize: 13, color: "#8A8F99", display: "flex", gap: 8 }}>
              <span>Brasil</span>
              <span>/</span>
              <span style={{ color: "#C2C7D0" }}>Recurso de multa</span>
            </div>
          </div>
          <div
            className="rm-hero-grid"
            style={{
              ...wrap,
              display: "grid",
              gridTemplateColumns: "1.08fr 0.92fr",
              gap: "clamp(36px,5vw,60px)",
              alignItems: "center",
              paddingTop: "clamp(44px,6vw,66px)",
              paddingBottom: "clamp(56px,7vw,84px)"
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(244,99,26,0.16)",
                  border: "1px solid rgba(244,99,26,0.45)",
                  color: "#FFB089",
                  padding: "7px 14px",
                  borderRadius: 100,
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 26
                }}
              >
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: ACCENT }} />{" "}
                Fundamentado no CTB, nas súmulas do STJ e nas Resoluções CONTRAN
              </div>
              <h1
                style={{
                  fontFamily: DISPLAY,
                  fontWeight: 700,
                  fontSize: "clamp(36px,5.4vw,60px)",
                  lineHeight: 1.03,
                  letterSpacing: "-0.02em",
                  margin: "0 0 22px"
                }}
              >
                Multado injustamente? Gere o seu recurso com IA.
              </h1>
              <p
                style={{
                  fontSize: "clamp(15px,1.6vw,18px)",
                  lineHeight: 1.6,
                  color: "#C2C7D0",
                  maxWidth: "54ch",
                  margin: "0 0 32px"
                }}
              >
                Responda algumas perguntas, a inteligência artificial analisa o seu caso e gera uma
                peça técnica com a tese e a fundamentação corretas. Conteste os pontos da sua CNH e
                questione o que considera indevido, com os fundamentos certos.
              </p>
              <div style={{ display: "flex", gap: 13, flexWrap: "wrap", alignItems: "center" }}>
                <a
                  href="#gerador"
                  style={{
                    background: ACCENT,
                    color: "#fff",
                    textDecoration: "none",
                    fontSize: 16,
                    fontWeight: 700,
                    padding: "16px 30px",
                    borderRadius: 11,
                    boxShadow: "0 10px 26px rgba(244,99,26,0.35)"
                  }}
                >
                  Analisar minha multa grátis
                </a>
                <a
                  href="#planos"
                  style={{
                    color: "#F4F5F7",
                    textDecoration: "none",
                    fontSize: 16,
                    fontWeight: 600,
                    padding: "16px 22px",
                    borderRadius: 11,
                    border: "1px solid rgba(255,255,255,0.2)"
                  }}
                >
                  Planos a partir de R$9,90
                </a>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 38,
                  marginTop: 46,
                  flexWrap: "wrap",
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                  paddingTop: 26
                }}
              >
                {[
                  { v: "~2 min", l: "Para analisar o seu caso" },
                  { v: "Em segundos", l: "A peça gerada pela IA" },
                  { v: "3 fases", l: "Defesa · JARI · CETRAN" }
                ].map((s) => (
                  <div key={s.l}>
                    <div style={{ fontFamily: DISPLAY, fontSize: 26, fontWeight: 700 }}>{s.v}</div>
                    <div style={{ fontSize: 12.5, color: "#8A8F99", marginTop: 3 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Confidence card */}
            <div
              style={{
                background: "#F7F8FA",
                borderRadius: 16,
                padding: 32,
                color: "#16181D",
                boxShadow: "0 20px 44px rgba(0,0,0,0.3)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22 }}>
                <div
                  style={{
                    position: "relative",
                    width: 84,
                    height: 84,
                    flex: "0 0 auto",
                    borderRadius: "50%",
                    background: "#FFE3D5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      background: "#F7F8FA",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={ACCENT}
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 11l3 3L22 4" />
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                    </svg>
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 19, lineHeight: 1.15 }}>
                    Vale a pena recorrer
                  </div>
                  <div style={{ fontSize: 13, color: "#5A5F6A", marginTop: 4 }}>
                    Vícios no auto ou na notificação são fundamentos sólidos para contestar a autuação.
                  </div>
                </div>
              </div>
              <div style={{ height: 1, background: "#E6E7EB", margin: "6px 0 20px" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { t: "Conte sobre a multa", s: "Infração, fase e alguns dados." },
                  { t: "A IA analisa o caso", s: "Identifica as teses cabíveis na hora." },
                  { t: "Gere o recurso no painel", s: "Pronto para baixar e protocolar." }
                ].map((it, i) => (
                  <div key={it.t} style={{ display: "flex", gap: 13, alignItems: "flex-start" }}>
                    <div
                      style={{
                        flex: "0 0 26px",
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        background: "#FFE3D5",
                        color: ACCENT,
                        fontWeight: 700,
                        fontSize: 13,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14.5 }}>{it.t}</div>
                      <div style={{ fontSize: 13, color: "#5A5F6A" }}>{it.s}</div>
                    </div>
                  </div>
                ))}
              </div>
              <a
                href="#gerador"
                style={{
                  display: "block",
                  textAlign: "center",
                  marginTop: 24,
                  background: ACCENT,
                  color: "#fff",
                  textDecoration: "none",
                  fontSize: 15,
                  fontWeight: 700,
                  padding: 14,
                  borderRadius: 10
                }}
              >
                Começar agora →
              </a>
            </div>
          </div>
        </section>

        {/* TRUST STRIP */}
        <div style={{ background: "#1C1F26", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div
            style={{
              ...wrap,
              paddingTop: 16,
              paddingBottom: 16,
              display: "flex",
              gap: "12px 34px",
              flexWrap: "wrap",
              justifyContent: "center",
              color: "#9AA0AA",
              fontSize: 13,
              fontWeight: 500
            }}
          >
            <span>✓ A tese certa para a sua infração</span>
            <span>✓ Artigos, súmulas e Resoluções citados</span>
            <span>✓ Defenda os pontos da sua CNH</span>
            <span>✓ Peça gerada em segundos pela IA, no seu painel</span>
          </div>
        </div>

        {/* FUNIL */}
        <section
          id="gerador"
          style={{ ...wrap, paddingTop: "clamp(56px,8vw,90px)", paddingBottom: "clamp(56px,8vw,90px)" }}
        >
          <div style={{ textAlign: "center", marginBottom: 34 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: ACCENT,
                marginBottom: 10
              }}
            >
              Análise do seu caso
            </div>
            <h2
              style={{
                fontFamily: DISPLAY,
                fontWeight: 700,
                fontSize: "clamp(28px,3.8vw,40px)",
                letterSpacing: "-0.02em",
                margin: "0 0 10px"
              }}
            >
              Vamos analisar a sua multa
            </h2>
            <p style={{ fontSize: 16, color: "#5A5F6A", maxWidth: "60ch", margin: "0 auto", lineHeight: 1.6 }}>
              Leva cerca de 2 minutos. A análise é gratuita — você só paga se quiser gerar o
              recurso completo.
            </p>
          </div>

          {/* Step bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, maxWidth: 560, margin: "0 auto 30px" }}>
            {stepsBar.map((st) => (
              <div key={st.label} style={{ flex: 1, textAlign: "center" }}>
                <div style={{ height: 5, borderRadius: 100, background: st.bar }} />
                <div style={{ fontSize: 11, fontWeight: 600, marginTop: 7, color: st.txt }}>
                  {st.label}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              maxWidth: 660,
              margin: "0 auto",
              background: "#fff",
              border: "1px solid #E6E7EB",
              borderRadius: 18,
              boxShadow: "0 8px 30px rgba(20,22,28,0.05)",
              overflow: "hidden"
            }}
          >
            {/* STEP: FORM */}
            {step === "form" && (
              <div style={{ padding: "clamp(24px,4vw,38px)" }}>
                <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 21, margin: "0 0 4px" }}>
                  Conte sobre a multa
                </div>
                <p style={{ fontSize: 14, color: "#5A5F6A", margin: "0 0 24px" }}>
                  Quanto mais preciso, melhor a tese que vamos montar para você.
                </p>

                <div style={fieldTitle}>Fase do recurso</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 24 }}>
                  {FASES.map((f) => {
                    const active = form.fase === f.value;
                    return (
                      <button
                        key={f.value}
                        type="button"
                        onClick={() => setForm((s) => ({ ...s, fase: f.value }))}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          textAlign: "left",
                          padding: "13px 15px",
                          borderRadius: 10,
                          cursor: "pointer",
                          border: `1.5px solid ${active ? ACCENT : "#DFE1E6"}`,
                          background: active ? "#FFF1EA" : "#fff",
                          fontFamily: SANS
                        }}
                      >
                        <span style={{ fontWeight: 600, fontSize: 14, color: "#16181D" }}>
                          {f.label}
                        </span>
                        <span
                          style={{ fontSize: 12.5, color: "#8A8F99", marginTop: 3, lineHeight: 1.4 }}
                        >
                          {FASE_SUB[f.value] ?? f.descricao}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div style={fieldTitle}>Tipo de infração</div>
                <select
                  value={form.infracao}
                  onChange={setField("infracao")}
                  style={{
                    width: "100%",
                    padding: "13px 14px",
                    border: "1px solid #D5D8DF",
                    borderRadius: 10,
                    fontSize: 15,
                    background: "#F7F8FA",
                    color: "#16181D",
                    marginBottom: 24,
                    cursor: "pointer",
                    fontFamily: SANS
                  }}
                >
                  {INFRACOES.map((i) => (
                    <option key={i.slug} value={i.slug}>
                      {i.label}
                    </option>
                  ))}
                </select>

                <div style={fieldTitle}>Dados do requerente</div>
                <div
                  className="rm-field-2"
                  style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 }}
                >
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>Nome completo</label>
                    <input
                      value={form.nome}
                      onChange={setField("nome")}
                      placeholder="Maria da Silva"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>CPF</label>
                    <input
                      value={form.cpf}
                      onChange={setField("cpf")}
                      placeholder="000.000.000-00"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Placa</label>
                    <input
                      value={form.placa}
                      onChange={setField("placa")}
                      placeholder="ABC1D23"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Nº do Auto (AIT)</label>
                    <input
                      value={form.ait}
                      onChange={setField("ait")}
                      placeholder="A0000000000"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Órgão autuador</label>
                    <input
                      value={form.orgao}
                      onChange={setField("orgao")}
                      placeholder="DETRAN-SP / DER"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Data da infração</label>
                    <input
                      value={form.data}
                      onChange={setField("data")}
                      type="date"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Cidade/UF</label>
                    <input
                      value={form.cidade}
                      onChange={setField("cidade")}
                      placeholder="São Paulo/SP"
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>
                      Relato dos fatos <span style={{ color: "#9AA0AA" }}>(opcional)</span>
                    </label>
                    <textarea
                      value={form.relato}
                      onChange={setField("relato")}
                      placeholder="O que aconteceu, na sua visão."
                      rows={3}
                      style={{ ...inputStyle, resize: "vertical" }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={startAnalysis}
                  style={{ ...ctaPrimary, width: "100%", marginTop: 26 }}
                >
                  Analisar meu caso →
                </button>
                <div style={{ textAlign: "center", fontSize: 12, color: "#9AA0AA", marginTop: 11 }}>
                  Análise gratuita · sem compromisso
                </div>
              </div>
            )}

            {/* STEP: ANALYZING */}
            {step === "analyzing" && (
              <div style={{ padding: "clamp(36px,5vw,56px)", textAlign: "center" }}>
                <div
                  style={{
                    width: 58,
                    height: 58,
                    margin: "0 auto 22px",
                    border: "4px solid #ECEDF1",
                    borderTopColor: ACCENT,
                    borderRadius: "50%",
                    animation: "rm-spin 0.9s linear infinite"
                  }}
                />
                <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 22, marginBottom: 6 }}>
                  Analisando o seu caso…
                </div>
                <p style={{ fontSize: 14, color: "#5A5F6A", margin: "0 0 28px" }}>
                  Cruzando os dados com a legislação de trânsito.
                </p>
                <div
                  style={{
                    maxWidth: 380,
                    margin: "0 auto",
                    textAlign: "left",
                    display: "flex",
                    flexDirection: "column",
                    gap: 13
                  }}
                >
                  {AZ_STEPS.map((label, i) => {
                    const done = i < az;
                    const active = i === az;
                    return (
                      <div key={label} style={{ display: "flex", alignItems: "center", gap: 11 }}>
                        <span
                          style={{
                            flex: "0 0 22px",
                            width: 22,
                            height: 22,
                            borderRadius: "50%",
                            background: done || active ? ACCENT : "#DFE1E6",
                            color: "#fff",
                            fontSize: 12,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          {done ? "✓" : ""}
                        </span>
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: active ? 700 : 500,
                            color: done || active ? "#16181D" : "#9AA0AA"
                          }}
                        >
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div
                  style={{
                    maxWidth: 380,
                    margin: "28px auto 0",
                    height: 6,
                    borderRadius: 100,
                    background: "#ECEDF1",
                    overflow: "hidden"
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: azPct,
                      background: ACCENT,
                      borderRadius: 100,
                      transition: "width .5s ease"
                    }}
                  />
                </div>
              </div>
            )}

            {/* STEP: RESULT */}
            {step === "result" && (
              <div style={{ padding: "clamp(28px,4vw,44px)", animation: "rm-fadeUp .4s ease" }}>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      background: "#EEF1F5",
                      color: "#44474F",
                      fontWeight: 700,
                      fontSize: 13,
                      padding: "7px 15px",
                      borderRadius: 100,
                      marginBottom: 22
                    }}
                  >
                    Análise concluída
                  </div>
                  <div
                    style={{
                      position: "relative",
                      width: 96,
                      height: 96,
                      margin: "0 auto 18px",
                      borderRadius: "50%",
                      background: "#FFE3D5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      animation: "rm-pop .5s ease"
                    }}
                  >
                    <div
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: "50%",
                        background: "#fff",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <svg
                        width="34"
                        height="34"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={ACCENT}
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 12l2 2 4-4" />
                        <circle cx="12" cy="12" r="9" />
                      </svg>
                    </div>
                  </div>
                  <h3
                    style={{
                      fontFamily: DISPLAY,
                      fontWeight: 700,
                      fontSize: "clamp(22px,3vw,28px)",
                      margin: "0 0 10px",
                      letterSpacing: "-0.01em"
                    }}
                  >
                    Veja a análise do seu caso
                  </h3>
                  <p
                    style={{
                      fontSize: 15,
                      color: "#5A5F6A",
                      lineHeight: 1.6,
                      maxWidth: "52ch",
                      margin: "0 auto 22px"
                    }}
                  >
                    A IA cruzou os dados da sua autuação com o CTB, as súmulas do STJ e as Resoluções
                    do CONTRAN. Veja o que ela encontrou:
                  </p>
                </div>

                <div
                  style={{
                    textAlign: "left",
                    maxWidth: 520,
                    margin: "0 auto 26px",
                    background: "#F7F8FA",
                    border: "1px solid #E6E7EB",
                    borderRadius: 12,
                    padding: "18px 20px",
                    fontSize: 14.5,
                    lineHeight: 1.65,
                    color: "#2A2E36",
                    whiteSpace: "pre-wrap"
                  }}
                >
                  {analise || analiseErro}
                </div>

                <button
                  type="button"
                  onClick={() => setStep("unlock")}
                  style={{ ...ctaPrimary, width: "100%", maxWidth: 520, display: "block", margin: "0 auto" }}
                >
                  Prosseguir →
                </button>
                <div
                  style={{
                    fontSize: 11,
                    color: "#9AA0AA",
                    marginTop: 16,
                    maxWidth: "52ch",
                    marginLeft: "auto",
                    marginRight: "auto",
                    textAlign: "center"
                  }}
                >
                  A decisão final é do órgão de trânsito. A IA monta a peça com os fundamentos
                  certos para o seu caso, pronta para você revisar e protocolar.
                </div>
              </div>
            )}

            {/* STEP: UNLOCK */}
            {step === "unlock" && (
              <div
                style={{ padding: "clamp(28px,4vw,44px)", textAlign: "center", animation: "rm-fadeUp .4s ease" }}
              >
                <div
                  style={{
                    width: 54,
                    height: 54,
                    margin: "0 auto 18px",
                    borderRadius: 14,
                    background: "#FFE3D5",
                    color: ACCENT,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <h3
                  style={{
                    fontFamily: DISPLAY,
                    fontWeight: 700,
                    fontSize: "clamp(22px,3vw,28px)",
                    margin: "0 0 10px",
                    letterSpacing: "-0.01em"
                  }}
                >
                  Desbloqueie o seu recurso
                </h3>
                <p
                  style={{
                    fontSize: 15,
                    color: "#5A5F6A",
                    lineHeight: 1.6,
                    maxWidth: "44ch",
                    margin: "0 auto 24px"
                  }}
                >
                  Você gera a peça completa na hora, com toda a fundamentação, direto no seu painel —
                  pronta para protocolar.
                </p>
                <div
                  style={{
                    background: "#F7F8FA",
                    border: "1px solid #E6E7EB",
                    borderRadius: 14,
                    padding: 24,
                    maxWidth: 420,
                    margin: "0 auto 24px",
                    textAlign: "left"
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 8,
                      justifyContent: "center",
                      marginBottom: 18
                    }}
                  >
                    <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 40, color: "#16181D" }}>
                      R$9,90
                    </span>
                    <span style={{ color: "#8A8F99", fontSize: 14 }}>pagamento único</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 11, fontSize: 14 }}>
                    {[
                      <>Até <strong>3 recursos</strong> completos</>,
                      "Gerados pela IA com a tese certa",
                      "Artigos, súmulas e Resoluções citados",
                      "No seu painel, prontos para baixar"
                    ].map((t, i) => (
                      <div key={i} style={{ display: "flex", gap: 10 }}>
                        <span style={{ color: "#1E8E54" }}>✓</span> {t}
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep("cadastro")}
                  style={{ ...ctaPrimary, width: "100%", maxWidth: 420 }}
                >
                  Ativar plano · R$9,90
                </button>
                <div style={{ fontSize: 12, color: "#9AA0AA", marginTop: 12 }}>
                  Pagamento via Pix · sem renovação automática
                </div>
              </div>
            )}

            {/* STEP: CADASTRO */}
            {step === "cadastro" && (
              <div style={{ padding: "clamp(28px,4vw,44px)", animation: "rm-fadeUp .4s ease" }}>
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                  <h3
                    style={{
                      fontFamily: DISPLAY,
                      fontWeight: 700,
                      fontSize: "clamp(21px,2.8vw,26px)",
                      margin: "0 0 6px",
                      letterSpacing: "-0.01em"
                    }}
                  >
                    Quase lá — crie o seu acesso
                  </h3>
                  <p style={{ fontSize: 14, color: "#5A5F6A", margin: 0 }}>
                    Cadastre-se para gerar o Pix e liberar o seu painel de recursos.
                  </p>
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 440, margin: "0 auto" }}
                >
                  <div>
                    <label style={labelStyle}>Nome completo</label>
                    <input
                      value={cadNome}
                      onChange={(e) => setCadNome(e.target.value)}
                      placeholder="Maria da Silva"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>E-mail</label>
                    <input
                      value={cadEmail}
                      onChange={(e) => setCadEmail(e.target.value)}
                      type="email"
                      placeholder="voce@email.com"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>WhatsApp</label>
                    <input
                      value={cadTel}
                      onChange={(e) => setCadTel(e.target.value)}
                      placeholder="(11) 90000-0000"
                      style={inputStyle}
                    />
                  </div>
                </div>
                {cadErro && (
                  <div
                    style={{
                      maxWidth: 440,
                      margin: "14px auto 0",
                      fontSize: 13,
                      color: "#B42318",
                      background: "#FEF3F2",
                      border: "1px solid #FECDCA",
                      borderRadius: 9,
                      padding: "10px 13px"
                    }}
                  >
                    {cadErro}
                  </div>
                )}
                <button
                  type="button"
                  onClick={submitCadastro}
                  disabled={saving}
                  style={{
                    ...ctaPrimary,
                    width: "100%",
                    maxWidth: 440,
                    display: "block",
                    margin: "24px auto 0",
                    opacity: saving ? 0.7 : 1,
                    cursor: saving ? "default" : "pointer"
                  }}
                >
                  {saving ? "Enviando…" : "Continuar para o pagamento"}
                </button>
                <div style={{ textAlign: "center", fontSize: 12, color: "#9AA0AA", marginTop: 12 }}>
                  Seus dados são usados apenas para gerar o seu recurso e liberar o seu acesso.
                </div>
              </div>
            )}

            {/* STEP: PAYMENT */}
            {step === "payment" && (
              <div
                style={{ padding: "clamp(28px,4vw,44px)", textAlign: "center", animation: "rm-fadeUp .4s ease" }}
              >
                <h3
                  style={{
                    fontFamily: DISPLAY,
                    fontWeight: 700,
                    fontSize: "clamp(21px,2.8vw,26px)",
                    margin: "0 0 6px",
                    letterSpacing: "-0.01em"
                  }}
                >
                  Pague com Pix para liberar
                </h3>
                <p style={{ fontSize: 14, color: "#5A5F6A", margin: "0 0 24px" }}>
                  Escaneie o QR Code abaixo ou use o Pix copia e cola.
                </p>
                <div
                  style={{
                    display: "inline-block",
                    padding: 16,
                    background: "#fff",
                    border: "1px solid #E6E7EB",
                    borderRadius: 16,
                    boxShadow: "0 6px 18px rgba(20,22,28,0.06)"
                  }}
                >
                  {qrUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={qrUrl}
                      alt="QR Code Pix para pagamento"
                      width={208}
                      height={208}
                      style={{ width: 208, height: 208, display: "block" }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 208,
                        height: 208,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#AAB0BA",
                        fontSize: 13
                      }}
                    >
                      Gerando QR Code…
                    </div>
                  )}
                </div>
                <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 26, margin: "18px 0 4px", color: "#16181D" }}>
                  {pixValor}
                </div>
                <div style={{ maxWidth: 420, margin: "18px auto 0" }}>
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                      background: "#F7F8FA",
                      border: "1px solid #E6E7EB",
                      borderRadius: 10,
                      padding: "11px 13px"
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        color: "#5A5F6A",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        flex: 1,
                        textAlign: "left"
                      }}
                    >
                      {pixPayload || "Gerando código Pix…"}
                    </span>
                    <button
                      type="button"
                      onClick={copyPix}
                      disabled={!pixPayload}
                      style={{
                        background: DARK,
                        color: "#fff",
                        border: "none",
                        padding: "8px 14px",
                        borderRadius: 7,
                        fontSize: 12.5,
                        fontWeight: 600,
                        cursor: pixPayload ? "pointer" : "default",
                        whiteSpace: "nowrap",
                        fontFamily: SANS,
                        opacity: pixPayload ? 1 : 0.6
                      }}
                    >
                      {pixCopied ? "Copiado ✓" : "Copiar"}
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep("done")}
                  style={{
                    ...ctaPrimary,
                    background: "#1E8E54",
                    boxShadow: "0 10px 24px rgba(30,142,84,0.28)",
                    width: "100%",
                    maxWidth: 420,
                    marginTop: 24
                  }}
                >
                  Já paguei →
                </button>
                <div style={{ fontSize: 12, color: "#9AA0AA", marginTop: 12 }}>
                  Seu acesso é liberado após a confirmação do pagamento.
                </div>
              </div>
            )}

            {/* STEP: DONE */}
            {step === "done" && (
              <div
                style={{ padding: "clamp(36px,5vw,56px)", textAlign: "center", animation: "rm-fadeUp .4s ease" }}
              >
                <div
                  style={{
                    width: 66,
                    height: 66,
                    margin: "0 auto 20px",
                    borderRadius: "50%",
                    background: "#E8F6EE",
                    color: "#1E8E54",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: "rm-pop .5s ease"
                  }}
                >
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h3
                  style={{
                    fontFamily: DISPLAY,
                    fontWeight: 700,
                    fontSize: "clamp(22px,3vw,28px)",
                    margin: "0 0 10px",
                    letterSpacing: "-0.01em"
                  }}
                >
                  Pagamento registrado!
                </h3>
                <p
                  style={{
                    fontSize: 15,
                    color: "#5A5F6A",
                    lineHeight: 1.6,
                    maxWidth: "48ch",
                    margin: "0 auto 8px"
                  }}
                >
                  Seu acesso será liberado após a confirmação do pagamento.
                </p>
                <p
                  style={{
                    fontSize: 13.5,
                    color: "#8A8F99",
                    lineHeight: 1.6,
                    maxWidth: "48ch",
                    margin: "0 auto 22px"
                  }}
                >
                  Tudo acontece no seu painel: assim que o acesso for liberado, você gera os seus
                  recursos (até 3) na hora, com a IA. Guarde o link abaixo para voltar quando quiser.
                </p>

                <a
                  href={token ? `/recurso/painel?t=${encodeURIComponent(token)}` : "/recurso/painel"}
                  style={{
                    ...ctaPrimary,
                    display: "inline-block",
                    textDecoration: "none",
                    maxWidth: 420,
                    width: "100%",
                    marginBottom: 18,
                    textAlign: "center"
                  }}
                >
                  Ir para o meu painel →
                </a>
                <div style={{ fontSize: 12, color: "#9AA0AA", margin: "0 auto 26px" }}>
                  ou verifique e gere por aqui mesmo:
                </div>

                {!peca && (
                  <>
                    <button
                      type="button"
                      onClick={checkAcesso}
                      disabled={acesso === "checking"}
                      style={{
                        display: "inline-block",
                        background: DARK,
                        color: "#fff",
                        border: "none",
                        padding: "13px 26px",
                        borderRadius: 10,
                        fontSize: 14.5,
                        fontWeight: 700,
                        cursor: acesso === "checking" ? "default" : "pointer",
                        fontFamily: SANS,
                        opacity: acesso === "checking" ? 0.7 : 1
                      }}
                    >
                      {acesso === "checking" ? "Verificando…" : "Já tenho acesso / Gerar minha peça"}
                    </button>

                    {acesso === "aguardando" && (
                      <div
                        style={{
                          maxWidth: 440,
                          margin: "18px auto 0",
                          fontSize: 13.5,
                          color: "#8A6D00",
                          background: "#FFF8E6",
                          border: "1px solid #F4E2A8",
                          borderRadius: 10,
                          padding: "12px 15px"
                        }}
                      >
                        {acessoMsg}
                      </div>
                    )}
                    {acesso === "erro" && (
                      <div
                        style={{
                          maxWidth: 440,
                          margin: "18px auto 0",
                          fontSize: 13.5,
                          color: "#B42318",
                          background: "#FEF3F2",
                          border: "1px solid #FECDCA",
                          borderRadius: 10,
                          padding: "12px 15px"
                        }}
                      >
                        {acessoMsg}
                      </div>
                    )}

                    {acesso === "ativo" && (
                      <div style={{ marginTop: 22 }}>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            background: "#E8F6EE",
                            color: "#1E8E54",
                            fontWeight: 700,
                            fontSize: 13,
                            padding: "7px 15px",
                            borderRadius: 100,
                            marginBottom: 16
                          }}
                        >
                          ✓ Acesso liberado
                        </div>
                        <div>
                          <button
                            type="button"
                            onClick={gerarPeca}
                            disabled={gerando}
                            style={{
                              ...ctaPrimary,
                              width: "100%",
                              maxWidth: 420,
                              opacity: gerando ? 0.7 : 1,
                              cursor: gerando ? "default" : "pointer"
                            }}
                          >
                            {gerando ? "Gerando a peça…" : "Gerar peça completa"}
                          </button>
                        </div>
                        {pecaErro && (
                          <div
                            style={{
                              maxWidth: 420,
                              margin: "16px auto 0",
                              fontSize: 13.5,
                              color: "#B42318",
                              background: "#FEF3F2",
                              border: "1px solid #FECDCA",
                              borderRadius: 10,
                              padding: "12px 15px"
                            }}
                          >
                            {pecaErro}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                {peca && (
                  <div style={{ marginTop: 8, textAlign: "left" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        justifyContent: "center",
                        flexWrap: "wrap",
                        marginBottom: 16
                      }}
                    >
                      <button
                        type="button"
                        onClick={copyPeca}
                        style={{
                          background: DARK,
                          color: "#fff",
                          border: "none",
                          padding: "11px 20px",
                          borderRadius: 9,
                          fontSize: 14,
                          fontWeight: 700,
                          cursor: "pointer",
                          fontFamily: SANS
                        }}
                      >
                        Copiar texto
                      </button>
                      <button
                        type="button"
                        onClick={printPeca}
                        style={{ ...ctaPrimary, padding: "11px 20px", fontSize: 14 }}
                      >
                        Imprimir / PDF
                      </button>
                    </div>
                    <div
                      style={{
                        maxWidth: 620,
                        margin: "0 auto",
                        background: "#F7F8FA",
                        border: "1px solid #E6E7EB",
                        borderRadius: 12,
                        padding: "20px 22px",
                        fontSize: 14,
                        lineHeight: 1.7,
                        color: "#16181D",
                        whiteSpace: "pre-wrap",
                        maxHeight: 460,
                        overflow: "auto"
                      }}
                    >
                      {peca}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* FASES */}
        <section id="fases" style={{ background: DARK, color: "#F4F5F7" }}>
          <div style={{ ...wrap, paddingTop: "clamp(56px,8vw,90px)", paddingBottom: "clamp(56px,8vw,90px)" }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#FFB089",
                marginBottom: 10
              }}
            >
              O caminho do recurso
            </div>
            <h2
              style={{
                fontFamily: DISPLAY,
                fontWeight: 700,
                fontSize: "clamp(28px,3.8vw,40px)",
                letterSpacing: "-0.02em",
                margin: "0 0 44px"
              }}
            >
              As três fases administrativas
            </h2>
            <div
              className="rm-cards-3"
              style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}
            >
              {FASES_CARDS.map((ph) => (
                <div
                  key={ph.n}
                  style={{ border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: 28 }}
                >
                  <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 14, color: "#FFB089", marginBottom: 16 }}>
                    {ph.n}
                  </div>
                  <h3 style={{ fontFamily: DISPLAY, fontSize: 20, fontWeight: 700, margin: "0 0 10px" }}>
                    {ph.t}
                  </h3>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: "#9AA0AA", margin: 0 }}>{ph.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PLANOS */}
        <section
          id="planos"
          style={{ ...wrap, paddingTop: "clamp(56px,8vw,90px)", paddingBottom: "clamp(40px,5vw,60px)" }}
        >
          <div style={{ marginBottom: 42, maxWidth: "60ch" }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: ACCENT,
                marginBottom: 10
              }}
            >
              Planos
            </div>
            <h2
              style={{
                fontFamily: DISPLAY,
                fontWeight: 700,
                fontSize: "clamp(28px,3.8vw,40px)",
                letterSpacing: "-0.02em",
                margin: "0 0 10px"
              }}
            >
              Bem mais barato que pagar a multa
            </h2>
            <p style={{ fontSize: 16, color: "#5A5F6A", margin: 0, lineHeight: 1.6 }}>
              A análise é gratuita. Por uma fração do valor da multa, gere o recurso completo no seu
              painel e proteja a sua CNH.
            </p>
          </div>
          <div
            className="rm-plans-2"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, maxWidth: 840 }}
          >
            <div style={{ background: "#fff", border: "1px solid #E6E7EB", borderRadius: 16, padding: 32 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: "#5A5F6A", letterSpacing: "0.04em" }}>
                ANÁLISE
              </div>
              <div style={{ fontFamily: DISPLAY, fontSize: 42, fontWeight: 800, margin: "12px 0 4px" }}>
                Grátis
              </div>
              <p style={{ fontSize: 13.5, color: "#5A5F6A", margin: "0 0 24px" }}>
                Descubra suas chances antes de pagar.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 11, fontSize: 14 }}>
                <div style={{ display: "flex", gap: 10 }}>
                  <span style={{ color: "#1E8E54" }}>✓</span> Análise do seu caso
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <span style={{ color: "#1E8E54" }}>✓</span> Teses cabíveis identificadas
                </div>
                <div style={{ display: "flex", gap: 10, color: "#9AA0AA" }}>
                  <span>—</span> Recurso completo gerado no painel
                </div>
              </div>
              <a
                href="#gerador"
                style={{
                  display: "block",
                  textAlign: "center",
                  marginTop: 28,
                  padding: 13,
                  borderRadius: 9,
                  border: "1px solid #D5D8DF",
                  textDecoration: "none",
                  color: "#16181D",
                  fontWeight: 700,
                  fontSize: 14.5
                }}
              >
                Analisar minha multa
              </a>
            </div>
            <div
              style={{
                background: DARK,
                color: "#F4F5F7",
                borderRadius: 16,
                padding: 32,
                position: "relative"
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  fontSize: 11,
                  fontWeight: 700,
                  background: "rgba(244,99,26,0.2)",
                  color: "#FFB089",
                  padding: "5px 11px",
                  borderRadius: 100,
                  marginBottom: 14,
                  letterSpacing: "0.03em"
                }}
              >
                MAIS ESCOLHIDO
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: "#9AA0AA", letterSpacing: "0.04em" }}>
                PLANO RECURSO
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, margin: "12px 0 4px" }}>
                <span style={{ fontFamily: DISPLAY, fontSize: 48, fontWeight: 800 }}>R$9,90</span>
                <span style={{ color: "#8A8F99", fontSize: 13.5 }}>único</span>
              </div>
              <p style={{ fontSize: 13.5, color: "#C2C7D0", margin: "0 0 24px" }}>
                Gere até <strong style={{ color: "#fff" }}>3 recursos</strong> completos no seu painel.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 11, fontSize: 14 }}>
                {[
                  "Até 3 recursos completos",
                  "Gerados na hora pela IA jurídica",
                  "Você mesmo gera no seu painel",
                  "Sem renovação automática"
                ].map((t) => (
                  <div key={t} style={{ display: "flex", gap: 10 }}>
                    <span style={{ color: "#FFB089" }}>✓</span> {t}
                  </div>
                ))}
              </div>
              <a
                href="#gerador"
                style={{
                  display: "block",
                  textAlign: "center",
                  marginTop: 28,
                  padding: 14,
                  borderRadius: 10,
                  background: ACCENT,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 14.5,
                  textDecoration: "none",
                  boxShadow: "0 10px 24px rgba(244,99,26,0.3)"
                }}
              >
                Começar agora
              </a>
            </div>
          </div>
        </section>

        {/* PRAZO */}
        <section style={{ ...wrap, paddingTop: "clamp(32px,4vw,48px)", paddingBottom: "clamp(56px,8vw,90px)" }}>
          <div
            className="rm-prazo-grid"
            style={{
              background: "#fff",
              border: "1px solid #E6E7EB",
              borderLeft: `4px solid ${ACCENT}`,
              borderRadius: 14,
              padding: "clamp(28px,4vw,46px)",
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr",
              gap: "clamp(28px,4vw,44px)",
              alignItems: "center"
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: DISPLAY,
                  fontWeight: 700,
                  fontSize: "clamp(24px,3vw,30px)",
                  letterSpacing: "-0.01em",
                  margin: "0 0 14px"
                }}
              >
                O prazo é o que mais derruba recurso
              </h2>
              <p style={{ fontSize: 15.5, lineHeight: 1.65, color: "#5A5F6A", margin: 0 }}>
                A maioria dos recursos é perdida não pelo mérito, mas por perder o prazo. Assim que
                receber a notificação, anote a data-limite (em regra, ao menos 30 dias) e comece a
                análise hoje.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              {["Cópia da notificação", "Documento do veículo (CRLV)", "CNH do condutor"].map((t) => (
                <div
                  key={t}
                  style={{ display: "flex", alignItems: "center", gap: 11, fontSize: 14.5, fontWeight: 500 }}
                >
                  <span style={{ color: ACCENT, fontWeight: 700 }}>✓</span> {t}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ ...wrap, maxWidth: 820, paddingBottom: "clamp(56px,8vw,90px)" }}>
          <h2
            style={{
              fontFamily: DISPLAY,
              fontWeight: 700,
              fontSize: "clamp(26px,3.2vw,34px)",
              letterSpacing: "-0.01em",
              margin: "0 0 30px"
            }}
          >
            Perguntas frequentes
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {FAQS.map((q) => (
              <details
                key={q.q}
                style={{ background: "#fff", border: "1px solid #E6E7EB", borderRadius: 12, padding: "2px 22px" }}
              >
                <summary
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    padding: "19px 0",
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#16181D"
                  }}
                >
                  {q.q}
                  <span style={{ color: ACCENT, fontSize: 22, fontWeight: 300 }}>+</span>
                </summary>
                <p style={{ fontSize: 14.5, lineHeight: 1.7, color: "#5A5F6A", margin: "0 0 19px" }}>
                  {q.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ background: "#0F1116", color: "#8A8F99", paddingTop: 52, paddingBottom: 36 }}>
          <div
            style={{
              ...wrap,
              display: "flex",
              justifyContent: "space-between",
              gap: 40,
              flexWrap: "wrap",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              paddingBottom: 36
            }}
          >
            <div style={{ maxWidth: "34ch" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 7,
                    background: ACCENT,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: DISPLAY,
                    fontWeight: 800,
                    color: "#fff"
                  }}
                >
                  A
                </div>
                <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 17, color: "#F4F5F7" }}>
                  AdvAqui
                </span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.6, margin: "0 0 12px" }}>
                Recurso de multa de trânsito on-line: análise gratuita e a peça pronta, gerada por
                IA com a fundamentação do CTB. Um serviço AdvAqui.
              </p>
              <a
                href="https://advaqui.com/criar-perfil"
                style={{ fontSize: 13, color: "#C2C7D0", textDecoration: "none" }}
              >
                É advogado? Apareça no AdvAqui →
              </a>
            </div>
            <div style={{ display: "flex", gap: 52, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: "#F4F5F7", marginBottom: 13 }}>
                  Ferramentas
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 9, fontSize: 13 }}>
                  <a href="https://advaqui.com/calculadoras" style={{ textDecoration: "none", color: "#8A8F99" }}>
                    Calculadoras
                  </a>
                  <a href="https://advaqui.com/calculadora-prazos" style={{ textDecoration: "none", color: "#8A8F99" }}>
                    Calculadora de prazos
                  </a>
                  <a href="https://advaqui.com/modelos" style={{ textDecoration: "none", color: "#8A8F99" }}>
                    Modelos de documentos
                  </a>
                  <a href="https://advaqui.com/montar-peticao" style={{ textDecoration: "none", color: "#8A8F99" }}>
                    Montar petição
                  </a>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: "#F4F5F7", marginBottom: 13 }}>
                  Conteúdo
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 9, fontSize: 13 }}>
                  <a href="https://advaqui.com/problemas-juridicos" style={{ textDecoration: "none", color: "#8A8F99" }}>
                    Problemas jurídicos
                  </a>
                  <a href="https://advaqui.com/guias" style={{ textDecoration: "none", color: "#8A8F99" }}>
                    Guias por área
                  </a>
                  <a href="https://advaqui.com/glossario" style={{ textDecoration: "none", color: "#8A8F99" }}>
                    Glossário jurídico
                  </a>
                  <a href="https://advaqui.com/jurisprudencia" style={{ textDecoration: "none", color: "#8A8F99" }}>
                    Jurisprudência STF/STJ
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div style={{ ...wrap, marginTop: 22 }}>
            <p style={{ fontSize: 11.5, lineHeight: 1.6, color: "#6B7280", margin: 0 }}>
              A AdvAqui não é escritório de advocacia e não presta consultoria jurídica. Esta é uma
              ferramenta de autosserviço: o recurso administrativo de multa não exige advogado e é
              gerado e protocolado pelo próprio interessado. Para casos que envolvam suspensão ou
              cassação da CNH, procure um advogado de sua confiança.
            </p>
          </div>
          <div
            style={{
              ...wrap,
              marginTop: 18,
              fontSize: 12,
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12
            }}
          >
            <span>© 2026 AdvAqui. Todos os direitos reservados.</span>
            <span style={{ display: "flex", gap: 18 }}>
              <a href="https://advaqui.com/termos" style={{ textDecoration: "none", color: "#8A8F99" }}>
                Termos
              </a>
              <a href="https://advaqui.com/privacidade" style={{ textDecoration: "none", color: "#8A8F99" }}>
                Privacidade
              </a>
              <a href="https://advaqui.com/aviso-legal" style={{ textDecoration: "none", color: "#8A8F99" }}>
                Aviso legal
              </a>
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
