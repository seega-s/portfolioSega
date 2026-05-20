import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { I18nProvider } from '@/components/i18n-context'

import './globals.css'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: 'Jaime Cegarra — Ingeniero de Software | Arquitecto de Sistemas | AI-Driven Developer',
  description:
    'Portfolio de Jaime Cegarra. Ingeniero de software especializado en diseño de sistemas, desarrollo impulsado por IA y arquitectura de soluciones. AWS Cloud Practitioner Certified. Java, React, Spring Boot, Python.',
  keywords: [
    'Jaime Cegarra',
    'ingeniero de software',
    'software engineer',
    'portfolio',
    'arquitecto de sistemas',
    'AI-driven development',
    'AWS certified',
    'Java developer',
    'React developer',
    'Spring Boot',
    'diseño de sistemas',
    'Murcia',
    'desarrollador',
    'full stack',
  ],
  authors: [{ name: 'Jaime Cegarra' }],
  creator: 'Jaime Cegarra',
  publisher: 'Jaime Cegarra',
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
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    alternateLocale: 'en_US',
    title: 'Jaime Cegarra — Software Engineer & Systems Architect',
    description:
      'I design and build software systems with a business-driven vision. Specialized in AI-powered development, solution architecture, and building products from scratch.',
    siteName: 'Jaime Cegarra Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jaime Cegarra — Software Engineer',
    description:
      'Ingeniero de software especializado en diseño de sistemas y desarrollo impulsado por IA. AWS Certified.',
    creator: '@jaimecegarra',
  },
  category: 'technology',
}

export const viewport: Viewport = {
  themeColor: '#F2F1EA',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${jetbrainsMono.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <body className="font-mono antialiased dot-grid-bg noise-overlay min-h-screen flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <I18nProvider>
            {children}
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
