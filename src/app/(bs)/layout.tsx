import type { Viewport } from "next";
import RootDocument from "@/components/root-document";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("PVC i AL stolarija Maglaj | JAS PlastikAL", "JAS PlastikAL Maglaj: proizvodnja i ugradnja PVC i AL prozora, ulaznih i garažnih vrata, kliznih sistema, zimskih vrtova, roletni i ograda. Zatražite ponudu.", "bs");
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#111513" };
export default function Layout({ children }: { children: React.ReactNode }) { return <RootDocument lang="bs">{children}</RootDocument>; }
