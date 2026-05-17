"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { PLAN } from "@/lib/config";
import { formatCurrency } from "@/lib/utils/format";

const FAQS: Array<[string, string]> = [
  ["O cadastro é realmente gratuito?", "Sim. Qualquer advogado com OAB ativa pode se cadastrar sem custo. O plano gratuito garante presença no diretório da sua cidade, com nome, OAB e cidade visíveis."],
  ["O que o plano premium oferece?", `O premium coloca seu perfil no topo da página da sua cidade, com selo de destaque, dados completos visíveis (telefone, WhatsApp, endereço) e posição privilegiada. Custa ${formatCurrency(PLAN.price)} por mês, sem fidelidade.`],
  ["Como funciona o pagamento?", `O pagamento é feito via Pix. Após o cadastro, ao optar pelo premium, você recebe a chave Pix e o QR Code. A ativação é manual e ocorre em até ${PLAN.activationHours} horas após a sinalização.`],
  ["Posso cancelar a qualquer momento?", "Sim. Não há fidelidade, contrato mínimo ou multa. O plano é mensal e você pode cancelar quando quiser. Se cancelar, mantém o destaque até o fim do mês pago."],
  ["Vocês intermediam a relação advogado-cliente?", "Não. O AdvAqui é apenas um diretório. A contratação e a prestação de serviços acontecem diretamente entre o advogado e o cliente."],
  ["Como entro em contato com o suporte?", "Pelo formulário de contato no site ou pela área de suporte dentro do seu painel de advogado."],
  ["Vocês validam a OAB do advogado?", "O admin valida os cadastros manualmente, confirmando a inscrição ativa na seccional. Após validação, o perfil recebe o selo OAB verificada."],
  ["E se minha cidade não estiver listada?", "O cadastro aceita qualquer cidade brasileira. Se a sua não estiver na lista pré-cadastrada, o sistema cria a página automaticamente após a verificação do admin."],
  ["Como o cliente entra em contato comigo?", "O cliente vê seu telefone e WhatsApp diretamente no seu perfil público. O contato é feito sem intermediação do AdvAqui."],
  ["Posso ter mais de uma cidade de atuação?", "Sim. No painel do advogado você pode marcar uma cidade principal e uma cidade adicional de destaque. Profissionais com plano premium têm mais flexibilidade."]
];

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="container-narrow py-12">
      <h1 className="font-display text-4xl font-bold text-brand-ink mb-6">
        Perguntas frequentes
      </h1>
      <div className="space-y-3">
        {FAQS.map(([q, a], idx) => {
          const isOpen = open === idx;
          return (
            <div key={idx} className="rounded-2xl border border-brand-line bg-white overflow-hidden">
              <button
                onClick={() => setOpen(isOpen ? null : idx)}
                className="w-full px-5 py-4 text-left flex items-center justify-between gap-4"
                aria-expanded={isOpen}
              >
                <span className="font-semibold text-brand-ink text-base">{q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-brand-ink/50 transition-transform flex-shrink-0 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-4 text-sm text-brand-ink/80 leading-relaxed">
                  {a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
