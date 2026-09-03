# Kontakt forma — Resend

Tok: forma na početnoj stranici → `POST /api/contact` → Resend → prodajni inbox.

## Konfiguracija

- Production `CONTACT_TO_EMAIL`: `jasplastikal@gmail.com` (postojeći primalac forme).
- `RESEND_FROM_EMAIL`: `JAS PlastikAL <upiti@jasplastikal.com>`.
- `RESEND_API_KEY`: Vercel Secret, samo serverski; dozvola Sending access samo za `jasplastikal.com`.
- Preview šalje isključivo na `delivered+jasplastikal-form@resend.dev`, Resend simulator, nikad firmi.
- Promjena Vercel varijabli zahtijeva novu objavu. Ne promovirati Preview build direktno u Production: napraviti produkcijsku objavu iz `main` s produkcijskim varijablama.
- `Reply-To` je e-mail posjetioca ako je unesen e-mail; broj telefona se prikazuje u poruci bez Reply-To zaglavlja.

## DNS — zaštita Microsoft 365

Dodani su samo `resend._domainkey` TXT te `send` TXT i MX za slanje/povratne poruke. Primanje u Resendu je isključeno.

**Ne mijenjati** glavni Microsoft 365 MX, postojeći SPF na korijenu domene, Microsoft verifikacijski TXT ni `autodiscover`.

## Provjere i ograničenja

- `node --experimental-strip-types scripts/test-contact.mjs`: presreće sve Resend mrežne pozive; nijedan pravi mail se ne šalje.
- Provjerava format i veličinu zahtjeva, Origin, obavezna polja, email/telefon, HTML escaping, honeypot, Reply-To, deduplikaciju i greške pružaoca usluge.
- Resend idempotency ključ za identičan sadržaj sprječava duplikate unutar njegovog 24-satnog prozora, uključujući ponavljanje nakon gubitka veze.
- Uspjeh znači da je Resend prihvatio poruku; stvarnu dostavu pratiti pod Resend → Emails. Dostava u inbox naspram spama zavisi i od primaoca.
- Osnovna zaštita uključuje honeypot i provjeru porijekla zahtjeva; to nije potpuna zaštita od ciljanog bot-spama. Ako se pojavi zloupotreba, dodati CAPTCHA ili distribuirano ograničenje zahtjeva. Resend kvote dijele se s drugim projektima na istom nalogu.

## Izvršeni test 2026-09-03

Preview: `jasplastikal-website-7je44fh1a-harishrvicfit-alts-projects.vercel.app`.

Browser je potvrdio ispravnu grešku za neispravan kontakt, zadržavanje unosa te uspjeh i reset forme za ispravan unos. Resend testna poruka `01a0663f-5e7b-75cc-816c-5020d2b9f86f` ima status Delivered, ispravan From, Reply-To i sadržaj. Nijedan test nije poslan firmi. Build, TypeScript i ESLint su prošli.
