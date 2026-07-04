/**
 * Motor das ferramentas PDF — só roda no servidor (route handler).
 *
 * Segurança:
 *  - execFile SEM shell (argumentos nunca são interpretados);
 *  - arquivos de trabalho com nomes internos fixos em diretório temporário
 *    exclusivo (mkdtemp), apagado no finally;
 *  - intervalos de página validados por regex antes de chegar ao qpdf;
 *  - senhas nunca começando com "-" (não viram flag);
 *  - timeout por operação e maxBuffer limitados.
 *
 * Binários exigidos no VPS: qpdf, gs (ghostscript), pdftotext/pdftoppm
 * (poppler-utils), img2pdf, soffice (libreoffice), ocrmypdf, zip.
 */

import { execFile } from "child_process";
import { mkdtemp, mkdir, rm, readFile, writeFile, readdir } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import { callAI } from "@/lib/ai/core";

export type UploadedFile = { name: string; buffer: Buffer };

export type ToolRunResult =
  | { kind: "file"; fileName: string; buffer: Buffer; mime: string }
  | {
      kind: "text";
      text: string;
      /** Download opcional gerado no servidor (ex.: PDF traduzido). */
      downloadName?: string;
      downloadBase64?: string;
      downloadMime?: string;
    };

export class ToolError extends Error {
  constructor(public publicMessage: string) {
    super(publicMessage);
  }
}

const MIME: Record<string, string> = {
  ".pdf": "application/pdf",
  ".zip": "application/zip",
  ".jpg": "image/jpeg",
  ".txt": "text/plain; charset=utf-8",
  ".csv": "text/csv; charset=utf-8",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation"
};

const RANGE_RE = /^[0-9]+(?:-(?:[0-9]+|z))?(?:\s*,\s*[0-9]+(?:-(?:[0-9]+|z))?)*$/;

function validRange(raw: string): string {
  const r = raw.replace(/\s+/g, "");
  if (!r || !RANGE_RE.test(r)) {
    throw new ToolError(
      "Intervalo de páginas inválido. Use números, vírgulas e hífens — ex.: 1,3,5-8 (z = última página)."
    );
  }
  return r;
}

function validPassword(raw: string): string {
  const p = (raw || "").trim();
  if (p.length < 4 || p.length > 64) {
    throw new ToolError("A senha deve ter entre 4 e 64 caracteres.");
  }
  if (p.startsWith("-")) {
    throw new ToolError("A senha não pode começar com hífen (-).");
  }
  return p;
}

/** Nome de download amigável e seguro, derivado do arquivo original. */
function outName(original: string, suffix: string, ext: string): string {
  const base = path
    .basename(original)
    .replace(/\.[^.]+$/, "")
    .replace(/[^\p{L}\p{N} _.-]/gu, "")
    .trim()
    .slice(0, 60) || "documento";
  return `${base}${suffix}${ext}`;
}

function sh(
  cmd: string,
  args: string[],
  opts: { cwd: string; timeoutMs?: number; env?: NodeJS.ProcessEnv } // cwd sempre no tmp
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    execFile(
      cmd,
      args,
      {
        cwd: opts.cwd,
        timeout: opts.timeoutMs ?? 90_000,
        maxBuffer: 8 * 1024 * 1024,
        env: { ...process.env, ...(opts.env || {}), HOME: opts.cwd }
      },
      (err, stdout, stderr) => {
        if (err) {
          const e = err as NodeJS.ErrnoException & { killed?: boolean };
          reject(
            new ToolError(
              e.killed
                ? "A operação demorou demais e foi interrompida. Tente um arquivo menor."
                : `Falha ao processar o arquivo. ${String(stderr || "").slice(0, 160)}`
            )
          );
        } else {
          resolve({ stdout: String(stdout), stderr: String(stderr) });
        }
      }
    );
  });
}

