import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ADMIN_CREDENTIALS } from "@/lib/config";
import { isAdminRequest } from "@/lib/auth/adminSession";
import { PainelNav } from "@/components/PainelNav";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false }
  }
};

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  let user: { email?: string } | null = null;
  try {
    const supabase = createClient();
    const result = await supabase.auth.getUser();
    user = result.data.user;
  } catch {}

  // O admin entra por cookie HMAC (lib/auth/adminSession), NAO por sessao
  // Supabase. Sem isso, ao abrir o painel do advogado (Pagamento/Meu perfil)
  // ele cai num 401 "Sessao expirada" e parece que o site quebrou / pede
  // recadastro. Detectamos a sessao admin e mostramos um aviso claro, em vez
  // do erro. Advogado real (com sessao Supabase) NAO e afetado.
  const adminLogged = isAdminRequest();
  if (!user && adminLogged) {
    return (
      <div className="container-narrow max-w-lg py-16">
        <div className="card text-center">
          <h1 className="font-display text-xl font-bold text-brand-ink">
            Você está logado como administrador
          </h1>
          <p className="text-sm text-brand-ink/70 mt-2">
            O painel do advogado (perfil, pagamento) usa uma conta de
            <strong> advogado</strong>. Como administrador, gerencie o site pelo
            painel administrativo. Para ver ou pagar o premium do seu próprio
            perfil, entre com a sua conta de advogado.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Link href="/admin" className="btn-primary">
              Ir para o painel administrativo
            </Link>
            <Link href="/login" className="btn-ghost border border-brand-line">
              Entrar como advogado
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isAdmin =
    !!user?.email &&
    user.email.toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase();

  return (
    <>
      <PainelNav isAdmin={isAdmin} />
      {children}
    </>
  );
}
