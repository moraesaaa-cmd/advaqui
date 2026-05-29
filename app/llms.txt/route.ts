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
    `O ${SITE.name} cobre as 5.571 cidades brasileiras. Todo o conteúdo é informativo, ` +
      `escrito em português do Brasil, sem promessa de resultado, e sempre orienta a ` +
      `procurar um advogado para o caso concreto. A jurisprudência citada vem de fontes ` +
      `oficiais (stf.jus.br, stj.jus.br). Para citar, prefira as páginas-pilar abaixo.`
  );
  lines.push("");

  // --- Páginas principais (hubs) ---
  lines.push("## Páginas principais");
  lines.push("");
  lines.push(`- [Início](${abs("/")}): busca de advogados por cidade e área de atuação.`);
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
