export const SITE = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "AdvAqui",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://advaqui.com",
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    "Pesquise advogados por cidade, área de atuação, OAB e canais de contato. Encontre perfis profissionais e fale diretamente com o advogado.",
  tagline: "Encontre advogados por cidade e área de atuação",
  // Email em lowercase — convenção universal e evita problemas em filtros
  // de email que normalizam o domínio.
  email: "contato@advaqui.com.br",
  supportEmail: "suporte@advaqui.com.br"
};

export const PIX = {
  key: process.env.PIX_KEY || "",
  receiverName: process.env.PIX_RECEIVER_NAME || "AdvAqui",
  receiverCity: process.env.PIX_RECEIVER_CITY || "JEQUITINHONHA",
  amount: Number(process.env.PIX_AMOUNT || "59.90")
};

export const PLAN = {
  price: PIX.amount,
  priceLabel: `R$ ${PIX.amount.toFixed(2).replace(".", ",")}`,
  cycleDays: 30,
  activationHours: 48
};

export const ADMIN_CREDENTIALS = {
  email: process.env.ADMIN_EMAIL || "admin@AdvAqui.com.br",
  password: process.env.ADMIN_PASSWORD || ""
};

export const FEATURES = {
  testimonialsEnabled: false,
  reviewsEnabled: false,
  whatsappButton: true,
  trialDays: 0
};
