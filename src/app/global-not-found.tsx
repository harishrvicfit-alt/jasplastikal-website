import type { Metadata } from "next";
import RootDocument from "@/components/root-document";
import NotFound from "@/components/not-found-content";
import { brandIcons } from "@/lib/seo";

export const metadata: Metadata = { title: "Stranica nije pronađena | JAS PlastikAL", robots: { index: false, follow: true }, icons: brandIcons };
export default function GlobalNotFound() { return <RootDocument lang="bs"><NotFound /></RootDocument>; }
