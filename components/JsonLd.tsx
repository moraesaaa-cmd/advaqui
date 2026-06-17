export function JsonLd({ data }: { data: unknown }) {
  // Escapa caracteres que poderiam quebrar o bloco <script> ou injetar HTML/JS
  // (XSS armazenado via nome/bio do advogado, editaveis no painel). Neutraliza
  // "</script>" e entidades, mantendo o JSON-LD valido.
  const json = JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
  );
}
