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
  // sameAs só entra quando houver perfis reais (config SITE.social) — declarar
  // perfil inexistente é sinal ruim; quando o dono criar as redes, vira aqui.
  ...(Array.isArray(SITE.social) && SITE.social.length > 0 ? { sameAs: SITE.social } : {}),
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
  url: `${SITE.url}/advogado/${lawyer.slug}`,
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

/**
 * HowTo — para conteúdo passo a passo (problemas jurídicos, exemplos de cálculo).
 * Habilita rich results no Google e é uma das estruturas que modelos de IA
 * mais usam para citar instruções práticas.
 *
 * `steps` aceita {name, text} (problemas) ou só texto (exemplos de cálculo).
 */
export const howToSchema = (
  name: string,
  description: string,
  steps: Array<{ name?: string; text: string }>,
  url: string
) => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  name,
  description,
  inLanguage: "pt-BR",
  url: url.startsWith("http") ? url : `${SITE.url}${url}`,
  step: steps.map((s, i) => ({
    "@type": "HowToStep",
    position: i + 1,
    name: s.name || `Passo ${i + 1}`,
    text: s.text
  }))
});

export const lawyerPersonSchema = (lawyer: Lawyer) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  name: lawyer.name,
  jobTitle: "Advogado",
  description: lawyer.bio || undefined,
  url: `${SITE.url}/advogado/${lawyer.slug}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: lawyer.cityName,
    addressRegion: lawyer.uf,
    addressCountry: "BR",
    ...(lawyer.address ? { streetAddress: lawyer.address } : {})
  },
  areaServed: {
    "@type": "City",
    name: lawyer.cityName
  },
  knowsAbout: lawyer.specialties,
  memberOf: {
    "@type": "Organization",
    name: `OAB/${lawyer.oabUf}`
  }
});

/**
 * ItemList — estrutura explícita da lista de advogados exibida numa página
 * de diretório (cidade, cidade×especialidade, área×cidade). O Google passa
 * a ver a relação página→perfis listados, na ordem de exibição.
 */
export const lawyerItemListSchema = (
  name: string,
  lawyers: Array<Pick<Lawyer, "name" | "slug">>
) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name,
  numberOfItems: lawyers.length,
  itemListElement: lawyers.map((l, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: l.name,
    url: `${SITE.url}/advogado/${l.slug}`
  }))
});

export const cityServiceSchema = (cityName: string, uf: string, count: number) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: `Advogados em ${cityName}`,
  areaServed: { "@type": "City", name: cityName, addressRegion: uf, addressCountry: "BR" },
  provider: { "@type": "Organization", name: SITE.name, url: SITE.url },
  description: `Diretório de ${count} advogado(s) cadastrado(s) em ${cityName}, ${uf}, organizados por especialidade.`
});
