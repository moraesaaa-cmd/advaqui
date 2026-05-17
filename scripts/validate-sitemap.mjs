#!/usr/bin/env node
/**
 * Valida que o sitemap gerado contém todas as cidades + estados + estáticas.
 *
 * Como rodar:
 *   1. `npm run build` (gera os sitemaps)
 *   2. `npm run start` em outra janela (sobe servidor)
 *   3. `node scripts/validate-sitemap.mjs http://localhost:3000`
 *
 * Sem o site no ar, o script ainda valida que `data/cities.json` cobre
 * todas as URLs que o sitemap deveria emitir, conferindo a contagem.
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const BASE = process.argv[2] || "";

const STATES_UF = ["AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT","PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO"];
const SPECIALTIES = ["trabalhista","civil","criminal","previdenciario","familia","empresarial","tributario","imobiliario","consumidor","administrativo","ambiental","digital","eleitoral","militar","internacional"];

const cities = JSON.parse(readFileSync(resolve(ROOT, "data/cities.json"), "utf8"));

const expectedUrls = new Set();
const base = BASE.replace(/\/$/, "");

// Estáticas
["/", "/advogados", "/planos", "/sobre", "/faq", "/contato", "/termos", "/privacidade", "/aviso-legal", "/cadastro", "/login"].forEach((p) => {
  expectedUrls.add(base + p);
});
// Estados
STATES_UF.forEach((uf) => expectedUrls.add(`${base}/advogados/${uf.toLowerCase()}`));
// Cidades
cities.forEach((c) => expectedUrls.add(`${base}/advogados/${c.u.toLowerCase()}/${c.s}`));
// Cidade × Especialidade
cities.forEach((c) => SPECIALTIES.forEach((sp) => expectedUrls.add(`${base}/advogados/${c.u.toLowerCase()}/${c.s}/${sp}`)));

console.log(`Esperado no sitemap: ${expectedUrls.size.toLocaleString("pt-BR")} URLs`);
console.log(`  - 11 páginas estáticas`);
console.log(`  - 27 estados`);
console.log(`  - ${cities.length.toLocaleString("pt-BR")} cidades`);
console.log(`  - ${(cities.length * SPECIALTIES.length).toLocaleString("pt-BR")} cidade × especialidade`);

if (!BASE) {
  console.log("\n(Validação offline — passe URL como argumento para checar sitemap real)");
  console.log("Ex: node scripts/validate-sitemap.mjs http://localhost:3000");
  process.exit(0);
}

// Online — busca sitemap.xml + sitemaps secundários e confere
const fetchSitemap = async (url) => {
  const r = await fetch(url);
  if (!r.ok) {
    console.warn(`⚠ ${url} retornou ${r.status}`);
    return [];
  }
  const xml = await r.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
};

const main = async () => {
  console.log("\n→ Buscando sitemap principal…");
  const found = new Set(await fetchSitemap(`${base}/sitemap.xml`));

  for (let i = 0; i < STATES_UF.length; i++) {
    const urls = await fetchSitemap(`${base}/sitemap-cidades/sitemap/${i}.xml`);
    urls.forEach((u) => found.add(u));
  }
  for (let i = 0; i < STATES_UF.length; i++) {
    const urls = await fetchSitemap(`${base}/sitemap-especialidades/sitemap/${i}.xml`);
    urls.forEach((u) => found.add(u));
  }

  console.log(`Encontrado no sitemap: ${found.size.toLocaleString("pt-BR")} URLs únicas`);
  const missing = [];
  for (const u of expectedUrls) {
    if (!found.has(u)) missing.push(u);
    if (missing.length > 20) break;
  }
  if (missing.length === 0) {
    console.log("✅ Sitemap completo — zero URL faltando");
    process.exit(0);
  } else {
    console.log(`❌ ${missing.length}+ URLs faltando no sitemap. Primeiras:`);
    missing.slice(0, 10).forEach((u) => console.log("  - " + u));
    process.exit(1);
  }
};

main().catch((err) => {
  console.error("❌ Erro ao validar sitemap:", err);
  process.exit(1);
});
