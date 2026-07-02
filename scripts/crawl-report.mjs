#!/usr/bin/env node
/**
 * crawl-report.mjs — relatório de crawl de bots a partir do access log do nginx.
 *
 * Uso:
 *   node scripts/crawl-report.mjs [caminho-do-log ...]
 *   cat access.log | node scripts/crawl-report.mjs -
 *
 * Default: /var/log/nginx/access.log
 * Formato esperado: nginx "combined" (com $request_time opcional no fim da linha).
 * Sem dependências externas (Node puro).
 */

import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';
import { createGunzip } from 'node:zlib';

const BOT_GROUPS = [
  { name: 'Googlebot', re: /Googlebot|GoogleOther|Google-InspectionTool|Storebot-Google/i },
  { name: 'Bingbot', re: /bingbot|BingPreview/i },
  { name: 'GPTBot', re: /GPTBot|OAI-SearchBot|ChatGPT-User/i },
  { name: 'ClaudeBot', re: /ClaudeBot|Claude-Web|anthropic-ai/i },
  { name: 'PerplexityBot', re: /PerplexityBot|Perplexity-User/i },
];

const URL_FAMILIES = [
  { name: '/advogados/{uf}/{cidade}', re: /^\/advogados\/[a-z]{2}(\/|$)/ },
  { name: '/advogados-de/{area}/em/{cidade}', re: /^\/advogados-de\/[^/]+\/em\// },
  { name: '/blog/*/em/{cidade}', re: /^\/blog\/[^/]+\/em\// },
  { name: '/blog/*', re: /^\/blog(\/|$)/ },
  { name: '/problemas-juridicos/*/em/*', re: /^\/problemas-juridicos\/[^/]+\/em\// },
  { name: '/quanto-custa/*/em/*', re: /^\/quanto-custa\/[^/]+\/em\// },
  { name: '/guias/*', re: /^\/guias(\/|$)/ },
  { name: '/glossario/*', re: /^\/glossario(\/|$)/ },
  { name: 'sitemaps', re: /^\/(sitemap|.*sitemap.*\.xml)/ },
  { name: 'robots.txt', re: /^\/robots\.txt$/ },
  { name: '_next/estáticos', re: /^\/(_next|favicon|icon|apple-icon|manifest|og)/ },
];

// combined: ip - user [time] "METHOD path HTTP/x" status bytes "referer" "ua" [request_time?]
const LINE_RE = /^(\S+) \S+ \S+ \[([^\]]+)\] "(\S+) (\S+)[^"]*" (\d{3}) \S+ "[^"]*" "([^"]*)"(?: (\d+\.\d+))?/;

function statusBucket(s) {
  if (s === 200) return '200';
  if (s === 304) return '304';
  if (s === 301 || s === 302 || s === 307 || s === 308) return '3xx';
  if (s === 404) return '404';
  if (s >= 500) return '5xx';
  if (s >= 400) return '4xx';
  return 'outros';
}

function familyOf(path) {
  const clean = path.split('?')[0];
  for (const f of URL_FAMILIES) if (f.re.test(clean)) return f.name;
  return 'outros';
}

function newAgg() {
  return { total: 0, status: {}, families: {}, firstTs: null, lastTs: null, timeSum: 0, timeN: 0, notFound: new Map(), errors5xx: new Map() };
}

const aggs = new Map(); // bot name -> agg
let totalLines = 0;
let botLines = 0;

function processLine(line) {
  totalLines++;
  const m = LINE_RE.exec(line);
  if (!m) return;
  const [, , ts, , path, statusStr, ua, reqTime] = m;
  const group = BOT_GROUPS.find((b) => b.re.test(ua));
  if (!group) return;
  botLines++;
  let a = aggs.get(group.name);
  if (!a) { a = newAgg(); aggs.set(group.name, a); }
  a.total++;
  if (!a.firstTs) a.firstTs = ts;
  a.lastTs = ts;
  const status = Number(statusStr);
  const sb = statusBucket(status);
  a.status[sb] = (a.status[sb] || 0) + 1;
  const fam = familyOf(path);
  if (!a.families[fam]) a.families[fam] = { total: 0, status: {} };
  a.families[fam].total++;
  a.families[fam].status[sb] = (a.families[fam].status[sb] || 0) + 1;
  if (reqTime) { a.timeSum += Number(reqTime); a.timeN++; }
  const clean = path.split('?')[0];
  if (status === 404) a.notFound.set(clean, (a.notFound.get(clean) || 0) + 1);
  if (status >= 500) a.errors5xx.set(clean, (a.errors5xx.get(clean) || 0) + 1);
}

function fmtStatus(st) {
  return Object.entries(st).sort((x, y) => y[1] - x[1]).map(([k, v]) => `${k}:${v}`).join(' ');
}

function printReport() {
  const now = new Date().toISOString();
  console.log('='.repeat(64));
  console.log(`RELATÓRIO DE CRAWL — advaqui.com — gerado em ${now}`);
  console.log(`Linhas lidas: ${totalLines} | linhas de bots monitorados: ${botLines}`);
  console.log('='.repeat(64));
  if (aggs.size === 0) {
    console.log('Nenhum hit dos bots monitorados encontrado no log.');
    return;
  }
  const ordered = [...aggs.entries()].sort((a, b) => b[1].total - a[1].total);
  for (const [bot, a] of ordered) {
    console.log('');
    console.log(`## ${bot} — ${a.total} hits (${a.firstTs} → ${a.lastTs})`);
    console.log(`   Status: ${fmtStatus(a.status)}`);
    if (a.timeN > 0) console.log(`   Tempo médio de resposta: ${(a.timeSum / a.timeN).toFixed(3)}s (${a.timeN} amostras)`);
    console.log('   Por família de URL:');
    const fams = Object.entries(a.families).sort((x, y) => y[1].total - x[1].total);
    for (const [fam, fa] of fams) {
      console.log(`     ${fam.padEnd(36)} ${String(fa.total).padStart(6)}  [${fmtStatus(fa.status)}]`);
    }
    const top404 = [...a.notFound.entries()].sort((x, y) => y[1] - x[1]).slice(0, 10);
    if (top404.length) {
      console.log('   Top 404:');
      for (const [p, n] of top404) console.log(`     ${n}x ${p}`);
    }
    const top5xx = [...a.errors5xx.entries()].sort((x, y) => y[1] - x[1]).slice(0, 10);
    if (top5xx.length) {
      console.log('   Top 5xx:');
      for (const [p, n] of top5xx) console.log(`     ${n}x ${p}`);
    }
  }
  console.log('');
}

async function readSource(src) {
  let stream;
  if (src === '-') {
    stream = process.stdin;
  } else {
    stream = createReadStream(src);
    if (src.endsWith('.gz')) stream = stream.pipe(createGunzip());
  }
  const rl = createInterface({ input: stream, crlfDelay: Infinity });
  for await (const line of rl) processLine(line);
}

const sources = process.argv.slice(2);
if (sources.length === 0) sources.push('/var/log/nginx/access.log');

try {
  for (const src of sources) await readSource(src);
  printReport();
} catch (err) {
  console.error(`Erro lendo log: ${err.message}`);
  process.exit(1);
}