async function zipFiles(dir: string, files: string[], zipName: string): Promise<Buffer> {
  await sh("zip", ["-j", "-q", zipName, ...files], { cwd: dir });
  return readFile(path.join(dir, zipName));
}

/** Conversão via LibreOffice headless com perfil isolado (permite concorrência). */
async function soffice(
  dir: string,
  input: string,
  convertTo: string,
  infilter?: string
): Promise<string> {
  const args = ["--headless", "--norestore", `-env:UserInstallation=file://${dir}/lo`];
  if (infilter) args.push(`--infilter=${infilter}`);
  args.push("--convert-to", convertTo, "--outdir", dir, input);
  await sh("soffice", args, { cwd: dir, timeoutMs: 180_000 });
  const outExt = convertTo.split(":")[0];
  const expected = path.join(dir, `${path.basename(input).replace(/\.[^.]+$/, "")}.${outExt}`);
  try {
    await readFile(expected);
    return expected;
  } catch {
    throw new ToolError(
      "Não foi possível converter este arquivo. Verifique se o documento abre normalmente e tente de novo."
    );
  }
}

/**
 * Monta um .docx (OOXML) de texto corrido DIRETO em Node, sem LibreOffice.
 * Blindagem: PDF→Word não depende mais do soffice/Java (que já quebrou uma vez
 * por falta de JRE). Cada linha vira um parágrafo Word; texto é XML-escapado.
 * Zipa a estrutura mínima com a CLI `zip`.
 */
async function buildDocxFromText(dir: string, text: string): Promise<string> {
  const root = path.join(dir, "docxsrc");
  await mkdir(path.join(root, "_rels"), { recursive: true });
  await mkdir(path.join(root, "word"), { recursive: true });

  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const paras = text
    .split(/\r?\n/)
    .map((line) => {
      const t = line.trim();
      return t
        ? `<w:p><w:r><w:t xml:space="preserve">${esc(t)}</w:t></w:r></w:p>`
        : "<w:p/>";
    })
    .join("");

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${paras}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1417" w:right="1417" w:bottom="1417" w:left="1417"/></w:sectPr></w:body></w:document>`;
  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`;
  const rootRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`;

  await writeFile(path.join(root, "[Content_Types].xml"), contentTypes);
  await writeFile(path.join(root, "_rels", ".rels"), rootRels);
  await writeFile(path.join(root, "word", "document.xml"), documentXml);

  const outZip = path.join(dir, "resultado.docx");
  // Zipa TUDO do diretório raiz do pacote (inclui [Content_Types].xml literal).
  await sh("zip", ["-r", "-X", "-q", outZip, "."], { cwd: root });
  return outZip;
}

async function pdftotextOf(dir: string, input: string, layout = false): Promise<string> {
  const out = path.join(dir, "saida.txt");
  await sh("pdftotext", [...(layout ? ["-layout"] : []), "-enc", "UTF-8", input, out], {
    cwd: dir
  });
  const text = (await readFile(out, "utf-8")).replace(/\f/g, "\n\n").trim();
  if (!text) {
    throw new ToolError(
      "Este PDF não tem texto embutido (provavelmente é digitalizado). Use antes a ferramenta 'PDF pesquisável (OCR)'."
    );
  }
  return text;
}

// ---------------------------------------------------------------- pdf-lib ops

/** Substitui caracteres fora do WinAnsi (Helvetica) para não quebrar encode. */
const winAnsiSafe = (s: string): string =>
  s
    .normalize("NFC")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/…/g, "...")
    // eslint-disable-next-line no-control-regex
    .replace(/[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF]/g, "?");

async function loadPdf(buffer: Buffer): Promise<PDFDocument> {
  try {
    return await PDFDocument.load(buffer);
  } catch {
    throw new ToolError(
      "Não foi possível abrir este PDF. Se ele tiver senha, use antes a ferramenta 'Desbloquear PDF'; se estiver corrompido, tente 'Reparar PDF'."
    );
  }
}

