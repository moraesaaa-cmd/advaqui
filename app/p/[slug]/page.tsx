import { permanentRedirect } from "next/navigation";

/**
 * Rota legada `/p/[slug]` (até Maio/2026 era a URL pública do perfil).
 * Em Maio/2026 a URL canônica passou a ser `/advogado/[slug]` — mais clara,
 * mais SEO-friendly e alinhada com a marca "Página Profissional AdvAqui".
 *
 * Esta rota agora faz **redirect 301 permanente** para a nova URL.
 * Importante porque:
 *   • Links em redes sociais, WhatsApp, e-mails de advogados etc. ainda
 *     apontam pra /p/...; tudo deve continuar funcionando.
 *   • O Google entende 301 como "esta URL se mudou pra cá" e preserva
 *     o ranking acumulado.
 *
 * Não tem static params: redirect é dinâmico — qualquer slug que chegue
 * aqui simplesmente redireciona.
 */
export const dynamic = "force-dynamic";

export default function LegacyProfileRedirect({
  params
}: {
  params: { slug: string };
}) {
  permanentRedirect(`/advogado/${params.slug}`);
}
