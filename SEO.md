# SEO maintenance

Canonical host: https://www.jasplastikal.com

- `/` = Bosnian, `/de` = German, `/en` = English; static server-rendered HTML with correctly scoped document languages.
- `src/lib/seo.ts` holds public business identity, metadata and reciprocal language alternates. Do not derive public URLs from a Vercel deployment hostname.
- `src/app/sitemap.ts` lists canonical pages. Update `lastModified` only when public content changes.
- Keep permanent redirects in `next.config.ts` for old `index.html`, `indexDE.html`, `indexEN.html` and the old catalogue URL for at least a year, preferably indefinitely. Do not redirect unknown pages indiscriminately to the homepage.
- No invented ratings, prices, business hours or certifications were added to structured data.

## Verification after publishing

```sh
node scripts/verify-seo.mjs https://www.jasplastikal.com
node scripts/submit-indexnow.mjs
```

IndexNow submits the changed public URLs to participating search engines. Run it after relevant changes, not repeatedly for unchanged content. A successful submission does not mean a page has already been indexed.

Google Search Console domain property: `jasplastikal.com`. Keep its separate Google verification TXT record. Submit `https://www.jasplastikal.com/sitemap.xml` and use URL Inspection after meaningful updates. Google and Bing determine crawl timing and rankings; neither can be guaranteed.

## Mail safety

SEO does not require changes to the Microsoft 365 MX, SPF, Microsoft verification TXT or autodiscover CNAME. Preserve these records. Resend/contact-form work is separate and was excluded from this SEO release.
