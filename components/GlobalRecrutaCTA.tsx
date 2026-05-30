"use client";

import { usePathname } from "next/navigation";
import { RecrutaAdvogadoCTA } from "@/components/RecrutaAdvogadoCTA";

/**
 * Renderiza a tarjeta de recrutamento no fim de TODA página pública.
 * Esconde nas páginas onde seria redundante ou inadequada: a própria landing
 * de advogados, fluxos de conta (cadastro/login/recuperação) e áreas internas
 * (painel/admin).
 */
const EXCLUIR = [
  "/", // a home já tem o seu próprio card "Sou advogado"
  "/para-advogados",
  "/cadastro",
  "/login",
  "/painel",
  "/admin",
  "/recuperar-senha",
  "/redefinir-senha"
];

export function GlobalRecrutaCTA() {
  const pathname = usePathname() || "/";
  const oculto = EXCLUIR.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  if (oculto) return null;
  return <RecrutaAdvogadoCTA />;
}
