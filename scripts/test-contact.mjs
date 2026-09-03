// No real email is sent: all provider requests are intercepted before importing the route.
import assert from "node:assert/strict";
let calls = [];
let providerMode = "success";
globalThis.fetch = async (url, options) => {
  assert.equal(String(url), "https://api.resend.com/emails");
  calls.push({ body: JSON.parse(options.body), headers: new Headers(options.headers) });
  if (providerMode === "throw") throw new Error("Simulated connection loss");
  if (providerMode === "reject") return Response.json({ name: "validation_error", message: "Simulated failure" }, { status: 422 });
  if (providerMode === "empty") return Response.json({});
  return Response.json({ id: "simulated-email-id" });
};
const { POST } = await import("../src/app/api/contact/route.ts");
const valid = { name: "Test Osoba", contact: "visitor@example.com", project: "PVC stolarija", message: "Testni opis projekta i dimenzija.", website: "" };
function request(body, extraHeaders = {}, raw = false) {
  return new Request("https://www.jasplastikal.com/api/contact", {
    method: "POST", headers: { origin: "https://www.jasplastikal.com", "content-type": "application/json", ...extraHeaders },
    body: raw ? body : JSON.stringify(body),
  });
}
for (const [name, body, headers, expected, raw] of [
  ["null payload", null, {}, 400],
  ["array payload", [], {}, 400],
  ["malformed JSON", "{", {}, 400, true],
  ["cross-origin", valid, { origin: "https://untrusted.example" }, 403],
  ["missing origin", valid, { origin: "" }, 403],
  ["wrong content type", valid, { "content-type": "text/plain" }, 415],
  ["oversized body", "a".repeat(17_000), {}, 413, true],
  ["missing fields", {}, {}, 400],
  ["invalid contact", { ...valid, contact: "abcde" }, {}, 400],
  ["invalid project", { ...valid, project: "unknown" }, {}, 400],
  ["header injection", { ...valid, name: "Hello\nBcc: x@example.com" }, {}, 400],
  ["field too long", { ...valid, message: "a".repeat(3001) }, {}, 400],
  ["honeypot", { ...valid, website: "bot.example" }, {}, 200],
]) {
  const result = await POST(request(body, headers, raw));
  assert.equal(result.status, expected, name);
  assert.equal(calls.length, 0, `${name}: must not contact Resend`);
  console.log(`PASS ${name}: ${expected}, no send`);
}
process.env.RESEND_API_KEY = "re_local_mock_only";
process.env.RESEND_FROM_EMAIL = "JAS PlastikAL <upiti@jasplastikal.com>";
delete process.env.CONTACT_TO_EMAIL;
assert.equal((await POST(request(valid))).status, 503);
assert.equal(calls.length, 0);
process.env.CONTACT_TO_EMAIL = "delivered@resend.dev";
const result = await POST(request({ ...valid, name: "A <B>", message: "<script>alert('x')</script>" }));
assert.equal(result.status, 200);
assert.deepEqual(await result.json(), { ok: true });
assert.deepEqual(calls[0].body.to, ["delivered@resend.dev"]);
assert.equal(calls[0].body.reply_to, valid.contact);
assert(!calls[0].body.html.includes("<script>"));
assert(calls[0].body.html.includes("&lt;script&gt;"));
console.log("PASS successful send, server-only recipient, escaped HTML, Reply-To");
calls = [];
await POST(request(valid));
await POST(request(valid));
assert.equal(calls[0].headers.get("idempotency-key"), calls[1].headers.get("idempotency-key"));
assert(calls[0].headers.get("idempotency-key").startsWith("contact-"));
console.log("PASS retry deduplication key");
await POST(request({ ...valid, contact: "+387 61 478 480", project: "AL ograde i kapije" }));
assert.equal(calls.at(-1).body.reply_to, undefined);
console.log("PASS phone contact and AL fences project");
for (const mode of ["reject", "throw", "empty"]) {
  providerMode = mode;
  const failure = await POST(request(valid));
  assert(failure.status >= 500);
  assert.notEqual((await failure.json()).ok, true);
  console.log(`PASS provider ${mode}: no false success`);
}
console.log("All contact route tests passed; no network requests were made.");
