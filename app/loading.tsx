export default function Loading() {
  return (
    <div className="container-tight py-20">
      <div className="flex flex-col items-center gap-3 text-brand-ink/50">
        <div
          aria-hidden
          className="w-10 h-10 border-4 border-brand-line border-t-brand-deep rounded-full animate-spin"
        />
        <p className="text-sm">Carregando…</p>
      </div>
    </div>
  );
}
