import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jaimecegarra.com'

export const metadata: Metadata = {
  title: 'Proyectos — Portfolio de Software',
  description:
    'Todos los proyectos de software de Jaime Cegarra: aplicaciones full stack, arquitecturas cloud, automatizaciones con IA, APIs REST con Spring Boot, interfaces React/Next.js y más. Código abierto en GitHub.',
  alternates: {
    canonical: `${SITE_URL}/projects`,
  },
  openGraph: {
    title: 'Proyectos — Jaime Cegarra',
    description: 'Colección de proyectos de ingeniería de software: desde orquestadores cloud hasta portfolios brutalist con Next.js.',
    url: `${SITE_URL}/projects`,
    type: 'website',
  },
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
