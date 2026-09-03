export default function LanguageLinks({ current }: { current: "bs" | "de" | "en" }) {
  return <nav className="language-bar" aria-label="Language / Sprache / Jezik">
    <span>JAS PlastikAL · Maglaj</span>
    <div>{([{ locale: "bs", href: "/", label: "Bosanski" }, { locale: "de", href: "/de", label: "Deutsch" }, { locale: "en", href: "/en", label: "English" }] as const).map(item => <a key={item.locale} href={item.href} hrefLang={item.locale} lang={item.locale} aria-current={current === item.locale ? "page" : undefined}>{item.label}</a>)}</div>
  </nav>;
}
