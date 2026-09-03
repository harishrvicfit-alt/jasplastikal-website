// Run only after a content change is live. This is not a scheduled polling job.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const host = "www.jasplastikal.com";
const keyFile = "5d2b27ca23854a759b5a4ef7a63b109b.txt";
const key = (await readFile(new URL(`../public/${keyFile}`, import.meta.url), "utf8")).trim();
const keyLocation = `https://${host}/${keyFile}`;
const proof = await fetch(keyLocation);
assert.equal(proof.status, 200, "Publish the verification file first");
assert.equal((await proof.text()).trim(), key, "Published verification file mismatch");
const paths = ["/", "/de", "/en", "/index.html", "/indexDE.html", "/indexEN.html", "/assets/catalog/Katalog_PDF.pdf", "/JASPlastikAL-katalog-2024.pdf"];
const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key, keyLocation, urlList: paths.map(path => `https://${host}${path}`) }),
});
console.log(`IndexNow HTTP ${response.status}: ${await response.text()}`);
assert([200, 202].includes(response.status), "Submission not accepted; inspect response before retrying");
console.log(`Submitted ${paths.length} changed URLs. Acceptance does not guarantee indexing.`);