async function addPageNumbers(
  buffer: Buffer,
  posicao: string,
  inicio: number,
  formato: string
): Promise<Buffer> {
  const doc = await loadPdf(buffer);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const total = doc.getPageCount();
  doc.getPages().forEach((page, i) => {
    const n = inicio + i;
    const label =
      formato === "n-de-t" ? `Página ${n} de ${inicio + total - 1}` : String(n);
    const size = 10;
    const w = font.widthOfTextAtSize(label, size);
    const { width, height } = page.getSize();
    let x = width - 28 - w;
    let y = 16;
    if (posicao === "rodape-centro") x = (width - w) / 2;
    if (posicao === "topo-direita") y = height - 26;
    page.drawText(label, { x, y, size, font, color: rgb(0.24, 0.28, 0.35) });
  });
  return Buffer.from(await doc.save());
}

async function addWatermark(
  buffer: Buffer,
  texto: string,
  estilo: string,
  intensidade: string
): Promise<Buffer> {
  const text = winAnsiSafe(texto.trim().slice(0, 60));
  if (!text) throw new ToolError("Informe o texto da marca d'água.");
  const doc = await loadPdf(buffer);
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  const opacity = intensidade === "forte" ? 0.32 : 0.14;
  doc.getPages().forEach((page) => {
    const { width, height } = page.getSize();
    if (estilo === "rodape") {
      const size = 11;
      const w = font.widthOfTextAtSize(text, size);
      page.drawText(text, {
        x: (width - w) / 2,
        y: 14,
        size,
        font,
        color: rgb(0.2, 0.24, 0.32),
        opacity: Math.min(0.85, opacity * 2.4)
      });
    } else {
      const diag = Math.hypot(width, height);
      const size = Math.max(24, Math.min(96, (diag * 0.72) / Math.max(4, text.length * 0.58)));
      const w = font.widthOfTextAtSize(text, size);
      page.drawText(text, {
        x: width / 2 - (w / 2) * Math.cos(Math.PI / 4),
        y: height / 2 - (w / 2) * Math.sin(Math.PI / 4),
        size,
        font,
        rotate: degrees(45),
        color: rgb(0.2, 0.24, 0.32),
        opacity
      });
    }
  });
  return Buffer.from(await doc.save());
}

/** Gera um PDF de leitura (A4) a partir de texto corrido — usado na tradução. */
async function textToPdf(text: string, titulo: string): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const A4: [number, number] = [595.28, 841.89];
  const margin = 56;
  const size = 11;
  const lineH = 15.5;
  const maxW = A4[0] - margin * 2;

  let page = doc.addPage(A4);
  let y = A4[1] - margin;

  const drawLine = (line: string, f = font, s = size) => {
    if (y < margin) {
      page = doc.addPage(A4);
      y = A4[1] - margin;
    }
    if (line) page.drawText(line, { x: margin, y, size: s, font: f, color: rgb(0.1, 0.13, 0.19) });
    y -= lineH;
  };

  drawLine(winAnsiSafe(titulo).slice(0, 70), bold, 13);
  y -= 6;

  for (const paragraph of winAnsiSafe(text).split(/\n/)) {
    const words = paragraph.split(/\s+/).filter(Boolean);
    if (!words.length) {
      y -= lineH * 0.5;
      continue;
    }
    let line = "";
    for (const wd of words) {
      const attempt = line ? `${line} ${wd}` : wd;
      if (font.widthOfTextAtSize(attempt, size) > maxW && line) {
        drawLine(line);
        line = wd;
      } else {
        line = attempt;
      }
    }
    drawLine(line);
  }
  return Buffer.from(await doc.save());
}

// ------------------------------------------------------------------- diff

