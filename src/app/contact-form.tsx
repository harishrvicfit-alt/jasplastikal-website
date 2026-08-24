"use client";

import { ArrowUpRight } from "lucide-react";
import type { FormEvent } from "react";

export default function ContactForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const contact = String(data.get("contact") ?? "").trim();
    const project = String(data.get("project") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const subject = encodeURIComponent(`Upit za ${project} — ${name}`);
    const body = encodeURIComponent(`Ime i prezime: ${name}\nKontakt: ${contact}\nVrsta projekta: ${project}\n\nOpis projekta:\n${message}`);

    window.location.href = `mailto:jasplastikal@gmail.com?subject=${subject}&body=${body}`;
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="contact-form-heading">
        <span>Brzi upit / 01</span>
        <p>Ispunite detalje i otvorit ćemo pripremljen e-mail koji možete dopuniti fotografijama ili skicom.</p>
      </div>
      <div className="field-grid">
        <label>
          <span>Ime i prezime</span>
          <input name="name" type="text" autoComplete="name" placeholder="Vaše ime" required />
        </label>
        <label>
          <span>Telefon ili e-mail</span>
          <input name="contact" type="text" autoComplete="email" placeholder="Kako da vas kontaktiramo?" required />
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
          <option>Ostalo</option>
        </select>
      </label>
      <label>
        <span>Opis i približne dimenzije</span>
        <textarea name="message" rows={4} placeholder="Npr. 6 prozora, novogradnja u Sarajevu…" required />
      </label>
      <button type="submit">Pripremi e-mail <ArrowUpRight size={18} /></button>
      <small>Slanjem se otvara vaš e-mail program; podaci se ne pohranjuju na ovoj stranici.</small>
    </form>
  );
}
