import type { Metadata } from "next";

// Public business identity must not depend on a deployment's generated hostname.
export const SITE_URL = "https://www.jasplastikal.com";
export const languageUrls = { bs: `${SITE_URL}/`, de: `${SITE_URL}/de`, en: `${SITE_URL}/en`, "x-default": `${SITE_URL}/` };
export const socialImage = { url: `${SITE_URL}/images/Zimski_vrt.jpg`, width: 1437, height: 1078, alt: "JAS PlastikAL — zimski vrt / Wintergarten / winter garden" };
export const brandIcons: Metadata["icons"] = {
  icon: [
    { url: "/favicon.ico", type: "image/x-icon", sizes: "16x16 32x32 48x48 256x256" },
    { url: "/favicon.png", type: "image/png", sizes: "192x192" },
  ],
  shortcut: "/favicon.ico",
  apple: { url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" },
};

export function pageMetadata(title: string, description: string, locale: "bs" | "de" | "en"): Metadata {
  const url = languageUrls[locale];
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    applicationName: "JAS PlastikAL",
    alternates: { canonical: url, languages: languageUrls },
    openGraph: { title, description, url, siteName: "JAS PlastikAL", type: "website", locale: { bs: "bs_BA", de: "de_DE", en: "en_GB" }[locale], images: [socialImage] },
    twitter: { card: "summary_large_image", title, description, images: [socialImage.url] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
    icons: brandIcons,
  };
}

export const businessSchema = {
  "@type": "HomeAndConstructionBusiness",
  "@id": `${SITE_URL}/#organization`,
  name: "JAS PlastikAL",
  legalName: "JAS PlastikAL d.o.o.",
  foundingDate: "2017",
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/images/logojas.png`,
  image: socialImage.url,
  email: "info@jasplastikal.com",
  telephone: "+38761478480",
  address: { "@type": "PostalAddress", streetAddress: "Bosanska bb", postalCode: "74250", addressLocality: "Maglaj", addressCountry: "BA" },
  areaServed: ["Bosnia and Herzegovina", "Croatia", "Austria", "Germany", "Luxembourg", "Netherlands"].map(name => ({ "@type": "Country", name })),
};

export function siteSchema(locale: "bs" | "de" | "en", services: { title: string; text: string }[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      businessSchema,
      { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: "JAS PlastikAL", inLanguage: ["bs", "de", "en"], publisher: { "@id": businessSchema["@id"] } },
      { "@type": "WebPage", "@id": `${languageUrls[locale]}#webpage`, url: languageUrls[locale], inLanguage: locale, isPartOf: { "@id": `${SITE_URL}/#website` }, about: { "@id": businessSchema["@id"] }, mainEntity: { "@type": "OfferCatalog", name: "JAS PlastikAL", itemListElement: services.map(item => ({ "@type": "OfferCatalog", name: item.title, itemListElement: [{ "@type": "Service", name: item.title, description: item.text, provider: { "@id": businessSchema["@id"] } }] })) } },
    ],
  };
}

export function jsonLd(value: unknown) { return JSON.stringify(value).replace(/</g, "\\u003c"); }
