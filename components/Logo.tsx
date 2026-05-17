import { SITE } from "@/lib/config";

export function Logo({ light = false }: { light?: boolean }) {
  const ink = light ? "text-white" : "text-brand-ink";
  const accent = "text-brand-accent";
  return (
    <span className={`inline-flex items-center gap-2 font-display ${ink}`}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M6 5h12l8 8-14 14L6 19V5z"
          fill="currentColor"
          className={accent}
        />
        <path
          d="M11 11h6M11 14h8M11 17h5"
          stroke={light ? "#0F1B2D" : "#FBF9F4"}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-lg font-bold tracking-tight">{SITE.name}</span>
    </span>
  );
}
