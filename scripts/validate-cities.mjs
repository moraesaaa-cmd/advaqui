#!/usr/bin/env node
/**
 * Valida integridade da base de cidades importada do IBGE.
 *
 * O que o script verifica:
 *   1. cities.json existe e tem o número esperado de cidades (5.500+)
 *   2. Toda cidade tem id, nome (n), slug (s) e UF (u)
 *   3. Não há slugs duplicados dentro do mesmo UF
 *   4. Toda cidade tem UF válida (uma das 27)
 *   5. Capitais conhecidas estão presentes em cada UF
 *   6. Almenara/MG e Jequitinhonha/MG existem (cidades obrigatórias)
 *   7. Mock-lawyers só referenciam cidades existentes (zero advogado órfão)
 *
 * Uso:
 *   node scripts/validate-cities.mjs
 *
 * Exit code:
 *   0 — tudo OK
 *   1 — encontrou problema (mostra detalhes)
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const VALID_UFS = new Set([
  "AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT","PA",
  "PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO"
]);

const CAPITALS = {
  AC: "rio-branco", AL: "maceio", AM: "manaus", AP: "macapa",
  BA: "salvador", CE: "fortaleza", DF: "brasilia", ES: "vitoria",
  GO: "goiania", MA: "sao-luis", MG: "belo-horizonte", MS: "campo-grande",
  MT: "cuiaba", PA: "belem", PB: "joao-pessoa", PE: "recife",
  PI: "teresina", PR: "curitiba", RJ: "rio-de-janeiro", RN: "natal",
  RO: "porto-velho", RR: "boa-vista", RS: "porto-alegre", SC: "florianopolis",
  SE: "aracaju", SP: "sao-paulo", TO: "palmas"
};

const errors = [];
const warnings = [];

const fail = (msg) => errors.push(msg);
const warn = (msg) => warnings.push(msg);
const readJson = (path) => JSON.parse(readFileSync(path, "utf8").replace(/^\uFEFF/, ""));

// 1. Carrega cities.json
const citiesPath = resolve(ROOT, "data/cities.json");
if (!existsSync(citiesPath)) {
  fail("data/cities.json não encontrado. Rode npm run import:ibge");
} else {
  const raw = readJson(citiesPath);
  if (!Array.isArray(raw)) {
    fail("data/cities.json não é um array");
  } else {
    console.log(`✓ data/cities.json — ${raw.length} cidades`);

    if (raw.length < 5500) {
      fail(`Esperado >= 5.500 cidades, encontrado ${raw.length}. Reimporte do IBGE`);
    }

    // 2. Cada cidade tem campos obrigatórios
    let missingFields = 0;
    const slugsByUf = new Map();
    for (const c of raw) {
      if (!c.i || !c.n || !c.s || !c.u) {
        missingFields++;
        if (missingFields <= 5) {
          fail(`Cidade com campos faltando: ${JSON.stringify(c)}`);
        }
      }
      if (c.u && !VALID_UFS.has(c.u)) {
        fail(`UF inválida em ${c.n}: ${c.u}`);
      }
      const set = slugsByUf.get(c.u) || new Set();
      if (set.has(c.s)) {
        fail(`Slug duplicado em ${c.u}: ${c.s} (${c.n})`);
      }
      set.add(c.s);
      slugsByUf.set(c.u, set);
    }
    if (missingFields === 0) console.log("✓ Todos os campos obrigatórios presentes");
    console.log(`✓ Slugs únicos dentro de cada UF (${slugsByUf.size} UFs)`);

    // 5. Capitais presentes
    let capMissing = 0;
    for (const [uf, capSlug] of Object.entries(CAPITALS)) {
      const found = raw.find((c) => c.u === uf && c.s === capSlug);
      if (!found) {
        fail(`Capital ${uf} não encontrada com slug '${capSlug}'`);
        capMissing++;
      }
    }
    if (capMissing === 0) console.log("✓ Todas as 27 capitais presentes");

    // 6. Cidades obrigatórias (Almenara/MG e Jequitinhonha/MG)
    const almenara = raw.find((c) => c.u === "MG" && c.s === "almenara");
    const jequit = raw.find((c) => c.u === "MG" && c.s === "jequitinhonha");
    if (!almenara) fail("Cidade obrigatória 'almenara' (MG) não encontrada");
    if (!jequit) fail("Cidade obrigatória 'jequitinhonha' (MG) não encontrada");
    if (almenara && jequit) console.log("✓ Almenara/MG e Jequitinhonha/MG presentes");

    // Distribuição
    const byUf = new Map();
    for (const c of raw) {
      byUf.set(c.u, (byUf.get(c.u) || 0) + 1);
    }
    console.log(`✓ Distribuição por UF — ${byUf.size} estados, min ${Math.min(...byUf.values())}, max ${Math.max(...byUf.values())}`);

    // 7. Mock-lawyers órfãos
    const lawyersPath = resolve(ROOT, "lib/data/mock-lawyers.ts");
    if (existsSync(lawyersPath)) {
      const src = readFileSync(lawyersPath, "utf8");
      const matches = [...src.matchAll(/citySlug:\s*"([^"]+)",\s*[\n\s]*uf:\s*"([^"]+)"/g)];
      let orphans = 0;
      for (const m of matches) {
        const slug = m[1];
        const uf = m[2];
        const set = slugsByUf.get(uf);
        if (!set || !set.has(slug)) {
          fail(`Advogado órfão: citySlug='${slug}' uf='${uf}' não existe na base IBGE`);
          orphans++;
        }
      }
      if (orphans === 0) {
        console.log(`✓ Mock-lawyers — ${matches.length} advogados, 0 órfãos`);
      }
    }
  }
}

// Final report
console.log("");
if (warnings.length > 0) {
  console.log(`⚠ ${warnings.length} aviso(s):`);
  warnings.forEach((w) => console.log("  - " + w));
}
if (errors.length === 0) {
  console.log("✅ Validação passou. Zero cidades órfãs, zero slugs duplicados.");
  process.exit(0);
} else {
  console.log(`❌ Validação falhou — ${errors.length} erro(s):`);
  errors.forEach((e) => console.log("  - " + e));
  process.exit(1);
}
