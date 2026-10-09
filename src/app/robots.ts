import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/99propiedades"],
    },
    sitemap: "https://99propiedades.com.ar/sitemap.xml",
  };
}
