import { Manrope, Space_Grotesk } from "next/font/google";
import "@/app/globals.css";
import "@/app/seo.css";

const manrope = Manrope({ subsets: ["latin", "latin-ext"], variable: "--font-manrope", display: "swap" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin", "latin-ext"], variable: "--font-display", display: "swap" });
export default function RootDocument({ children, lang }: Readonly<{ children: React.ReactNode; lang: "bs" | "de" | "en" }>) {
  return <html lang={lang} className={`${manrope.variable} ${spaceGrotesk.variable}`} data-scroll-behavior="smooth"><body>{children}</body></html>;
}
