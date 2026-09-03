import { Resend } from "resend";
import { createHash } from "node:crypto";
import { checkBotId } from "botid/server";

export const runtime = "nodejs";
export const maxDuration = 30;

const PROJECTS = new Set([
  "PVC stolarija", "AL bravarija", "Ulazna vrata", "Klizni sistemi",
  "Staklene fasade", "Zimski vrt", "Roletne i komarnici", "Garažna vrata", "AL ograde i kapije", "Ostalo",
]);

type ContactPayload = {
  name?: unknown;
  contact?: unknown;
  project?: unknown;
  message?: unknown;
  website?: unknown;
};

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" && value.length <= maxLength ? value.trim() : "";
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  })[character] ?? character);
}

function isEmail(value: string) {
  return /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value);
}

function isPhone(value: string) {
  return /^\+?[\d\s()./-]+$/.test(value) && /^\d{7,15}$/.test(value.replace(/\D/g, ""));
}

// Limit streamed bodies too; Content-Length alone is not trustworthy.
async function readPayload(request: Request) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error("invalid_body");
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.length;
      if (length > 16_384) {
        await reader.cancel();
        throw new Error("body_too_large");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const payload: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) throw new Error("invalid_body");
  return payload as ContactPayload;
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host") || new URL(request.url).host;

  if (!origin || request.headers.get("sec-fetch-site") === "cross-site") {
    return Response.json({ message: "Zahtjev nije dozvoljen." }, { status: 403 });
  }
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    return Response.json({ message: "Podaci forme nisu ispravni." }, { status: 415 });
  }

  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        return Response.json({ message: "Zahtjev nije dozvoljen." }, { status: 403 });
      }
    } catch {
      return Response.json({ message: "Zahtjev nije ispravan." }, { status: 400 });
    }
  }

  let payload: ContactPayload;
  try {
    payload = await readPayload(request);
  } catch (error) {
    return Response.json({ message: "Podaci forme nisu ispravni." }, { status: error instanceof Error && error.message === "body_too_large" ? 413 : 400 });
  }

  if (payload.website) return Response.json({ ok: true });

  const name = clean(payload.name, 100);
  const contact = clean(payload.contact, 160);
  const project = clean(payload.project, 80);
  const message = clean(payload.message, 3000);

  if (name.length < 2 || /[\r\n\x00]/.test(name) || message.length < 10 || !PROJECTS.has(project)) {
    return Response.json({ message: "Provjerite obavezna polja i pokušajte ponovo." }, { status: 400 });
  }
  if (!isEmail(contact) && !isPhone(contact)) {
    return Response.json({ message: "Unesite ispravnu e-mail adresu ili broj telefona (7–15 cifara)." }, { status: 400 });
  }

  // Verify on the server before contacting Resend. No user-supplied bypass flags.
  try {
    const verification = await checkBotId({ advancedOptions: { checkLevel: "basic" } });
    if (verification.isBot) {
      return Response.json({ code: "BOT_BLOCKED", message: "Sigurnosna provjera nije uspjela. Osvježite stranicu i pokušajte ponovo ili nam pišite direktno na info@jasplastikal.com." }, { status: 403 });
    }
  } catch {
    console.error("Contact anti-spam verification unavailable.");
    return Response.json({ code: "BOT_CHECK_UNAVAILABLE", message: "Sigurnosna provjera trenutno nije dostupna. Pokušajte ponovo ili nam pišite na info@jasplastikal.com." }, { status: 503 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const recipients = (process.env.CONTACT_TO_EMAIL || "")
    .split(",").map((email) => email.trim()).filter(Boolean);

  if (!apiKey || !from || recipients.length === 0 || !recipients.every(isEmail)) {
    console.error("Contact form is missing Resend environment configuration.");
    return Response.json({ message: "Slanje trenutno nije dostupno. Molimo pokušajte kasnije ili nas pozovite." }, { status: 503 });
  }

  const safeName = escapeHtml(name);
  const safeContact = escapeHtml(contact);
  const safeProject = escapeHtml(project);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

  try {
    const resend = new Resend(apiKey);
    const email = {
      from,
      to: recipients,
      replyTo: isEmail(contact) ? contact : undefined,
      subject: `Novi upit: ${project} — ${name}`,
      text: `Ime i prezime: ${name}\nKontakt: ${contact}\nVrsta projekta: ${project}\n\nOpis projekta:\n${message}`,
      html: `<div style="font-family:Arial,sans-serif;max-width:640px;color:#111513"><p style="color:#258d7c;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase">Novi upit sa jasplastikal.com</p><h1 style="font-size:28px;margin:18px 0 28px">${safeProject}</h1><table style="width:100%;border-collapse:collapse"><tr><td style="padding:12px 0;border-bottom:1px solid #ddd;color:#686e69">Ime i prezime</td><td style="padding:12px 0;border-bottom:1px solid #ddd;font-weight:700">${safeName}</td></tr><tr><td style="padding:12px 0;border-bottom:1px solid #ddd;color:#686e69">Kontakt</td><td style="padding:12px 0;border-bottom:1px solid #ddd;font-weight:700">${safeContact}</td></tr></table><h2 style="font-size:16px;margin:28px 0 10px">Opis projekta</h2><p style="line-height:1.7">${safeMessage}</p></div>`,
    };
    // Provider-side deduplication also survives serverless restarts and network retries.
    const idempotencyKey = `contact-${createHash("sha256").update(JSON.stringify(email)).digest("hex")}`;
    const { data, error } = await resend.emails.send(email, { idempotencyKey });

    if (error) {
      console.error("Resend rejected contact email:", error.name);
      return Response.json({ message: "Upit trenutno nije moguće poslati. Pokušajte ponovo za nekoliko minuta." }, { status: 502 });
    }

    if (!data?.id) throw new Error("missing_delivery_receipt");
    console.info("Contact email accepted by Resend:", data.id);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Unexpected contact email error:", error instanceof Error ? error.name : "Unknown error");
    return Response.json({ message: "Došlo je do greške pri slanju. Pokušajte ponovo." }, { status: 500 });
  }
}