/** Diff de linhas estilo Myers simplificado (documentos parecidos = rápido). */
function lineDiff(aRaw: string, bRaw: string): string {
  const clean = (t: string) =>
    t
      .split("\n")
      .map((l) => l.replace(/\s+/g, " ").trim())
      .filter(Boolean)
      .slice(0, 6000);
  const a = clean(aRaw);
  const b = clean(bRaw);

  // LCS por programação dinâmica com janelas — suficiente e previsível.
  const setB = new Map<string, number[]>();
  b.forEach((l, i) => {
    const arr = setB.get(l) || [];
    arr.push(i);
    setB.set(l, arr);
  });

  const out: string[] = [];
  let bi = 0;
  let removidas = 0;
  let adicionadas = 0;
  for (const lineA of a) {
    const positions = setB.get(lineA) || [];
    const match = positions.find((p) => p >= bi);
    if (match === undefined) {
      out.push(`− ${lineA}`);
      removidas++;
    } else {
      for (let k = bi; k < match; k++) {
        out.push(`+ ${b[k]}`);
        adicionadas++;
      }
      bi = match + 1;
    }
  }
  for (let k = bi; k < b.length; k++) {
    out.push(`+ ${b[k]}`);
    adicionadas++;
  }

  if (!removidas && !adicionadas) {
    return "Os dois documentos têm o mesmo texto — nenhuma diferença encontrada.";
  }
  const changed = out.filter((l) => l.startsWith("−") || l.startsWith("+"));
  return [
    `RESUMO: ${removidas} linha(s) removida(s) e ${adicionadas} linha(s) adicionada(s) em relação ao primeiro documento.`,
    "Legenda: '−' só existe no primeiro documento; '+' só existe no segundo.",
    "",
    ...changed.slice(0, 800),
    ...(changed.length > 800 ? ["", `(+ ${changed.length - 800} diferenças omitidas)`] : [])
  ].join("\n");
}

// -------------------------------------------------------------------- IA

const AI_MODEL = "gpt-5.4-mini";

async function summarize(text: string): Promise<string> {
  const excerpt = text.slice(0, 180_000);
  const res = await callAI({
    feature: "pdf_resumo",
    model: AI_MODEL,
    maxTokens: 1600,
    messages: [
      {
        role: "system",
        content:
          "Você resume documentos em português do Brasil para leitores leigos. Produza: 1) um parágrafo de visão geral; 2) lista dos pontos-chave (datas, valores, partes, obrigações, prazos); 3) se for documento jurídico, uma linha 'Atenção:' com o que merece conferência no original. Seja fiel ao texto — não invente nada. Sem markdown de cabeçalho, use hífens nas listas."
      },
      { role: "user", content: `Resuma o documento a seguir:\n\n${excerpt}` }
    ]
  });
  if (!res.ok) {
    throw new ToolError("O resumo não pôde ser gerado agora. Tente novamente em instantes.");
  }
  return res.text;
}

async function translate(text: string, destino: string): Promise<string> {
  const nomes: Record<string, string> = { pt: "português do Brasil", en: "inglês", es: "espanhol" };
  const alvo = nomes[destino] || "português do Brasil";
  const source = text.slice(0, 90_000);
  const chunks: string[] = [];
  for (let i = 0; i < source.length; i += 9_000) chunks.push(source.slice(i, i + 9_000));

  const partes: string[] = [];
  for (const [i, chunk] of chunks.entries()) {
    const res = await callAI({
      feature: "pdf_traducao",
      model: AI_MODEL,
      maxTokens: 4000,
      details: { parte: i + 1, total: chunks.length },
      messages: [
        {
          role: "system",
          content: `Traduza o texto do usuário para ${alvo}. Preserve a estrutura de parágrafos e listas. Não resuma, não omita, não comente — devolva apenas a tradução integral do trecho.`
        },
        { role: "user", content: chunk }
      ]
    });
    if (!res.ok) {
      throw new ToolError("A tradução não pôde ser concluída agora. Tente novamente em instantes.");
    }
    partes.push(res.text);
  }
  return partes.join("\n");
}

// ----------------------------------------------------------------- runner

