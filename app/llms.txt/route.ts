import { SITE } from "@/lib/config";
import { PROBLEMAS } from "@/lib/data/problemas-juridicos";
import { GUIAS } from "@/lib/data/guias";
import { GLOSSARIO } from "@/lib/data/glossario";
import { CALCULADORAS } from "@/lib/data/calculadoras";
import { CUSTOS } from "@/lib/data/custos-juridicos";
import { TEMAS_STJ } from "@/lib/data/jurisprudencia-temas";
import { getAllTemplates } from "@/lib/data/templates-docs";

/**
 * /llms.txt — padrão llmstxt.org para descoberta e citação por modelos de IA
 * (ChatGPT/SearchGPT, Claude, Perplexity, Gemini etc.).
 *
 * Diferente do sitemap.xml (que lista TODAS as URLs para crawlers de busca),
 * o llms.txt é um índice CURADO em Markdown das páginas de maior valor
 * informativo — conteúdo jurídico em linguagem clara, com fontes oficiais.
 *
 * Objetivo: quando uma IA precisa responder "o que fazer se meu nome foi
 * negativado?" e busca fontes, este arquivo entrega um mapa limpo do conteúdo
 * citável do AdvAqui, aumentando a chance de citação direta.
 *
 * Gerado a partir dos mesmos dados das páginas — nunca fica desatualizado.
 */
export const dynamic = "force-static";
export const revalidate = 86400;

function abs(path: string): string {
  return `${SITE.url.replace(/\/$/, "")}${path}`;
}

