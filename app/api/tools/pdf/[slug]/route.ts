import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { getPdfTool } from "@/lib/tools/pdf/registry";
import { runPdfTool, ToolError, type UploadedFile } from "@/lib/tools/pdf/engine";
import { logAgentRun } from "@/lib/ai/core";
import { createClient } from "@/lib/supabase/server";
import { isAdminRequest } from "@/lib/auth/adminSession";

export const dynamic = "force-dynamic";

const MAX_TOTAL = 25 * 1024 * 1024; // 25 MB por operação
const MAX_FILES = 20;

// Rate limit em memória por usuário (VPS de instância única).
const usage = new Map<string, { count: number; reset: number }>();
const LIMIT_PER_HOUR = 40;

function rateLimited(userId: string): boolean {
  const now = Date.now();
  const u = usage.get(userId);
  if (!u || now > u.reset) {
    usage.set(userId, { count: 1, reset: now + 3_600_000 });
    return false;
  }
  u.count++;
  return u.count > LIMIT_PER_HOUR;
}

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const tool = getPdfTool(params.slug);
  if (!tool) {
    return NextResponse.json({ error: "Ferramenta não encontrada." }, { status: 404 });
  }

  // Gate de conta grátis: o processamento (e portanto o download) exige login.
  // A página em si é pública e indexável — o gate fica só na ação.
  // O ADMIN usa cookie HMAC próprio (sem sessão Supabase) — aceitar também,
  // senão o dono logado como admin cai num loop de "crie sua conta".
  let userId = "admin";
  if (!isAdminRequest()) {
    const supabase = createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        {
          error: "cadastro_necessario",
          message: "Crie uma conta gratuita para baixar o resultado."
        },
        { status: 401 }
      );
    }
    userId = user.id;
  }

  if (rateLimited(userId)) {
    return NextResponse.json(
      { error: "Muitas operações em sequência. Aguarde alguns minutos e tente de novo." },
      { status: 429 }
    );
  }

  const length = Number(req.headers.get("content-length") || 0);
  if (length > MAX_TOTAL + 1024 * 1024) {
    return NextResponse.json(
      { error: "Arquivos grandes demais. O total por operação é de 25 MB — use a compressão ou divida o documento." },
      { status: 413 }
    );
  }

  const files: UploadedFile[] = [];
  const options: Record<string, string> = {};
  try {
    const form = await req.formData();
    const rawOptions = form.get("options");
    if (typeof rawOptions === "string" && rawOptions) {
      const parsed: unknown = JSON.parse(rawOptions);
      if (parsed && typeof parsed === "object") {
        for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
          if (typeof v === "string") options[k] = v.slice(0, 200);
        }
      }
    }
    const entries = form.getAll("files").filter((f): f is File => f instanceof File);
    if (!entries.length) {
      return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
    }
    if (entries.length > MAX_FILES) {
      return NextResponse.json({ error: `Envie no máximo ${MAX_FILES} arquivos por vez.` }, { status: 400 });
    }
    if (!tool.multiplos && entries.length > 1) {
      return NextResponse.json({ error: "Esta ferramenta aceita um arquivo por vez." }, { status: 400 });
    }
    if (tool.minArquivos && entries.length < tool.minArquivos) {
      return NextResponse.json(
        { error: `Envie pelo menos ${tool.minArquivos} arquivos para esta operação.` },
        { status: 400 }
      );
    }

    let total = 0;
    for (const f of entries) {
      const ext = path.extname(f.name).toLowerCase();
      if (!tool.aceita.includes(ext)) {
        return NextResponse.json(
          { error: `Formato não aceito (${ext || "sem extensão"}). Esta ferramenta aceita: ${tool.aceita.join(", ")}.` },
          { status: 400 }
        );
      }
      total += f.size;
      if (total > MAX_TOTAL) {
        return NextResponse.json(
          { error: "Arquivos grandes demais. O total por operação é de 25 MB." },
          { status: 413 }
        );
      }
      files.push({ name: f.name, buffer: Buffer.from(await f.arrayBuffer()) });
    }
  } catch {
    return NextResponse.json({ error: "Envio inválido. Recarregue a página e tente de novo." }, { status: 400 });
  }

  const started = Date.now();
  try {
    const result = await runPdfTool(tool.slug, files, options);
    void logAgentRun("pdf_tools", tool.slug, {
      status: "success",
      itemsProcessed: files.length,
      durationMs: Date.now() - started,
      details: { user: userId }
    });

    if (result.kind === "text") {
      return NextResponse.json({
        ok: true,
        text: result.text,
        downloadName: result.downloadName,
        downloadBase64: result.downloadBase64,
        downloadMime: result.downloadMime
      });
    }

    const ascii = result.fileName.replace(/[^\x20-\x7E]/g, "_");
    return new NextResponse(new Uint8Array(result.buffer), {
      headers: {
        "Content-Type": result.mime,
        "Content-Disposition": `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(result.fileName)}`,
        "Cache-Control": "no-store"
      }
    });
  } catch (e) {
    const msg = e instanceof ToolError ? e.publicMessage : "Não foi possível processar o arquivo. Tente novamente.";
    void logAgentRun("pdf_tools", tool.slug, {
      status: "error",
      durationMs: Date.now() - started,
      details: { user: userId, error: e instanceof Error ? e.message.slice(0, 200) : "erro" }
    });
    return NextResponse.json({ error: msg }, { status: 422 });
  }
}
