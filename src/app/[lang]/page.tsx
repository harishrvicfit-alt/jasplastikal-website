import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, Download, Mail, Phone } from "lucide-react";
import LanguageLinks from "@/components/language-links";
import { translations } from "@/lib/translations";
import { jsonLd, pageMetadata, siteSchema } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() { return [{ lang: "de" }, { lang: "en" }]; }
function getContent(lang: string) {
  if (lang !== "de" && lang !== "en") notFound();
  return { lang, t: translations[lang] } as const;
}
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang, t } = getContent((await params).lang);
  return pageMetadata(t.title, t.description, lang);
}
export default async function InternationalPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang, t } = getContent((await params).lang);
  const sectionIds = ["about", "products", "systems", "contact"];
  return <main className="international-page" id="top">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(siteSchema(lang, [...t.services])) }} />
    <LanguageLinks current={lang} />
    <a className="skip-link" href="#hero-title">{t.skip}</a>
    <header className="intl-header">
      <a className="brand" href={`/${lang}`} aria-label="JAS PlastikAL"><Image src="/images/logojas.png" alt="JAS PlastikAL" width={160} height={92} preload /></a>
      <nav aria-label={lang === "de" ? "Hauptnavigation" : "Main navigation"}>{t.nav.map((label, i) => <a key={label} href={`#${sectionIds[i]}`}>{label}</a>)}</nav>
      <a className="intl-header-cta" href="#contact">{t.request} <ArrowRight size={17} /></a>
    </header>
    <section className="intl-hero" aria-labelledby="hero-title">
      <div className="intl-hero-copy"><p className="eyebrow">{t.eyebrow}</p><h1 id="hero-title">{t.heading}<br /><em>{t.accent}</em></h1><p>{t.lead}</p><div className="hero-actions"><a className="button button-primary" href="#contact">{t.request}<ArrowRight size={18} /></a><a className="text-link" href="/JASPlastikAL-katalog-2024.pdf" download>{t.catalog}<Download size={17} /></a></div></div>
      <div className="intl-hero-image"><Image src="/images/Zimski_vrt.jpg" alt={t.photoAlt} fill sizes="(max-width: 900px) 100vw, 48vw" preload /><span>JAS PlastikAL / FEAL</span></div>
    </section>
    <section className="intl-section intl-about" id="about"><span className="legacy-anchor" id="Onama" /><p className="section-label">01 / {t.nav[0]}</p><div><h2>{t.aboutTitle}</h2><p>{t.about}</p><p className="intl-markets">{t.markets}</p></div></section>
    <section className="intl-section intl-products" id="products"><span className="legacy-anchor" id="Usluge" /><p className="section-label">02 / {t.nav[1]}</p><div className="intl-heading"><h2>{t.offerTitle}</h2><p>{t.offerLead}</p></div><div className="intl-product-grid">{t.services.map((item, index) => <article key={item.title}><div className="intl-product-image"><span>{String(index + 1).padStart(2, "0")}</span><Image src={`/images/${item.image}`} alt={item.title} fill sizes="(max-width: 650px) 100vw, (max-width: 1050px) 50vw, 33vw" /></div><div className="intl-product-copy"><h3>{item.title}</h3><p>{item.text}</p><a className="text-link" href="#contact" aria-label={`${t.request}: ${item.title}`}>{t.request}<ArrowRight size={16} /></a></div></article>)}</div><p className="intl-extras">{t.extras}</p></section>
    <section className="intl-section" id="systems"><p className="section-label">03 / {t.nav[2]}</p><div className="intl-heading"><h2>{t.systemsTitle}</h2><p>{t.systemsLead}</p></div><dl className="intl-specs">{t.systems.map(([name, detail]) => <div key={name}><dt>{name}</dt><dd>{detail}</dd></div>)}</dl></section>
    <section className="intl-section intl-contact" id="contact"><span className="legacy-anchor" id="Kontakt" /><p className="section-label">04 / {t.nav[3]}</p><div className="intl-heading"><h2>{t.contactTitle}</h2><p>{t.contactText}</p></div><div className="contact-actions"><a className="button button-primary" href="mailto:info@jasplastikal.com">{t.request}<Mail size={18} /></a><a className="button button-outline-light" href="tel:+38761478480">+387 61 478 480<Phone size={18} /></a></div><div className="intl-contact-grid"><div><h3>{t.address}</h3><a href="https://maps.google.com/?q=JAS+PlastikAL+Maglaj" target="_blank" rel="noopener noreferrer">Bosanska bb<br />74250 Maglaj, BiH</a></div><div><h3>{t.email}</h3><a href="mailto:info@jasplastikal.com">info@jasplastikal.com</a><a href="mailto:jasplastikal@gmail.com">jasplastikal@gmail.com</a></div><div><h3>{t.phone}</h3><a href="tel:+38761478480">Asim · +387 61 478 480</a><a href="tel:+38762683524">Ajdin · +387 62 683 524</a><a href="tel:+38762235112">Saud · +387 62 235 112</a></div><div><h3>{t.germanContact}</h3><a href="tel:+4915228531422">Zlatan · +49 1522 8531422</a></div></div></section>
    <footer className="intl-footer"><span>© {new Date().getFullYear()} JAS PlastikAL d.o.o. {t.rights}</span><span>{t.credit} <a href="https://www.h-cyber.de" target="_blank" rel="noopener noreferrer">H-Cyber</a></span></footer>
  </main>;
}
