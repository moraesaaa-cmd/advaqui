"use client";

import { useEffect, useState } from "react";
import { Check, AlertCircle, X } from "lucide-react";

type ToastEvent = CustomEvent<{ message: string; type?: "success" | "error" | "info" }>;

declare global {
  interface WindowEventMap {
    "AdvAqui:toast": ToastEvent;
  }
}

export function toast(message: string, type: "success" | "error" | "info" = "success") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("AdvAqui:toast", { detail: { message, type } }));
}

export function Toaster() {
  const [state, setState] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  useEffect(() => {
    const handler = (e: ToastEvent) => {
      setState({ message: e.detail.message, type: e.detail.type || "success" });
      setTimeout(() => setState(null), 4500);
    };
    window.addEventListener("AdvAqui:toast", handler);
    return () => window.removeEventListener("AdvAqui:toast", handler);
  }, []);

  if (!state) return null;

  const palette =
    state.type === "success"
      ? "bg-emerald-600 text-white"
      : state.type === "error"
      ? "bg-red-600 text-white"
      : "bg-brand-accent text-brand-ink";

  const Icon = state.type === "success" ? Check : state.type === "error" ? AlertCircle : X;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-xl shadow-cardHover flex items-center gap-2 text-sm font-medium ${palette}`}
    >
      <Icon className="w-4 h-4" aria-hidden />
      {state.message}
    </div>
  );
}
