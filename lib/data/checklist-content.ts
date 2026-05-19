/**
 * Conteúdo do checklist "Como melhorar sua presença digital jurídica".
 *
 * Usado em duas formas:
 *   • Visual — array de seções renderizadas no /checklist (com ContentGate)
 *   • Download — string plana .txt gerada pelo componente client-side
 *
 * Atualização: Maio/2026 (revisar com nova Provimento OAB anualmente).
 */

export type ChecklistItem = {
  title: string;
  description: string;
  done?: boolean; // sempre false no template — usuário preenche
};

export type ChecklistSection = {
  title: string;
  description: string;
  items: ChecklistItem[];
};

export const CHECKLIST_SECTIONS: ChecklistSection[] = [
  {
    title: "1. Foundation — antes de qualquer marketing",
    description:
      "Sem isso, tudo o resto é dinheiro queimado. Em 1-2 horas você resolve.",
    items: [
      {
        title: "Foto profissional recente",
        description:
          "Última foto: máximo 2 anos. Fundo neutro, iluminação frontal, blazer/terno, sorriso leve. Investimento R$ 200-500 retorna mais que qualquer anúncio."
      },
      {
        title: "Nome civil completo e OAB correta",
        description:
          "Use 'Dr.' e títulos no campo apropriado, nunca dentro do nome. OAB com pontos e UF: OAB/MG 123.456."
      },
      {
        title: "Endereço comercial real",
        description:
          "Escritório próprio, sala em coworking com contrato, ou endereço alugado. Nunca residencial em diretório público."
      },
      {
        title: "Telefone único que VOCÊ atende",
        description:
          "Mesmo número em todos os lugares (NAP consistency). Idealmente: número da OAB + WhatsApp Business + GBP iguais."
      }
    ]
  },
  {
    title: "2. Google Business Profile (GBP)",
    description:
      "ROI mais alto do marketing jurídico. 30 minutos pra configurar, anos de retorno.",
    items: [
      {
        title: "Conta criada em google.com/business",
        description:
          "Use e-mail Gmail dedicado profissional. Vincule depois ao seu domínio se tiver."
      },
      {
        title: "Categoria 'Escritório de advocacia' + subcategorias específicas",
        description:
          "Primária + 4-8 secundárias (Advogado de Família, Trabalhista, etc.)."
      },
      {
        title: "Horário comercial real, incluindo feriados",
        description:
          "Google penaliza horários falsos. Marque fechado quando estiver."
      },
      {
        title: "8-12 fotos: fachada, escritório, equipe (com permissão)",
        description:
          "Fotos próprias > stock photos. Atualize a cada 3-6 meses."
      },
      {
        title: "Verificação por cartão postal",
        description:
          "Solicite logo no início. Chega em 5-14 dias. Sem isso, não aparece no mapinha."
      },
      {
        title: "Primeira ronda de avaliações Google (5-10)",
        description:
          "SOMENTE de clientes em casos ENCERRADOS. Vedado oferecer brinde/desconto em troca."
      }
    ]
  },
  {
    title: "3. Diretórios verticais jurídicos",
    description:
      "Onde 60-70% do tráfego de busca local realmente vai. Pode multiplicar exposição.",
    items: [
      {
        title: "Cadastro AdvAqui (advaqui.com.br)",
        description:
          "Diretório hiperlocal, perfil grátis, premium R$ 59,90/mês com WhatsApp clicável."
      },
      {
        title: "Cadastro Jusbrasil",
        description:
          "Perfil profissional grátis. Útil pra SEO mesmo quando você não responde dúvidas."
      },
      {
        title: "Cadastro JuriCertO",
        description:
          "Diretório nacional. Cadastro grátis com perfil básico."
      },
      {
        title: "Perfil público na OAB Seccional",
        description:
          "Atualize com endereço comercial e contato — muitas pessoas pesquisam direto no site da OAB."
      }
    ]
  },
  {
    title: "4. WhatsApp Business profissional",
    description:
      "60% dos clientes desistem se a primeira resposta demora mais de 4 horas.",
    items: [
      {
        title: "Conta WhatsApp Business instalada (não a versão pessoal)",
        description:
          "Use número exclusivo profissional. Foto profissional. Descrição com nome + OAB + área."
      },
      {
        title: "Horário comercial configurado",
        description:
          "Mensagem automática fora do horário com prazo de retorno: 'Recebi sua mensagem, retorno até [hora] no próximo dia útil.'"
      },
      {
        title: "Mensagem de saudação inicial",
        description:
          "'Olá! Recebi sua mensagem. Sou Dr(a). [Nome], advogado(a) em [Cidade]. Em que posso ajudar?'"
      },
      {
        title: "Etiquetas configuradas",
        description:
          "Cliente novo, cliente ativo, parceiro, urgência. Ajuda a organizar volume."
      },
      {
        title: "Link wa.me/55[seu número] copiado e disponível",
        description:
          "Cole em todos os perfis. No AdvAqui premium isso fica clicável automaticamente."
      }
    ]
  },
  {
    title: "5. Bio profissional e perfil completo",
    description:
      "300-500 caracteres que decidem se você passa o primeiro filtro.",
    items: [
      {
        title: "Bio em 5 partes: Identidade + Atuação + Experiência + Diferencial + CTA",
        description:
          "Veja artigo 'O que colocar na bio' no /marketing-juridico para a fórmula completa com exemplos."
      },
      {
        title: "2-4 áreas de atuação (não 10)",
        description:
          "Foco vende mais que generalismo. 3 áreas conexas tipicamente convertem melhor."
      },
      {
        title: "Cidades adicionais preenchidas (se atua em mais de uma comarca)",
        description:
          "No AdvAqui você aparece nas buscas das cidades adicionais — multiplicador de exposição."
      }
    ]
  },
  {
    title: "6. Conteúdo — primeiros 30 dias",
    description:
      "Não precisa virar influenciador. Mas precisa ter ALGO indexado pelo Google.",
    items: [
      {
        title: "1 artigo no blog do seu perfil ou site (1.200-1.500 palavras)",
        description:
          "Tema: dúvida real que cliente pergunta. Exemplo: 'Como funciona a pensão alimentícia em [sua cidade]'."
      },
      {
        title: "3-5 posts no Instagram (foto + texto explicativo)",
        description:
          "Cada post responde 1 dúvida. Use hashtags geo-localizadas: #AdvogadoBeloHorizonte #DireitoFamiliaBH."
      },
      {
        title: "1 vídeo curto (Reels/TikTok) — opcional",
        description:
          "30-60s respondendo dúvida. Se grava com naturalidade, é o canal de maior crescimento orgânico."
      }
    ]
  }
];

/**
 * Converte para texto plano para download em .txt
 */
export function buildChecklistTxt(): string {
  let txt = `CHECKLIST: COMO MELHORAR SUA PRESENÇA DIGITAL JURÍDICA
Versão Maio/2026 — AdvAqui (https://advaqui.com.br/checklist)

Material gratuito para advogados que querem aplicar presença digital
sem inflar custo de marketing.

============================================================

`;
  for (const section of CHECKLIST_SECTIONS) {
    txt += `\n## ${section.title}\n${section.description}\n\n`;
    for (const item of section.items) {
      txt += `[ ] ${item.title}\n    ${item.description}\n\n`;
    }
  }
  txt += `
============================================================

Próximo passo recomendado:
- Cadastre seu perfil no AdvAqui: https://advaqui.com.br/cadastro
- Premium R$ 59,90/mês = WhatsApp clicável, selo OAB verificada,
  posição no topo da página da sua cidade.

© AdvAqui · Use livremente. Compartilhe com colegas advogados.
`;
  return txt;
}
