import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Jaime Cegarra — Software Engineer & Systems Architect',
    short_name: 'Jaime Cegarra',
    description: 'Portfolio de Jaime Cegarra. Ingeniero de software especializado en diseño de sistemas, desarrollo impulsado por IA y arquitectura de soluciones.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F2F1EA',
    theme_color: '#F2F1EA',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