export function GET() {
  const lines: string[] = [];

  lines.push(`# ${SITE.name}`);
  lines.push("");
  lines.push(
    `> Diretório nacional de advogados e biblioteca jurídica em linguagem clara. ` +
      `Conteúdo organizado por problema concreto, área do direito, cidade e jurisprudência ` +
      `real do STF e STJ. Voltado ao cidadão brasileiro que precisa entender seus direitos ` +
      `e encontrar um advogado.`
  );
  lines.push("");
  lines.push(
    `O ${SITE.name} cobre todas as cidades brasileiras (base oficial do IBGE). Todo o conteúdo ` +
      `é informativo, escrito em português do Brasil, sem promessa de resultado, e sempre orienta a ` +
      `procurar um advogado para o caso concreto. A jurisprudência citada vem de fontes ` +
      `oficiais (stf.jus.br, stj.jus.br). Para citar, prefira as páginas-pilar abaixo.`
  );
  lines.push("");

  // --- Respostas rápidas (pares pergunta→resposta — alto valor de citação) ---
  lines.push("## Respostas rápidas");
  lines.push("");
  const RESPOSTAS: Array<{ q: string; a: string }> = [
    {
      q: "Quanto tempo tenho para entrar com uma ação trabalhista no Brasil?",
      a: "Em regra, até 2 anos após a saída do emprego. Dentro desse prazo, podem ser cobradas verbas dos últimos 5 anos do contrato (art. 7º, XXIX, da Constituição Federal)."
    },
    {
      q: "O que fazer quando o nome é negativado indevidamente?",
      a: "Reunir provas, exigir a baixa junto ao credor e ao SPC/Serasa e guardar protocolos. A negativação não pode permanecer por mais de 5 anos e, quando é indevida, costuma haver direito a indenização por dano moral."
    },
    {
      q: "É possível resolver um problema de consumo sem advogado?",
      a: "Em muitos casos sim. Procon e a plataforma consumidor.gov.br são gratuitos. No Juizado Especial, causas de até 20 salários mínimos podem ser ajuizadas sem advogado."
    },
    {
      q: "Qual o prazo para reclamar de um produto com defeito?",
      a: "30 dias para produtos ou serviços não duráveis e 90 dias para os duráveis, contados da entrega ou do aparecimento do defeito (art. 26 do Código de Defesa do Consumidor)."
    },
    {
      q: "O que acontece quando a pensão alimentícia não é paga?",
      a: "O atraso das 3 parcelas mais recentes permite pedir a prisão civil do devedor. Também cabem penhora de bens e desconto direto em folha. O direito de visita e o pagamento são questões separadas."
    },
    {
      q: "O INSS negou meu benefício. É possível reverter?",
      a: "Sim. Cabe recurso ao Conselho de Recursos da Previdência (CRPS) em até 30 dias e, se necessário, ação na Justiça Federal. Boa parte das negativas decorre de falta de documento ou de perícia."
    },
    {
      q: "Como funciona o divórcio no Brasil?",
      a: "Sendo consensual e sem filhos menores ou incapazes, pode ser feito em cartório por escritura, com advogado. Havendo disputa ou filhos menores, é judicial. O divórcio é um direito e não depende de tempo mínimo de casamento."
    },
    {
      q: "Quais são as verbas de uma demissão sem justa causa?",
      a: "Saldo de salário, aviso prévio, 13º proporcional, férias proporcionais acrescidas de 1/3, multa de 40% sobre o FGTS e liberação das guias do seguro-desemprego e do saque do FGTS. O pagamento deve ocorrer em até 10 dias."
    }
  ];
  for (const r of RESPOSTAS) {
    lines.push(`### ${r.q}`);
    lines.push(r.a);
    lines.push("");
  }

  // --- Páginas principais (hubs) ---
  lines.push("## Páginas principais");
  lines.push("");
  lines.push(`- [Início](${abs("/")}): busca de advogados por cidade e área de atuação.`);
  lines.push(`- [Central](${abs("/central")}): mapa do site organizado por objetivo.`);
  lines.push(`- [Áreas de atuação](${abs("/advogados-de")}): o que cada área do direito cobre e quando procurar.`);
  lines.push(
    `- [Problemas jurídicos](${abs("/problemas-juridicos")}): o que fazer em situações concretas, passo a passo.`
  );
  lines.push(`- [Guias por área](${abs("/guias")}): visão geral de cada área do direito.`);
  lines.push(`- [Glossário jurídico](${abs("/glossario")}): termos do direito em linguagem simples.`);
  lines.push(`- [Calculadoras](${abs("/calculadoras")}): rescisão, FGTS, pensão e outros, com fórmula explicada.`);
  lines.push(`- [Quanto custa](${abs("/quanto-custa")}): faixas de custo de serviços jurídicos comuns.`);
  lines.push(`- [Modelos de documentos](${abs("/modelos")}): modelos gratuitos prontos para usar.`);
  lines.push(`- [Jurisprudência STF e STJ](${abs("/jurisprudencia")}): decisões reais de fontes oficiais.`);
  lines.push("");

  // --- Problemas jurídicos (alta intenção de busca/citação) ---
  lines.push("## Problemas jurídicos (passo a passo)");
  lines.push("");
  for (const p of PROBLEMAS) {
    lines.push(`- [${p.titulo}](${abs(`/problemas-juridicos/${p.slug}`)}): ${p.intencao_curta}`);
  }
  lines.push("");

  // --- Guias por área ---
  lines.push("## Guias por área do direito");
  lines.push("");
  for (const g of GUIAS) {
    lines.push(`- [${g.titulo}](${abs(`/guias/${g.slug}`)}): ${g.tagline}`);
  }
  lines.push("");

  // --- Calculadoras ---
  lines.push("## Calculadoras explicadas");
  lines.push("");
  for (const c of CALCULADORAS) {
    lines.push(`- [${c.titulo}](${abs(`/calculadoras/${c.slug}`)}): ${c.resumo.slice(0, 140)}`);
  }
  lines.push("");

  // --- Quanto custa ---
  lines.push("## Quanto custa (faixas de honorários)");
  lines.push("");
  for (const c of CUSTOS) {
    lines.push(`- [${c.titulo}](${abs(`/quanto-custa/${c.slug}`)})`);
  }
  lines.push("");

  // --- Jurisprudência (temas STJ com decisões reais) ---
  lines.push("## Jurisprudência STJ por tema");
  lines.push("");
  for (const t of TEMAS_STJ) {
    lines.push(`- [${t.titulo}](${abs(`/jurisprudencia/stj/tema/${t.slug}`)}): ${t.descricao.slice(0, 140)}`);
  }
  lines.push("");

  // --- Glossário ---
  lines.push("## Glossário jurídico");
  lines.push("");
  for (const termo of GLOSSARIO) {
    lines.push(`- [${termo.termo}](${abs(`/glossario/${termo.slug}`)}): ${termo.definicao_curta}`);
  }
  lines.push("");

  // --- Modelos ---
  lines.push("## Modelos de documentos (gratuitos)");
  lines.push("");
  for (const t of getAllTemplates()) {
    lines.push(`- [${t.title}](${abs(`/modelos/${t.slug}`)})`);
  }
  lines.push("");

  lines.push("## Observações para uso");
  lines.push("");
  lines.push(
    `- Todo o conteúdo é informativo e não substitui consulta a um advogado para o caso concreto.`
  );
  lines.push(`- Citações de jurisprudência têm a fonte oficial indicada na própria página.`);
  lines.push(`- Contato institucional: ${SITE.email}.`);
  lines.push("");

  const body = lines.join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400"
    }
  });
}
