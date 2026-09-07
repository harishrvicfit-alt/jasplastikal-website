import type { NextConfig } from "next";
import { withBotId } from "botid/next/config";

const nextConfig: NextConfig = {
  experimental: { globalNotFound: true },
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/indexDE.html", destination: "/de", permanent: true },
      { source: "/indexEN.html", destination: "/en", permanent: true },
      { source: "/assets/catalog/Katalog_PDF.pdf", destination: "/JASPlastikAL-katalog-2024.pdf", permanent: true },
      { source: "/assets/catalog/Katalog_EN_PDF.pdf", destination: "/JASPlastikAL-katalog-2024.pdf", permanent: true },
      // Consolidate the public Vercel alias, without redirecting preview deployments.
      { source: "/:path*", has: [{ type: "host", value: "jasplastikal-website.vercel.app" }], destination: "https://www.jasplastikal.com/:path*", permanent: true },
    ];
  },
};

export default withBotId(nextConfig);
