import type { Viewport } from "next";
import { notFound } from "next/navigation";
import RootDocument from "@/components/root-document";

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#111513" };
export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (lang !== "de" && lang !== "en") notFound();
  return <RootDocument lang={lang}>{children}</RootDocument>;
}
