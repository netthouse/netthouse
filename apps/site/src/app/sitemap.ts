import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://netthouse.com";

  return [
    { url: `${baseUrl}/`, lastModified: new Date() },
    { url: `${baseUrl}/docs`, lastModified: new Date() },
    { url: `${baseUrl}/ru`, lastModified: new Date() },
    { url: `${baseUrl}/ru/docs`, lastModified: new Date() },
  ];
}
