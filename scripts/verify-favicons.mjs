import assert from "node:assert/strict";
const base = (process.argv[2] || "http://localhost:3210").replace(/\/$/, "");
function pngSize(data, expected) {
  assert.equal(data.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  assert.equal(data.readUInt32BE(16), expected);
  assert.equal(data.readUInt32BE(20), expected);
}
for (const [path, size] of [["/favicon.png", 192], ["/apple-touch-icon.png", 180]]) {
  const response = await fetch(base + path);
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /image\/png/);
  assert(!response.headers.get("x-robots-tag")?.includes("noindex"));
  pngSize(Buffer.from(await response.arrayBuffer()), size);
  console.log(`PASS ${path}: valid ${size}×${size} PNG, 200, crawlable`);
}
const response = await fetch(base + "/favicon.ico");
assert.equal(response.status, 200);
assert.match(response.headers.get("content-type"), /image\/(x-icon|vnd.microsoft.icon)/);
const ico = Buffer.from(await response.arrayBuffer());
assert.equal(ico.readUInt16LE(0), 0);
assert.equal(ico.readUInt16LE(2), 1);
assert.equal(ico.readUInt16LE(4), 4);
for (const [index, size] of [16, 32, 48, 256].entries()) {
  const entry = 6 + index * 16;
  assert.equal(ico[entry] || 256, size);
  assert.equal(ico[entry + 1] || 256, size);
  const length = ico.readUInt32LE(entry + 8);
  const offset = ico.readUInt32LE(entry + 12);
  assert(offset + length <= ico.length);
  pngSize(ico.subarray(offset, offset + length), size);
}
console.log("PASS /favicon.ico: 4 valid embedded images, 16/32/48/256 px");
for (const path of ["/", "/de", "/en", "/missing-favicon-test-page"]) {
  const html = await (await fetch(base + path)).text();
  for (const icon of ["favicon.ico", "favicon.png", "apple-touch-icon.png"]) assert(html.includes(`href="/${icon}"`), `${path}: ${icon}`);
  assert(!/<link[^>]*rel="(?:icon|shortcut icon|apple-touch-icon)"[^>]*logojas.png/.test(html));
  console.log(`PASS ${path}: correct icon declarations`);
}
