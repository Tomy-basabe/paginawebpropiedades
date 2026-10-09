import { MetadataRoute } from "next";
import { INITIAL_PROPERTIES } from "@/lib/initialData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://99propiedades.com.ar";
  const now = new Date();

  // Rutas estáticas principales
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/propiedades`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/propiedades?operation=venta`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/propiedades?operation=alquiler`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/propiedades?type=casa`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/propiedades?type=loteo`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/financiamiento`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/sobre-mi`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Rutas dinámicas de cada propiedad
  const propertyRoutes: MetadataRoute.Sitemap = INITIAL_PROPERTIES.map((prop) => ({
    url: `${baseUrl}/propiedades/${prop.id}`,
    lastModified: prop.createdAt ? new Date(prop.createdAt) : now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...propertyRoutes];
}
