#!/usr/bin/env node
/**
 * Importa a lista completa de municípios brasileiros do IBGE e gera
 * `data/cities.json` no formato compacto usado pelo projeto.
 *
 * Fonte oficial — https://servicodados.ibge.gov.br/api/v1/localidades/municipios
 *
 * Uso:
 *   node scripts/import-ibge.mjs
 *
 * Regerar a base anualmente (ou quando o IBGE divulgar novos municípios)
 * mantém o site cobrindo todas as cidades brasileiras existentes.
 */
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DATA_DIR = resolve(ROOT, "data");
const OUT_JSON = resolve(DATA_DIR, "cities.json");

const UF_BY_PREFIX = {
  "11": "RO", "12": "AC", "13": "AM", "14": "RR", "15": "PA", "16": "AP", "17": "TO",
  "21": "MA", "22": "PI", "23": "CE", "24": "RN", "25": "PB", "26": "PE", "27": "AL",
  "28": "SE", "29": "BA", "31": "MG", "32": "ES", "33": "RJ", "35": "SP",
  "41": "PR", "42": "SC", "43": "RS", "50": "MS", "51": "MT", "52": "GO", "53": "DF"
};

const slugify = (s) => {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

const fetchIbge = async () => {
  const url = "https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome";
  console.log("→ Buscando IBGE…");
  const r = await fetch(url);
  if (!r.ok) {
    throw new Error(`IBGE retornou ${r.status}`);
  }
  return r.json();
};

const main = async () => {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

  const ibge = await fetchIbge();
  console.log(`✓ ${ibge.length} municípios recebidos do IBGE`);

  const records = [];
  const seen = new Set();
  let missingUf = 0;
  for (const m of ibge) {
    let uf = m?.microrregiao?.mesorregiao?.UF?.sigla;
    if (!uf) {
      // Fallback — UF a partir do prefixo do código IBGE.
      const prefix = String(m.id).slice(0, 2);
      uf = UF_BY_PREFIX[prefix];
      missingUf++;
    }
    if (!uf) {
      console.warn(`⚠ Município ${m.id} ${m.nome} sem UF — pulado`);
      continue;
    }
    const slug = slugify(m.nome);
    const key = `${uf}:${slug}`;
    if (seen.has(key)) {
      console.warn(`⚠ Slug duplicado: ${key} (${m.nome})`);
      continue;
    }
    seen.add(key);
    records.push({ i: m.id, n: m.nome, s: slug, u: uf });
  }

  records.sort((a, b) =>
    a.u === b.u ? a.s.localeCompare(b.s) : a.u.localeCompare(b.u)
  );

  writeFileSync(OUT_JSON, JSON.stringify(records), "utf8");
  console.log(`✓ ${records.length} cidades gravadas em ${OUT_JSON}`);
  if (missingUf > 0) {
    console.log(`  (${missingUf} sem UF na hierarquia IBGE, resolvidos via prefixo do código)`);
  }

  // Distribuição
  const byUf = {};
  for (const r of records) byUf[r.u] = (byUf[r.u] || 0) + 1;
  console.log("\nDistribuição por UF:");
  Object.keys(byUf).sort().forEach((uf) => {
    console.log(`  ${uf}: ${byUf[uf]}`);
  });
};

main().catch((err) => {
  console.error("❌ Erro ao importar IBGE:", err);
  process.exit(1);
});
