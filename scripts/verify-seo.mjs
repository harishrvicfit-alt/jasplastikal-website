import assert from "node:assert/strict";

const base = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const canonical = "https://www.jasplastikal.com";
const paths = ["/", "/de", "/en"];
const assetPaths = new Set();
for (const [index, path] of paths.entries()) {
  const response = await fetch(`${base}${path}`);
  assert.equal(response.status, 200, path);
  const html = await response.text();
  assert.match(html, new RegExp(`<html[^>]+lang="${["bs", "de", "en"][index]}"`));
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `${path}: exactly one H1`);
  const canonicalHref = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  assert.equal(new URL(canonicalHref).href, new URL(`${canonical}${path}`).href, `${path}: canonical`);
  for (const lang of ["bs", "de", "en", "x-default"]) assert(html.includes(`hrefLang="${lang}"`), `${path}: hreflang ${lang}`);
  assert(!/<meta name="robots" content="[^"]*noindex/.test(html), `${path}: indexable`);
  const structured = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
  assert.equal(structured[0]["@graph"][0].url, `${canonical}/`);
  for (const match of html.matchAll(/href="(#[^"]+)"/g)) {
    assert(html.includes(`id="${match[1].slice(1)}"`), `${path}: missing anchor ${match[1]}`);
  }
  for (const match of html.matchAll(/(?:href|src)="(\/[^"#?]+)(?:\?[^"#]*)?"/g)) {
    if (!match[1].startsWith("/_next")) assetPaths.add(match[1]);
  }
  console.log(`PASS ${path}: 200, language, H1, canonical, hreflang, JSON-LD, anchors`);
}
for (const [source, target] of [["/index.html", "/"], ["/indexDE.html", "/de"], ["/indexEN.html", "/en"], ["/assets/catalog/Katalog_PDF.pdf", "/JASPlastikAL-katalog-2024.pdf"]]) {
  const response = await fetch(`${base}${source}`, { redirect: "manual" });
  assert.equal(response.status, 308, source);
  assert.equal(new URL(response.headers.get("location"), base).pathname, target);
  const final = await fetch(`${base}${source}`);
  assert.equal(final.status, 200, `${source}: final destination`);
  console.log(`PASS ${source}: 308 → ${target} → 200`);
}
const robots = await (await fetch(`${base}/robots.txt`)).text();
assert(robots.includes(`Sitemap: ${canonical}/sitemap.xml`));
assert(!robots.includes("Disallow: /\n"));
const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
for (const path of paths) assert(sitemap.includes(`<loc>${canonical}${path}</loc>`));
assert(!sitemap.includes("vercel.app"));
const missing = await fetch(`${base}/this-page-does-not-exist-seo-test`);
assert.equal(missing.status, 404);
assert.match(await missing.text(), /name="robots" content="[^"]*noindex/);
for (const path of assetPaths) {
  const response = await fetch(`${base}${path}`, { method: "HEAD" });
  assert.equal(response.status, 200, `internal resource ${path}`);
}
console.log(`PASS robots.txt, sitemap.xml, real 404/noindex, ${assetPaths.size} internal resources`);
