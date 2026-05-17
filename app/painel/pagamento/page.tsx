"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Star } from "lucide-react";
import { store } from "@/lib/store/localStore";
import { PixDisplay } from "@/components/PixDisplay";
import { toast } from "@/components/Toast";
import type { Lawyer } from "@/lib/data/mock-lawyers";

export default function PagamentoPage() {
  const router = useRouter();
  const [user, setUser] = useState<Lawyer | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const session = store.getSession();
    if (!session || session.role !== "lawyer") {
      router.push("/login");
      return;
    }
    const u = store.getUsers().find((x) => x.id === session.userId);
    if (!u) {
      router.push("/login");
      return;
    }
    setUser(u);
  }, [router]);

  const confirm = () => {
    if (!user) return;
    setConfirming(true);
    const updated: Lawyer = {
      ...user,
      planStatus: "pending",
      paymentDate: new Date().toISOString()
    };
    const users = store.getUsers();
    store.setUsers(users.map((u) => (u.id === user.id ? updated : u)));
    setUser(updated);
    setConfirmed(true);
    toast("Pagamento sinalizado! Ativação em até 48 horas.");
  };

  if (!user) {
    return (
      <div className="container-narrow py-20 text-center text-brand-ink/60">Carregando…</div>
    );
  }

  if (confirmed) {
    return (
      <div className="container-narrow max-w-lg py-16">
        <div className="card text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-emerald-700" aria-hidden />
          </div>
          <h1 className="font-display text-2xl font-bold text-brand-ink mb-2">
            Pagamento sinalizado
          </h1>
          <p className="text-brand-ink/70 mb-6">
            Recebemos sua sinalização. Nossa equipe vai validar o Pix e ativar seu plano premium em
            até <strong>48 horas</strong>. Você receberá a confirmação aqui no painel.
          </p>
          <div className="text-sm text-brand-ink/60 bg-brand-bg rounded-xl p-3 mb-5">
            <p>1. ✅ Pagamento sinalizado</p>
            <p>2. ⏳ Em análise (até 48h)</p>
            <p>3. ⚪ Plano ativo</p>
          </div>
          <Link href="/painel" className="btn-primary">
            Voltar ao painel
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-narrow max-w-lg py-12">
      <Link href="/painel" className="inline-flex items-center gap-1 text-sm text-brand-deep mb-4">
        <ArrowLeft className="w-4 h-4" aria-hidden />
        Voltar ao painel
      </Link>

      <header className="text-center mb-6">
        <div className="w-14 h-14 rounded-full bg-brand-accent/20 flex items-center justify-center mx-auto mb-3">
          <Star className="w-7 h-7 text-brand-accent" aria-hidden />
        </div>
        <h1 className="font-display text-2xl font-bold text-brand-ink">Ativar plano premium</h1>
        <p className="text-sm text-brand-ink/60 mt-1">
          Pagamento por Pix. Ativação manual em até 48 horas.
        </p>
      </header>

      <PixDisplay txid={`AdvAqui${user.id.slice(0, 6).toUpperCase()}`} />

      <button
        onClick={confirm}
        disabled={confirming}
        className="btn-primary w-full mt-6 bg-emerald-600 hover:bg-emerald-500"
      >
        Já realizei o pagamento
      </button>

      <p className="text-xs text-brand-ink/50 mt-4 text-center leading-relaxed">
        Ao clicar, você confirma que enviou o Pix para a chave acima. Nossa equipe valida
        manualmente e ativa o seu destaque em até 48 horas.
      </p>
    </div>
  );
}
