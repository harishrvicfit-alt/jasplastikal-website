import type { Metadata, Viewport } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin", "latin-ext"], variable: "--font-manrope", display: "swap" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin", "latin-ext"], variable: "--font-display", display: "swap" });
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "JAS PlastikAL | PVC i AL sistemi", template: "%s | JAS PlastikAL" },
  description: "Proizvodnja i ugradnja PVC stolarije, AL bravarije, vrata, kliznih sistema, staklenih fasada, zimskih vrtova, roletni i garažnih vrata.",
  keywords: ["PVC stolarija", "AL bravarija", "Maglaj", "prozori", "ulazna vrata", "zimski vrtovi", "staklene fasade"],
  alternates: { canonical: "/" },
  openGraph: { title: "JAS PlastikAL — prostor počinje dobrim okvirom", description: "Precizna proizvodnja i pouzdana ugradnja PVC i AL sistema.", type: "website", locale: "bs_BA", images: [{ url: "/images/Zimski_vrt.jpg", width: 1437, height: 1078, alt: "JAS PlastikAL zimski vrt" }] },
  twitter: { card: "summary_large_image", title: "JAS PlastikAL — prostor počinje dobrim okvirom", description: "Precizna proizvodnja i pouzdana ugradnja PVC i AL sistema.", images: ["/images/Zimski_vrt.jpg"] },
  robots: { index: true, follow: true },
  icons: { icon: "/images/logojas.png", apple: "/images/logojas.png" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#111513" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="bs" className={`${manrope.variable} ${spaceGrotesk.variable}`}><body>{children}</body></html>;
}
