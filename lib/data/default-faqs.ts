/**
 * FAQs padrão pra Página Profissional do advogado.
 *
 * Esse conjunto base aparece automaticamente em toda Página Profissional
 * premium na seção "Perguntas frequentes". O advogado pode adicionar mais
 * FAQs próprias via painel (tabela lawyer_faqs — migration 0006), que se
 * somam a essas e aparecem antes na ordem.
 *
 * Linguagem sóbria conforme Provimento OAB 205/2021. Maio/2026 — Fase 3.
 */

export type Faq = {
  question: string;
  answer: string;
};

export const DEFAULT_FAQS: Faq[] = [
  {
    question: "O contato pelo WhatsApp é uma consulta jurídica?",
    answer:
      "Não. O contato inicial pelo WhatsApp serve para apresentar a situação e combinar com o profissional o melhor formato de atendimento (presencial, online ou por outro canal). A análise jurídica detalhada acontece na consulta propriamente dita."
  },
  {
    question: "Posso enviar documentos pelo WhatsApp?",
    answer:
      "Antes da orientação individual, prefira descrever a situação em texto e só compartilhar documentos após indicação do profissional. Isso protege seus dados pessoais e evita que informações sensíveis circulem sem necessidade."
  },
  {
    question: "O atendimento pode ser online?",
    answer:
      "Depende do profissional e do tipo de demanda. Algumas áreas permitem orientação totalmente online, outras envolvem audiências ou comparecimento em órgão público. Confirme as modalidades disponíveis na seção Atendimento desta página."
  },
  {
    question: "O contato inicial implica contratação?",
    answer:
      "Não. Entrar em contato pela Página Profissional não gera vínculo contratual nem cobrança automática. Eventual contratação só ocorre depois que o profissional e o cliente acertarem expectativas e formalizarem a relação."
  },
  {
    question: "Quais informações devo enviar no primeiro contato?",
    answer:
      "Uma mensagem objetiva com seu nome, cidade, área do assunto (por exemplo, trabalhista ou família) e um breve resumo da situação já é o suficiente. Evite enviar números de documento, fotos pessoais ou comprovantes bancários antes de combinar com o profissional."
  }
];
