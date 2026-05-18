import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/lawyer/revalidate
 *
 * Chamado pelo /painel após o advogado salvar mudanças no próprio perfil.
 * Invalida o cache SSG das páginas onde esse perfil aparece (home, estado,
 * cidade principal, cidade adicional legada, extra_cities e perfil individual).
 *
 * Segurança — confirma que existe sessão Supabase válida ANTES de revalidar.
 * O lawyer só pode invalidar páginas relacionadas ao próprio ID. Não aceita
 * lawyerId arbitrário no body — pega sempre do session.user.id.
 *
 * Sem body necessário. Retorna { ok, revalidated: number }.
 */
export async function POST() {
  // 1. Verifica que tem sessão (anônimo não pode invalidar cache)
  const supabase = createClient();
  const {
    data: { user: authUser }
  } = await supabase.auth.getUser();

  if (!authUser) {
    return NextResponse.json(
      { ok: false, error: "Sessão expirada" },
      { status: 401 }
    );
  }

  // 2. Busca dados do lawyer (slug, cidades) via service_role
  const admin = createAdminClient();
  const { data: lawyer, error } = await admin
    .from("lawyers")
    .select("slug,uf,city_slug,target_uf,target_city,extra_cities")
    .eq("id", authUser.id)
    .maybeSingle();

  if (error || !lawyer) {
    return NextResponse.json(
      { ok: false, error: "Cadastro não encontrado" },
      { status: 404 }
    );
  }

  // 3. Revalida todas as rotas onde o perfil aparece
  const paths = new Set<string>();
  paths.add("/");
  paths.add(`/p/${lawyer.slug}`);

  const ufLower = (lawyer.uf as string).toLowerCase();
  paths.add(`/advogados/${ufLower}`);
  paths.add(`/advogados/${ufLower}/${lawyer.city_slug}`);

  if (lawyer.target_uf && lawyer.target_city) {
    const tufLower = (lawyer.target_uf as string).toLowerCase();
    paths.add(`/advogados/${tufLower}`);
    paths.add(`/advogados/${tufLower}/${lawyer.target_city}`);
  }

  // Inclui todas as extra_cities (até 9 entradas)
  const extras = Array.isArray(lawyer.extra_cities) ? lawyer.extra_cities : [];
  for (const c of extras as Array<{ uf?: string; slug?: string }>) {
    if (c && typeof c.uf === "string" && typeof c.slug === "string") {
      const tufLower = c.uf.toLowerCase();
      paths.add(`/advogados/${tufLower}`);
      paths.add(`/advogados/${tufLower}/${c.slug}`);
    }
  }

  for (const path of paths) {
    try {
      revalidatePath(path);
    } catch (err) {
      console.error("[revalidate] failed for", path, err);
    }
  }

  return NextResponse.json({ ok: true, revalidated: paths.size });
}
