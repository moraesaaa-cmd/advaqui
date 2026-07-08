/**
 * Cliente mínimo do gateway Asaas para o premium do AdvAqui.
 *
 * SOMENTE servidor (usa ASAAS_API_KEY). Fluxo: garante o cliente pelo CPF,
 * cria a cobrança PIX com externalReference = id do advogado e devolve o
 * QR Code ("copia e cola" + PNG base64). A confirmação chega pelo webhook
 * em /api/webhooks/asaas, que ativa o plano sozinho.
 */

const BASE_URL = "https://api.asaas.com/v3";

export function getAsaasApiKey(): string {
  // Chave do Asaas comeca com "$aact". Se o valor cru chegou mutilado pelo
  // shell (ex.: "\$aact..." ou truncado), cai para a variante base64.
  const direct = (process.env.ASAAS_API_KEY || "").trim();
  if (direct.startsWith("$aact")) return direct;
  const b64 = (process.env.ASAAS_API_KEY_B64 || "").trim();
  if (b64) {
    try {
      const decoded = Buffer.from(b64, "base64").toString("utf8").trim();
      if (decoded.startsWith("$aact")) return decoded;
      if (!direct && decoded) return decoded;
    } catch {
      /* base64 invalido: ignora */
    }
  }
  return direct;
}

function apiKey(): string {
  const k = getAsaasApiKey();
  if (!k) throw new Error("ASAAS_API_KEY não configurada.");
  return k;
}

type AsaasError = { errors?: Array<{ description?: string }> };

async function asaasFetch<T>(
  path: string,
  init: { method?: "GET" | "POST"; body?: unknown } = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: init.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "AdvAqui/1.0 (+asaas-premium)",
      access_token: apiKey()
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    cache: "no-store"
  });

  const text = await res.text();
  let json: unknown = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }

  if (!res.ok) {
    const desc = (json as AsaasError)?.errors
      ?.map((e) => e.description)
      .filter(Boolean)
      .join("; ");
    throw new Error(desc || `Erro na API Asaas (HTTP ${res.status}).`);
  }
  return json as T;
}

/** Status do Asaas que significam "pago" para fins de ativação do premium. */
export function pagamentoAprovado(statusAsaas: string): boolean {
  const s = (statusAsaas || "").toUpperCase();
  return s === "RECEIVED" || s === "CONFIRMED" || s === "RECEIVED_IN_CASH";
}

async function garantirCliente(nome: string, cpf: string, email: string): Promise<string> {
  const soDigitos = cpf.replace(/\D+/g, "");
  const lista = await asaasFetch<{ data?: Array<{ id: string }> }>(
    `/customers?cpfCnpj=${encodeURIComponent(soDigitos)}`
  );
  const existente = lista.data?.[0]?.id;
  if (existente) return existente;

  const criado = await asaasFetch<{ id?: string }>("/customers", {
    method: "POST",
    body: { name: nome, cpfCnpj: soDigitos, email }
  });
  if (!criado.id) throw new Error("Asaas não retornou o cliente criado.");
  return criado.id;
}

export interface CobrancaPixPremium {
  paymentId: string;
  copiaECola: string;
  qrCodeBase64: string;
}

/**
 * Cria a cobrança PIX do plano premium para um advogado.
 * `externalReference` = id do advogado — é como o webhook sabe quem ativar.
 */
export async function criarCobrancaPixPremium(params: {
  lawyerId: string;
  nome: string;
  cpf: string;
  email: string;
  valorReais: number;
  descricao: string;
}): Promise<CobrancaPixPremium> {
  const customer = await garantirCliente(params.nome, params.cpf, params.email);

  const hoje = new Date();
  hoje.setDate(hoje.getDate() + 1);
  const dueDate = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(
    hoje.getDate()
  ).padStart(2, "0")}`;

  const payment = await asaasFetch<{ id: string }>("/payments", {
    method: "POST",
    body: {
      customer,
      billingType: "PIX",
      value: Number(params.valorReais.toFixed(2)),
      description: params.descricao,
      externalReference: params.lawyerId,
      dueDate
    }
  });

  const qr = await asaasFetch<{ encodedImage: string; payload: string }>(
    `/payments/${encodeURIComponent(payment.id)}/pixQrCode`
  );

  return {
    paymentId: payment.id,
    copiaECola: qr.payload,
    qrCodeBase64: qr.encodedImage
  };
}
