/**
 * Registro central das ferramentas PDF do AdvAqui.
 *
 * Fonte única de verdade: cada entrada alimenta a página SEO
 * (/ferramentas/pdf/[slug]), o hub (/ferramentas/pdf), o sitemap e o
 * handler da API (/api/tools/pdf/[slug]). Adicionar ferramenta nova =
 * adicionar entrada aqui + case no engine.ts.
 *
 * Regras de copy: keyword no início do título; sem menção a IA em texto
 * visível; sem promessa de resultado (OAB); ângulo jurídico sempre que
 * fizer sentido (PJe, protocolo, prazos).
 */

export type PdfToolCategory =
  | "organizar"
  | "converter"
  | "otimizar"
  | "editar"
  | "seguranca"
  | "avancado";

export const PDF_CATEGORIES: Record<PdfToolCategory, { label: string; ordem: number }> = {
  organizar: { label: "Organizar PDF", ordem: 1 },
  otimizar: { label: "Otimizar PDF", ordem: 2 },
  converter: { label: "Converter PDF", ordem: 3 },
  editar: { label: "Editar PDF", ordem: 4 },
  seguranca: { label: "Segurança", ordem: 5 },
  avancado: { label: "Recursos avançados", ordem: 6 }
};

export type PdfToolOption = {
  name: string;
  label: string;
  type: "select" | "text" | "password" | "number";
  options?: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  help?: string;
  default?: string;
};

export type PdfTool = {
  slug: string;
  /** Nome curto (card do hub). */
  nome: string;
  /** <title> — keyword primeiro; o layout acrescenta " — AdvAqui". */
  titulo: string;
  metaDescription: string;
  h1: string;
  subtitulo: string;
  categoria: PdfToolCategory;
  /** Nome do ícone lucide-react (resolvido no componente). */
  icone: string;
  /** Extensões aceitas no upload (com ponto, minúsculas). */
  aceita: string[];
  multiplos: boolean;
  minArquivos?: number;
  ctaLabel: string;
  opcoes?: PdfToolOption[];
  passos: [string, string, string];
  faq: { q: string; a: string }[];
  /** Bloco "No dia a dia jurídico" — diferencial do AdvAqui. */
  usoJuridico: string;
  /** "arquivo" = devolve download; "texto" = mostra resultado na tela + download. */
  resultado: "arquivo" | "texto";
  relacionadas: string[];
};

const PRIVACIDADE =
  "Os arquivos são processados no nosso servidor e apagados automaticamente ao fim da operação. Nada fica armazenado.";

