import { FileText, ExternalLink } from "lucide-react";
import { CopyButton } from "./CopyButton";

type Props = {
  /** Server portal name, ex.: "Portal de Dados Abertos do STJ" */
  source_portal?: string | null;
  dataset_name?: string | null;
  dataset_url?: string | null;
  resource_name?: string | null;
  resource_url?: string | null;
  source_format?: string | null;
  /** Tribunal (STF/STJ) — usado pra fallback de pesquisa pública */
  tribunal?: string;
  /** Visual: 'full' (card completo na página individual) ou 'compact' (em card de listagem) */
  variant?: "full" | "compact";
  /** Referência técnica copiável (ex.: classe + número + URL). Usado no botão "Copiar referência". */
  copyReference?: string;
};

const TRIBUNAL_SEARCH: Record<string, string> = {
  STJ:
    "https://www.stj.jus.br/sites/portalp/Paginas/Sob-medida/Advogado/Jurisprudencia/Pesquisa-de-Jurisprudencia.aspx",
  STF: "https://jurisprudencia.stf.jus.br/pages/search?base=acordaos",
};

/**
 * Componente reutilizável da Fonte Oficial dos Dados.
 *
 * Princípios:
 *   - NUNCA mostra URL técnica longa como TEXTO visível ao usuário.
 *   - URL completa fica em href do botão.
 *   - JSON NÃO é chamado de "inteiro teor". É "arquivo oficial de dados".
 *   - Quando dataset/resource não existem, oculta o botão correspondente.
 *   - variant="compact" pra usar dentro de cards na listagem.
 */
export function OfficialSourceBox({
  source_portal,
  dataset_name,
  dataset_url,
  resource_name,
  resource_url,
  source_format,
  tribunal = "STJ",
  variant = "full",
  copyReference,
}: Props) {
  // Versão compacta — pra cards de listagem
  if (variant === "compact") {
    return (
      <div className="text-xs text-brand-ink/65 flex flex-wrap items-center gap-2">
        <span>
          Fonte:{" "}
          <span className="font-medium text-brand-ink/80">
            {source_portal || `Portal de Dados Abertos do ${tribunal}`}
          </span>
        </span>
        {dataset_url && (
          <a
            href={dataset_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-brand-deep hover:underline"
          >
            <ExternalLink className="w-3 h-3" aria-hidden />
            Ver fonte oficial
          </a>
        )}
      </div>
    );
  }

  // Versão completa — pra página individual
  return (
    <div>
      <dl className="text-xs space-y-1.5 mb-4">
        <div className="flex flex-wrap gap-1.5">
          <dt className="text-brand-ink/55 font-semibold uppercase tracking-wide">
            Portal:
          </dt>
          <dd className="text-brand-ink/90">
            {source_portal || `Portal de Dados Abertos do ${tribunal}`}
          </dd>
        </div>
        {dataset_name && (
          <div className="flex flex-wrap gap-1.5">
            <dt className="text-brand-ink/55 font-semibold uppercase tracking-wide">
              Conjunto de dados:
            </dt>
            <dd className="text-brand-ink/90">{dataset_name}</dd>
          </div>
        )}
        {resource_name && (
          <div className="flex flex-wrap gap-1.5">
            <dt className="text-brand-ink/55 font-semibold uppercase tracking-wide">
              Arquivo oficial:
            </dt>
            <dd className="text-brand-ink/90 font-mono">{resource_name}</dd>
          </div>
        )}
        {source_format && (
          <div className="flex flex-wrap gap-1.5">
            <dt className="text-brand-ink/55 font-semibold uppercase tracking-wide">
              Formato:
            </dt>
            <dd className="text-brand-ink/90">{source_format}</dd>
          </div>
        )}
      </dl>

      <div className="flex flex-wrap gap-2">
        {dataset_url && (
          <a
            href={dataset_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-brand-deep text-brand-deep hover:bg-brand-deep hover:text-white transition"
          >
            <ExternalLink className="w-4 h-4" aria-hidden />
            Ver conjunto de dados no {tribunal}
          </a>
        )}
        {resource_url && (
          <a
            href={resource_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-brand-line text-brand-ink hover:border-brand-deep transition"
          >
            <FileText className="w-4 h-4" aria-hidden />
            Baixar arquivo {source_format || "JSON"} oficial
          </a>
        )}
        <a
          href={TRIBUNAL_SEARCH[tribunal] || TRIBUNAL_SEARCH.STJ}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-brand-line text-brand-ink hover:border-brand-deep transition"
        >
          <ExternalLink className="w-4 h-4" aria-hidden />
          Pesquisar no site do {tribunal}
        </a>
        {copyReference && (
          <CopyButton
            text={copyReference}
            label="Copiar referência técnica"
            copiedLabel="Referência copiada!"
            variant="ghost"
            className="text-sm px-4 py-2"
          />
        )}
      </div>
    </div>
  );
}
