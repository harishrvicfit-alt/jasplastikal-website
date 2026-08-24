import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <Link className="not-found-brand" href="/" aria-label="JAS PlastikAL — početna">
        <Image src="/images/logojas.png" alt="JAS PlastikAL" width={160} height={92} preload />
      </Link>
      <div className="not-found-grid" aria-hidden="true" />
      <div className="not-found-code">404</div>
      <div className="not-found-copy">
        <span>Ovaj otvor nema okvir</span>
        <h1>Stranica nije pronađena.</h1>
        <p>Link je možda zastario ili je adresa pogrešno unesena. Vratite se na početnu stranicu ili nam odmah pošaljite upit.</p>
        <div>
          <Link className="button button-primary" href="/"><ArrowLeft size={18} /> Na početnu</Link>
          <a className="button button-ghost" href="mailto:jasplastikal@gmail.com"><Mail size={18} /> Kontakt</a>
        </div>
      </div>
    </main>
  );
}
