"use client";

import { ArrowUpRight, Check, LoaderCircle, TriangleAlert } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [feedback, setFeedback] = useState("");
  const submitting = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus("submitting");
    setFeedback("Šaljemo vaš upit…");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(35_000),
        body: JSON.stringify({
          name: String(data.get("name") ?? ""),
          contact: String(data.get("contact") ?? ""),
          project: String(data.get("project") ?? ""),
          message: String(data.get("message") ?? ""),
          website: String(data.get("website") ?? ""),
        }),
      });

      const result = (await response.json().catch(() => null)) as { ok?: boolean; message?: string } | null;
      if (!response.ok || result?.ok !== true) throw new Error(result?.message || "Upit trenutno nije moguće poslati.");

      form.reset();
      setStatus("success");
      setFeedback("Hvala! Vaš upit je uspješno poslan. Javit ćemo vam se u najkraćem roku.");
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error && error.name === "TimeoutError"
        ? "Potvrda slanja traje duže nego očekivano. Pokušajte ponovo; isti upit neće biti poslan dvaput."
        : error instanceof TypeError ? "Provjerite internet vezu i pokušajte ponovo. Vaš tekst je sačuvan u formi."
        : error instanceof Error ? error.message : "Došlo je do greške. Pokušajte ponovo.");
    } finally {
      submitting.current = false;
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} aria-busy={status === "submitting"}>
      <div className="contact-form-heading">
        <span>Brzi upit / 01</span>
        <p>Ispunite detalje i pošaljite upit direktno našem prodajnom timu.</p>
      </div>
      <div className="field-grid">
        <label>
          <span>Ime i prezime</span>
          <input name="name" type="text" autoComplete="name" placeholder="Vaše ime" minLength={2} maxLength={100} required />
        </label>
        <label>
          <span>Telefon ili e-mail</span>
          <input name="contact" type="text" autoComplete="email" placeholder="Kako da vas kontaktiramo?" minLength={5} maxLength={160} required />
        </label>
      </div>
      <label>
        <span>Vrsta projekta</span>
        <select name="project" defaultValue="" required>
          <option value="" disabled>Odaberite proizvod</option>
          <option>PVC stolarija</option>
          <option>AL bravarija</option>
          <option>Ulazna vrata</option>
          <option>Klizni sistemi</option>
          <option>Staklene fasade</option>
          <option>Zimski vrt</option>
          <option>Roletne i komarnici</option>
          <option>Garažna vrata</option>
          <option>AL ograde i kapije</option>
          <option>Ostalo</option>
        </select>
      </label>
      <label>
        <span>Opis i približne dimenzije</span>
        <textarea name="message" rows={4} placeholder="Npr. 6 prozora, novogradnja u Sarajevu…" minLength={10} maxLength={3000} required />
      </label>
      <label className="form-honeypot" aria-hidden="true">
        <span>Web stranica</span>
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </label>
      <button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? <><LoaderCircle className="form-spinner" size={18} /> Šaljem upit</> : <>Pošalji upit <ArrowUpRight size={18} /></>}
      </button>
      <p className={feedback ? `form-feedback ${status}` : "form-feedback-empty"} role="status" aria-live="polite" aria-atomic="true">
        {status === "success" ? <Check size={16} /> : status === "error" ? <TriangleAlert size={16} /> : null}
        {feedback}
      </p>
      {status === "error" ? <small>Možete nam pisati i na <a href="mailto:jasplastikal@gmail.com">jasplastikal@gmail.com</a> ili nas pozvati na <a href="tel:+38761478480">+387 61 478 480</a>.</small> : null}
      <small>Vaši podaci koriste se isključivo za odgovor na ovaj upit i ne pohranjuju se na web stranici.</small>
    </form>
  );
}
