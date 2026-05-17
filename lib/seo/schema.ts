import { SITE } from "@/lib/config";
import type { Lawyer } from "@/lib/data/lawyers";

export const orgSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: SITE.url,
  description: SITE.description,
  logo: `${SITE.url}/logo.png`
});

export const websiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: SITE.url,
  name: SITE.name,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE.url}/buscar?q={search_term_string}`,
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
