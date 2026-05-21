import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { I18nProvider } from '@/components/i18n-context'
import { PersonJsonLd, WebSiteJsonLd, ProfilePageJsonLd } from '@/components/json-ld'

import './globals.css'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jaimecegarra.com'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap', // SEO: prevent FOIT, improve CLS
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

import { getServiceSupabase } from "@/lib/supabase";

export async function generateMetadata(): Promise<Metadata> {
  const supabase = getServiceSupabase();
  
  let config = null;
  try {
    const { data } = await supabase
      .from('main_config')
      .select('site_name, favicon_url')
      .limit(1)
      .single();
    config = data;
  } catch (error) {
    console.error('Error fetching metadata config:', error);
  }

  const siteName = config?.site_name || 'Jaime Cegarra';
  const siteTitle = `${siteName} — Ingeniero de Software | Arquitecto de Sistemas | AI-Driven Developer`;
  const defaultFavicon = '/favicon.ico';
  const faviconUrl = config?.favicon_url || defaultFavicon;

  return {
    metadataBase: new URL(SITE_URL),

    // ── Title Template ──────────────────────────────────────
    title: {
      default: siteTitle,
      template: `%s | ${siteName}`,
    },

    // ── Icons ───────────────────────────────────────────────
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    },

    // ── Core Meta ───────────────────────────────────────────
    description:
      `Portfolio profesional de ${siteName}. Ingeniero de software especializado en diseño de sistemas, desarrollo impulsado por IA y arquitectura de soluciones. AWS Cloud Practitioner Certified. Java, React, Spring Boot, Python, TypeScript, Next.js.`,
    keywords: [
      siteName,
      `${siteName} portfolio`,
      `${siteName} ingeniero`,
      `${siteName} software`,
      `${siteName} developer`,
      'ingeniero de software',
      'software engineer',
      'portfolio',
      'arquitecto de sistemas',
      'systems architect',
      'AI-driven development',
      'desarrollo impulsado por IA',
      'AWS certified',
      'AWS Cloud Practitioner',
      'Java developer',
      'React developer',
      'Spring Boot',
      'Python developer',
      'TypeScript',
      'Next.js',
      'diseño de sistemas',
      'full stack developer',
      'desarrollador full stack',
      'Murcia',
      'España',
      'Spain',
      'cloud computing',
      'Docker',
      'Azure',
    ],
    authors: [{ name: siteName, url: SITE_URL }],
    creator: siteName,
    publisher: siteName,
    category: 'technology',

    // ── Robots ──────────────────────────────────────────────
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // ── Canonical + Alternates ──────────────────────────────
    alternates: {
      canonical: SITE_URL,
      languages: {
        'es-ES': SITE_URL,
        'en-US': SITE_URL,
        'x-default': SITE_URL,
      },
    },

    // ── Open Graph (Facebook, LinkedIn, WhatsApp) ──────────
    openGraph: {
      type: 'profile',
      locale: 'es_ES',
      alternateLocale: ['en_US'],
      url: SITE_URL,
      title: `${siteName} — Software Engineer & Systems Architect`,
      description:
        `Portfolio profesional de ${siteName}. Diseño y construyo sistemas de software con visión de negocio. Especializado en desarrollo impulsado por IA, arquitectura de soluciones y creación de productos desde cero.`,
      siteName: `${siteName} Portfolio`,
      images: [
        {
          url: '/images/about-isometric.jpg',
          width: 1200,
          height: 630,
          alt: `${siteName} — Software Engineer Portfolio`,
          type: 'image/jpeg',
        },
      ],
      firstName: siteName.split(' ')[0] || 'Jaime',
      lastName: siteName.split(' ').slice(1).join(' ') || 'Cegarra',
    },

    // ── Twitter Card ───────────────────────────────────────
    twitter: {
      card: 'summary_large_image',
      title: `${siteName} — Software Engineer & Systems Architect`,
      description:
        'Ingeniero de software especializado en diseño de sistemas y desarrollo impulsado por IA. AWS Cloud Practitioner Certified. Portfolio con proyectos en Java, React, Spring Boot y Python.',
      images: ['/images/about-isometric.jpg'],
    },

    // ── Verification (configure when you have accounts) ─────
    verification: {
      google: 'GwZGUHPQTd6_OyTV5r7OazuwXS4GSpwoFPqxWQtULZg',
    },

    // ── Other SEO Meta ──────────────────────────────────────
    other: {
      'theme-color': '#F2F1EA',
      'color-scheme': 'light dark',
      'format-detection': 'telephone=no',
    },
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F2F1EA' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' },
  ],
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
      <head>
        {/* ── JSON-LD Structured Data ── */}
        <PersonJsonLd />
        <WebSiteJsonLd />
        <ProfilePageJsonLd />

        {/* ── GEO: Machine-readable profile for AI crawlers ── */}
        <link rel="author" href={`${SITE_URL}/llms.txt`} type="text/plain" />
        <meta name="ai:profile" content={`${SITE_URL}/llms.txt`} />

        {/* ── Geo Meta (SEO local) ── */}
        <meta name="geo.region" content="ES-MU" />
        <meta name="geo.placename" content="Murcia, España" />
        <meta name="ICBM" content="37.9922, -1.1307" />
      </head>
      <body className="font-mono antialiased dot-grid-bg noise-overlay min-h-screen flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true} disableTransitionOnChange>
          <I18nProvider>
            {children}
          </I18nProvider>
        </ThemeProvider>

        {/* ── SEO: Server-rendered noscript fallback for crawlers ── */}
        <noscript>
          <div style={{ padding: '2rem', fontFamily: 'monospace', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Jaime Cegarra — Ingeniero de Software &amp; Arquitecto de Sistemas</h1>
            <p>
              Portfolio profesional de Jaime Cegarra Martínez. Ingeniero de software
              especializado en diseño de sistemas, desarrollo impulsado por IA y
              arquitectura de soluciones. AWS Cloud Practitioner Certified.
            </p>
            <h2>Tecnologías</h2>
            <p>Java, Spring Boot, React, Next.js, Python, TypeScript, C++, SQL, Docker, AWS, Azure</p>
            <h2>Contacto</h2>
            <p>
              Murcia, España —{' '}
              <a href="https://github.com/seega-s">GitHub</a> —{' '}
              <a href="https://www.linkedin.com/in/jaime-cegarra-mart%C3%ADnez-682811305">LinkedIn</a>
            </p>
          </div>
        </noscript>
      </body>
    </html>
  )
}
