/**
 * Marketing jurídico para advogados — 5 artigos seed (Maio/2026).
 *
 * Posiciona o AdvAqui como parceiro de crescimento dos advogados (não só
 * diretório frio). Os 5 artigos cobrem o ciclo completo de captação digital
 * pra advogado autônomo ou escritório pequeno:
 *
 *   1. Presença digital geral — por onde começar
 *   2. Buscas locais — Google Maps, GBP, citations
 *   3. Perfil jurídico profissional — o que preencher
 *   4. Bio de advogado — o que destaca (sem soar mercenário)
 *   5. Facilitar contato — WhatsApp, formulários, horário comercial
 *
 * Compartilha estrutura com lib/data/articles.ts (mesmas seções tipadas),
 * mas com `audience: "lawyer"` e CTA voltado para premium AdvAqui em vez de
 * encontrar advogado.
 */

export type MktSection =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "callout"; text: string };

export type MktArticle = {
  slug: string;
  title: string;
  excerpt: string;
  readingMinutes: number;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  authorRole: "Equipe AdvAqui" | "Convidado";
  intro: string;
  body: MktSection[];
  keyTakeaways: string[];
};

export const MARKETING_ARTICLES: MktArticle[] = [
  // 1
  {
    slug: "como-advogados-podem-melhorar-presenca-digital",
    title: "Como advogados podem melhorar sua presença digital em 2026",
    excerpt:
      "O guia prático de presença digital para advogado autônomo ou pequeno escritório: site, Google, redes sociais e diretórios — o que vale o tempo e o que não vale.",
    readingMinutes: 12,
    publishedAt: "2026-05-15",
    author: "Equipe AdvAqui",
    authorRole: "Equipe AdvAqui",
    intro:
      "Cliente jurídico em 2026 começa no Google. Mais de 75% das pessoas que contratam advogado fizeram pesquisa online antes de marcar a primeira conversa — Provimento 205/2021 da OAB autoriza explicitamente a publicidade informativa, então o jogo não é mais sobre PODE, é sobre COMO. Esse guia organiza os passos que de fato movem ponteiro pra advogado que está começando ou estagnou.",
    body: [
      { type: "h2", text: "O ranking real do que move ponteiro" },
      {
        type: "p",
        text: "Vou direto: 80% do resultado vem de 20% do esforço. Esses 20% são quatro coisas — Google Meu Negócio (Google Business Profile), perfil em diretório verticalizado (AdvAqui, Jusbrasil, JuriCertO), conteúdo informativo no site ou blog, e WhatsApp profissional ativo. O resto (Instagram, TikTok, anúncios pagos) é multiplicador, mas SÓ depois desses quatro estarem bem feitos."
      },
      { type: "h2", text: "Passo 1 — Google Meu Negócio (GBP)" },
      {
        type: "p",
        text: "É o passo de maior ROI e o mais negligenciado. Quem aparece no \"mapinha\" do Google quando alguém pesquisa \"advogado em Belo Horizonte\" tem 3-5x mais cliques que o orgânico tradicional. Setup leva 30 minutos e dura para sempre."
      },
      {
        type: "ol",
        items: [
          "Acesse google.com/business e cadastre seu escritório (ou endereço comercial)",
          "Categoria principal: \"Escritório de advocacia\" (ou subcategoria mais específica)",
          "Endereço EXATO + horário comercial + telefone + site",
          "Suba 8-12 fotos: fachada, recepção, escritório, equipe (com permissão), formação acadêmica enquadrada",
          "Solicite verificação por cartão postal — Google envia em 5-14 dias um código pra validar o endereço",
          "Depois de verificado: peça avaliações Google a clientes (em ações já encerradas, jamais durante processo)"
        ]
      },
      { type: "h2", text: "Passo 2 — Diretórios verticais" },
      {
        type: "p",
        text: "Plataforma de busca específica para serviços jurídicos. Quem procura \"advogado trabalhista em Belo Horizonte\" muitas vezes não usa Google direto — usa diretório que pré-filtra qualificação. Cadastro nessas plataformas (AdvAqui, Jusbrasil, JuriCertO) é grátis e gera leads passivos. O premium em uma delas (R$ 60-100/mês) costuma ter ROI de 3-10x para advogado em cidade pequena ou média."
      },
      {
        type: "callout",
        text: "Sinal de qualidade: cadastre-se em 2-3 diretórios bons, NÃO em 10. Diretório de baixa qualidade prejudica autoridade — Google rastreia tudo e penaliza presença em sites com má reputação."
      },
      { type: "h2", text: "Passo 3 — Site próprio ou perfil bem feito?" },
      {
        type: "p",
        text: "Pra advogado começando, perfil bem feito em diretório vertical resolve 80% da necessidade. Site próprio só vale a partir do momento em que: (a) você produz conteúdo regular (blog, vídeo, podcast); (b) tem orçamento para SEO técnico contínuo (R$ 800-2.500/mês); (c) o site vai além de cartão de visitas, com casos resolvidos, equipe expandida, etc. Site mal feito e abandonado é PIOR que não ter site — sinaliza profissional desatualizado."
      },
      { type: "h2", text: "Passo 4 — WhatsApp profissional" },
      {
        type: "p",
        text: "WhatsApp Business é grátis e separa o número do pessoal. Configure: foto profissional (selfie boa, fundo neutro), descrição (\"Dr. Fulano — Advogado Trabalhista — OAB/MG XYZ\"), horário comercial (responde em até X horas), respostas rápidas pra perguntas frequentes, link wa.me/55... pronto pra colar em qualquer canal. Não use \"Hi\", responda em pt-BR formal mas humano."
      },
      { type: "h2", text: "Conteúdo — onde começar" },
      {
        type: "p",
        text: "Conteúdo que converte cliente NÃO é jurisprudência técnica para colega — é resposta direta a dúvida prática. Bons exemplos: \"meu chefe não paga horas extras, e agora?\", \"como pedir pensão alimentícia em Belo Horizonte\", \"contrato de aluguel pode ter cláusula X?\". Cada artigo bem feito de 1.500 palavras com base legal vira ferramenta de captação por anos."
      },
      { type: "h2", text: "Redes sociais — Instagram, TikTok, LinkedIn" },
      {
        type: "ul",
        items: [
          "Instagram: foto profissional + bio direta + 2-3 posts/semana. Reels de 30-60s respondendo dúvidas dão tração",
          "TikTok: se conseguir gravar com naturalidade, é o canal de maior crescimento orgânico em 2026 para advogado autônomo",
          "LinkedIn: artigo mensal + interação em posts do nicho. Para advocacia consultiva/B2B é o canal principal",
          "Facebook: ignore (público envelheceu, alcance orgânico para advogado é ~1%)",
          "X/Twitter: nicho, só vale se você já produz conteúdo escrito ágil"
        ]
      },
      { type: "h2", text: "Anúncios pagos — quando começar" },
      {
        type: "p",
        text: "Só comece anúncios DEPOIS de ter os 4 fundamentos (GBP + diretório + WhatsApp + algum conteúdo). Anúncio em terreno mal preparado queima dinheiro. Quando estiver pronto, comece com Google Ads (search) com R$ 5-15/dia em palavras-chave como \"advogado trabalhista São Paulo\" ou \"advogado de família Belo Horizonte\" — mensure conversão e escale só o que funciona."
      },
      { type: "h2", text: "Métricas que importam" },
      {
        type: "ol",
        items: [
          "Mensagens recebidas via WhatsApp/site/diretório (volume mensal)",
          "Taxa de conversão de mensagem para primeira reunião (alvo: 40-60%)",
          "Taxa de conversão de reunião para contratação (alvo: 25-40%)",
          "Origem da consulta (perguntar a TODO cliente novo \"como me encontrou?\")",
          "Ticket médio de contratação por origem"
        ]
      },
      { type: "h2", text: "Erros mais comuns" },
      {
        type: "ul",
        items: [
          "Tentar fazer tudo ao mesmo tempo — fragmenta esforço, nada fica bom",
          "Site genérico de template, sem foto sua, sem casos, sem prova de autoridade",
          "Não responder mensagens em menos de 4 horas úteis — taxa de perda dispara",
          "Usar foto antiga, com fundo bagunçado, ou de família — perfil profissional precisa de foto profissional",
          "Falar só na terceira pessoa institucional (\"O escritório XPTO atua...\") — humanize",
          "Promessa de resultado (\"ganhe seu processo\") — vedado pela OAB e gera desconfiança"
        ]
      }
    ],
    keyTakeaways: [
      "Comece pelo GBP + diretório + WhatsApp Business — fundamentos antes de site/redes",
      "Conteúdo prático (dúvidas reais) converte mais que conteúdo técnico",
      "Pergunte a TODO cliente novo \"como me encontrou?\" — sem isso, marketing fica no escuro",
      "Anúncios pagos só depois dos fundamentos prontos"
    ]
  },

  // 2
  {
    slug: "como-aparecer-em-buscas-locais",
    title: "Como aparecer em buscas locais do Google",
    excerpt:
      "SEO local para advogado: como entrar no mapinha do Google, conseguir avaliações verdadeiras e dominar buscas geo-localizadas na sua região.",
    readingMinutes: 10,
    publishedAt: "2026-05-14",
    author: "Equipe AdvAqui",
    authorRole: "Equipe AdvAqui",
    intro:
      "Quando alguém pesquisa \"advogado trabalhista em Almenara\" no Google, o que aparece primeiro é o \"Local Pack\" — três fichas com mapa, foto, nota e botão de ligar. Estar nesse top 3 vale mais que estar em primeiro no resultado orgânico tradicional. E o caminho é diferente do SEO clássico.",
    body: [
      { type: "h2", text: "O que é o Local Pack" },
      {
        type: "p",
        text: "É o bloco de três resultados com mapa que aparece para qualquer busca com intenção local — \"advogado trabalhista em Belo Horizonte\", \"escritório de advocacia perto de mim\". Pesquisa do BrightLocal (2024) mostra que 92% dos cliques de busca local vão para o Local Pack, não para o orgânico abaixo."
      },
      { type: "h2", text: "Os três fatores que decidem ranking local" },
      {
        type: "ol",
        items: [
          "Relevância — quão bem seu GBP responde à busca (categoria correta, palavras-chave no nome/descrição)",
          "Distância — quanto mais próximo do CEP de quem pesquisa, melhor",
          "Destaque (prominence) — combinação de avaliações, frequência de atualização, citações em diretórios e backlinks"
        ]
      },
      { type: "h2", text: "Setup completo do Google Business Profile" },
      {
        type: "ol",
        items: [
          "Use o ENDEREÇO REAL do escritório — não caixa postal, não coworking sem contrato fixo",
          "Categoria principal: \"Escritório de advocacia\" — depois adicione subcategorias específicas (\"Advogado especialista em direito de família\")",
          "Nome: seu nome ou razão social — NÃO inclua \"Advogado em Belo Horizonte\" (vai contra termos do Google e pode ser denunciado)",
          "Horário: comercial real, com fechamento em feriados — Google penaliza horários falsos",
          "Telefone: o mesmo número que aparece em todos os outros lugares (NAP consistency)",
          "Site: link direto, sem redirects",
          "Fotos: 12-20 imagens (fachada, sala, equipe, conquistas profissionais enquadradas)",
          "Posts: mínimo 1 post a cada 2 semanas (Google penaliza GBP \"morto\")",
          "Categoria de serviços: liste 6-10 serviços específicos (\"Divórcio consensual\", \"Inventário extrajudicial\", \"Reclamação trabalhista\")"
        ]
      },
      { type: "h2", text: "Avaliações Google — como conseguir SEM violar ética" },
      {
        type: "p",
        text: "O Provimento 205/2021 da OAB permite que advogado solicite avaliação a CLIENTE QUE JÁ TEVE O SERVIÇO ENCERRADO. Vedado durante processo em andamento, vedado oferecer brinde/desconto em troca."
      },
      {
        type: "ul",
        items: [
          "Aguarde encerramento do caso (sentença transitada em julgado ou acordo cumprido)",
          "Envie mensagem por WhatsApp ou e-mail agradecendo a confiança e perguntando se foi positivo",
          "Se sim, envie link curto do seu GBP (use g.page/r/SEU_ID/review) e peça a avaliação",
          "Não envie em massa — personalize. 5 avaliações genuínas por mês > 50 forçadas",
          "Avaliações com texto valem mais que só estrelas — peça pra cliente contar o caso (sem dados pessoais)",
          "Responda TODAS as avaliações (positivas e negativas) — Google premia essa atividade"
        ]
      },
      { type: "h2", text: "Citações em diretórios (NAP consistency)" },
      {
        type: "p",
        text: "\"Citação\" é qualquer menção do seu Nome + Endereço + Telefone (NAP) em outro site. Quanto mais consistente (idêntica em todos os lugares), maior a confiança do Google. Diretórios que valem cadastro para advogado:"
      },
      {
        type: "ul",
        items: [
          "AdvAqui (advaqui.com.br) — diretório vertical com foco hiperlocal",
          "OAB Seccional do seu estado — perfil público gratuito",
          "Jusbrasil — perfil profissional",
          "JuriCertO — diretório nacional",
          "Yelp Brasil (ainda relevante)",
          "Apontador, Telelistas — diretórios genéricos com bom DA"
        ]
      },
      { type: "h2", text: "Conteúdo geo-localizado no site" },
      {
        type: "p",
        text: "Se você tem site próprio, crie páginas separadas pra cada cidade onde atua. Não COPIE o conteúdo — varie 70%+ do texto e cite especificidades reais (tribunal local, lei municipal, particularidades da região). Estrutura típica: /cidade/belo-horizonte/ com H1 \"Advogado de Família em Belo Horizonte\", texto único, fotos do local."
      },
      { type: "h2", text: "Avaliação negativa — como lidar" },
      {
        type: "p",
        text: "Vai acontecer. Cliente insatisfeito, contraparte que vai descontar no GBP, até concorrente desleal. Não apague (Google não permite mesmo). RESPONDA com profissionalismo: reconheça o sentimento, lembre que advogados têm sigilo (não confirme nem negue se é cliente), proponha contato direto para resolver. Resposta calma a avaliação ruim CONVERTE leitores futuros — eles veem que você se importa."
      },
      { type: "h2", text: "O fator AdvAqui no SEO local" },
      {
        type: "p",
        text: "Cada cadastro no AdvAqui gera uma página pública com seu nome, OAB, endereço, telefone e link clicável. Quando o Google indexa essa página, soma como citação NAP + backlink contextual relevante (tema jurídico). Em cidades pequenas, isso pode mover MUITO o ranking. Premium amplifica isso porque o perfil ganha endereço completo, bio, áreas de atuação detalhadas — mais sinal de relevância pro Google."
      }
    ],
    keyTakeaways: [
      "Local Pack > orgânico: 92% dos cliques de busca local vão pro mapinha",
      "Setup GBP completo + categorias certas + horário real são fundamentais",
      "Solicite avaliação só após encerramento do caso, sempre",
      "NAP consistente em 5-8 diretórios bons > 50 diretórios fracos"
    ]
  },

  // 3
  {
    slug: "como-preencher-perfil-juridico-profissional",
    title: "Como preencher um perfil jurídico profissional (que vira contratação)",
    excerpt:
      "Cada campo do seu perfil tem papel na conversão. Veja o que mais ajuda — e o que afasta cliente — campo por campo.",
    readingMinutes: 8,
    publishedAt: "2026-05-13",
    author: "Equipe AdvAqui",
    authorRole: "Equipe AdvAqui",
    intro:
      "Perfil em diretório jurídico não é currículo. É vitrine de conversão. Cada campo é uma oportunidade de gerar (ou queimar) confiança em segundos. Esse guia detalha o que preencher em cada parte, com exemplos do que funciona e do que não funciona.",
    body: [
      { type: "h2", text: "Foto de perfil — o filtro de 1 segundo" },
      {
        type: "p",
        text: "Antes de ler qualquer texto, o cliente decide se você \"parece advogado de verdade\" pela foto. Isso é injusto mas é assim. Foto profissional aumenta clique em 60-80% comparado a foto amadora (estudos Linkedin 2023). Critérios mínimos:"
      },
      {
        type: "ul",
        items: [
          "Iluminação frontal natural (janela atrás do fotógrafo, não atrás de você)",
          "Fundo neutro (parede lisa, escritório, livros ao fundo desfocados)",
          "Trajes: terno/blazer para homens; blazer/blusa profissional para mulheres",
          "Expressão: sorriso leve, NUNCA boca totalmente fechada e sério — passa hostilidade",
          "Enquadramento até o peito, olhar para a câmera",
          "Foto de 1-3 anos no máximo — fotos muito velhas geram desconfiança quando você é reconhecido"
        ]
      },
      {
        type: "callout",
        text: "Investimento R$ 200-500 em foto profissional retorna mais que qualquer R$ 500 em anúncio. É o ROI mais alto do marketing jurídico."
      },
      { type: "h2", text: "Nome — use o nome completo civil" },
      {
        type: "p",
        text: "Não invente título marketing-eiro. \"Dr. Carlos Silva — Especialista em Trabalhista\" no nome é vedado pela OAB. Use o nome civil completo. \"Dr.\" e título acadêmico vão no campo apropriado, não no nome."
      },
      { type: "h2", text: "OAB — número e seccional" },
      {
        type: "p",
        text: "Campo obrigatório. Use a numeração completa (com pontos) e a UF. Exemplo: OAB/MG 123.456. Se for inscrito em mais de uma seccional, coloque a principal (geralmente a do seu domicílio profissional)."
      },
      { type: "h2", text: "Endereço — quanto mais específico, melhor" },
      {
        type: "p",
        text: "Cliente que vai marcar reunião presencial PRECISA do endereço. Mesmo quem só atende online ganha credibilidade tendo endereço. Use endereço comercial real (escritório próprio, escritório compartilhado, sala em coworking com contrato). Não use endereço residencial."
      },
      { type: "h2", text: "Telefone — clicável e ativo" },
      {
        type: "p",
        text: "Formato (XX) XXXXX-XXXX. Em mobile, vira tel:+55... e o cliente liga direto. Use número que VOCÊ atende — não use número de secretária que não conhece sua agenda. Tempo médio de resposta importa: clientes que ligam e ouvem 4+ chamadas perdem 50% do interesse."
      },
      { type: "h2", text: "WhatsApp — diferencial no Brasil" },
      {
        type: "p",
        text: "WhatsApp Business com link wa.me/55XX... pré-formatado com mensagem (\"Olá Dr. Fulano, vi seu perfil no AdvAqui e gostaria de conversar sobre [caso]\") reduz fricção em 70%. Plano premium do AdvAqui já entrega isso pronto — o botão verde wa.me funciona sem você precisar configurar nada."
      },
      { type: "h2", text: "Áreas de atuação — foco vence amplitude" },
      {
        type: "p",
        text: "Erro comum: marcar 10 áreas pra \"não perder nenhum cliente\". Resultado: parece advogado generalista de subúrbio, sem especialização. Marque 2-4 áreas onde você de fato atua bem e tem casos resolvidos."
      },
      {
        type: "ul",
        items: [
          "Bom: \"Direito do Trabalho — Direito Previdenciário — Direito de Família\" (3 áreas conexas, plausíveis pra um profissional dominar)",
          "Ruim: \"Trabalhista, Família, Previdenciário, Criminal, Civil, Empresarial, Tributário, Imobiliário, Consumidor, Ambiental\" (não existe especialista em tudo)"
        ]
      },
      { type: "h2", text: "Bio — onde a maioria erra" },
      {
        type: "p",
        text: "Bio de 300-500 caracteres conta sua história em segundos. Estrutura que funciona: 1ª frase = quem você é + onde atua. 2ª frase = experiência principal (anos, área, tipo de caso). 3ª frase = diferencial real (atendimento humanizado, especialização técnica, fala outro idioma, atende online). 4ª frase = CTA (\"Entre em contato pelo WhatsApp\")."
      },
      {
        type: "callout",
        text: "Bio TRAVA quando soa genérica — \"atendimento humanizado, ética e dedicação\" são clichês inúteis. Substitua por algo concreto: \"Já atuei em 200+ casos de pensão alimentícia na Vara da Família de Belo Horizonte\"."
      },
      { type: "h2", text: "Cidades adicionais — atendendo região" },
      {
        type: "p",
        text: "Se você atua em mais de uma cidade (vai a comarcas vizinhas), use o campo de cidades adicionais. AdvAqui inclui você na busca daquelas cidades também, multiplicando exposição. Cuidado pra não exagerar — escritório de BH listado em 30 cidades fica suspeito. Use 3-6 cidades onde de fato atua."
      },
      { type: "h2", text: "Foto de capa / banner (se disponível)" },
      {
        type: "p",
        text: "Quando o diretório oferece foto secundária, use imagem do escritório, do edifício ou do tribunal local. Não use imagem genérica do Shutterstock (\"martelo sobre livros\") — sinaliza vagabundagem visual."
      },
      { type: "h2", text: "Checklist final" },
      {
        type: "ol",
        items: [
          "Foto profissional recente, fundo neutro, sorriso leve ✓",
          "Nome civil completo, OAB com pontos e UF ✓",
          "Endereço comercial real, telefone clicável, WhatsApp funcionando ✓",
          "2-4 áreas de atuação focadas ✓",
          "Bio de 300-500 caracteres com diferencial concreto ✓",
          "3-6 cidades adicionais (se aplicável) ✓",
          "Foto vista por 3 pessoas próximas pra feedback antes de subir ✓"
        ]
      }
    ],
    keyTakeaways: [
      "Foto profissional é o ROI mais alto do marketing jurídico",
      "Especialização em 2-4 áreas converte melhor que generalismo em 10",
      "Bio com diferencial CONCRETO (anos, comarca, tipo de caso) > clichê",
      "Endereço comercial real + WhatsApp clicável = combinação que mais converte"
    ]
  },

  // 4
  {
    slug: "o-que-colocar-na-bio-de-advogado",
    title: "O que colocar na bio de advogado — fórmula em 5 partes",
    excerpt:
      "A bio decide se o cliente sente que pode confiar. Fórmula testada para escrever bio que converte sem soar marketing-eira nem violar a OAB.",
    readingMinutes: 6,
    publishedAt: "2026-05-12",
    author: "Equipe AdvAqui",
    authorRole: "Equipe AdvAqui",
    intro:
      "Você tem 30 segundos pra convencer o leitor de que VOCÊ é o advogado certo. A bio é essa janela. Esse guia traz uma fórmula em 5 partes (Identidade → Atuação → Experiência → Diferencial → CTA) com exemplos prontos.",
    body: [
      { type: "h2", text: "Por que a bio importa tanto" },
      {
        type: "p",
        text: "Cliente jurídico médio compara 3-7 perfis antes de decidir. A bio é o filtro principal: foto + nome chama atenção, a bio sela ou queima a confiança. Bio mal escrita afasta cliente qualificado mesmo que você seja ótimo profissional."
      },
      { type: "h2", text: "A fórmula em 5 partes" },
      {
        type: "h3",
        text: "1. Identidade (1 frase, 60-100 caracteres)"
      },
      {
        type: "p",
        text: "Quem você é, onde atua. Não comece com nome — comece com profissão + cidade. Exemplo: \"Advogada trabalhista atuando em Belo Horizonte e região metropolitana.\""
      },
      {
        type: "h3",
        text: "2. Atuação (1 frase, 80-120 caracteres)"
      },
      {
        type: "p",
        text: "Tipos de caso que você resolve. Use termos que o LEIGO usa, não jurisdiquês. Exemplo: \"Atendo casos de demissão, horas extras, assédio moral e acordos trabalhistas.\" Não escreva \"reclamações trabalhistas em sentido amplo\" — escreva o problema concreto."
      },
      {
        type: "h3",
        text: "3. Experiência (1 frase, 80-130 caracteres)"
      },
      {
        type: "p",
        text: "Algo que prove qualificação SEM violar OAB. Ano de OAB, formação, anos de prática, número aproximado de casos atendidos (\"mais de 100 acordos extrajudiciais resolvidos\"). Evite \"melhor advogada\", \"sucesso garantido\" — vedado e contraproducente."
      },
      {
        type: "h3",
        text: "4. Diferencial (1 frase, 80-120 caracteres)"
      },
      {
        type: "p",
        text: "O que te diferencia REAL. Possíveis: atendimento online via vídeo, fala inglês/espanhol, horário estendido até 19h, especialização em nicho específico (servidor público, motoristas de aplicativo, mulher vítima de violência). Não invente — escolha algo verdadeiro."
      },
      {
        type: "h3",
        text: "5. CTA (1 frase, 50-100 caracteres)"
      },
      {
        type: "p",
        text: "Diga o próximo passo. Sem CTA, o cliente fica em dúvida. Exemplos: \"Fale comigo pelo WhatsApp.\" / \"Agende sua primeira consulta — orçamento gratuito.\" / \"Estou aqui para ajudar com seu caso.\""
      },
      { type: "h2", text: "Exemplos completos" },
      {
        type: "callout",
        text: "Exemplo 1 — Trabalhista BH:\n\"Advogada trabalhista atuando em Belo Horizonte e região metropolitana. Atendo casos de demissão, horas extras, assédio moral e acordos trabalhistas. Inscrita na OAB/MG desde 2014, com mais de 200 reclamações trabalhistas conduzidas. Atendimento online por vídeo ou presencial no centro de BH. Fale comigo pelo WhatsApp — primeira conversa gratuita.\""
      },
      {
        type: "callout",
        text: "Exemplo 2 — Família/Sucessões interior MG:\n\"Advogado de família e sucessões em Almenara/MG, atendendo o Vale do Jequitinhonha. Resolvo divórcios, inventários, pensão alimentícia e questões de herança. OAB/MG desde 2010, com 15+ anos atuando na comarca. Atendo presencialmente em Almenara e online para todo o Brasil. Marque sua consulta pelo (38) 9XXXX-XXXX.\""
      },
      {
        type: "callout",
        text: "Exemplo 3 — Criminalista SP:\n\"Advogado criminalista em São Paulo capital. Atuação em prisões em flagrante, audiências de custódia, tribunal do júri e crimes contra patrimônio. Pós-graduado em Direito Penal pela PUC-SP, OAB/SP há 12 anos. Atendimento de urgência 24/7 para casos com prisão. Plantão pelo WhatsApp (11) 9XXXX-XXXX.\""
      },
      { type: "h2", text: "Erros que matam a bio" },
      {
        type: "ul",
        items: [
          "Começar com nome (\"Dr. Fulano de Tal...\") — perde a 1ª frase pra info que já está no campo NOME",
          "Adjetivos vazios (\"ético\", \"dedicado\", \"comprometido\") — todos os advogados dizem isso",
          "Promessa de resultado (\"ganhe sua causa comigo\") — vedado pela OAB",
          "Jurisdiquês (\"hipossuficiência probatória\") — afasta o leigo",
          "Citar todos os clientes ilustres (mesmo permitido, soa arrogante)",
          "Mais de 500 caracteres — perde leitor mobile"
        ]
      },
      { type: "h2", text: "Conformidade OAB" },
      {
        type: "p",
        text: "Provimento 205/2021 autoriza publicidade informativa. Vedados: promessa de resultado, captação ostensiva, comparação direta com outros advogados, oferta em troca de remuneração, uso de termo \"melhor\", \"top\" e similares. Se sua bio cumpre a fórmula acima, você está dentro das regras."
      }
    ],
    keyTakeaways: [
      "Fórmula: Identidade + Atuação + Experiência + Diferencial + CTA",
      "Use linguagem que o LEIGO usa, não jurisdiquês",
      "Diferencial CONCRETO (vídeo, idioma, horário estendido) > adjetivo vazio",
      "Limite 500 caracteres, comece com profissão + cidade (não com nome)"
    ]
  },

  // 5
  {
    slug: "como-facilitar-contato-com-cliente",
    title: "Como facilitar o contato — reduzir fricção sem virar refém do WhatsApp",
    excerpt:
      "Cliente quer falar com você do jeito DELE — WhatsApp, telefone, e-mail. Veja como atender múltiplos canais sem perder o foco no trabalho.",
    readingMinutes: 7,
    publishedAt: "2026-05-11",
    author: "Equipe AdvAqui",
    authorRole: "Equipe AdvAqui",
    intro:
      "60% dos clientes desistem de um advogado se a primeira resposta demora mais de 4 horas (pesquisa Clio Legal Trends 2024). Mas ficar disponível 24/7 destrói sua sanidade e qualidade de trabalho. A solução é estruturar canais e expectativas — não estar online o tempo todo.",
    body: [
      { type: "h2", text: "Os 5 canais e quando usar cada um" },
      {
        type: "h3",
        text: "1. WhatsApp Business — primeiro contato e dúvidas curtas"
      },
      {
        type: "ul",
        items: [
          "Use número separado do pessoal (compre chip exclusivo se possível)",
          "Configure foto profissional + descrição + horário comercial automático",
          "Resposta rápida: \"Olá! Recebi sua mensagem. Estou em audiência até [hora]. Retorno até [hora].\"",
          "Use \"Etiquetas\" pra organizar (cliente novo, cliente existente, parceiro, OAB)",
          "Mensagem de ausência fora do horário: deixe claro o prazo de retorno"
        ]
      },
      {
        type: "h3",
        text: "2. Telefone — casos urgentes e idoso"
      },
      {
        type: "p",
        text: "Ainda vale, especialmente cliente acima de 60 anos. Use mesmo número do WhatsApp pra simplificar — secretária ou serviço de atendimento (R$ 200-400/mês) atende fora do seu horário."
      },
      {
        type: "h3",
        text: "3. E-mail — documentos e contratos"
      },
      {
        type: "p",
        text: "Não tente fechar contrato por WhatsApp. E-mail formal pra envio de documentos, propostas, contratos. Crie endereço @dominio.com.br (não @gmail.com, sinaliza falta de profissionalismo)."
      },
      {
        type: "h3",
        text: "4. Vídeo (Google Meet, Zoom) — primeira reunião"
      },
      {
        type: "p",
        text: "Cliente que mora longe ou tem horário restrito agradece. Use Calendly ou Cal.com (gratuito) pra permitir que cliente reserve horário sem você responder pra agendar."
      },
      {
        type: "h3",
        text: "5. Formulário no site/perfil — captação fria"
      },
      {
        type: "p",
        text: "Cliente que está pesquisando ainda não quer ligar. Formulário curto (nome + telefone + caso em 1 linha) reduz fricção. Você responde quando puder."
      },
      { type: "h2", text: "Tempo de resposta — meta realista" },
      {
        type: "p",
        text: "Não é 5 minutos. Não é 24 horas. Meta de mercado é 1-2 horas no horário comercial. Cliente que recebe resposta em 30 minutos sente prioridade — mas isso é diferenciação, não obrigação."
      },
      {
        type: "callout",
        text: "Use mensagem automática inicial pra ganhar tempo: \"Olá Maria, recebi sua mensagem e respondo até 18h. Em caso de urgência (prisão, audiência marcada para hoje), ligue para (31) 99999-9999.\" Isso compra 4-6 horas sem o cliente sentir abandono."
      },
      { type: "h2", text: "Estruturando o atendimento sem virar 24/7" },
      {
        type: "ol",
        items: [
          "Defina horário comercial (ex.: 9h-12h e 14h-18h, dias úteis)",
          "Configure mensagem automática fora do horário em WhatsApp Business",
          "Bloqueie 1-2 janelas POR DIA pra responder mensagens (ex.: 10h-10h30 e 16h-16h30) — fora disso, não abre WhatsApp",
          "Plantão real (telefone) só pra clientes em urgência verdadeira (prisão, internação, audiência iminente)",
          "Use serviço de secretária remota se volume crescer (R$ 300-700/mês resolve)"
        ]
      },
      { type: "h2", text: "Roteiro de primeira conversa" },
      {
        type: "p",
        text: "Quando alguém entra em contato pela primeira vez, ter um roteiro evita perder informação e ganha credibilidade. Roteiro em 6 perguntas:"
      },
      {
        type: "ol",
        items: [
          "Qual é a situação resumida? (1-3 frases)",
          "Quando começou? (data ou marco)",
          "Há algum prazo (audiência marcada, intimação recebida, vencimento de contrato)?",
          "Já existe processo na Justiça?",
          "Qual seu objetivo realista? (acordo, sentença, reverter situação)",
          "Como prefere conversar — vídeo, telefone, presencial?"
        ]
      },
      { type: "h2", text: "Honorário — quando e como falar" },
      {
        type: "p",
        text: "Cliente quase sempre pergunta logo. Resposta direta evita perda de tempo (sua e do cliente)."
      },
      {
        type: "ul",
        items: [
          "Para causa trabalhista com base na tabela da OAB local — dê faixa (\"entre R$ X e R$ Y, dependendo da complexidade\")",
          "Para êxito (percentual sobre o ganho) — diga claramente: \"trabalho com 20-30% sobre o que conseguirmos\"",
          "Para consultoria avulsa — \"primeira hora R$ X, hora extra R$ Y\"",
          "Nunca fale honorário ANTES de entender o caso — você precisa avaliar complexidade",
          "Vedado anunciar honorário em mídia genérica (Provimento 205/2021)"
        ]
      },
      { type: "h2", text: "Quando dizer NÃO" },
      {
        type: "p",
        text: "Nem todo cliente vale a contratação. Sinais de \"talvez não\": pergunta só sobre preço sem se importar com qualificação, quer resultado que não é juridicamente possível, foi atendido por 3 outros advogados antes (e culpa todos), pede desconto agressivo na primeira mensagem. Recusa elegante: \"Pelo que você descreve, acredito que outro colega possa ajudar melhor. Posso indicar?\""
      }
    ],
    keyTakeaways: [
      "WhatsApp Business + telefone unificado + e-mail @dominio = combinação básica",
      "Meta de resposta: 1-2h horário comercial — mensagem automática inicial compra tempo",
      "Bloqueie 1-2 janelas/dia pra mensagens — não fique 24/7 no WhatsApp",
      "Roteiro de 6 perguntas na primeira conversa evita perder informação"
    ]
  }
];

export function getAllMarketingArticles(): MktArticle[] {
  return [...MARKETING_ARTICLES].sort((a, b) =>
    (b.publishedAt || "").localeCompare(a.publishedAt || "")
  );
}

export function getMarketingArticleBySlug(slug: string): MktArticle | null {
  return MARKETING_ARTICLES.find((a) => a.slug === slug) || null;
}

export function getAllMarketingArticleSlugs(): string[] {
  return MARKETING_ARTICLES.map((a) => a.slug);
}
