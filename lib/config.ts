export const SITE = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "AdvAqui",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://AdvAqui.com.br",
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    "Encontre o advogado certo na sua cidade. Diretório verificado em todas as regiões do Brasil.",
  tagline: "Seu advogado, perto de você",
  email: "contato@AdvAqui.com.br",
  supportEmail: "suporte@AdvAqui.com.br"
};

export const PIX = {
  key: process.env.PIX_KEY || "68852fb1-adfe-4656-bb9a-63d20cd73ce1",
  receiverName: process.env.PIX_RECEIVER_NAME || "AdvAqui",
  receiverCity: process.env.PIX_RECEIVER_CITY || "JEQUITINHONHA",
  amount: Number(process.env.PIX_AMOUNT || "59.90")
};

export const PLAN = {
  price: 59.9,
  priceLabel: "R$ 59,90",
  cycleDays: 30,
  activationHours: 48
};

export const ADMIN_CREDENTIALS = {
  email: process.env.ADMIN_EMAIL || "admin@AdvAqui.com.br",
  password: process.env.ADMIN_PASSWORD || "Admin@2026"
};

export const FEATURES = {
  testimonialsEnabled: false,
  reviewsEnabled: false,
  whatsappButton: true,
  trialDays: 0
};
