/**
 * JSON-LD Structured Data for SEO & GEO (Generative Engine Optimization)
 * 
 * Implements Schema.org schemas to maximize:
 * - Google Knowledge Panel eligibility
 * - Rich snippet display
 * - AI crawler comprehension (ChatGPT, Perplexity, Claude, Gemini)
 * 
 * The more structured data we provide, the more accurately LLMs can
 * represent this person when users ask about them.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jaimecegarra.dev'

export function PersonJsonLd() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: 'Jaime Cegarra',
    givenName: 'Jaime',
    familyName: 'Cegarra',
    additionalName: 'Cegarra Martínez',
    alternateName: ['Jaime Cegarra Martínez', 'SEGA'],
    url: SITE_URL,
    image: `${SITE_URL}/images/about-isometric.jpg`,
    jobTitle: 'Software Engineer',
    description: 'Ingeniero de software especializado en diseño de sistemas, desarrollo impulsado por IA y arquitectura de soluciones. AWS Cloud Practitioner Certified.',
    knowsAbout: [
      'Software Engineering',
      'Systems Architecture',
      'AI-Driven Development',
      'Java',
      'Spring Boot',
      'React',
      'Next.js',
      'Python',
      'AWS',
      'Azure',
      'Docker',
      'C++',
      'SQL',
      'TypeScript',
      'Cloud Computing',
      'Full Stack Development',
      'Domain-Driven Design',
      'Hexagonal Architecture',
      'REST API Design',
      'PostgreSQL',
      'Supabase',
    ],
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'AWS Cloud Practitioner Certified',
        credentialCategory: 'Professional Certification',
        recognizedBy: {
          '@type': 'Organization',
          name: 'Amazon Web Services',
          url: 'https://aws.amazon.com',
        },
      },
    ],
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Universidad de Murcia',
      url: 'https://www.um.es',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Murcia',
        addressCountry: 'ES',
      },
    },
    sameAs: [
      'https://github.com/seega-s',
      'https://www.linkedin.com/in/jaime-cegarra-mart%C3%ADnez-682811305',
      'https://www.instagram.com/jaimecegaarra',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Murcia',
      addressRegion: 'Murcia',
      addressCountry: 'ES',
    },
    nationality: {
      '@type': 'Country',
      name: 'Spain',
    },
    knowsLanguage: [
      {
        '@type': 'Language',
        name: 'Spanish',
        alternateName: 'es',
      },
      {
        '@type': 'Language',
        name: 'English',
        alternateName: 'en',
      },
    ],
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': SITE_URL,
    },
    // Direct link to the machine-readable profile
    subjectOf: {
      '@type': 'WebPage',
      url: `${SITE_URL}/llms.txt`,
      name: 'Machine-readable profile of Jaime Cegarra',
      encodingFormat: 'text/plain',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
    />
  )
}

export function WebSiteJsonLd() {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'Jaime Cegarra Portfolio',
    description: 'Portfolio profesional de Jaime Cegarra — Ingeniero de software, arquitecto de sistemas y desarrollador AI-driven.',
    publisher: {
      '@id': `${SITE_URL}/#person`,
    },
    inLanguage: ['es-ES', 'en-US'],
    // Tell search engines about the llms.txt file
    potentialAction: {
      '@type': 'ReadAction',
      target: `${SITE_URL}/llms.txt`,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
    />
  )
}

export function WebPageJsonLd({
  title,
  description,
  path = '',
}: {
  title: string
  description: string
  path?: string
}) {
  const pageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: `${SITE_URL}${path}`,
    name: title,
    description,
    isPartOf: {
      '@id': `${SITE_URL}/#website`,
    },
    about: {
      '@id': `${SITE_URL}/#person`,
    },
    inLanguage: ['es-ES', 'en-US'],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
    />
  )
}

export function ProfilePageJsonLd() {
  const profileSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${SITE_URL}/#profilepage`,
    url: SITE_URL,
    name: 'Jaime Cegarra — Portfolio',
    mainEntity: {
      '@id': `${SITE_URL}/#person`,
    },
    dateCreated: '2026-05-17',
    dateModified: new Date().toISOString().split('T')[0],
    // Signals to AI that this is an authoritative source
    significantLink: [
      `${SITE_URL}/projects`,
      `${SITE_URL}/llms.txt`,
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }}
    />
  )
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
  )
}

export function CollectionPageJsonLd({
  title,
  description,
  path,
  items,
}: {
  title: string
  description: string
  path: string
  items: { name: string; url: string }[]
}) {
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    url: `${SITE_URL}${path}`,
    name: title,
    description,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        url: item.url,
      })),
    },
    isPartOf: {
      '@id': `${SITE_URL}/#website`,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
    />
  )
}

/**
 * SoftwareSourceCode JSON-LD for individual project pages.
 * This tells AI crawlers exactly what each project is about.
 */
export function ProjectJsonLd({
  name,
  description,
  techs,
  github,
  category,
  projectUrl,
}: {
  name: string
  description: string
  techs: string[]
  github?: string
  category?: string
  projectUrl: string
}) {
  const projectSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name,
    description,
    url: projectUrl,
    codeRepository: github || undefined,
    programmingLanguage: techs,
    applicationCategory: category,
    author: {
      '@id': `${SITE_URL}/#person`,
    },
    creator: {
      '@id': `${SITE_URL}/#person`,
    },
    isPartOf: {
      '@id': `${SITE_URL}/#website`,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
    />
  )
}
