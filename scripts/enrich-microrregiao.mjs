#!/usr/bin/env node
/**
 * Enriquece `data/cities.json` com microrregião e mesorregião do IBGE,
 * SEM remover nenhuma cidade nem nenhum campo existente.
 *
 * Acrescenta a cada registro:
 *   mi — id da microrregião IBGE (municipio.microrregiao.id)
 *   me — id da mesorregião IBGE (municipio.microrregiao.mesorregiao.id)
 *
 * Fonte oficial — https://servicodados.ibge.gov.br/api/v1/localidades/municipios
 *
 * Matching: primário pelo código IBGE (`i`), que já existe na base;
 * fallback por nome+UF normalizado (sem acento, sem hífen, minúsculo).
 *
 * Uso:
 *   node scripts/enrich-microrregiao.mjs
 *
 * O script valida ao final: mesmo nº de cidades antes/depois e relata
 * qualquer cidade que tenha ficado sem `mi`.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const CITIES_JSON = resolve(ROOT, "data", "cities.json");

/**
 * Municípios criados após 2017 não têm micro/mesorregião na API do IBGE
 * (a divisão em microrregiões foi congelada em 2017). Para esses, herdamos
 * a região do município de origem (desmembramento).
 *
 *   5101837 Boa Esperança do Norte/MT — desmembrado de Sorriso/MT (5107925)
 */
const PARENT_OVERRIDES = {
  5101837: 5107925
};

const normalize = (s) =>
  String(s)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");

const fetchIbge = async () => {
  const url = "https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome";
  console.log("→ Buscando IBGE…");
  const r = await fetch(url);
  if (!r.ok) throw new Error(`IBGE retornou ${r.status}`);
  return r.json();
};

const main = async () => {
  // replace(^﻿) — o arquivo atual tem BOM UTF-8; regravamos sem BOM.
  const before = JSON.parse(readFileSync(CITIES_JSON, "utf8").replace(/^﻿/, ""));
  const countBefore = before.length;
  console.log(`✓ ${countBefore} cidades lidas de data/cities.json`);

  const ibge = await fetchIbge();
  console.log(`✓ ${ibge.length} municípios recebidos do IBGE`);

  // Índices IBGE: por código e por nome+UF normalizado.
  const byId = new Map();
  const byNameUf = new Map();
  for (const m of ibge) {
    byId.set(m.id, m);
    const uf =
      m?.microrregiao?.mesorregiao?.UF?.sigla ||
      m?.["regiao-imediata"]?.["regiao-intermediaria"]?.UF?.sigla;
    if (uf) byNameUf.set(`${uf}:${normalize(m.nome)}`, m);
  }

  const regionsOf = (m) => {
    let src = m;
    if (!src?.microrregiao && PARENT_OVERRIDES[src?.id]) {
      src = byId.get(PARENT_OVERRIDES[src.id]);
    }
    const mi = src?.microrregiao?.id;
    const me = src?.microrregiao?.mesorregiao?.id;
    return { mi, me };
  };

  let matchedById = 0;
  let matchedByName = 0;
  const missing = [];

  const after = before.map((c) => {
    let m = byId.get(c.i);
    if (m) {
      matchedById++;
    } else {
      m = byNameUf.get(`${c.u}:${normalize(c.n)}`);
      if (m) matchedByName++;
    }
    if (!m) {
      missing.push(`${c.u}/${c.s} (IBGE ${c.i}) — não encontrado na API`);
      return { ...c };
    }
    const { mi, me } = regionsOf(m);
    if (!mi) {
      missing.push(`${c.u}/${c.s} (IBGE ${c.i}) — sem microrregião na API`);
      return { ...c, ...(me ? { me } : {}) };
    }
    return { ...c, mi, ...(me ? { me } : {}) };
  });

  // Validações — nada pode sumir.
  if (after.length !== countBefore) {
    throw new Error(`Contagem mudou: ${countBefore} → ${after.length}. Abortando sem gravar.`);
  }
  for (let i = 0; i < after.length; i++) {
    const a = before[i];
    const b = after[i];
    for (const k of Object.keys(a)) {
      if (JSON.stringify(a[k]) !== JSON.stringify(b[k])) {
        throw new Error(`Campo ${k} alterado em ${a.u}/${a.s}. Abortando sem gravar.`);
      }
    }
  }

  writeFileSync(CITIES_JSON, JSON.stringify(after), "utf8");

  const withMi = after.filter((c) => typeof c.mi === "number").length;
  const withMe = after.filter((c) => typeof c.me === "number").length;
  console.log(`✓ ${after.length} cidades gravadas (antes: ${countBefore})`);
  console.log(`  match por código IBGE: ${matchedById} · por nome+UF: ${matchedByName}`);
  console.log(`  com microId (mi): ${withMi} · com mesoId (me): ${withMe}`);
  if (missing.length > 0) {
    console.log(`\n⚠ ${missing.length} exceções (sem microId):`);
    missing.forEach((x) => console.log(`  - ${x}`));
  } else {
    console.log("  Nenhuma exceção — todas as cidades têm microId.");
  }
};

main().catch((err) => {
  console.error("❌ Erro ao enriquecer cidades:", err);
  process.exit(1);
});