export const PDF_TOOLS: PdfTool[] = [
  // ============================== ORGANIZAR ==============================
  {
    slug: "juntar-pdf",
    nome: "Juntar PDF",
    titulo: "Juntar PDF online grátis — unir vários em um",
    metaDescription:
      "Juntar PDF online grátis: una vários arquivos PDF em um único documento, na ordem que você escolher. Rápido, seguro e sem marca d'água.",
    h1: "Juntar PDF",
    subtitulo:
      "Una dois ou mais arquivos PDF em um único documento, na ordem que você escolher. Sem marca d'água, sem limite de uso.",
    categoria: "organizar",
    icone: "Combine",
    aceita: [".pdf"],
    multiplos: true,
    minArquivos: 2,
    ctaLabel: "Juntar PDF",
    passos: [
      "Envie dois ou mais arquivos PDF (a ordem de envio é a ordem final).",
      "Confira a lista e clique em Juntar PDF.",
      "Baixe o documento único, pronto para usar."
    ],
    faq: [
      {
        q: "Existe limite de arquivos para juntar?",
        a: "Você pode juntar até 20 arquivos por vez, com tamanho total de até 25 MB. Para volumes maiores, repita a operação com o resultado."
      },
      {
        q: "A ordem das páginas é mantida?",
        a: "Sim. Os documentos entram no arquivo final exatamente na ordem em que aparecem na lista de envio, com todas as páginas preservadas."
      },
      {
        q: "O PDF final tem marca d'água?",
        a: "Não. O arquivo final sai limpo, sem marca d'água e sem alteração no conteúdo das páginas."
      },
      {
        q: "Meus arquivos ficam salvos no site?",
        a: PRIVACIDADE
      }
    ],
    usoJuridico:
      "Para protocolar no PJe ou e-SAJ, é comum precisar reunir procuração, documentos pessoais e provas em um único PDF. Junte tudo aqui na ordem correta antes de anexar ao processo.",
    resultado: "arquivo",
    relacionadas: ["organizar-pdf", "comprimir-pdf", "dividir-pdf", "pdf-para-pdfa"]
  },
  {
    slug: "dividir-pdf",
    nome: "Dividir PDF",
    titulo: "Dividir PDF online grátis — separar páginas",
    metaDescription:
      "Dividir PDF online grátis: separe um intervalo de páginas ou transforme cada página em um PDF independente. Simples, rápido e seguro.",
    h1: "Dividir PDF",
    subtitulo:
      "Extraia um intervalo de páginas ou separe cada página do documento em um PDF independente.",
    categoria: "organizar",
    icone: "Scissors",
    aceita: [".pdf"],
    multiplos: false,
    ctaLabel: "Dividir PDF",
    opcoes: [
      {
        name: "modo",
        label: "Como dividir",
        type: "select",
        default: "intervalo",
        options: [
          { value: "intervalo", label: "Extrair um intervalo de páginas" },
          { value: "todas", label: "Separar todas as páginas (um PDF por página)" }
        ]
      },
      {
        name: "intervalo",
        label: "Páginas (ex.: 1-5 ou 2,4,7-9)",
        type: "text",
        placeholder: "1-5",
        help: "Use vírgula para páginas soltas e hífen para intervalos. Ignorado no modo 'todas as páginas'."
      }
    ],
    passos: [
      "Envie o arquivo PDF que quer dividir.",
      "Escolha entre extrair um intervalo (ex.: 1-5) ou separar todas as páginas.",
      "Baixe o resultado — um PDF único ou um ZIP com todas as páginas."
    ],
    faq: [
      {
        q: "Como indicar as páginas que eu quero?",
        a: "Use o formato 1-5 para intervalos e vírgulas para páginas soltas: 2,4,7-9 extrai as páginas 2, 4, 7, 8 e 9 na ordem indicada."
      },
      {
        q: "O que acontece no modo 'todas as páginas'?",
        a: "Cada página vira um PDF independente e você recebe tudo em um único arquivo ZIP, com os PDFs numerados na ordem original."
      },
      {
        q: "A qualidade das páginas muda?",
        a: "Não. As páginas são copiadas do original sem recompressão — texto, imagens e formatação permanecem idênticos."
      },
      { q: "Meus arquivos ficam salvos no site?", a: PRIVACIDADE }
    ],
    usoJuridico:
      "Útil para separar só a decisão ou a certidão de um processo digital extenso, ou para dividir autos volumosos em partes menores antes de encaminhar ao cliente.",
    resultado: "arquivo",
    relacionadas: ["extrair-paginas", "juntar-pdf", "organizar-pdf", "comprimir-pdf"]
  },
  {
    slug: "extrair-paginas",
    nome: "Extrair páginas",
    titulo: "Extrair páginas de PDF online grátis",
    metaDescription:
      "Extrair páginas de PDF online grátis: selecione as páginas que quer manter e gere um novo PDF só com elas. Sem instalar nada.",
    h1: "Extrair páginas de PDF",
    subtitulo: "Selecione as páginas que interessam e gere um novo PDF apenas com elas.",
    categoria: "organizar",
    icone: "FileOutput",
    aceita: [".pdf"],
    multiplos: false,
    ctaLabel: "Extrair páginas",
    opcoes: [
      {
        name: "intervalo",
        label: "Páginas a extrair (ex.: 1,3,5-8)",
        type: "text",
        placeholder: "1,3,5-8",
        required: true,
        help: "Vírgula para páginas soltas, hífen para intervalos."
      }
    ],
    passos: [
      "Envie o PDF original.",
      "Informe as páginas que quer manter (ex.: 1,3,5-8).",
      "Baixe o novo PDF somente com as páginas selecionadas."
    ],
    faq: [
      {
        q: "Posso mudar a ordem das páginas extraídas?",
        a: "Sim. As páginas saem na ordem em que você as digita: 5,1,3 gera um PDF com a página 5 primeiro, depois a 1 e a 3."
      },
      {
        q: "O original é alterado?",
        a: "Não. O arquivo enviado permanece intacto; a ferramenta gera um documento novo apenas com as páginas escolhidas."
      },
      { q: "Meus arquivos ficam salvos no site?", a: PRIVACIDADE }
    ],
    usoJuridico:
      "Extraia apenas as páginas relevantes de um contrato ou dos autos — por exemplo, a cláusula discutida e a assinatura — para anexar a uma petição enxuta.",
    resultado: "arquivo",
    relacionadas: ["dividir-pdf", "organizar-pdf", "juntar-pdf"]
  },
  {
    slug: "organizar-pdf",
    nome: "Organizar PDF",
    titulo: "Organizar PDF online — reordenar e excluir páginas",
    metaDescription:
      "Organizar PDF online grátis: reordene, exclua ou repita páginas do seu documento apenas indicando a nova sequência. Rápido e seguro.",
    h1: "Organizar PDF",
    subtitulo:
      "Reordene ou exclua páginas do documento indicando a nova sequência — o arquivo sai pronto na ordem que você definir.",
    categoria: "organizar",
    icone: "ListOrdered",
    aceita: [".pdf"],
    multiplos: false,
    ctaLabel: "Organizar PDF",
    opcoes: [
      {
        name: "ordem",
        label: "Nova ordem das páginas (ex.: 3,1,2,5-8)",
        type: "text",
        placeholder: "3,1,2,5-8",
        required: true,
        help: "Páginas fora da lista são excluídas do resultado. Use z para a última página (ex.: 2-z)."
      }
    ],
    passos: [
      "Envie o PDF que quer reorganizar.",
      "Digite a nova sequência de páginas (o que ficar fora é removido).",
      "Baixe o PDF já na ordem certa."
    ],
    faq: [
      {
        q: "Como excluo uma página?",
        a: "Basta não incluí-la na sequência. Em um PDF de 5 páginas, informar 1,2,4,5 gera um documento sem a página 3."
      },
      {
        q: "Posso repetir uma página?",
        a: "Sim. Informar 1,1,2 duplica a primeira página. Útil para gerar vias de um mesmo documento."
      },
      {
        q: "E se eu não souber o total de páginas?",
        a: "Use a letra z para indicar a última página: 3,1,2,4-z reordena as três primeiras e mantém o restante na sequência original."
      },
      { q: "Meus arquivos ficam salvos no site?", a: PRIVACIDADE }
    ],
    usoJuridico:
      "Documentos digitalizados fora de ordem são comuns em processos físicos migrados. Reordene as páginas antes de juntar aos autos digitais.",
    resultado: "arquivo",
    relacionadas: ["juntar-pdf", "dividir-pdf", "rodar-pdf"]
  },
  {
    slug: "rodar-pdf",
    nome: "Rodar PDF",
    titulo: "Rodar PDF online grátis — girar páginas",
    metaDescription:
      "Rodar PDF online grátis: gire páginas em 90°, 180° ou 270°, no documento inteiro ou só nas páginas que você indicar. Sem instalar nada.",
    h1: "Rodar PDF",
    subtitulo:
      "Gire páginas de cabeça para baixo ou de lado — no documento inteiro ou apenas nas páginas que você escolher.",
    categoria: "organizar",
    icone: "RotateCw",
    aceita: [".pdf"],
    multiplos: false,
    ctaLabel: "Rodar PDF",
    opcoes: [
      {
        name: "angulo",
        label: "Rotação",
        type: "select",
        default: "90",
        options: [
          { value: "90", label: "90° (horário)" },
          { value: "180", label: "180° (de cabeça para baixo)" },
          { value: "270", label: "270° (anti-horário)" }
        ]
      },
      {
        name: "paginas",
        label: "Páginas (vazio = todas)",
        type: "text",
        placeholder: "Todas",
        help: "Ex.: 2,5-7. Deixe em branco para girar o documento inteiro."
      }
    ],
    passos: [
      "Envie o PDF com páginas viradas.",
      "Escolha o ângulo e, se quiser, quais páginas girar.",
      "Baixe o documento corrigido."
    ],
    faq: [
      {
        q: "Dá para girar só algumas páginas?",
        a: "Sim. Informe as páginas no campo próprio (ex.: 2,5-7). Em branco, a rotação vale para o documento inteiro."
      },
      {
        q: "A rotação piora a qualidade?",
        a: "Não. A rotação é uma instrução de exibição do PDF — o conteúdo das páginas não é recomprimido nem alterado."
      },
      { q: "Meus arquivos ficam salvos no site?", a: PRIVACIDADE }
    ],
    usoJuridico:
      "Digitalizações de balcão frequentemente saem de lado. Corrija a orientação antes de protocolar — páginas viradas dificultam a leitura pelo juízo e podem gerar pedido de regularização.",
    resultado: "arquivo",
    relacionadas: ["organizar-pdf", "juntar-pdf", "pdf-pesquisavel"]
  },

  // ============================== OTIMIZAR ==============================
  {
    slug: "comprimir-pdf",
    nome: "Comprimir PDF",
    titulo: "Comprimir PDF online grátis — reduzir tamanho",
    metaDescription:
      "Comprimir PDF online grátis: reduza o tamanho do arquivo mantendo a qualidade. Ideal para anexar no PJe, e-mail e WhatsApp sem estourar o limite.",
    h1: "Comprimir PDF",
    subtitulo:
      "Reduza o tamanho do arquivo mantendo a melhor qualidade possível — ideal para sistemas com limite de upload.",
    categoria: "otimizar",
    icone: "FileArchive",
    aceita: [".pdf"],
    multiplos: false,
    ctaLabel: "Comprimir PDF",
    opcoes: [
      {
        name: "nivel",
        label: "Nível de compressão",
        type: "select",
        default: "recomendada",
        options: [
          { value: "leve", label: "Leve — máxima qualidade" },
          { value: "recomendada", label: "Recomendada — bom equilíbrio" },
          { value: "maxima", label: "Máxima — menor tamanho possível" }
        ]
      }
    ],
    passos: [
      "Envie o PDF pesado.",
      "Escolha o nível de compressão (a recomendada resolve a maioria dos casos).",
      "Baixe o arquivo menor e confira o resultado."
    ],
    faq: [
      {
        q: "Quanto o arquivo diminui?",
        a: "Depende do conteúdo. PDFs com fotos e digitalizações costumam reduzir de 50% a 90%; PDFs só de texto já são leves e reduzem menos."
      },
      {
        q: "Qual nível escolher para o PJe?",
        a: "Comece pela compressão recomendada. Se o arquivo continuar acima do limite do tribunal (em geral 10 MB por documento no PJe), use a máxima ou divida o PDF em partes."
      },
      {
        q: "A compressão apaga texto ou páginas?",
        a: "Não. Todas as páginas e textos permanecem; o que muda é a resolução das imagens internas, otimizadas para leitura em tela."
      },
      { q: "Meus arquivos ficam salvos no site?", a: PRIVACIDADE }
    ],
    usoJuridico:
      "O PJe limita o tamanho de cada anexo (em regra 10 MB por PDF). Comprima digitalizações de provas e contratos para caber no limite sem precisar cortar conteúdo.",
    resultado: "arquivo",
    relacionadas: ["dividir-pdf", "pdf-para-pdfa", "juntar-pdf", "reparar-pdf"]
  },
  {
    slug: "reparar-pdf",
    nome: "Reparar PDF",
    titulo: "Reparar PDF online grátis — recuperar arquivo corrompido",
    metaDescription:
      "Reparar PDF online grátis: reconstrua a estrutura de um PDF danificado que não abre ou trava e recupere o conteúdo legível do documento.",
    h1: "Reparar PDF",
    subtitulo:
      "Reconstrua a estrutura interna de um PDF danificado que não abre, trava o leitor ou é recusado em sistemas de protocolo.",
    categoria: "otimizar",
    icone: "Wrench",
    aceita: [".pdf"],
    multiplos: false,
    ctaLabel: "Reparar PDF",
    passos: [
      "Envie o PDF com problema.",
      "A ferramenta reconstrói a estrutura interna do arquivo.",
      "Baixe a versão reparada e teste a abertura."
    ],
    faq: [
      {
        q: "Todo PDF corrompido tem conserto?",
        a: "Não. A ferramenta recupera arquivos com estrutura danificada, mas se o conteúdo em si foi perdido (download incompleto, disco defeituoso), a recuperação pode ser parcial ou impossível."
      },
      {
        q: "O que costuma corromper um PDF?",
        a: "Downloads interrompidos, anexos de e-mail truncados, pen drives removidos durante a cópia e geradores de PDF com falhas são as causas mais comuns."
      },
      { q: "Meus arquivos ficam salvos no site?", a: PRIVACIDADE }
    ],
    usoJuridico:
      "PDF que o PJe recusa com erro de validação muitas vezes tem estrutura fora do padrão. A reconstrução gera um arquivo em conformidade, pronto para novo protocolo.",
    resultado: "arquivo",
    relacionadas: ["pdf-para-pdfa", "comprimir-pdf", "pdf-pesquisavel"]
  },
  {
    slug: "pdf-para-pdfa",
    nome: "PDF para PDF/A",
    titulo: "Converter PDF para PDF/A online grátis (padrão PJe)",
    metaDescription:
      "Converter PDF em PDF/A online grátis: gere o formato de arquivamento exigido pelo PJe e por órgãos públicos, preservando o documento a longo prazo.",
    h1: "Converter PDF para PDF/A",
    subtitulo:
      "Transforme seu PDF no padrão PDF/A — o formato de arquivamento de longa duração exigido pelo PJe e por órgãos públicos.",
    categoria: "otimizar",
    icone: "Landmark",
    aceita: [".pdf"],
    multiplos: false,
    ctaLabel: "Converter para PDF/A",
    passos: [
      "Envie o PDF comum.",
      "A ferramenta converte para o padrão PDF/A (ISO 19005).",
      "Baixe o arquivo pronto para protocolo e arquivamento."
    ],
    faq: [
      {
        q: "O que é PDF/A e por que o PJe exige?",
        a: "PDF/A é a versão do PDF padronizada pela ISO para arquivamento de longa duração: fontes embutidas, sem dependências externas. Tribunais o exigem para garantir que o documento abra igual daqui a décadas."
      },
      {
        q: "Qual versão de PDF/A é gerada?",
        a: "PDF/A-2b, aceita pelo PJe e pelos principais sistemas processuais brasileiros (e-SAJ, eproc, Projudi)."
      },
      {
        q: "O visual do documento muda?",
        a: "Não deve mudar. A conversão embute fontes e normaliza cores, preservando o conteúdo e o layout das páginas."
      },
      { q: "Meus arquivos ficam salvos no site?", a: PRIVACIDADE }
    ],
    usoJuridico:
      "Vários tribunais recusam anexos fora do padrão PDF/A. Converta a petição e os documentos antes do protocolo para evitar rejeição na validação do PJe.",
    resultado: "arquivo",
    relacionadas: ["comprimir-pdf", "reparar-pdf", "juntar-pdf", "pdf-pesquisavel"]
  },

  // ============================== CONVERTER ==============================
  {
    slug: "pdf-para-word",
    nome: "PDF para Word",
    titulo: "Converter PDF em Word online grátis (DOCX)",
    metaDescription:
      "Converter PDF em Word online grátis: transforme PDF em DOCX editável para alterar contratos, petições e documentos sem redigitar nada.",
    h1: "Converter PDF em Word",
    subtitulo:
      "Transforme um PDF em documento Word (DOCX) editável — sem precisar redigitar o texto.",
    categoria: "converter",
    icone: "FileText",
    aceita: [".pdf"],
    multiplos: false,
    ctaLabel: "Converter para Word",
    passos: [
      "Envie o arquivo PDF.",
      "A ferramenta extrai texto e layout para o formato DOCX.",
      "Baixe e edite no Word, LibreOffice ou Google Docs."
    ],
    faq: [
      {
        q: "A formatação fica idêntica?",
        a: "PDFs gerados por computador (contratos, petições) convertem bem. PDFs escaneados viram imagem dentro do Word — nesse caso, use antes a ferramenta PDF pesquisável (OCR) para reconhecer o texto."
      },
      {
        q: "Funciona com PDF digitalizado (foto)?",
        a: "Parcialmente. O escaneado não tem texto embutido; rode primeiro o PDF pesquisável (OCR) e depois converta para Word."
      },
      {
        q: "Em que programa abro o DOCX?",
        a: "Microsoft Word, LibreOffice Writer, Google Docs e WPS Office abrem o arquivo normalmente."
      },
      { q: "Meus arquivos ficam salvos no site?", a: PRIVACIDADE }
    ],
    usoJuridico:
      "Recebeu a minuta de um contrato em PDF e precisa propor alterações? Converta para Word, edite com controle de alterações e devolva para a outra parte.",
    resultado: "arquivo",
    relacionadas: ["word-para-pdf", "pdf-pesquisavel", "pdf-para-texto"]
  },
  {
    slug: "pdf-para-excel",
    nome: "PDF para Excel",
    titulo: "Converter PDF em Excel online grátis (planilha)",
    metaDescription:
      "Converter PDF em planilha online grátis: extraia dados e tabelas de um PDF para arquivo CSV que abre direto no Excel. Sem redigitar valores.",
    h1: "Converter PDF em planilha (Excel)",
    subtitulo:
      "Extraia os dados do PDF para um arquivo CSV que abre direto no Excel — sem redigitar valores um a um.",
    categoria: "converter",
    icone: "Table",
    aceita: [".pdf"],
    multiplos: false,
    ctaLabel: "Extrair para planilha",
    passos: [
      "Envie o PDF com os dados ou tabelas.",
      "A ferramenta extrai o conteúdo preservando o alinhamento em colunas.",
      "Baixe o CSV e abra no Excel, LibreOffice ou Google Planilhas."
    ],
    faq: [
      {
        q: "Por que recebo um CSV e não XLSX?",
        a: "O CSV é um formato universal de planilha que o Excel abre com dois cliques. A extração preserva as colunas do PDF; depois é só salvar como XLSX dentro do Excel, se preferir."
      },
      {
        q: "Tabelas complexas convertem bem?",
        a: "Tabelas simples e extratos alinhados convertem bem. Tabelas com células mescladas podem exigir ajustes manuais depois da extração."
      },
      {
        q: "Funciona com PDF escaneado?",
        a: "Não diretamente. Rode antes o PDF pesquisável (OCR) para reconhecer o texto e depois faça a extração."
      },
      { q: "Meus arquivos ficam salvos no site?", a: PRIVACIDADE }
    ],
    usoJuridico:
      "Extraia a tabela de cálculo de uma execução ou o extrato bancário juntado aos autos para conferir valores no Excel, linha a linha.",
    resultado: "arquivo",
    relacionadas: ["excel-para-pdf", "pdf-para-texto", "pdf-pesquisavel"]
  },
  {
    slug: "pdf-para-powerpoint",
    nome: "PDF para PowerPoint",
    titulo: "Converter PDF em PowerPoint online grátis (PPTX)",
    metaDescription:
      "Converter PDF em PowerPoint online grátis: transforme cada página do PDF em slide PPTX editável para apresentações e sustentações.",
    h1: "Converter PDF em PowerPoint",
    subtitulo: "Transforme as páginas do PDF em slides PPTX para editar no PowerPoint.",
    categoria: "converter",
    icone: "Presentation",
    aceita: [".pdf"],
    multiplos: false,
    ctaLabel: "Converter para PowerPoint",
    passos: [
      "Envie o arquivo PDF.",
      "Cada página vira um slide no formato PPTX.",
      "Baixe e finalize a apresentação no PowerPoint ou LibreOffice."
    ],
    faq: [
      {
        q: "Os slides ficam editáveis?",
        a: "Os elementos do PDF são convertidos para o slide; textos simples ficam editáveis, e layouts complexos podem chegar agrupados como imagem, dependendo de como o PDF foi gerado."
      },
      {
        q: "Serve para apresentações prontas em PDF?",
        a: "Sim — é o caso ideal: apresentações exportadas para PDF voltam a ser slides com boa fidelidade."
      },
      { q: "Meus arquivos ficam salvos no site?", a: PRIVACIDADE }
    ],
    usoJuridico:
      "Recupere aquela apresentação de audiência ou treinamento que só sobrou em PDF e volte a editá-la como slides.",
    resultado: "arquivo",
    relacionadas: ["powerpoint-para-pdf", "pdf-para-word", "pdf-para-jpg"]
  },
  {
    slug: "pdf-para-jpg",
    nome: "PDF para JPG",
    titulo: "Converter PDF em JPG online grátis — cada página em imagem",
    metaDescription:
      "Converter PDF em JPG online grátis: transforme cada página do PDF em imagem de alta qualidade para usar no WhatsApp, redes sociais e sistemas.",
    h1: "Converter PDF em JPG",
    subtitulo:
      "Transforme cada página do PDF em uma imagem JPG de alta qualidade — perfeito para enviar no WhatsApp ou inserir em outros documentos.",
    categoria: "converter",
    icone: "Image",
    aceita: [".pdf"],
    multiplos: false,
    ctaLabel: "Converter para JPG",
    opcoes: [
      {
        name: "qualidade",
        label: "Resolução",
        type: "select",
        default: "150",
        options: [
          { value: "100", label: "Padrão — leve (100 dpi)" },
          { value: "150", label: "Alta — recomendada (150 dpi)" },
          { value: "300", label: "Máxima — impressão (300 dpi)" }
        ]
      }
    ],
    passos: [
      "Envie o PDF.",
      "Escolha a resolução das imagens.",
      "Baixe o JPG (uma página) ou o ZIP com todas as páginas."
    ],
    faq: [
      {
        q: "Recebo uma imagem por página?",
        a: "Sim. PDFs de uma página geram um JPG direto; com mais páginas, você baixa um ZIP com as imagens numeradas na ordem."
      },
      {
        q: "Qual resolução escolher?",
        a: "150 dpi atende leitura em tela e WhatsApp. Use 300 dpi apenas se for imprimir — o arquivo fica maior."
      },
      { q: "Meus arquivos ficam salvos no site?", a: PRIVACIDADE }
    ],
    usoJuridico:
      "Envie a decisão ou o comprovante ao cliente como imagem no WhatsApp — abre na hora, sem precisar de leitor de PDF.",
    resultado: "arquivo",
    relacionadas: ["jpg-para-pdf", "pdf-para-word", "comprimir-pdf"]
  },
  {
    slug: "pdf-para-texto",
    nome: "PDF para texto",
    titulo: "Extrair texto de PDF online grátis (TXT)",
    metaDescription:
      "Extrair texto de PDF online grátis: copie todo o conteúdo do PDF em um arquivo TXT limpo, pronto para colar em petições e documentos.",
    h1: "Extrair texto de PDF",
    subtitulo: "Extraia todo o texto do PDF em um arquivo TXT limpo, pronto para copiar e colar.",
    categoria: "converter",
    icone: "Type",
    aceita: [".pdf"],
    multiplos: false,
    ctaLabel: "Extrair texto",
    passos: [
      "Envie o PDF.",
      "A ferramenta extrai todo o texto embutido no documento.",
      "Copie o resultado na tela ou baixe o arquivo TXT."
    ],
    faq: [
      {
        q: "Funciona com documento escaneado?",
        a: "Escaneados não têm texto embutido. Rode primeiro o PDF pesquisável (OCR) e depois extraia o texto."
      },
      {
        q: "A formatação é mantida?",
        a: "O TXT preserva a ordem e as quebras de linha do texto, mas não formatação visual (negrito, tabelas). Para manter layout, prefira a conversão para Word."
      },
      { q: "Meus arquivos ficam salvos no site?", a: PRIVACIDADE }
    ],
    usoJuridico:
      "Copie trechos de decisões e doutrina em PDF para citar na petição sem redigitar — com paginação limpa, sem quebras estranhas.",
    resultado: "texto",
    relacionadas: ["pdf-para-word", "pdf-pesquisavel", "resumir-pdf"]
  },
  {
    slug: "word-para-pdf",
    nome: "Word para PDF",
    titulo: "Converter Word em PDF online grátis (DOC, DOCX)",
    metaDescription:
      "Converter Word em PDF online grátis: transforme DOC e DOCX em PDF idêntico ao original, pronto para protocolo, assinatura e envio.",
    h1: "Converter Word em PDF",
    subtitulo:
      "Transforme documentos Word (DOC, DOCX, ODT, RTF) em PDF fiel ao original — pronto para protocolo e envio.",
    categoria: "converter",
    icone: "FileType",
    aceita: [".doc", ".docx", ".odt", ".rtf"],
    multiplos: false,
    ctaLabel: "Converter para PDF",
    passos: [
      "Envie o documento Word (DOC, DOCX, ODT ou RTF).",
      "A conversão preserva fontes, margens e numeração.",
      "Baixe o PDF pronto para assinar ou protocolar."
    ],
    faq: [
      {
        q: "O PDF fica igual ao documento original?",
        a: "Sim — fontes, margens, cabeçalhos e numeração de páginas são preservados na conversão."
      },
      {
        q: "Aceita quais formatos de entrada?",
        a: "DOC, DOCX (Word), ODT (LibreOffice) e RTF. Planilhas e apresentações têm ferramentas próprias."
      },
      {
        q: "Preciso do Word instalado?",
        a: "Não. A conversão acontece no servidor; você só envia o arquivo e baixa o PDF."
      },
      { q: "Meus arquivos ficam salvos no site?", a: PRIVACIDADE }
    ],
    usoJuridico:
      "O PJe não aceita DOCX — toda petição precisa ir em PDF. Converta a peça final do Word para PDF (e, se o tribunal exigir, converta também para PDF/A) antes do protocolo.",
    resultado: "arquivo",
    relacionadas: ["pdf-para-word", "pdf-para-pdfa", "juntar-pdf"]
  },
  {
    slug: "excel-para-pdf",
    nome: "Excel para PDF",
    titulo: "Converter Excel em PDF online grátis (XLS, XLSX)",
    metaDescription:
      "Converter Excel em PDF online grátis: transforme planilhas XLS e XLSX em PDF com as colunas ajustadas à página, pronto para juntar aos autos.",
    h1: "Converter Excel em PDF",
    subtitulo:
      "Transforme planilhas (XLS, XLSX, ODS, CSV) em PDF com as colunas ajustadas à largura da página.",
    categoria: "converter",
    icone: "Sheet",
    aceita: [".xls", ".xlsx", ".ods", ".csv"],
    multiplos: false,
    ctaLabel: "Converter para PDF",
    passos: [
      "Envie a planilha (XLS, XLSX, ODS ou CSV).",
      "A conversão gera páginas com as colunas visíveis.",
      "Baixe o PDF pronto para imprimir ou anexar."
    ],
    faq: [
      {
        q: "Planilhas largas cabem na página?",
        a: "A conversão ajusta o conteúdo à página. Para planilhas muito largas, considere reorganizar as colunas antes, para manter a leitura confortável."
      },
      {
        q: "Fórmulas são executadas?",
        a: "O PDF mostra os valores calculados como estão salvos na planilha — as fórmulas em si não aparecem."
      },
      { q: "Meus arquivos ficam salvos no site?", a: PRIVACIDADE }
    ],
    usoJuridico:
      "Planilhas de cálculo de liquidação precisam entrar nos autos como PDF. Converta mantendo os valores legíveis para o juízo e a parte contrária.",
    resultado: "arquivo",
    relacionadas: ["pdf-para-excel", "word-para-pdf", "juntar-pdf"]
  },
  {
    slug: "powerpoint-para-pdf",
    nome: "PowerPoint para PDF",
    titulo: "Converter PowerPoint em PDF online grátis (PPT, PPTX)",
    metaDescription:
      "Converter PowerPoint em PDF online grátis: transforme apresentações PPT e PPTX em PDF idêntico aos slides, fácil de compartilhar.",
    h1: "Converter PowerPoint em PDF",
    subtitulo: "Transforme apresentações (PPT, PPTX, ODP) em PDF fiel aos slides originais.",
    categoria: "converter",
    icone: "MonitorPlay",
    aceita: [".ppt", ".pptx", ".odp"],
    multiplos: false,
    ctaLabel: "Converter para PDF",
    passos: [
      "Envie a apresentação (PPT, PPTX ou ODP).",
      "Cada slide vira uma página do PDF.",
      "Baixe e compartilhe com quem não tem PowerPoint."
    ],
    faq: [
      {
        q: "Animações e vídeos aparecem?",
        a: "Não — o PDF é estático. Cada slide é convertido no estado final, sem animações, transições ou vídeos."
      },
      {
        q: "A fonte dos slides muda?",
        a: "Fontes padrão são preservadas. Fontes muito específicas podem ser substituídas por equivalentes, mantendo o layout."
      },
      { q: "Meus arquivos ficam salvos no site?", a: PRIVACIDADE }
    ],
    usoJuridico:
      "Compartilhe o material de um treinamento ou de uma sustentação com colegas em formato que abre em qualquer dispositivo.",
    resultado: "arquivo",
    relacionadas: ["pdf-para-powerpoint", "word-para-pdf", "comprimir-pdf"]
  },
  {
    slug: "jpg-para-pdf",
    nome: "JPG para PDF",
    titulo: "Converter JPG em PDF online grátis — fotos em documento",
    metaDescription:
      "Converter JPG em PDF online grátis: transforme fotos e imagens (JPG, PNG) em um único PDF organizado, pronto para enviar ou protocolar.",
    h1: "Converter JPG em PDF",
    subtitulo:
      "Transforme fotos e imagens (JPG, PNG) em um único PDF — na ordem que você escolher.",
    categoria: "converter",
    icone: "Images",
    aceita: [".jpg", ".jpeg", ".png"],
    multiplos: true,
    ctaLabel: "Converter para PDF",
    passos: [
      "Envie uma ou mais imagens (a ordem de envio é a ordem das páginas).",
      "As imagens são montadas em um único PDF.",
      "Baixe o documento pronto."
    ],
    faq: [
      {
        q: "Posso juntar várias fotos em um PDF só?",
        a: "Sim. Envie todas de uma vez — cada imagem vira uma página, na ordem da lista de envio."
      },
      {
        q: "A qualidade das fotos diminui?",
        a: "Não. As imagens são embutidas no PDF sem recompressão. Se o resultado ficar pesado, use depois a ferramenta Comprimir PDF."
      },
      { q: "Meus arquivos ficam salvos no site?", a: PRIVACIDADE }
    ],
    usoJuridico:
      "Fotos de documentos tiradas com o celular (RG, comprovantes, provas) precisam virar PDF para protocolo no PJe. Junte todas em um único arquivo organizado.",
    resultado: "arquivo",
    relacionadas: ["pdf-para-jpg", "comprimir-pdf", "juntar-pdf", "pdf-pesquisavel"]
  },

  // ============================== EDITAR ==============================
  {
    slug: "numerar-paginas",
    nome: "Números de página",
    titulo: "Numerar páginas de PDF online grátis",
    metaDescription:
      "Numerar páginas de PDF online grátis: adicione números de página com posição e formato à sua escolha. Ideal para autos, contratos e trabalhos.",
    h1: "Adicionar números de página ao PDF",
    subtitulo: "Insira numeração nas páginas do PDF — escolha posição e número inicial.",
    categoria: "editar",
    icone: "Hash",
    aceita: [".pdf"],
    multiplos: false,
    ctaLabel: "Numerar páginas",
    opcoes: [
      {
        name: "posicao",
        label: "Posição",
        type: "select",
        default: "rodape-direita",
        options: [
          { value: "rodape-direita", label: "Rodapé — direita" },
          { value: "rodape-centro", label: "Rodapé — centro" },
          { value: "topo-direita", label: "Topo — direita" }
        ]
      },
      {
        name: "inicio",
        label: "Começar em",
        type: "number",
        default: "1",
        help: "Número da primeira página (útil para continuar a numeração de outro volume)."
      },
      {
        name: "formato",
        label: "Formato",
        type: "select",
        default: "n",
        options: [
          { value: "n", label: "Somente o número (1, 2, 3...)" },
          { value: "n-de-t", label: "Página X de Y" }
        ]
      }
    ],
    passos: [
      "Envie o PDF sem numeração.",
      "Escolha posição, formato e número inicial.",
      "Baixe o documento numerado."
    ],
    faq: [
      {
        q: "Posso continuar a numeração de outro documento?",
        a: "Sim. Defina o campo 'Começar em' — útil para numerar volumes sequenciais de um mesmo caderno de documentos."
      },
      {
        q: "A numeração cobre o conteúdo da página?",
        a: "O número é inserido na margem (rodapé ou topo). Em documentos com margens muito estreitas, confira o resultado e ajuste a posição se necessário."
      },
      { q: "Meus arquivos ficam salvos no site?", a: PRIVACIDADE }
    ],
    usoJuridico:
      "Numerar o caderno de documentos facilita a referência na petição ('doc. 3, fl. 12') e a conferência pelo juízo e pela parte contrária.",
    resultado: "arquivo",
    relacionadas: ["marca-dagua", "juntar-pdf", "organizar-pdf"]
  },
  {
    slug: "marca-dagua",
    nome: "Marca d'água",
    titulo: "Marca d'água em PDF online grátis — texto em todas as páginas",
    metaDescription:
      "Inserir marca d'água em PDF online grátis: aplique texto como CONFIDENCIAL, MINUTA ou CÓPIA em todas as páginas, com transparência ajustável.",
    h1: "Inserir marca d'água no PDF",
    subtitulo:
      "Aplique um texto em todas as páginas — como CONFIDENCIAL, MINUTA ou CÓPIA — com transparência e posição ajustáveis.",
    categoria: "editar",
    icone: "Droplets",
    aceita: [".pdf"],
    multiplos: false,
    ctaLabel: "Aplicar marca d'água",
    opcoes: [
      {
        name: "texto",
        label: "Texto da marca d'água",
        type: "text",
        placeholder: "CONFIDENCIAL",
        required: true
      },
      {
        name: "estilo",
        label: "Estilo",
        type: "select",
        default: "diagonal",
        options: [
          { value: "diagonal", label: "Diagonal — centro da página" },
          { value: "rodape", label: "Discreta — rodapé" }
        ]
      },
      {
        name: "intensidade",
        label: "Intensidade",
        type: "select",
        default: "suave",
        options: [
          { value: "suave", label: "Suave (não atrapalha a leitura)" },
          { value: "forte", label: "Forte (bem visível)" }
        ]
      }
    ],
    passos: [
      "Envie o PDF.",
      "Digite o texto e escolha estilo e intensidade.",
      "Baixe o documento com a marca aplicada em todas as páginas."
    ],
    faq: [
      {
        q: "A marca d'água pode ser removida depois?",
        a: "Ela é gravada como camada sobre a página. Não é uma trava de segurança absoluta — para proteger o conteúdo, combine com a ferramenta Proteger PDF (senha)."
      },
      {
        q: "Posso usar em minutas de contrato?",
        a: "Sim — marcar MINUTA ou VERSÃO PARA ANÁLISE evita que uma versão não final seja confundida com o documento assinado."
      },
      { q: "Meus arquivos ficam salvos no site?", a: PRIVACIDADE }
    ],
    usoJuridico:
      "Marque pareceres e minutas como CONFIDENCIAL ou MINUTA antes de circular por e-mail — deixa claro o status do documento e desestimula repasse indevido.",
    resultado: "arquivo",
    relacionadas: ["proteger-pdf", "numerar-paginas", "juntar-pdf"]
  },

  // ============================== SEGURANÇA ==============================
  {
    slug: "proteger-pdf",
    nome: "Proteger PDF",
    titulo: "Proteger PDF com senha online grátis",
    metaDescription:
      "Proteger PDF com senha online grátis: encripte o documento para impedir acesso não autorizado. Proteção AES-256, padrão de mercado.",
    h1: "Proteger PDF com senha",
    subtitulo:
      "Encripte o documento com senha (AES-256) para impedir acesso não autorizado.",
    categoria: "seguranca",
    icone: "Lock",
    aceita: [".pdf"],
    multiplos: false,
    ctaLabel: "Proteger PDF",
    opcoes: [
      {
        name: "senha",
        label: "Senha de abertura",
        type: "password",
        required: true,
        help: "Guarde a senha em local seguro — sem ela o arquivo não abre. Mínimo de 4 caracteres."
      }
    ],
    passos: [
      "Envie o PDF a proteger.",
      "Defina a senha de abertura.",
      "Baixe o documento encriptado — só abre com a senha."
    ],
    faq: [
      {
        q: "Que tipo de proteção é aplicada?",
        a: "Encriptação AES de 256 bits, o padrão atual do formato PDF. O arquivo só abre mediante a senha definida."
      },
      {
        q: "E se eu esquecer a senha?",
        a: "Não há como recuperar — a encriptação é real. Guarde a senha em um gerenciador ou local seguro."
      },
      {
        q: "Posso enviar o PDF protegido por e-mail?",
        a: "Sim — é a prática recomendada para dados sensíveis. Envie a senha por outro canal (telefone ou mensagem), nunca no mesmo e-mail."
      },
      { q: "Meus arquivos ficam salvos no site?", a: PRIVACIDADE }
    ],
    usoJuridico:
      "A LGPD exige cuidado com dados pessoais. Proteja com senha documentos com CPF, dados bancários ou de saúde antes de enviar por e-mail ou WhatsApp.",
    resultado: "arquivo",
    relacionadas: ["desbloquear-pdf", "marca-dagua", "comprimir-pdf"]
  },
  {
    slug: "desbloquear-pdf",
    nome: "Desbloquear PDF",
    titulo: "Desbloquear PDF online grátis — remover senha que você conhece",
    metaDescription:
      "Desbloquear PDF online grátis: informe a senha atual e gere uma cópia sem senha, para não digitá-la a cada abertura do documento.",
    h1: "Desbloquear PDF (remover senha)",
    subtitulo:
      "Informe a senha atual do documento e gere uma cópia livre, sem pedir senha a cada abertura.",
    categoria: "seguranca",
    icone: "LockOpen",
    aceita: [".pdf"],
    multiplos: false,
    ctaLabel: "Desbloquear PDF",
    opcoes: [
      {
        name: "senha",
        label: "Senha atual do PDF",
        type: "password",
        required: true,
        help: "É necessário conhecer a senha — a ferramenta não quebra proteção de terceiros."
      }
    ],
    passos: [
      "Envie o PDF protegido.",
      "Digite a senha atual do documento.",
      "Baixe a cópia desbloqueada."
    ],
    faq: [
      {
        q: "Preciso saber a senha?",
        a: "Sim. A ferramenta remove a proteção de documentos cuja senha você conhece — ela não quebra nem descobre senhas de arquivos de terceiros."
      },
      {
        q: "Para que desbloquear um PDF meu?",
        a: "Contracheques, extratos bancários e informes de rendimento costumam vir com senha (CPF). Desbloqueie para arquivar e juntar aos autos sem digitar senha toda vez."
      },
      { q: "Meus arquivos ficam salvos no site?", a: PRIVACIDADE }
    ],
    usoJuridico:
      "Extratos e contracheques protegidos por senha não abrem para o juízo. Remova a senha (que você recebeu do banco/empregador) antes de juntar o documento ao processo.",
    resultado: "arquivo",
    relacionadas: ["proteger-pdf", "juntar-pdf", "comprimir-pdf"]
  },

  // ============================== AVANÇADO ==============================
  {
    slug: "pdf-pesquisavel",
    nome: "PDF pesquisável (OCR)",
    titulo: "OCR em PDF online grátis — tornar PDF pesquisável",
    metaDescription:
      "OCR em PDF online grátis: converta documento escaneado em PDF pesquisável e selecionável, com reconhecimento de texto em português.",
    h1: "Transformar PDF escaneado em pesquisável (OCR)",
    subtitulo:
      "Reconhecimento de texto em português: o documento escaneado passa a permitir busca (Ctrl+F), seleção e cópia.",
    categoria: "avancado",
    icone: "ScanText",
    aceita: [".pdf"],
    multiplos: false,
    ctaLabel: "Reconhecer texto",
    passos: [
      "Envie o PDF escaneado (imagem).",
      "O texto é reconhecido página a página, em português.",
      "Baixe o PDF pesquisável — o visual não muda, mas o texto passa a existir por baixo."
    ],
    faq: [
      {
        q: "O que muda no documento?",
        a: "Visualmente, nada. Uma camada invisível de texto é adicionada sob a imagem, permitindo buscar (Ctrl+F), selecionar e copiar o conteúdo."
      },
      {
        q: "Funciona com manuscritos?",
        a: "O reconhecimento é confiável para texto impresso. Manuscritos têm taxa de acerto baixa e não são recomendados."
      },
      {
        q: "Digitalizações tortas ou escuras funcionam?",
        a: "A ferramenta corrige inclinação leve automaticamente. Quanto melhor a digitalização (300 dpi, página reta, boa iluminação), melhor o resultado."
      },
      { q: "Meus arquivos ficam salvos no site?", a: PRIVACIDADE }
    ],
    usoJuridico:
      "Autos digitalizados sem OCR não permitem buscar termos. Torne o PDF pesquisável para localizar nomes, datas e cláusulas em segundos — e para citar trechos sem redigitar.",
    resultado: "arquivo",
    relacionadas: ["pdf-para-word", "pdf-para-texto", "resumir-pdf", "comprimir-pdf"]
  },
  {
    slug: "resumir-pdf",
    nome: "Resumir PDF",
    titulo: "Resumir PDF online grátis — resumo automático",
    metaDescription:
      "Resumir PDF online grátis: gere um resumo claro e objetivo de contratos, decisões e documentos longos em segundos, com os pontos-chave.",
    h1: "Resumir PDF",
    subtitulo:
      "Gere um resumo objetivo de documentos longos em segundos — com os pontos-chave organizados.",
    categoria: "avancado",
    icone: "AlignLeft",
    aceita: [".pdf"],
    multiplos: false,
    ctaLabel: "Gerar resumo",
    passos: [
      "Envie o PDF (contrato, decisão, relatório).",
      "O sistema analisa o texto e organiza os pontos-chave.",
      "Leia o resumo na tela e baixe em TXT se quiser guardar."
    ],
    faq: [
      {
        q: "Que tipo de documento resume melhor?",
        a: "Documentos de texto corrido: contratos, decisões, pareceres, relatórios. Documentos escaneados precisam passar antes pelo PDF pesquisável (OCR)."
      },
      {
        q: "Qual o tamanho máximo?",
        a: "Documentos de até cerca de 100 páginas de texto. Acima disso, divida o PDF e resuma por partes."
      },
      {
        q: "O resumo substitui a leitura do documento?",
        a: "Não. O resumo orienta a leitura e destaca os pontos principais, mas decisões importantes exigem a conferência do documento completo."
      },
      { q: "Meus arquivos ficam salvos no site?", a: PRIVACIDADE }
    ],
    usoJuridico:
      "Receba o panorama de um contrato de 40 páginas antes da reunião, ou o essencial de uma decisão longa antes de definir o recurso — e confirme depois no original.",
    resultado: "texto",
    relacionadas: ["traduzir-pdf", "pdf-para-texto", "comparar-pdf", "pdf-pesquisavel"]
  },
  {
    slug: "traduzir-pdf",
    nome: "Traduzir PDF",
    titulo: "Traduzir PDF online grátis — português, inglês e espanhol",
    metaDescription:
      "Traduzir PDF online grátis: traduza o texto de documentos entre português, inglês e espanhol e baixe o resultado em PDF organizado.",
    h1: "Traduzir PDF",
    subtitulo:
      "Traduza o texto do documento entre português, inglês e espanhol — e baixe o resultado em PDF.",
    categoria: "avancado",
    icone: "Languages",
    aceita: [".pdf"],
    multiplos: false,
    ctaLabel: "Traduzir",
    opcoes: [
      {
        name: "destino",
        label: "Traduzir para",
        type: "select",
        default: "pt",
        options: [
          { value: "pt", label: "Português" },
          { value: "en", label: "Inglês" },
          { value: "es", label: "Espanhol" }
        ]
      }
    ],
    passos: [
      "Envie o PDF no idioma original.",
      "Escolha o idioma de destino.",
      "Leia a tradução na tela e baixe o PDF traduzido."
    ],
    faq: [
      {
        q: "A formatação original é mantida?",
        a: "A tradução preserva a estrutura do texto (títulos e parágrafos) em um PDF limpo de leitura. Elementos gráficos complexos não são reproduzidos."
      },
      {
        q: "Serve como tradução juramentada?",
        a: "Não. Para efeitos oficiais (documentos estrangeiros em processo, por exemplo), a lei exige tradutor público juramentado. Use esta ferramenta para compreensão e trabalho interno."
      },
      {
        q: "Quais idiomas são suportados?",
        a: "Tradução entre português, inglês e espanhol, em qualquer direção — o idioma de origem é detectado automaticamente."
      },
      { q: "Meus arquivos ficam salvos no site?", a: PRIVACIDADE }
    ],
    usoJuridico:
      "Entenda um contrato internacional ou uma cláusula em inglês antes de decidir os próximos passos — lembrando que juntada oficial aos autos exige tradução juramentada.",
    resultado: "texto",
    relacionadas: ["resumir-pdf", "pdf-para-texto", "pdf-para-word"]
  },
  {
    slug: "comparar-pdf",
    nome: "Comparar PDF",
    titulo: "Comparar PDF online grátis — diferenças entre versões",
    metaDescription:
      "Comparar dois PDFs online grátis: veja o que mudou entre versões de um contrato ou documento, com as diferenças destacadas linha a linha.",
    h1: "Comparar dois PDFs",
    subtitulo:
      "Veja o que mudou entre duas versões de um documento — diferenças destacadas linha a linha.",
    categoria: "avancado",
    icone: "GitCompare",
    aceita: [".pdf"],
    multiplos: true,
    minArquivos: 2,
    ctaLabel: "Comparar documentos",
    passos: [
      "Envie a versão original e a versão nova (2 arquivos).",
      "Os textos são comparados linha a linha.",
      "Veja o relatório de diferenças na tela e baixe em TXT."
    ],
    faq: [
      {
        q: "O que a comparação mostra?",
        a: "Linhas removidas, adicionadas e alteradas entre os dois documentos, na ordem em que aparecem — como uma revisão de versões."
      },
      {
        q: "Funciona com documentos escaneados?",
        a: "Não diretamente. Rode antes o PDF pesquisável (OCR) nos dois arquivos para que o texto possa ser comparado."
      },
      {
        q: "Compara imagens e layout?",
        a: "A comparação é do texto. Mudanças puramente visuais (fonte, cor, posição) não são apontadas."
      },
      { q: "Meus arquivos ficam salvos no site?", a: PRIVACIDADE }
    ],
    usoJuridico:
      "A outra parte devolveu o contrato 'com pequenos ajustes'? Compare com a sua versão e veja exatamente o que foi alterado antes de assinar.",
    resultado: "texto",
    relacionadas: ["pdf-para-word", "resumir-pdf", "marca-dagua"]
  }
];

export const getPdfTool = (slug: string): PdfTool | undefined =>
  PDF_TOOLS.find((t) => t.slug === slug);

export const getPdfToolsByCategory = (): Array<{
  categoria: PdfToolCategory;
  label: string;
  tools: PdfTool[];
}> =>
  (Object.keys(PDF_CATEGORIES) as PdfToolCategory[])
    .sort((a, b) => PDF_CATEGORIES[a].ordem - PDF_CATEGORIES[b].ordem)
    .map((categoria) => ({
      categoria,
      label: PDF_CATEGORIES[categoria].label,
      tools: PDF_TOOLS.filter((t) => t.categoria === categoria)
    }))
    .filter((g) => g.tools.length > 0);
