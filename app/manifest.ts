import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Cancionero Interactivo",
    short_name: "Cancionero",
    description: "Aplicacion para gestionar y visualizar cantos liturgicos con acordes",
    start_url: "/",
    display: "standalone",
    background_color: "#fefdf9",
    theme_color: "#5a6b7d",
    orientation: "portrait-primary",
    categories: ["music", "education", "lifestyle"],
    lang: "es",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
  }
}
