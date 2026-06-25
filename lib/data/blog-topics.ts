export type BlogTopic = {
  category: string;
  title: string;
  keywords: string[];
  targetAudience: string;
};

export const BLOG_TOPICS: BlogTopic[] = [
  // ============================================================
  // 1. TRABALHISTA
  // ============================================================
  {
    category: "Trabalhista",
    title: "Fui demitido sem justa causa: quais são os meus direitos?",
    keywords: ["demissão sem justa causa", "direitos demissão", "rescisão trabalhista", "verbas rescisórias"],
    targetAudience: "Trabalhadores demitidos sem justa causa que querem entender seus direitos",
  },
  {
    category: "Trabalhista",
    title: "Como calcular minha rescisão trabalhista passo a passo",
    keywords: ["cálculo rescisão", "rescisão trabalhista", "verbas rescisórias", "simulador rescisão"],
    targetAudience: "Empregados desligados que precisam conferir os valores recebidos na rescisão",
  },
  {
    category: "Trabalhista",
    title: "FGTS: como sacar, quando posso sacar e quem tem direito",
    keywords: ["saque FGTS", "FGTS direito", "como sacar FGTS", "modalidades saque FGTS"],
    targetAudience: "Trabalhadores com dúvidas sobre o saque do FGTS em diferentes situações",
  },
  {
    category: "Trabalhista",
    title: "Hora extra não paga: o que fazer e como provar",
    keywords: ["hora extra", "hora extra não paga", "prova hora extra", "direito hora extra"],
    targetAudience: "Funcionários que fazem horas extras sem receber o pagamento correto",
  },
  {
    category: "Trabalhista",
    title: "Danos morais no trabalho: quando posso processar meu empregador?",
    keywords: ["danos morais trabalho", "indenização trabalhista", "humilhação no trabalho", "processo trabalhista"],
    targetAudience: "Trabalhadores que sofreram humilhação ou constrangimento no ambiente de trabalho",
  },
  {
    category: "Trabalhista",
    title: "Acidente de trabalho: direitos, estabilidade e indenização",
    keywords: ["acidente de trabalho", "estabilidade acidente", "indenização acidente trabalho", "CAT"],
    targetAudience: "Trabalhadores que sofreram acidente no exercício da função",
  },
  {
    category: "Trabalhista",
    title: "Assédio moral no trabalho: como identificar e o que fazer",
    keywords: ["assédio moral", "assédio no trabalho", "denúncia assédio", "prova assédio moral"],
    targetAudience: "Funcionários que sofrem pressão psicológica ou humilhação recorrente no emprego",
  },
  {
    category: "Trabalhista",
    title: "Insalubridade e periculosidade: quando tenho direito ao adicional?",
    keywords: ["adicional insalubridade", "periculosidade", "laudo insalubridade", "grau insalubridade"],
    targetAudience: "Trabalhadores expostos a condições insalubres ou perigosas",
  },
  {
    category: "Trabalhista",
    title: "Demissão por justa causa: motivos, direitos e como recorrer",
    keywords: ["justa causa", "demissão justa causa", "motivos justa causa", "reverter justa causa"],
    targetAudience: "Empregados demitidos por justa causa que desejam contestar a decisão",
  },
  {
    category: "Trabalhista",
    title: "Aviso prévio: trabalhado, indenizado e proporcional — entenda as diferenças",
    keywords: ["aviso prévio", "aviso prévio indenizado", "aviso prévio proporcional", "dias aviso prévio"],
    targetAudience: "Trabalhadores em processo de desligamento com dúvidas sobre o aviso prévio",
  },
  {
    category: "Trabalhista",
    title: "Acordo trabalhista na nova lei: como funciona e quando vale a pena",
    keywords: ["acordo trabalhista", "rescisão por acordo", "demissão consensual", "reforma trabalhista acordo"],
    targetAudience: "Empregados e empregadores considerando a rescisão por acordo mútuo",
  },
  {
    category: "Trabalhista",
    title: "Carteira de trabalho digital: como acessar, baixar e consultar registros",
    keywords: ["carteira de trabalho digital", "CTPS digital", "consultar CTPS", "carteira de trabalho app"],
    targetAudience: "Trabalhadores que precisam acessar ou verificar seus registros na CTPS digital",
  },
  {
    category: "Trabalhista",
    title: "Férias vencidas: o que a empresa deve pagar e quando posso exigir",
    keywords: ["férias vencidas", "férias não pagas", "dobra de férias", "direito a férias"],
    targetAudience: "Empregados com férias em atraso que querem saber seus direitos",
  },
  {
    category: "Trabalhista",
    title: "13º salário: quem tem direito, prazos e como calcular",
    keywords: ["13º salário", "décimo terceiro", "cálculo 13º", "prazo pagamento 13º"],
    targetAudience: "Trabalhadores com dúvidas sobre o cálculo e pagamento do décimo terceiro",
  },
  {
    category: "Trabalhista",
    title: "Trabalho intermitente: como funciona, direitos e cuidados",
    keywords: ["trabalho intermitente", "contrato intermitente", "CLT intermitente", "direitos intermitente"],
    targetAudience: "Trabalhadores e empregadores que utilizam ou consideram o contrato intermitente",
  },
  {
    category: "Trabalhista",
    title: "Terceirização: direitos do trabalhador terceirizado e responsabilidade da tomadora",
    keywords: ["terceirização", "terceirizado direitos", "responsabilidade tomadora", "lei terceirização"],
    targetAudience: "Trabalhadores terceirizados que querem entender seus direitos e garantias",
  },
  {
    category: "Trabalhista",
    title: "MEI ou CLT: diferenças, vantagens e quando a pejotização é ilegal",
    keywords: ["MEI x CLT", "pejotização", "pejotização ilegal", "vínculo empregatício MEI"],
    targetAudience: "Profissionais contratados como MEI que suspeitam de vínculo empregatício disfarçado",
  },
  {
    category: "Trabalhista",
    title: "Assédio sexual no trabalho: como denunciar e quais provas são aceitas",
    keywords: ["assédio sexual trabalho", "denúncia assédio sexual", "provas assédio", "crime assédio sexual"],
    targetAudience: "Vítimas de assédio sexual no ambiente de trabalho",
  },
  {
    category: "Trabalhista",
    title: "Estabilidade no emprego: quem não pode ser demitido e por quanto tempo",
    keywords: ["estabilidade emprego", "gestante estabilidade", "CIPA estabilidade", "acidente estabilidade"],
    targetAudience: "Trabalhadores em situações de estabilidade provisória",
  },
  {
    category: "Trabalhista",
    title: "Trabalho sem carteira assinada: como provar o vínculo e receber seus direitos",
    keywords: ["trabalho sem carteira", "vínculo empregatício", "emprego informal direitos", "provar vínculo"],
    targetAudience: "Trabalhadores informais que querem reconhecer o vínculo empregatício",
  },

  // ============================================================
  // 2. FAMÍLIA
  // ============================================================
  {
    category: "Família",
    title: "Como fazer o divórcio: judicial, extrajudicial e online",
    keywords: ["divórcio", "como se divorciar", "divórcio extrajudicial", "divórcio online"],
    targetAudience: "Pessoas que desejam se divorciar e precisam entender os tipos de divórcio",
  },
  {
    category: "Família",
    title: "Pensão alimentícia: quem paga, quanto e como pedir revisão",
    keywords: ["pensão alimentícia", "valor pensão", "revisão pensão", "alimentos"],
    targetAudience: "Pais ou responsáveis que precisam pedir, pagar ou revisar pensão alimentícia",
  },
  {
    category: "Família",
    title: "Guarda compartilhada: como funciona e quando é obrigatória",
    keywords: ["guarda compartilhada", "guarda dos filhos", "guarda unilateral", "direito de guarda"],
    targetAudience: "Pais separados que precisam definir ou modificar a guarda dos filhos",
  },
  {
    category: "Família",
    title: "Inventário: prazos, custos e passo a passo para abrir",
    keywords: ["inventário", "abrir inventário", "prazo inventário", "custo inventário"],
    targetAudience: "Herdeiros que precisam iniciar o inventário após falecimento de familiar",
  },
  {
    category: "Família",
    title: "Como fazer testamento no Brasil: tipos, validade e custo",
    keywords: ["testamento", "fazer testamento", "testamento público", "testamento particular"],
    targetAudience: "Pessoas que desejam planejar a sucessão e proteger seus bens",
  },
  {
    category: "Família",
    title: "União estável: direitos, como registrar e diferença do casamento",
    keywords: ["união estável", "registrar união estável", "direitos união estável", "união estável x casamento"],
    targetAudience: "Casais em convivência que querem formalizar ou entender a união estável",
  },
  {
    category: "Família",
    title: "Alienação parental: como identificar, provar e denunciar",
    keywords: ["alienação parental", "prova alienação parental", "lei alienação parental", "denúncia alienação"],
    targetAudience: "Pais ou familiares que suspeitam de alienação parental contra a criança",
  },
  {
    category: "Família",
    title: "Adoção no Brasil: requisitos, etapas e tempo de espera",
    keywords: ["adoção", "como adotar", "processo adoção", "requisitos adoção"],
    targetAudience: "Pessoas ou casais que desejam adotar uma criança ou adolescente",
  },
  {
    category: "Família",
    title: "Interdição de pessoa idosa ou incapaz: quando e como pedir",
    keywords: ["interdição", "curatela", "interdição idoso", "incapacidade civil"],
    targetAudience: "Familiares de pessoas idosas ou com incapacidade que precisam de proteção legal",
  },
  {
    category: "Família",
    title: "Casamento no civil: documentos, custos e passo a passo",
    keywords: ["casamento civil", "documentos casamento", "custo casamento civil", "cartório casamento"],
    targetAudience: "Casais que pretendem oficializar a união pelo casamento civil",
  },
  {
    category: "Família",
    title: "Regime de bens: comunhão parcial, total e separação — qual escolher?",
    keywords: ["regime de bens", "comunhão parcial", "separação de bens", "pacto antenupcial"],
    targetAudience: "Noivos ou casais que precisam definir o regime patrimonial do casamento",
  },
  {
    category: "Família",
    title: "Direito de visita: como funciona a regulamentação de visitas aos filhos",
    keywords: ["direito de visita", "visitação filhos", "regulamentação visitas", "horário visita pai"],
    targetAudience: "Pais que não detêm a guarda e precisam garantir convivência com os filhos",
  },
  {
    category: "Família",
    title: "Alimentos avoengos: quando os avós devem pagar pensão alimentícia",
    keywords: ["alimentos avoengos", "pensão avós", "obrigação avós", "alimentos complementares"],
    targetAudience: "Famílias em que o genitor não consegue arcar com a pensão e buscam os avós",
  },
  {
    category: "Família",
    title: "Divórcio com filhos: guarda, pensão e partilha — o que muda",
    keywords: ["divórcio com filhos", "guarda filhos divórcio", "pensão divórcio", "partilha bens filhos"],
    targetAudience: "Casais com filhos que estão se separando e querem proteger as crianças",
  },
  {
    category: "Família",
    title: "Reconhecimento de paternidade: voluntário e judicial",
    keywords: ["reconhecimento paternidade", "teste DNA", "paternidade judicial", "registro pai"],
    targetAudience: "Mães ou filhos que buscam o reconhecimento legal do pai biológico",
  },
  {
    category: "Família",
    title: "Guarda unilateral: quando é concedida e como pedir",
    keywords: ["guarda unilateral", "guarda exclusiva", "perda guarda", "mudar guarda"],
    targetAudience: "Pais que precisam solicitar a guarda exclusiva em situações de risco",
  },
  {
    category: "Família",
    title: "Pensão alimentícia atrasada: como cobrar e o que acontece com o devedor",
    keywords: ["pensão atrasada", "execução alimentos", "prisão pensão", "cobrar pensão"],
    targetAudience: "Guardiões de crianças cujo alimentante está inadimplente com a pensão",
  },
  {
    category: "Família",
    title: "Medida protetiva para criança e adolescente: quando e como pedir",
    keywords: ["medida protetiva criança", "ECA proteção", "conselho tutelar", "abrigo criança"],
    targetAudience: "Familiares ou profissionais preocupados com a segurança de menores",
  },

  // ============================================================
  // 3. CONSUMIDOR
  // ============================================================
  {
    category: "Consumidor",
    title: "Nome negativado indevidamente: como resolver e pedir indenização",
    keywords: ["negativação indevida", "nome sujo indevido", "SPC Serasa indevido", "indenização negativação"],
    targetAudience: "Consumidores com nome negativado sem motivo legítimo",
  },
  {
    category: "Consumidor",
    title: "Produto com defeito: troca, reparo ou dinheiro de volta?",
    keywords: ["produto defeituoso", "troca produto", "CDC defeito", "garantia produto"],
    targetAudience: "Consumidores que compraram produto com problema e querem solução",
  },
  {
    category: "Consumidor",
    title: "Cobrança indevida: o que fazer e quando tenho direito à devolução em dobro",
    keywords: ["cobrança indevida", "devolução em dobro", "cobrado errado", "repetição indébito"],
    targetAudience: "Consumidores cobrados por valores que não devem",
  },
  {
    category: "Consumidor",
    title: "Plano de saúde negou procedimento: como recorrer e garantir a cobertura",
    keywords: ["plano de saúde negativa", "cobertura plano saúde", "ANS reclamação", "cirurgia plano saúde"],
    targetAudience: "Beneficiários de plano de saúde com cobertura negada",
  },
  {
    category: "Consumidor",
    title: "Compra online: direitos do consumidor, troca e arrependimento em 7 dias",
    keywords: ["compra online direito", "direito arrependimento", "troca compra internet", "e-commerce consumidor"],
    targetAudience: "Consumidores que compraram pela internet e querem trocar ou devolver",
  },
  {
    category: "Consumidor",
    title: "Propaganda enganosa: o que caracteriza e como denunciar",
    keywords: ["propaganda enganosa", "publicidade enganosa", "Procon denúncia", "oferta não cumprida"],
    targetAudience: "Consumidores que se sentiram enganados por publicidade falsa",
  },
  {
    category: "Consumidor",
    title: "Recall de veículo: é obrigatório fazer? E se causar prejuízo?",
    keywords: ["recall veículo", "recall obrigatório", "defeito fábrica carro", "recall prazo"],
    targetAudience: "Proprietários de veículos convocados para recall",
  },
  {
    category: "Consumidor",
    title: "Garantia legal e contratual: prazos e o que o fornecedor deve cobrir",
    keywords: ["garantia legal", "garantia contratual", "prazo garantia", "vício produto garantia"],
    targetAudience: "Consumidores que querem entender os prazos e extensão da garantia",
  },
  {
    category: "Consumidor",
    title: "Código de Defesa do Consumidor: 10 direitos que todo brasileiro precisa conhecer",
    keywords: ["CDC direitos", "código defesa consumidor", "direitos consumidor", "lei consumidor"],
    targetAudience: "Consumidores em geral que querem conhecer seus direitos básicos",
  },
  {
    category: "Consumidor",
    title: "Vício oculto do produto: o que é e qual o prazo para reclamar",
    keywords: ["vício oculto", "defeito oculto", "prazo reclamação produto", "vício redibitório"],
    targetAudience: "Consumidores que descobriram defeito no produto após o uso inicial",
  },
  {
    category: "Consumidor",
    title: "Dano moral nas relações de consumo: quando cabe indenização",
    keywords: ["dano moral consumidor", "indenização consumidor", "constrangimento consumo", "processo consumidor"],
    targetAudience: "Consumidores que sofreram constrangimento ou abuso em relação de consumo",
  },
  {
    category: "Consumidor",
    title: "Cláusula abusiva em contrato: como identificar e anular",
    keywords: ["cláusula abusiva", "contrato abusivo", "nulidade cláusula", "CDC cláusula"],
    targetAudience: "Consumidores presos em contratos com termos desequilibrados",
  },
  {
    category: "Consumidor",
    title: "Banco cobrou tarifa indevida: como pedir reembolso e reclamar",
    keywords: ["tarifa bancária indevida", "cobrança banco", "reembolso tarifa", "Bacen reclamação"],
    targetAudience: "Correntistas e clientes bancários cobrados por tarifas não contratadas",
  },
  {
    category: "Consumidor",
    title: "Atraso na entrega de produto comprado online: quais os meus direitos?",
    keywords: ["atraso entrega", "produto não entregue", "prazo entrega consumidor", "reclamar entrega"],
    targetAudience: "Consumidores prejudicados por atrasos em entregas de compras online",
  },
  {
    category: "Consumidor",
    title: "Negativação após quitação da dívida: o que fazer",
    keywords: ["negativação após pagamento", "nome sujo pago", "baixa SPC", "limpar nome após quitar"],
    targetAudience: "Consumidores que quitaram dívida mas seguem com nome restrito",
  },
  {
    category: "Consumidor",
    title: "Empréstimo consignado não autorizado: como cancelar e receber de volta",
    keywords: ["consignado não autorizado", "empréstimo fraude", "cancelar consignado", "INSS consignado"],
    targetAudience: "Aposentados e servidores vítimas de empréstimo consignado sem consentimento",
  },
  {
    category: "Consumidor",
    title: "Consumidor.gov.br: como funciona e como registrar reclamação",
    keywords: ["consumidor.gov", "reclamação online consumidor", "Procon online", "plataforma consumidor"],
    targetAudience: "Consumidores que querem resolver conflitos pela plataforma oficial do governo",
  },

  // ============================================================
  // 4. PREVIDENCIÁRIO
  // ============================================================
  {
    category: "Previdenciário",
    title: "Aposentadoria por tempo de contribuição após a Reforma: regras de transição",
    keywords: ["aposentadoria tempo contribuição", "reforma previdência", "regras transição", "INSS aposentadoria"],
    targetAudience: "Segurados do INSS próximos de se aposentar por tempo de contribuição",
  },
  {
    category: "Previdenciário",
    title: "Aposentadoria por idade: requisitos, valor e como solicitar",
    keywords: ["aposentadoria por idade", "idade mínima aposentar", "requisitos aposentadoria", "INSS idade"],
    targetAudience: "Trabalhadores que atingiram a idade mínima e querem se aposentar",
  },
  {
    category: "Previdenciário",
    title: "BPC/LOAS: quem tem direito ao benefício assistencial de um salário mínimo",
    keywords: ["BPC LOAS", "benefício assistencial", "BPC idoso", "BPC deficiente"],
    targetAudience: "Idosos e pessoas com deficiência de baixa renda que buscam o BPC",
  },
  {
    category: "Previdenciário",
    title: "Auxílio-doença (auxílio por incapacidade temporária): como pedir e o que fazer se for negado",
    keywords: ["auxílio-doença", "incapacidade temporária", "perícia INSS", "benefício negado"],
    targetAudience: "Trabalhadores afastados por doença que precisam de benefício do INSS",
  },
  {
    category: "Previdenciário",
    title: "Revisão de benefício do INSS: quando vale a pena e como solicitar",
    keywords: ["revisão benefício INSS", "revisão aposentadoria", "recálculo INSS", "valor benefício errado"],
    targetAudience: "Aposentados e pensionistas que acreditam que o benefício foi calculado errado",
  },
  {
    category: "Previdenciário",
    title: "Pensão por morte: quem tem direito, valor e como requerer",
    keywords: ["pensão por morte", "dependente INSS", "pensão cônjuge", "pensão filho"],
    targetAudience: "Dependentes de segurado falecido que precisam da pensão por morte",
  },
  {
    category: "Previdenciário",
    title: "Aposentadoria especial: atividades insalubres, requisitos e PPP",
    keywords: ["aposentadoria especial", "insalubridade aposentadoria", "PPP", "agente nocivo INSS"],
    targetAudience: "Trabalhadores expostos a agentes nocivos que buscam aposentadoria antecipada",
  },
  {
    category: "Previdenciário",
    title: "Auxílio-acidente: quem tem direito e como funciona o benefício",
    keywords: ["auxílio-acidente", "sequela acidente trabalho", "redução capacidade", "INSS auxílio-acidente"],
    targetAudience: "Segurados com sequelas permanentes de acidente que reduzem a capacidade laboral",
  },
  {
    category: "Previdenciário",
    title: "Certidão de Tempo de Contribuição (CTC): como emitir e para que serve",
    keywords: ["CTC", "certidão tempo contribuição", "averbação tempo", "regime próprio"],
    targetAudience: "Servidores e trabalhadores que precisam transferir tempo de contribuição entre regimes",
  },
  {
    category: "Previdenciário",
    title: "Salário-maternidade: quem tem direito, valor e como solicitar",
    keywords: ["salário-maternidade", "licença-maternidade INSS", "maternidade MEI", "adoção salário-maternidade"],
    targetAudience: "Gestantes, adotantes e seguradas do INSS que buscam o salário-maternidade",
  },
  {
    category: "Previdenciário",
    title: "Tempo de trabalho rural: como comprovar para aposentadoria",
    keywords: ["tempo rural INSS", "aposentadoria rural", "prova atividade rural", "segurado especial"],
    targetAudience: "Trabalhadores rurais que precisam comprovar tempo de serviço para o INSS",
  },
  {
    category: "Previdenciário",
    title: "CNIS: como consultar seu extrato previdenciário e corrigir erros",
    keywords: ["CNIS", "extrato previdenciário", "consultar CNIS", "corrigir CNIS"],
    targetAudience: "Segurados que precisam verificar ou corrigir seus dados de contribuição no INSS",
  },
  {
    category: "Previdenciário",
    title: "Aposentadoria da pessoa com deficiência: regras e requisitos especiais",
    keywords: ["aposentadoria deficiente", "LC 142/2013", "pessoa com deficiência INSS", "aposentadoria PCD"],
    targetAudience: "Pessoas com deficiência que querem se aposentar com requisitos diferenciados",
  },
  {
    category: "Previdenciário",
    title: "Benefício do INSS negado: como recorrer administrativa e judicialmente",
    keywords: ["recurso INSS", "benefício negado", "junta recursos INSS", "ação judicial INSS"],
    targetAudience: "Segurados que tiveram benefício indeferido pelo INSS",
  },
  {
    category: "Previdenciário",
    title: "Aposentadoria por invalidez: quando é concedida e quais os direitos",
    keywords: ["aposentadoria invalidez", "incapacidade permanente", "perícia invalidez", "grande invalidez"],
    targetAudience: "Segurados com incapacidade permanente para o trabalho",
  },
  {
    category: "Previdenciário",
    title: "Contribuição do INSS em atraso: como pagar e quais as consequências",
    keywords: ["INSS atrasado", "contribuição atraso", "GPS atraso", "contribuinte individual atraso"],
    targetAudience: "Autônomos e contribuintes individuais com contribuições em atraso",
  },
  {
    category: "Previdenciário",
    title: "Meu INSS: como usar o aplicativo para consultas e agendamentos",
    keywords: ["Meu INSS", "app INSS", "agendar perícia INSS", "consulta benefício INSS"],
    targetAudience: "Segurados que precisam acessar serviços do INSS de forma digital",
  },

  // ============================================================
  // 5. IMOBILIÁRIO
  // ============================================================
  {
    category: "Imobiliário",
    title: "Ação de despejo: como funciona, prazos e defesa do inquilino",
    keywords: ["ação de despejo", "despejo inquilino", "prazo despejo", "defesa despejo"],
    targetAudience: "Inquilinos ameaçados de despejo ou proprietários que precisam retomar o imóvel",
  },
  {
    category: "Imobiliário",
    title: "Contrato de aluguel: cláusulas essenciais e direitos do locatário",
    keywords: ["contrato aluguel", "locação imóvel", "direitos inquilino", "lei inquilinato"],
    targetAudience: "Inquilinos e proprietários que vão celebrar ou revisar contrato de locação",
  },
  {
    category: "Imobiliário",
    title: "Usucapião: tipos, requisitos e como dar entrada no pedido",
    keywords: ["usucapião", "usucapião extrajudicial", "requisitos usucapião", "posse prolongada"],
    targetAudience: "Possuidores de imóvel sem escritura que buscam regularização por usucapião",
  },
  {
    category: "Imobiliário",
    title: "Problemas no condomínio: barulho, inadimplência e obras irregulares",
    keywords: ["condomínio problemas", "barulho condomínio", "inadimplência condomínio", "convenção condomínio"],
    targetAudience: "Condôminos enfrentando conflitos no condomínio residencial",
  },
  {
    category: "Imobiliário",
    title: "Compra e venda de imóvel: documentos, cuidados e etapas do negócio",
    keywords: ["compra imóvel", "documentos compra imóvel", "escritura imóvel", "registro imóvel"],
    targetAudience: "Compradores ou vendedores de imóvel que querem segurança na transação",
  },
  {
    category: "Imobiliário",
    title: "Distrato imobiliário: como cancelar a compra de imóvel na planta",
    keywords: ["distrato imobiliário", "desistência imóvel planta", "rescisão compra imóvel", "lei distrato"],
    targetAudience: "Compradores que desejam desistir de imóvel adquirido na planta",
  },
  {
    category: "Imobiliário",
    title: "Posse e propriedade: diferenças e como proteger seus direitos",
    keywords: ["posse imóvel", "propriedade imóvel", "reintegração de posse", "turbação"],
    targetAudience: "Possuidores ou proprietários envolvidos em disputa sobre imóvel",
  },
  {
    category: "Imobiliário",
    title: "Escritura de imóvel: como fazer, custos e documentos necessários",
    keywords: ["escritura imóvel", "escritura pública", "custo escritura", "cartório escritura"],
    targetAudience: "Compradores de imóvel que precisam lavrar a escritura pública",
  },
  {
    category: "Imobiliário",
    title: "Registro de imóvel: por que é obrigatório e como fazer",
    keywords: ["registro imóvel", "matrícula imóvel", "cartório registro", "CRI imóvel"],
    targetAudience: "Proprietários que precisam registrar a aquisição do imóvel",
  },
  {
    category: "Imobiliário",
    title: "ITBI: quem paga, como calcular e quando há isenção",
    keywords: ["ITBI", "imposto transmissão imóvel", "cálculo ITBI", "isenção ITBI"],
    targetAudience: "Compradores de imóvel que precisam entender e pagar o ITBI",
  },
  {
    category: "Imobiliário",
    title: "Taxa de condomínio: quem paga, reajuste e o que fazer quando é abusiva",
    keywords: ["taxa condomínio", "condomínio abusivo", "reajuste condomínio", "cobrança condomínio"],
    targetAudience: "Condôminos preocupados com cobrança excessiva de taxa condominial",
  },
  {
    category: "Imobiliário",
    title: "Benfeitorias no imóvel alugado: quem paga e como ser reembolsado",
    keywords: ["benfeitorias imóvel", "reforma aluguel", "reembolso benfeitoria", "benfeitoria necessária"],
    targetAudience: "Inquilinos que fizeram melhorias no imóvel e querem ser ressarcidos",
  },
  {
    category: "Imobiliário",
    title: "Locação comercial: cláusulas específicas, renovatória e direitos do lojista",
    keywords: ["locação comercial", "aluguel ponto comercial", "renovatória locação", "fundo de comércio"],
    targetAudience: "Comerciantes e empreendedores que alugam ponto comercial",
  },
  {
    category: "Imobiliário",
    title: "Atraso na entrega do imóvel pela construtora: indenização e multa",
    keywords: ["atraso entrega imóvel", "construtora atraso", "indenização atraso obra", "multa construtora"],
    targetAudience: "Compradores de imóvel na planta prejudicados pelo atraso da construtora",
  },
  {
    category: "Imobiliário",
    title: "Financiamento imobiliário: como funciona, taxas e cuidados antes de contratar",
    keywords: ["financiamento imobiliário", "crédito imobiliário", "taxa juros imóvel", "parcela financiamento"],
    targetAudience: "Compradores de primeiro imóvel avaliando opções de financiamento",
  },
  {
    category: "Imobiliário",
    title: "Vizinho barulhento: o que a lei diz e como resolver juridicamente",
    keywords: ["barulho vizinho", "perturbação sossego", "lei silêncio", "ação vizinho barulho"],
    targetAudience: "Moradores prejudicados por barulho excessivo de vizinhos",
  },

  // ============================================================
  // 6. CRIMINAL
  // ============================================================
  {
    category: "Criminal",
    title: "Fui preso: quais são meus direitos e o que fazer primeiro",
    keywords: ["direitos preso", "prisão em flagrante", "advogado preso", "defesa criminal"],
    targetAudience: "Pessoas presas ou familiares que precisam de orientação urgente",
  },
  {
    category: "Criminal",
    title: "Fiança criminal: quem pode pagar, valor e quando é negada",
    keywords: ["fiança criminal", "pagar fiança", "valor fiança", "liberdade provisória"],
    targetAudience: "Familiares de presos que querem entender como funciona a fiança",
  },
  {
    category: "Criminal",
    title: "Habeas corpus: quando cabe, como impetrar e prazos",
    keywords: ["habeas corpus", "liberdade habeas corpus", "prisão ilegal", "HC preventivo"],
    targetAudience: "Pessoas presas ilegalmente ou sob ameaça de prisão injusta",
  },
  {
    category: "Criminal",
    title: "Audiência de custódia: o que é, como funciona e seus direitos",
    keywords: ["audiência custódia", "preso audiência custódia", "prazo audiência custódia", "juiz custódia"],
    targetAudience: "Presos em flagrante e familiares que aguardam a audiência de custódia",
  },
  {
    category: "Criminal",
    title: "Legítima defesa: quando é reconhecida e quais os limites",
    keywords: ["legítima defesa", "excesso legítima defesa", "defesa própria", "excludente ilicitude"],
    targetAudience: "Pessoas que agiram em defesa própria e enfrentam processo criminal",
  },
  {
    category: "Criminal",
    title: "Furto e roubo: diferenças, penas e quando cabe o princípio da insignificância",
    keywords: ["furto roubo diferença", "furto simples", "roubo qualificado", "princípio insignificância"],
    targetAudience: "Réus ou familiares de acusados por furto ou roubo",
  },
  {
    category: "Criminal",
    title: "Tráfico de drogas: penas, defesa e quando é reclassificado para uso pessoal",
    keywords: ["tráfico drogas", "uso pessoal drogas", "pena tráfico", "lei drogas"],
    targetAudience: "Acusados de tráfico ou familiares que buscam reclassificação para uso",
  },
  {
    category: "Criminal",
    title: "Violência doméstica: medidas protetivas e como denunciar",
    keywords: ["violência doméstica", "denúncia violência", "medida protetiva", "agressão doméstica"],
    targetAudience: "Vítimas de violência doméstica que precisam de proteção legal",
  },
  {
    category: "Criminal",
    title: "Lei Maria da Penha: proteção integral à mulher vítima de violência",
    keywords: ["Lei Maria da Penha", "proteção mulher", "violência contra mulher", "medida protetiva mulher"],
    targetAudience: "Mulheres vítimas de violência que precisam conhecer seus direitos",
  },
  {
    category: "Criminal",
    title: "Medida protetiva de urgência: como pedir, prazo e descumprimento",
    keywords: ["medida protetiva", "medida protetiva urgência", "descumprir medida protetiva", "delegacia mulher"],
    targetAudience: "Vítimas de violência que precisam de proteção judicial imediata",
  },
  {
    category: "Criminal",
    title: "Porte e posse de arma de fogo: o que é legal e o que é crime",
    keywords: ["porte de arma", "posse de arma", "arma ilegal", "estatuto desarmamento"],
    targetAudience: "Cidadãos com dúvidas sobre a legalidade de possuir ou portar arma de fogo",
  },
  {
    category: "Criminal",
    title: "Crimes cibernéticos: tipos, como denunciar e o que a lei prevê",
    keywords: ["crimes cibernéticos", "crime internet", "golpe online", "delegacia cibernética"],
    targetAudience: "Vítimas de golpes ou crimes praticados pela internet",
  },
  {
    category: "Criminal",
    title: "Antecedentes criminais: como consultar, limpar e quando prescrevem",
    keywords: ["antecedentes criminais", "certidão antecedentes", "reabilitação criminal", "folha penal"],
    targetAudience: "Pessoas com antecedentes que precisam de certidão ou reabilitação",
  },
  {
    category: "Criminal",
    title: "Acordo de não persecução penal (ANPP): quando é oferecido e como funciona",
    keywords: ["ANPP", "acordo não persecução", "Ministério Público acordo", "pena alternativa"],
    targetAudience: "Réus primários em crimes sem violência que podem ser beneficiados pelo ANPP",
  },
  {
    category: "Criminal",
    title: "Calúnia, difamação e injúria: diferenças e como processar",
    keywords: ["calúnia", "difamação", "injúria", "crimes contra honra"],
    targetAudience: "Vítimas de ofensas à honra que desejam responsabilizar o agressor",
  },
  {
    category: "Criminal",
    title: "Suspensão condicional do processo (sursis processual): requisitos e benefícios",
    keywords: ["sursis processual", "suspensão condicional processo", "art. 89 Lei 9099", "benefício réu primário"],
    targetAudience: "Réus primários acusados de crimes de menor potencial ofensivo",
  },
  {
    category: "Criminal",
    title: "Estelionato e golpes financeiros: como se proteger e denunciar",
    keywords: ["estelionato", "golpe financeiro", "fraude", "denúncia estelionato"],
    targetAudience: "Vítimas de golpes financeiros que precisam registrar ocorrência e buscar reparação",
  },

  // ============================================================
  // 7. TRÂNSITO
  // ============================================================
  {
    category: "Trânsito",
    title: "Recebi uma multa de trânsito: como recorrer passo a passo",
    keywords: ["recurso multa trânsito", "como recorrer multa", "defesa prévia multa", "recurso JARI"],
    targetAudience: "Motoristas que receberam multa e querem contestar",
  },
  {
    category: "Trânsito",
    title: "Recurso de multa de trânsito: modelos, prazos e onde protocolar",
    keywords: ["modelo recurso multa", "prazo recurso multa", "JARI recurso", "CETRAN recurso"],
    targetAudience: "Condutores que precisam de orientação para elaborar recurso de multa",
  },
  {
    category: "Trânsito",
    title: "Suspensão da CNH: motivos, como evitar e como recuperar",
    keywords: ["suspensão CNH", "perder carteira", "pontos CNH", "cassação habilitação"],
    targetAudience: "Motoristas em risco de perder ou que já perderam o direito de dirigir",
  },
  {
    category: "Trânsito",
    title: "Seguro DPVAT: como dar entrada, valores e quem tem direito",
    keywords: ["DPVAT", "seguro obrigatório", "indenização DPVAT", "acidente trânsito seguro"],
    targetAudience: "Vítimas de acidente de trânsito que precisam acionar o seguro obrigatório",
  },
  {
    category: "Trânsito",
    title: "Acidente de trânsito: quem tem culpa, como registrar e direito à indenização",
    keywords: ["acidente trânsito", "culpa acidente", "boletim ocorrência acidente", "indenização acidente"],
    targetAudience: "Envolvidos em acidente de trânsito que precisam de orientação jurídica",
  },
  {
    category: "Trânsito",
    title: "Embriaguez ao volante: multa, suspensão da CNH e crime de trânsito",
    keywords: ["embriaguez volante", "Lei Seca", "bafômetro", "crime trânsito álcool"],
    targetAudience: "Motoristas flagrados ou acusados de dirigir sob efeito de álcool",
  },
  {
    category: "Trânsito",
    title: "Primeira habilitação (CNH): etapas, custos e dicas para aprovação",
    keywords: ["primeira habilitação", "tirar CNH", "autoescola", "prova Detran"],
    targetAudience: "Jovens e adultos que vão tirar a primeira carteira de motorista",
  },
  {
    category: "Trânsito",
    title: "JARI e CETRAN: como funcionam os órgãos de recurso de multa",
    keywords: ["JARI", "CETRAN", "órgão recurso multa", "segunda instância multa"],
    targetAudience: "Motoristas que precisam recorrer em segunda instância contra multas",
  },
  {
    category: "Trânsito",
    title: "Sistema de pontos na CNH: como funciona e quando a carteira é suspensa",
    keywords: ["pontos CNH", "limite pontos carteira", "40 pontos CNH", "consultar pontos"],
    targetAudience: "Motoristas preocupados com a pontuação acumulada na habilitação",
  },
  {
    category: "Trânsito",
    title: "Transferência de veículo: documentos, taxas e prazos obrigatórios",
    keywords: ["transferência veículo", "transferir carro", "documentos transferência", "DETRAN transferência"],
    targetAudience: "Compradores e vendedores de veículos usados",
  },
  {
    category: "Trânsito",
    title: "Multa por farol apagado: quando é válida e como recorrer",
    keywords: ["multa farol apagado", "farol rodovia", "recurso farol", "CTB farol"],
    targetAudience: "Motoristas multados por trafegar com farol desligado",
  },
  {
    category: "Trânsito",
    title: "Multa por estacionar em local proibido: valores e como contestar",
    keywords: ["multa estacionamento", "estacionar proibido", "guincho Detran", "recurso estacionamento"],
    targetAudience: "Condutores multados por estacionar em locais irregulares",
  },
  {
    category: "Trânsito",
    title: "CNH vencida: multa, prazos de renovação e o que fazer",
    keywords: ["CNH vencida", "renovar CNH", "dirigir carteira vencida", "multa CNH vencida"],
    targetAudience: "Motoristas com habilitação vencida que precisam regularizar a situação",
  },
  {
    category: "Trânsito",
    title: "Recurso de multa por excesso de velocidade: argumentos e modelos",
    keywords: ["multa velocidade", "radar multa", "excesso velocidade recurso", "aferição radar"],
    targetAudience: "Motoristas multados por excesso de velocidade que querem recorrer",
  },
  {
    category: "Trânsito",
    title: "Indicação de condutor: como fazer, prazo e o que acontece se não indicar",
    keywords: ["indicação condutor", "indicar condutor multa", "NIC multa", "prazo indicar condutor"],
    targetAudience: "Proprietários de veículos que precisam indicar quem estava dirigindo no momento da infração",
  },

  // ============================================================
  // 8. TRIBUTÁRIO
  // ============================================================
  {
    category: "Tributário",
    title: "IPTU: como calcular, quando há isenção e como contestar o valor",
    keywords: ["IPTU", "isenção IPTU", "contestar IPTU", "cálculo IPTU"],
    targetAudience: "Proprietários de imóvel que querem entender ou contestar o IPTU",
  },
  {
    category: "Tributário",
    title: "ITBI na compra de imóvel: quem paga, base de cálculo e isenções",
    keywords: ["ITBI imposto", "ITBI compra imóvel", "base cálculo ITBI", "isenção ITBI primeiro imóvel"],
    targetAudience: "Compradores de imóvel que precisam entender o imposto de transmissão",
  },
  {
    category: "Tributário",
    title: "Isenção tributária: quem tem direito e como solicitar",
    keywords: ["isenção tributária", "isenção imposto renda", "isenção IPVA", "doença grave isenção"],
    targetAudience: "Contribuintes que podem ter direito à isenção de impostos",
  },
  {
    category: "Tributário",
    title: "Execução fiscal: o que é, como se defender e o que pode ser penhorado",
    keywords: ["execução fiscal", "dívida governo", "penhora execução fiscal", "defesa execução fiscal"],
    targetAudience: "Contribuintes cobrados judicialmente por dívidas tributárias",
  },
  {
    category: "Tributário",
    title: "ICMS: o que é, quem paga e principais polêmicas",
    keywords: ["ICMS", "imposto ICMS", "ICMS mercadorias", "ICMS conta de luz"],
    targetAudience: "Empresários e consumidores que querem entender o ICMS e seus impactos",
  },
  {
    category: "Tributário",
    title: "ISS: qual o fato gerador, alíquotas e obrigações do prestador de serviço",
    keywords: ["ISS imposto", "ISS prestação serviço", "alíquota ISS", "ISS município"],
    targetAudience: "Prestadores de serviço e empresas que recolhem ISS",
  },
  {
    category: "Tributário",
    title: "Simples Nacional: como funciona, limites de faturamento e exclusão",
    keywords: ["Simples Nacional", "regime tributário Simples", "limite Simples Nacional", "exclusão Simples"],
    targetAudience: "Micro e pequenas empresas enquadradas ou que desejam aderir ao Simples",
  },
  {
    category: "Tributário",
    title: "MEI e impostos: quanto paga, como emitir DAS e obrigações fiscais",
    keywords: ["MEI imposto", "DAS MEI", "obrigações MEI", "DASN SIMEI"],
    targetAudience: "Microempreendedores individuais com dúvidas sobre tributos e obrigações",
  },
  {
    category: "Tributário",
    title: "Imposto de Renda Pessoa Física: quem declara, deduções e malha fina",
    keywords: ["imposto de renda", "declaração IR", "malha fina", "deduções IR"],
    targetAudience: "Contribuintes pessoa física que precisam declarar ou corrigir o IR",
  },
  {
    category: "Tributário",
    title: "Dívida ativa: o que é, consequências e como regularizar",
    keywords: ["dívida ativa", "inscrição dívida ativa", "negociar dívida ativa", "certidão negativa"],
    targetAudience: "Contribuintes inscritos em dívida ativa que buscam regularização",
  },
  {
    category: "Tributário",
    title: "Restituição de tributo pago a maior: como pedir de volta",
    keywords: ["restituição tributo", "tributo pago a maior", "repetição indébito tributário", "pedido restituição"],
    targetAudience: "Contribuintes que pagaram imposto em valor superior ao devido",
  },
  {
    category: "Tributário",
    title: "IPVA: cálculo, isenções e como parcelar o pagamento",
    keywords: ["IPVA", "isenção IPVA", "parcelar IPVA", "IPVA atrasado"],
    targetAudience: "Proprietários de veículos com dúvidas sobre o IPVA",
  },
  {
    category: "Tributário",
    title: "Planejamento tributário: como reduzir legalmente a carga de impostos",
    keywords: ["planejamento tributário", "elisão fiscal", "reduzir impostos", "regime tributário"],
    targetAudience: "Empresários e profissionais que buscam economia fiscal dentro da legalidade",
  },
  {
    category: "Tributário",
    title: "Parcelamento de dívidas tributárias: Refis, Programa Litígio Zero e opções",
    keywords: ["parcelamento tributário", "Refis", "Litígio Zero", "negociação dívida fiscal"],
    targetAudience: "Contribuintes com débitos fiscais que buscam condições de parcelamento",
  },
  {
    category: "Tributário",
    title: "Nota fiscal: obrigatoriedade, tipos e o que acontece se não emitir",
    keywords: ["nota fiscal obrigatória", "sonegação fiscal", "NF-e", "emitir nota fiscal"],
    targetAudience: "Empreendedores e prestadores de serviço com dúvidas sobre emissão de nota",
  },

  // ============================================================
  // 9. ADMINISTRATIVO
  // ============================================================
  {
    category: "Administrativo",
    title: "Concurso público: direitos do candidato aprovado e prazo de validade",
    keywords: ["concurso público", "nomeação concurso", "prazo validade concurso", "direito candidato aprovado"],
    targetAudience: "Candidatos aprovados em concurso público aguardando nomeação",
  },
  {
    category: "Administrativo",
    title: "Servidor público: estabilidade, direitos e deveres",
    keywords: ["servidor público", "estabilidade servidor", "direitos servidor", "regime estatutário"],
    targetAudience: "Servidores públicos com dúvidas sobre seus direitos e deveres funcionais",
  },
  {
    category: "Administrativo",
    title: "Licitação: modalidades, como participar e irregularidades comuns",
    keywords: ["licitação", "modalidades licitação", "pregão eletrônico", "fraude licitação"],
    targetAudience: "Empresários que desejam participar de licitações ou denunciar irregularidades",
  },
  {
    category: "Administrativo",
    title: "PAD (Processo Administrativo Disciplinar): fases, defesa e consequências",
    keywords: ["PAD", "processo administrativo disciplinar", "defesa PAD", "sindicância"],
    targetAudience: "Servidores públicos respondendo a processo disciplinar",
  },
  {
    category: "Administrativo",
    title: "Improbidade administrativa: o que é, penalidades e como denunciar",
    keywords: ["improbidade administrativa", "enriquecimento ilícito", "LIA", "denúncia improbidade"],
    targetAudience: "Cidadãos que querem denunciar atos de improbidade de agentes públicos",
  },
  {
    category: "Administrativo",
    title: "Mandado de segurança: quando cabe, prazo e como impetrar",
    keywords: ["mandado de segurança", "direito líquido e certo", "MS prazo", "ato abusivo autoridade"],
    targetAudience: "Cidadãos cujos direitos foram violados por ato ilegal de autoridade pública",
  },
  {
    category: "Administrativo",
    title: "Desapropriação: como funciona, indenização e como contestar",
    keywords: ["desapropriação", "indenização desapropriação", "utilidade pública", "contestar desapropriação"],
    targetAudience: "Proprietários de imóvel ameaçados ou em processo de desapropriação",
  },
  {
    category: "Administrativo",
    title: "Direito de petição: como protocolar requerimento ao poder público",
    keywords: ["direito de petição", "requerimento administrativo", "protocolo órgão público", "resposta administração"],
    targetAudience: "Cidadãos que precisam solicitar informações ou providências ao governo",
  },
  {
    category: "Administrativo",
    title: "Lei de Acesso à Informação: como pedir dados ao governo",
    keywords: ["Lei Acesso Informação", "LAI", "transparência pública", "pedido informação"],
    targetAudience: "Cidadãos, jornalistas e pesquisadores que buscam dados públicos",
  },
  {
    category: "Administrativo",
    title: "Concurso público anulado: quando é possível e direitos do candidato",
    keywords: ["anulação concurso", "questão anulada concurso", "recurso concurso", "mandado segurança concurso"],
    targetAudience: "Candidatos prejudicados por irregularidades em concurso público",
  },
  {
    category: "Administrativo",
    title: "Servidor público e acumulação de cargos: quando é permitido",
    keywords: ["acumulação cargos", "dois cargos públicos", "compatibilidade horários", "acúmulo servidor"],
    targetAudience: "Servidores que exercem ou desejam exercer mais de um cargo público",
  },
  {
    category: "Administrativo",
    title: "Responsabilidade civil do Estado: quando o governo deve indenizar o cidadão",
    keywords: ["responsabilidade Estado", "indenização governo", "dano Estado", "ação contra governo"],
    targetAudience: "Cidadãos que sofreram prejuízo causado por ação ou omissão do poder público",
  },
  {
    category: "Administrativo",
    title: "Multa administrativa: como recorrer e anular penalidades do poder público",
    keywords: ["multa administrativa", "recurso administrativo", "auto infração", "anular multa"],
    targetAudience: "Pessoas e empresas multadas por órgãos públicos que desejam recorrer",
  },
  {
    category: "Administrativo",
    title: "Aposentadoria do servidor público: regras atuais e direitos adquiridos",
    keywords: ["aposentadoria servidor público", "RPPS", "paridade integralidade", "regras transição servidor"],
    targetAudience: "Servidores públicos que desejam se aposentar ou entender as novas regras",
  },
  {
    category: "Administrativo",
    title: "Pregão eletrônico: como participar e evitar a desclassificação",
    keywords: ["pregão eletrônico", "como participar pregão", "habilitação licitação", "recurso pregão"],
    targetAudience: "Empresas que querem fornecer para o governo por meio de pregão eletrônico",
  },

  // ============================================================
  // 10. DIGITAL / LGPD
  // ============================================================
  {
    category: "Digital/LGPD",
    title: "Vazamento de dados pessoais: o que fazer e como pedir indenização",
    keywords: ["vazamento dados", "LGPD indenização", "dados pessoais vazados", "notificação vazamento"],
    targetAudience: "Pessoas que tiveram dados pessoais expostos em vazamentos",
  },
  {
    category: "Digital/LGPD",
    title: "Direito ao esquecimento na internet: como remover informações pessoais",
    keywords: ["direito ao esquecimento", "remover nome Google", "desindexação", "apagar dados internet"],
    targetAudience: "Pessoas que querem remover informações pessoais de sites e buscadores",
  },
  {
    category: "Digital/LGPD",
    title: "Crimes digitais: tipos mais comuns e como registrar boletim de ocorrência",
    keywords: ["crimes digitais", "crime internet", "BO online", "delegacia virtual"],
    targetAudience: "Vítimas de crimes praticados por meios digitais",
  },
  {
    category: "Digital/LGPD",
    title: "LGPD para empresas: o que é preciso fazer para se adequar",
    keywords: ["LGPD empresa", "adequação LGPD", "DPO encarregado", "multa LGPD"],
    targetAudience: "Empresários e gestores que precisam adequar seus negócios à LGPD",
  },
  {
    category: "Digital/LGPD",
    title: "Cyberbullying: o que é, como denunciar e consequências legais",
    keywords: ["cyberbullying", "bullying internet", "denúncia cyberbullying", "lei bullying"],
    targetAudience: "Pais, professores e vítimas de intimidação e assédio online",
  },
  {
    category: "Digital/LGPD",
    title: "Pornografia de vingança (revenge porn): crime, pena e como denunciar",
    keywords: ["revenge porn", "pornografia vingança", "divulgação íntima", "crime imagem íntima"],
    targetAudience: "Vítimas de divulgação não autorizada de imagens íntimas",
  },
  {
    category: "Digital/LGPD",
    title: "Proteção de dados pessoais: seus direitos como titular na LGPD",
    keywords: ["proteção dados pessoais", "direitos titular LGPD", "consentimento dados", "ANPD"],
    targetAudience: "Consumidores e cidadãos que querem conhecer seus direitos sobre dados pessoais",
  },
  {
    category: "Digital/LGPD",
    title: "Fake news e desinformação: responsabilidade legal e como combater",
    keywords: ["fake news", "desinformação", "notícia falsa crime", "responsabilidade fake news"],
    targetAudience: "Vítimas de notícias falsas ou cidadãos que querem entender a legislação",
  },
  {
    category: "Digital/LGPD",
    title: "E-commerce e direito digital: obrigações legais da loja virtual",
    keywords: ["e-commerce legal", "loja virtual obrigações", "CDC e-commerce", "política privacidade"],
    targetAudience: "Donos de lojas virtuais que precisam estar em conformidade legal",
  },
  {
    category: "Digital/LGPD",
    title: "Golpe do Pix: o que fazer, como recuperar o dinheiro e denunciar",
    keywords: ["golpe Pix", "fraude Pix", "MED Pix", "recuperar Pix golpe"],
    targetAudience: "Vítimas de fraude envolvendo transferências por Pix",
  },
  {
    category: "Digital/LGPD",
    title: "Perfil falso nas redes sociais: como denunciar e responsabilizar o autor",
    keywords: ["perfil falso", "fake redes sociais", "denunciar perfil falso", "identidade falsa internet"],
    targetAudience: "Vítimas de criação de perfis falsos em seu nome nas redes sociais",
  },
  {
    category: "Digital/LGPD",
    title: "Compras em sites internacionais: tributação, direitos e como reclamar",
    keywords: ["compra site internacional", "importação produto", "taxa importação", "reclamar compra exterior"],
    targetAudience: "Consumidores que compram em sites estrangeiros e enfrentam problemas",
  },
  {
    category: "Digital/LGPD",
    title: "Assinatura digital e eletrônica: validade jurídica e como usar",
    keywords: ["assinatura digital", "assinatura eletrônica", "ICP-Brasil", "validade jurídica assinatura"],
    targetAudience: "Profissionais e empresas que usam ou desejam usar assinaturas digitais",
  },
  {
    category: "Digital/LGPD",
    title: "Direito de imagem na internet: quando a publicação de fotos é ilegal",
    keywords: ["direito imagem", "foto sem autorização", "uso indevido imagem", "indenização imagem"],
    targetAudience: "Pessoas que tiveram imagens publicadas sem consentimento",
  },
  {
    category: "Digital/LGPD",
    title: "Contrato digital: validade jurídica do aceite por clique e termos de uso",
    keywords: ["contrato digital", "aceite clique", "termos de uso", "contrato eletrônico validade"],
    targetAudience: "Empresas e consumidores com dúvidas sobre contratos firmados online",
  },

  // ============================================================
  // 11. CONTRATUAL
  // ============================================================
  {
    category: "Contratual",
    title: "Contrato de prestação de serviço: cláusulas obrigatórias e cuidados",
    keywords: ["contrato prestação serviço", "cláusulas contrato", "modelo contrato serviço", "contrato autônomo"],
    targetAudience: "Prestadores e tomadores de serviço que precisam formalizar a relação",
  },
  {
    category: "Contratual",
    title: "Distrato de contrato: como rescindir e quais os custos",
    keywords: ["distrato contrato", "rescisão contratual", "multa distrato", "desfazer contrato"],
    targetAudience: "Partes contratantes que desejam encerrar um contrato antes do prazo",
  },
  {
    category: "Contratual",
    title: "Cláusula abusiva em contrato: como identificar e pedir a nulidade",
    keywords: ["cláusula abusiva contrato", "contrato leonino", "nulidade cláusula", "desequilíbrio contratual"],
    targetAudience: "Pessoas presas em contratos com termos injustos ou ilegais",
  },
  {
    category: "Contratual",
    title: "Rescisão contratual por descumprimento: direitos e como agir",
    keywords: ["rescisão contratual", "inadimplemento contrato", "quebra contrato", "resolução contrato"],
    targetAudience: "Contratantes prejudicados pelo descumprimento da outra parte",
  },
  {
    category: "Contratual",
    title: "Inadimplemento contratual: quando posso cobrar perdas e danos",
    keywords: ["inadimplemento", "perdas e danos", "mora contratual", "notificação extrajudicial"],
    targetAudience: "Partes lesadas por descumprimento de obrigações contratuais",
  },
  {
    category: "Contratual",
    title: "Multa contratual: limites legais e quando pode ser reduzida pelo juiz",
    keywords: ["multa contratual", "cláusula penal", "redução multa", "limite multa contrato"],
    targetAudience: "Pessoas cobradas por multas contratuais que consideram abusivas",
  },
  {
    category: "Contratual",
    title: "Fiança em contrato de aluguel: obrigações do fiador e como se liberar",
    keywords: ["fiança contratual", "fiador aluguel", "exoneração fiador", "obrigação fiador"],
    targetAudience: "Fiadores que querem entender ou encerrar sua responsabilidade",
  },
  {
    category: "Contratual",
    title: "Contrato verbal: tem validade? Quando posso exigir cumprimento?",
    keywords: ["contrato verbal", "acordo verbal validade", "prova contrato verbal", "compromisso oral"],
    targetAudience: "Pessoas que fizeram acordos de boca e precisam exigir cumprimento",
  },
  {
    category: "Contratual",
    title: "Notificação extrajudicial: quando enviar e como redigir",
    keywords: ["notificação extrajudicial", "carta notificação", "cartório notificação", "cobrança extrajudicial"],
    targetAudience: "Credores ou contratantes que precisam notificar formalmente a outra parte",
  },
  {
    category: "Contratual",
    title: "Contrato de compra e venda: o que não pode faltar e riscos comuns",
    keywords: ["contrato compra venda", "compromisso compra venda", "contrato particular", "arras sinal"],
    targetAudience: "Compradores e vendedores que querem segurança jurídica na transação",
  },
  {
    category: "Contratual",
    title: "Revisão contratual: quando é possível pedir ao juiz para alterar o contrato",
    keywords: ["revisão contratual", "teoria imprevisão", "onerosidade excessiva", "reequilíbrio contrato"],
    targetAudience: "Contratantes em situação de desequilíbrio contratual por fato superveniente",
  },
  {
    category: "Contratual",
    title: "Contrato de franquia: obrigações, riscos e o que a lei exige",
    keywords: ["contrato franquia", "franquia lei", "COF franquia", "franqueado direitos"],
    targetAudience: "Empreendedores interessados em adquirir ou operar uma franquia",
  },
  {
    category: "Contratual",
    title: "Contrato de parceria: como formalizar sociedade informal sem constituir empresa",
    keywords: ["contrato parceria", "sociedade informal", "parceria negócio", "conta de participação"],
    targetAudience: "Empreendedores que querem formalizar parcerias sem criar empresa",
  },
  {
    category: "Contratual",
    title: "Cláusula de não concorrência: quando é válida e quais os limites",
    keywords: ["não concorrência", "cláusula non compete", "concorrência desleal", "quarentena contratual"],
    targetAudience: "Profissionais submetidos a cláusula de não concorrência em contratos de trabalho ou sociedade",
  },
  {
    category: "Contratual",
    title: "Contrato de empreitada: obrigações, prazos e o que fazer quando a obra atrasa",
    keywords: ["contrato empreitada", "obra atrasada", "empreiteiro obrigação", "rescisão empreitada"],
    targetAudience: "Proprietários que contrataram obra e enfrentam atrasos ou defeitos",
  },

  // ============================================================
  // 12. SUCESSÕES
  // ============================================================
  {
    category: "Sucessões",
    title: "Herança: quem tem direito e como funciona a ordem de vocação hereditária",
    keywords: ["herança", "direito herança", "vocação hereditária", "herdeiros legítimos"],
    targetAudience: "Familiares de pessoa falecida que querem saber se têm direito à herança",
  },
  {
    category: "Sucessões",
    title: "Inventário extrajudicial: quando é possível, custos e passo a passo",
    keywords: ["inventário extrajudicial", "inventário cartório", "custo inventário extrajudicial", "escritura inventário"],
    targetAudience: "Herdeiros maiores e concordes que desejam fazer o inventário de forma simplificada",
  },
  {
    category: "Sucessões",
    title: "Testamento: tipos, validade e como revogar",
    keywords: ["testamento tipos", "testamento válido", "revogar testamento", "testamento cerrado"],
    targetAudience: "Pessoas que desejam elaborar, alterar ou revogar um testamento",
  },
  {
    category: "Sucessões",
    title: "Partilha de bens: amigável e judicial — quando usar cada uma",
    keywords: ["partilha bens", "partilha amigável", "partilha judicial", "divisão herança"],
    targetAudience: "Herdeiros que precisam dividir os bens do espólio",
  },
  {
    category: "Sucessões",
    title: "Herdeiros necessários: quem são e qual a parte que não pode ser excluída",
    keywords: ["herdeiros necessários", "legítima herança", "metade disponível", "exclusão herdeiro"],
    targetAudience: "Herdeiros ou testadores que querem entender a parte obrigatória da herança",
  },
  {
    category: "Sucessões",
    title: "Renúncia de herança: como fazer e quais as consequências",
    keywords: ["renúncia herança", "renunciar herança", "cessão herança", "consequência renúncia"],
    targetAudience: "Herdeiros que desejam abrir mão da herança recebida",
  },
  {
    category: "Sucessões",
    title: "ITCMD: o imposto sobre herança e doação — cálculo, alíquotas e isenções",
    keywords: ["ITCMD", "imposto herança", "ITCMD alíquota", "isenção ITCMD"],
    targetAudience: "Herdeiros e donatários que precisam entender e pagar o ITCMD",
  },
  {
    category: "Sucessões",
    title: "Meação: a parte do cônjuge sobrevivente na herança",
    keywords: ["meação", "cônjuge sobrevivente", "meação herança", "regime bens meação"],
    targetAudience: "Cônjuges sobreviventes que querem entender sua parcela no patrimônio",
  },
  {
    category: "Sucessões",
    title: "Doação em vida: como funciona, impostos e cuidados para evitar conflitos",
    keywords: ["doação em vida", "antecipação herança", "doação ITCMD", "colação doação"],
    targetAudience: "Pessoas que desejam transferir bens em vida para familiares",
  },
  {
    category: "Sucessões",
    title: "Inventário atrasado: multa, prazo e como regularizar",
    keywords: ["inventário atrasado", "multa inventário", "prazo inventário", "ITCMD multa atraso"],
    targetAudience: "Herdeiros que não abriram inventário dentro do prazo legal",
  },
  {
    category: "Sucessões",
    title: "Deserdação: quando um herdeiro pode ser excluído da herança pelo testamento",
    keywords: ["deserdação", "excluir herdeiro", "indignidade herança", "deserdar filho"],
    targetAudience: "Testadores que desejam excluir herdeiro ou herdeiros contestando exclusão",
  },
  {
    category: "Sucessões",
    title: "Planejamento sucessório: como organizar a transmissão de bens e evitar disputas",
    keywords: ["planejamento sucessório", "holding familiar", "organização patrimonial", "sucessão empresa"],
    targetAudience: "Famílias com patrimônio relevante que buscam segurança na sucessão",
  },
  {
    category: "Sucessões",
    title: "Inventário com menores ou incapazes: procedimento e cuidados especiais",
    keywords: ["inventário menor", "inventário incapaz", "alvará judicial inventário", "tutela inventário"],
    targetAudience: "Famílias com herdeiros menores de idade ou incapazes",
  },
  {
    category: "Sucessões",
    title: "União estável e herança: o companheiro tem direito à sucessão?",
    keywords: ["união estável herança", "companheiro herança", "direito sucessório união estável", "partilha companheiro"],
    targetAudience: "Companheiros em união estável que precisam garantir direitos na herança",
  },
  {
    category: "Sucessões",
    title: "Testamento vital (diretivas antecipadas de vontade): como registrar",
    keywords: ["testamento vital", "diretivas antecipadas", "vontade paciente", "cuidados paliativos"],
    targetAudience: "Pessoas que desejam registrar suas vontades sobre tratamentos médicos futuros",
  },

  // ============================================================
  // 13. SAÚDE
  // ============================================================
  {
    category: "Saúde",
    title: "Erro médico: como identificar, provar e pedir indenização",
    keywords: ["erro médico", "negligência médica", "indenização erro médico", "processo médico"],
    targetAudience: "Pacientes ou familiares que sofreram dano por erro de profissional de saúde",
  },
  {
    category: "Saúde",
    title: "Plano de saúde negou cobertura: como obrigar o plano a atender",
    keywords: ["plano saúde cobertura", "negativa plano saúde", "liminar plano saúde", "ANS cobertura"],
    targetAudience: "Beneficiários com procedimento ou exame negado pelo plano de saúde",
  },
  {
    category: "Saúde",
    title: "Medicamento pelo SUS: como conseguir remédio de alto custo judicialmente",
    keywords: ["medicamento SUS", "remédio alto custo", "judicialização saúde", "ação medicamento"],
    targetAudience: "Pacientes que precisam de medicamento não disponível ou em falta no SUS",
  },
  {
    category: "Saúde",
    title: "Responsabilidade médica: quando o profissional responde por dano ao paciente",
    keywords: ["responsabilidade médica", "culpa médica", "obrigação meio resultado", "CRM denúncia"],
    targetAudience: "Pacientes que desejam responsabilizar profissionais de saúde por danos",
  },
  {
    category: "Saúde",
    title: "Cirurgia estética mal feita: direitos do paciente e como processar",
    keywords: ["cirurgia estética", "plástica mal feita", "indenização cirurgia", "obrigação resultado"],
    targetAudience: "Pacientes insatisfeitos com resultado de procedimento estético",
  },
  {
    category: "Saúde",
    title: "Prontuário médico: como solicitar cópia e quais seus direitos",
    keywords: ["prontuário médico", "acesso prontuário", "cópia prontuário", "sigilo médico"],
    targetAudience: "Pacientes que precisam acessar seu histórico médico",
  },
  {
    category: "Saúde",
    title: "Seguro saúde: diferenças para plano de saúde e como acionar em caso de sinistro",
    keywords: ["seguro saúde", "reembolso médico", "diferença plano seguro", "sinistro saúde"],
    targetAudience: "Segurados que precisam entender como funciona o reembolso do seguro saúde",
  },
  {
    category: "Saúde",
    title: "Reajuste abusivo do plano de saúde: como contestar o aumento",
    keywords: ["reajuste plano saúde", "aumento plano saúde", "ANS reajuste", "plano saúde idoso reajuste"],
    targetAudience: "Beneficiários de plano de saúde que sofreram aumento acima do razoável",
  },
  {
    category: "Saúde",
    title: "Plano de saúde e carência: prazos legais e quando a carência não se aplica",
    keywords: ["carência plano saúde", "prazo carência", "urgência emergência carência", "portabilidade carência"],
    targetAudience: "Novos beneficiários de plano de saúde com dúvidas sobre prazos de carência",
  },
  {
    category: "Saúde",
    title: "Infecção hospitalar: responsabilidade do hospital e direito à indenização",
    keywords: ["infecção hospitalar", "responsabilidade hospital", "dano paciente hospital", "negligência hospital"],
    targetAudience: "Pacientes que contraíram infecção durante internação hospitalar",
  },
  {
    category: "Saúde",
    title: "Plano de saúde cancelado: quando é ilegal e como reverter",
    keywords: ["cancelamento plano saúde", "rescisão plano saúde", "plano saúde empresarial demissão", "manter plano demitido"],
    targetAudience: "Beneficiários que tiveram o plano de saúde cancelado unilateralmente",
  },
  {
    category: "Saúde",
    title: "SUS: direitos do paciente e como exigir atendimento adequado",
    keywords: ["direitos paciente SUS", "atendimento SUS", "fila SUS", "ouvidoria SUS"],
    targetAudience: "Pacientes do SUS que enfrentam demora ou negativa de atendimento",
  },
  {
    category: "Saúde",
    title: "Consentimento informado: o que o médico é obrigado a explicar antes do procedimento",
    keywords: ["consentimento informado", "termo consentimento", "informação paciente", "autonomia paciente"],
    targetAudience: "Pacientes que querem entender seus direitos antes de procedimentos médicos",
  },
  {
    category: "Saúde",
    title: "Home care pelo plano de saúde: quando o plano é obrigado a fornecer",
    keywords: ["home care", "internação domiciliar", "plano saúde home care", "cuidado domiciliar"],
    targetAudience: "Pacientes ou familiares que precisam de atendimento domiciliar pelo plano de saúde",
  },
  {
    category: "Saúde",
    title: "Dano estético: quando a aparência física gera direito à indenização",
    keywords: ["dano estético", "cicatriz acidente", "indenização estética", "dano imagem corporal"],
    targetAudience: "Vítimas de acidentes ou procedimentos que resultaram em alteração estética permanente",
  },
];
