import { SITE } from "@/lib/config";

/**
 * Logo do handoff "Melhorias para advaqui.com" (Apex / claude_design):
 * pino de localização dourado (#C8A24A) com um "check" navy no centro —
 * "advogado verificado perto de você". Wordmark em Newsreader (font-display).
 * O check fica navy sobre o pino dourado em qualquer fundo; só o wordmark
 * muda de cor (light = branco no header navy; senão, navy).
 */
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 font-display ${light ? "text-white" : "text-brand-ink"}`}>
      <svg
        width="22"
        height="26"
        viewBox="0 0 24 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        className="block"
      >
        <path
          d="M12 0C5.37 0 0 5.37 0 12c0 8.4 12 16 12 16s12-7.6 12-16C24 5.37 18.63 0 12 0z"
          fill="#C8A24A"
        />
        <path
          d="M7.5 12.2l3 3 6-6.2"
          stroke="#0F1B2D"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-[1.4rem] font-semibold tracking-tight leading-none">{SITE.name}</span>
    </span>
  );
}
