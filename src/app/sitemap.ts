import type { MetadataRoute } from "next";
import { SITE_URL, languageUrls, socialImage } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/de", "/en"].map(path => ({
    url: `${SITE_URL}${path}`,
    // Change only when public page content changes, not on every request/build.
    lastModified: "2026-09-03",
    alternates: { languages: languageUrls },
    images: [socialImage.url],
  }));
}
