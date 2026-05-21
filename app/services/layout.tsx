import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jaimecegarra.com'

export const metadata: Metadata = {
  title: 'Servicios — Consultoría & Desarrollo de Software',
  description:
    'Servicios profesionales de Jaime Cegarra: consultoría de arquitectura de software, desarrollo full stack, integración de IA en flujos de trabajo, y diseño de sistemas cloud-native. Disponible próximamente.',
  alternates: {
    canonical: `${SITE_URL}/services`,
  },
  openGraph: {
    title: 'Servicios — Jaime Cegarra',
    description: 'Consultoría de arquitectura de software, desarrollo impulsado por IA y diseño de sistemas.',
    url: `${SITE_URL}/services`,
    type: 'website',
  },
}

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
