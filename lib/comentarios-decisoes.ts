import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

/**
 * Comentários públicos nas páginas de decisão (aba Notícias) — v1 em ARQUIVO.
 *
 * Por que arquivo e não Supabase: criar tabela exige DDL pelo Studio (sessão
 * de navegador), indisponível no momento da implantação. O armazenamento fica
 * em /var/www/advaqui-data (FORA do repositório e do .next — sobrevive a
 * deploy e build). Volume esperado é baixo (moderado a mão); quando crescer,
 * migrar para a tabela de supabase/migrations/0022_comentarios_decisoes.sql
 * trocando só este módulo.
 *
 * Moderação: todo comentário nasce "pendente" e só aparece no site depois de
 * aprovado no painel admin (aba Comentários). Compliance: conteúdo de
 * terceiros não publica sozinho.
 */

export type ComentarioStatus = "pendente" | "aprovado";

export type ComentarioDecisao = {
  id: string;
  tribunal: "stf" | "stj";
  slug: string;
  nome: string;
  texto: string;
  status: ComentarioStatus;
  createdAt: string;
  ipTrunc: string | null;
};

const DATA_DIR = process.env.ADVAQUI_DATA_DIR || "/var/www/advaqui-data";
const FILE = path.join(DATA_DIR, "comentarios-decisoes.json");

async function readAll(): Promise<ComentarioDecisao[]> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ComentarioDecisao[]) : [];
  } catch {
    return [];
  }
}

async function writeAll(list: ComentarioDecisao[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = FILE + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(list, null, 1), "utf8");
  await fs.rename(tmp, FILE);
}

/** Aprovados de uma decisão, mais recentes primeiro. */
export async function listAprovados(
  tribunal: string,
  slug: string,
  limit = 50
): Promise<Array<Pick<ComentarioDecisao, "id" | "nome" | "texto" | "createdAt">>> {
  const all = await readAll();
  return all
    .filter(
      (c) =>
        c.status === "aprovado" &&
        c.tribunal === tribunal.toLowerCase() &&
        c.slug === slug
    )
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, limit)
    .map(({ id, nome, texto, createdAt }) => ({ id, nome, texto, createdAt }));
}

/** Lista para o admin (todos ou por status), mais recentes primeiro. */
export async function listParaAdmin(
  status?: ComentarioStatus
): Promise<ComentarioDecisao[]> {
  const all = await readAll();
  return all
    .filter((c) => (status ? c.status === status : true))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 500);
}

export async function addComentario(input: {
  tribunal: "stf" | "stj";
  slug: string;
  nome: string;
  texto: string;
  ipTrunc: string | null;
}): Promise<ComentarioDecisao> {
  const all = await readAll();
  const novo: ComentarioDecisao = {
    id: randomUUID(),
    tribunal: input.tribunal,
    slug: input.slug,
    nome: input.nome,
    texto: input.texto,
    status: "pendente",
    createdAt: new Date().toISOString(),
    ipTrunc: input.ipTrunc
  };
  all.push(novo);
  await writeAll(all);
  return novo;
}

/** aprovar = publica; excluir = remove de vez. */
export async function moderarComentario(
  id: string,
  action: "aprovar" | "excluir"
): Promise<boolean> {
  const all = await readAll();
  const idx = all.findIndex((c) => c.id === id);
  if (idx === -1) return false;
  if (action === "excluir") {
    all.splice(idx, 1);
  } else {
    all[idx].status = "aprovado";
  }
  await writeAll(all);
  return true;
}
