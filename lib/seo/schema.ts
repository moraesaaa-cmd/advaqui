import { SITE } from "@/lib/config";
import type { Lawyer } from "@/lib/data/lawyer-mapper";

/**
 * Organization — entidade que opera o site. Inclui contato de suporte
 * para sinalização do Google de que existe canal humano de atendimento.
 */
export const orgSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: SITE.url,
  description: SITE.description,
  logo: `${SITE.url}/opengraph-image`,
  contactPoint: [
    {
      "@type": "ContactPoint",
      email: SITE.email,
      contactType: "customer support",
      availableLanguage: ["Portuguese"]
    }
  ]
});

/**
 * WebSite — habilita o sitelink searchbox no Google quando o site tem
 * autoridade suficiente (mostra caixa de busca direto nos resultados).
 *
 * O template `target` usa /buscar?q= que é a rota da busca interna.
 */
export const websiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: SITE.url,
  name: SITE.name,
  description: SITE.description,
  inLanguage: "pt-BR",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE.url}/buscar?q={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  }
});

export const breadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: item.url.startsWith("http") ? item.url : `${SITE.url}${item.url}`
  }))
});

export const lawyerSchema = (lawyer: Lawyer) => ({
  "@context": "https://schema.org",
  "@type": "LegalService",
  name: lawyer.name,
  description: lawyer.bio,
  telephone: lawyer.phone,
  email: lawyer.email,
  url: `${SITE.url}/p/${lawyer.slug}`,
  areaServed: {
    "@type": "City",
    name: lawyer.cityName,
    address: { "@type": "PostalAddress", addressRegion: lawyer.uf, addressCountry: "BR" }
  },
  address: lawyer.address
    ? {
        "@type": "PostalAddress",
        streetAddress: lawyer.address,
        addressLocality: lawyer.cityName,
        addressRegion: lawyer.uf,
        addressCountry: "BR"
      }
    : undefined,
  knowsAbout: lawyer.specialties
});

export const cityServiceSchema = (cityName: string, uf: string, count: number) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: `Advogados em ${cityName}`,
  areaServed: { "@type": "City", name: cityName, addressRegion: uf, addressCountry: "BR" },
  provider: { "@type": "Organization", name: SITE.name, url: SITE.url },
  description: `Diretório de ${count} advogado(s) cadastrado(s) em ${cityName}, ${uf}, organizados por especialidade.`
});
