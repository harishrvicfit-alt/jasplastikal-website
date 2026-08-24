"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const links = [
  ["O nama", "#o-nama"],
  ["Ponuda", "#ponuda"],
  ["Sistemi", "#sistemi"],
  ["Partneri", "#partneri"],
  ["Kontakt", "#kontakt"],
] as const;

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div className={`mobile-menu ${open ? "is-open" : ""}`}>
      <button
        type="button"
        className="mobile-menu-toggle"
        aria-label={open ? "Zatvori navigaciju" : "Otvori navigaciju"}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen((current) => !current)}
      >
        {open ? <X size={23} /> : <Menu size={23} />}
      </button>
      {open ? (
        <>
          <button className="mobile-menu-backdrop" type="button" aria-label="Zatvori navigaciju" onClick={() => setOpen(false)} />
          <nav id="mobile-navigation" aria-label="Mobilna navigacija">
            <span className="mobile-menu-kicker">Navigacija</span>
            {links.map(([label, href], index) => (
              <a key={href} href={href} onClick={() => setOpen(false)}>
                <small>0{index + 1}</small>
                {label}
              </a>
            ))}
            <a className="mobile-menu-cta" href="tel:+38761478480" onClick={() => setOpen(false)}>
              Pozovi +387 61 478 480
            </a>
          </nav>
        </>
      ) : null}
    </div>
  );
}