const GS_BASE = ["-dNOPAUSE", "-dBATCH", "-dQUIET", "-dSAFER"];

export async function runPdfTool(
  slug: string,
  files: UploadedFile[],
  options: Record<string, string>
): Promise<ToolRunResult> {
  const dir = await mkdtemp(path.join(tmpdir(), "advtool-"));
  try {
    // grava os uploads com nomes internos previsíveis (in-1.pdf, in-2.jpg...)
    const inputs: string[] = [];
    for (const [i, f] of files.entries()) {
      const ext = path.extname(f.name).toLowerCase() || ".bin";
      const p = path.join(dir, `in-${i + 1}${ext}`);
      await writeFile(p, f.buffer);
      inputs.push(p);
    }
    const first = inputs[0];
    const firstName = files[0]?.name || "documento.pdf";
    const out = (ext: string) => path.join(dir, `out${ext}`);
    const fileResult = async (
      p: string,
      fileName: string
    ): Promise<ToolRunResult> => ({
      kind: "file",
      fileName,
      buffer: await readFile(p),
      mime: MIME[path.extname(p).toLowerCase()] || "application/octet-stream"
    });

    switch (slug) {
      case "juntar-pdf": {
        await sh("qpdf", ["--empty", "--pages", ...inputs, "--", out(".pdf")], { cwd: dir });
        return fileResult(out(".pdf"), outName(firstName, "-unido", ".pdf"));
      }

      case "dividir-pdf": {
        if ((options.modo || "intervalo") === "todas") {
          await sh("qpdf", ["--split-pages=1", first, path.join(dir, "pagina-%d.pdf")], {
            cwd: dir
          });
          const pages = (await readdir(dir)).filter((f) => f.startsWith("pagina-")).sort();
          if (pages.length === 1) return fileResult(path.join(dir, pages[0]), outName(firstName, "-pagina-1", ".pdf"));
          const zip = await zipFiles(dir, pages, "paginas.zip");
          return { kind: "file", fileName: outName(firstName, "-paginas", ".zip"), buffer: zip, mime: MIME[".zip"] };
        }
        const range = validRange(options.intervalo || "");
        await sh("qpdf", ["--empty", "--pages", first, range, "--", out(".pdf")], { cwd: dir });
        return fileResult(out(".pdf"), outName(firstName, `-paginas-${range.replace(/[^0-9z-]/g, "_")}`, ".pdf"));
      }

      case "extrair-paginas":
      case "organizar-pdf": {
        const range = validRange(options.intervalo || options.ordem || "");
        await sh("qpdf", ["--empty", "--pages", first, range, "--", out(".pdf")], { cwd: dir });
        return fileResult(out(".pdf"), outName(firstName, slug === "organizar-pdf" ? "-organizado" : "-extraido", ".pdf"));
      }

      case "rodar-pdf": {
        const angulo = ["90", "180", "270"].includes(options.angulo || "") ? options.angulo : "90";
        const range = options.paginas?.trim() ? validRange(options.paginas) : "1-z";
        await sh("qpdf", [first, out(".pdf"), `--rotate=+${angulo}:${range}`], { cwd: dir });
        return fileResult(out(".pdf"), outName(firstName, "-girado", ".pdf"));
      }

      case "comprimir-pdf": {
        const nivel =
          options.nivel === "maxima" ? "/screen" : options.nivel === "leve" ? "/printer" : "/ebook";
        // "Máxima" força downsampling agressivo das imagens (72 dpi) — sem isso
        // ela ficava idêntica à "Recomendada". Threshold 1.0 = sempre reduz.
        const extra =
          options.nivel === "maxima"
            ? [
                "-dDownsampleColorImages=true", "-dColorImageResolution=72", "-dColorImageDownsampleThreshold=1.0",
                "-dDownsampleGrayImages=true", "-dGrayImageResolution=72", "-dGrayImageDownsampleThreshold=1.0",
                "-dDownsampleMonoImages=true", "-dMonoImageResolution=100"
              ]
            : [];
        await sh(
          "gs",
          [...GS_BASE, "-sDEVICE=pdfwrite", "-dCompatibilityLevel=1.5", `-dPDFSETTINGS=${nivel}`, ...extra, "-o", out(".pdf"), first],
          { cwd: dir, timeoutMs: 180_000 }
        );
        // Nunca devolver arquivo MAIOR que o original: PDFs pequenos ou já
        // otimizados podem crescer com o Ghostscript. Se não reduziu, devolve
        // o original (o usuário via "comprimir" aumentar o tamanho e achava bug).
        const compBuf = await readFile(out(".pdf"));
        const menor = compBuf.length < files[0].buffer.length ? compBuf : files[0].buffer;
        return { kind: "file", fileName: outName(firstName, "-comprimido", ".pdf"), buffer: menor, mime: MIME[".pdf"] };
      }

      case "reparar-pdf": {
        await sh("gs", [...GS_BASE, "-sDEVICE=pdfwrite", "-o", out(".pdf"), first], {
          cwd: dir,
          timeoutMs: 180_000
        });
        return fileResult(out(".pdf"), outName(firstName, "-reparado", ".pdf"));
      }

      case "pdf-para-pdfa": {
        await sh(
          "gs",
          [
            ...GS_BASE,
            "-dPDFA=2",
            "-sColorConversionStrategy=RGB",
            "-dPDFACompatibilityPolicy=1",
            "-sDEVICE=pdfwrite",
            "-o",
            out(".pdf"),
            first
          ],
          { cwd: dir, timeoutMs: 180_000 }
        );
        return fileResult(out(".pdf"), outName(firstName, "-pdfa", ".pdf"));
      }

      case "pdf-para-word": {
        // Texto limpo do PDF (pdftotext, ordem correta) → DOCX montado em Node
        // (buildDocxFromText), SEM LibreOffice. Antes usava soffice, que quebrou
        // por falta de Java no VPS; agora é independente e à prova de falha.
        const text = await pdftotextOf(dir, first);
        const p = await buildDocxFromText(dir, text);
        return fileResult(p, outName(firstName, "", ".docx"));
      }

      case "pdf-para-powerpoint": {
        const p = await soffice(dir, first, "pptx", "impress_pdf_import");
        return fileResult(p, outName(firstName, "", ".pptx"));
      }

      case "word-para-pdf":
      case "excel-para-pdf":
      case "powerpoint-para-pdf": {
        const p = await soffice(dir, first, "pdf");
        return fileResult(p, outName(firstName, "", ".pdf"));
      }

      case "pdf-para-excel": {
        const text = await pdftotextOf(dir, first, true);
        const csv = text
          .split("\n")
          .map((l) => l.replace(/\r/g, ""))
          .filter((l) => l.trim())
          .map((l) =>
            l
              .split(/\s{2,}/)
              .map((c) => `"${c.trim().replace(/"/g, '""')}"`)
              .join(";")
          )
          .join("\r\n");
        // BOM para o Excel brasileiro reconhecer UTF-8 e ";" como separador
        const buf = Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), Buffer.from(csv, "utf-8")]);
        return { kind: "file", fileName: outName(firstName, "-planilha", ".csv"), buffer: buf, mime: MIME[".csv"] };
      }

      case "pdf-para-jpg": {
        const dpi = ["100", "150", "300"].includes(options.qualidade || "") ? options.qualidade : "150";
        await sh("pdftoppm", ["-jpeg", "-r", dpi, first, path.join(dir, "pagina")], {
          cwd: dir,
          timeoutMs: 180_000
        });
        const imgs = (await readdir(dir)).filter((f) => f.startsWith("pagina") && f.endsWith(".jpg")).sort();
        if (!imgs.length) throw new ToolError("Não foi possível converter as páginas em imagem.");
        if (imgs.length === 1) return fileResult(path.join(dir, imgs[0]), outName(firstName, "", ".jpg"));
        const zip = await zipFiles(dir, imgs, "imagens.zip");
        return { kind: "file", fileName: outName(firstName, "-imagens", ".zip"), buffer: zip, mime: MIME[".zip"] };
      }

      case "jpg-para-pdf": {
        await sh("img2pdf", ["--output", out(".pdf"), ...inputs], { cwd: dir });
        return fileResult(out(".pdf"), outName(firstName, "", ".pdf"));
      }

      case "pdf-para-texto": {
        const text = await pdftotextOf(dir, first);
        return { kind: "text", text };
      }

      case "numerar-paginas": {
        const inicio = Math.max(1, Math.min(9999, parseInt(options.inicio || "1", 10) || 1));
        const buf = await addPageNumbers(
          files[0].buffer,
          options.posicao || "rodape-direita",
          inicio,
          options.formato || "n"
        );
        return { kind: "file", fileName: outName(firstName, "-numerado", ".pdf"), buffer: buf, mime: MIME[".pdf"] };
      }

      case "marca-dagua": {
        const buf = await addWatermark(
          files[0].buffer,
          options.texto || "",
          options.estilo || "diagonal",
          options.intensidade || "suave"
        );
        return { kind: "file", fileName: outName(firstName, "-marcado", ".pdf"), buffer: buf, mime: MIME[".pdf"] };
      }

      case "proteger-pdf": {
        const pw = validPassword(options.senha || "");
        await sh("qpdf", ["--encrypt", pw, pw, "256", "--", first, out(".pdf")], { cwd: dir });
        return fileResult(out(".pdf"), outName(firstName, "-protegido", ".pdf"));
      }

      case "desbloquear-pdf": {
        const pw = validPassword(options.senha || "");
        try {
          await sh("qpdf", [`--password=${pw}`, "--decrypt", first, out(".pdf")], { cwd: dir });
        } catch {
          throw new ToolError("Senha incorreta para este PDF. Confira e tente novamente.");
        }
        return fileResult(out(".pdf"), outName(firstName, "-desbloqueado", ".pdf"));
      }

      case "pdf-pesquisavel": {
        await sh("ocrmypdf", ["-l", "por", "--skip-text", "--optimize", "1", first, out(".pdf")], {
          cwd: dir,
          timeoutMs: 300_000
        });
        return fileResult(out(".pdf"), outName(firstName, "-pesquisavel", ".pdf"));
      }

      case "resumir-pdf": {
        const text = await pdftotextOf(dir, first);
        return { kind: "text", text: await summarize(text) };
      }

      case "traduzir-pdf": {
        const text = await pdftotextOf(dir, first);
        const traduzido = await translate(text, options.destino || "pt");
        const pdf = await textToPdf(traduzido, outName(firstName, " (tradução)", "").replace(/\.$/, ""));
        return {
          kind: "text",
          text: traduzido,
          downloadName: outName(firstName, "-traduzido", ".pdf"),
          downloadBase64: pdf.toString("base64"),
          downloadMime: MIME[".pdf"]
        };
      }

      case "comparar-pdf": {
        const t1 = await pdftotextOf(dir, inputs[0]);
        const dir2 = dir; // mesmo workspace
        const outTxt = path.join(dir2, "b.txt");
        await sh("pdftotext", ["-enc", "UTF-8", inputs[1], outTxt], { cwd: dir2 });
        const t2 = (await readFile(outTxt, "utf-8")).replace(/\f/g, "\n\n").trim();
        if (!t2) {
          throw new ToolError(
            "O segundo PDF não tem texto embutido. Use antes a ferramenta 'PDF pesquisável (OCR)'."
          );
        }
        return { kind: "text", text: lineDiff(t1, t2) };
      }

      default:
        throw new ToolError("Ferramenta não encontrada.");
    }
  } finally {
    rm(dir, { recursive: true, force: true }).catch(() => undefined);
  }
}
