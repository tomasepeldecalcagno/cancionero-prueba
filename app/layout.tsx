import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'Cancionero Interactivo',
  description: 'Aplicacion para gestionar y visualizar cantos liturgicos con acordes transpuestos automaticamente',
  keywords: ['cancionero', 'musica', 'acordes', 'liturgia', 'guitarra', 'cantos'],
  authors: [{ name: 'Cancionero App' }],
  creator: 'Cancionero App',
  publisher: 'Cancionero App',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Cancionero Interactivo',
    description: 'Gestiona y visualiza cantos liturgicos con transposicion automatica de acordes',
    type: 'website',
    locale: 'es_ES',
    siteName: 'Cancionero Interactivo',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cancionero Interactivo',
    description: 'Gestiona y visualiza cantos liturgicos con transposicion automatica de acordes',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#5a6b7d" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
