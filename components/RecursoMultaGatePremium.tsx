"use client";

import { useEffect, useState } from "react";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";
import { RecursoMultaWidget } from "@/components/RecursoMultaWidget";

/**
 * Gate Premium do gerador de recurso por template (2026-07-07, decisão do dono):
 * a ferramenta é exclusiva dos advogados com plano Premium ativo. Visitante
 * anônimo/free vê o convite para entrar ou assinar.
 */
export function RecursoMultaGatePremium() {
  const [estado, setEstado] = useState<"carregando" | "premium" | "bloqueado">("carregando");

  useEffect(() => {
    (async () => {
      try {
        const supabase = createSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from("lawyers")
            .select("plan_status")
            .eq("id", user.id)
            .maybeSingle();
          if (data?.plan_status === "active") {
            setEstado("premium");
            return;
          }
        }
      } catch {
        // sem sessão
      }
      setEstado("bloqueado");
    })();
  }, []);

  if (estado === "carregando") {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
        Verificando o seu acesso…
      </div>
    );
  }
  if (estado === "premium") return <RecursoMultaWidget />;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
      <h3 className="text-xl font-bold text-slate-900">Ferramenta exclusiva Premium</h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-600">
        O gerador de recurso de multa é um benefício exclusivo dos advogados com o plano
        Premium AdvAqui (R$ 19,90/mês).
      </p>
      <div className="mt-6 flex flex-col items-center gap-3">
        <a
          href="/login?redirect=/recurso-de-multa"
          className="inline-block rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
        >
          Já sou Premium — entrar na minha conta
        </a>
        <a href="/planos" className="text-sm font-semibold text-slate-700 underline">
          Ainda não sou Premium — conhecer o plano
        </a>
      </div>
    </div>
  );
}
