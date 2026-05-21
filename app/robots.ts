import { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jaimecegarra.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // ── Default: allow everything public ──
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      // ── AI Crawlers: explicitly allow public API + llms.txt ──
      // These bots power ChatGPT, Perplexity, Claude, Google Gemini, etc.
      {
        userAgent: 'GPTBot',
        allow: ['/', '/llms.txt', '/api/projects'],
        disallow: ['/admin/', '/api/admin/', '/api/auth/', '/api/experience/'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: ['/', '/llms.txt', '/api/projects'],
        disallow: ['/admin/', '/api/admin/', '/api/auth/', '/api/experience/'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: ['/', '/llms.txt', '/api/projects'],
        disallow: ['/admin/', '/api/admin/', '/api/auth/', '/api/experience/'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: ['/', '/llms.txt', '/api/projects'],
        disallow: ['/admin/', '/api/admin/', '/api/auth/', '/api/experience/'],
      },
      {
        userAgent: 'Claude-Web',
        allow: ['/', '/llms.txt', '/api/projects'],
        disallow: ['/admin/', '/api/admin/', '/api/auth/', '/api/experience/'],
      },
      {
        userAgent: 'Google-Extended',
        allow: ['/', '/llms.txt', '/api/projects'],
        disallow: ['/admin/', '/api/admin/', '/api/auth/', '/api/experience/'],
      },
      {
        userAgent: 'Amazonbot',
        allow: ['/', '/llms.txt'],
        disallow: ['/admin/', '/api/admin/', '/api/auth/', '/api/experience/'],
      },
      {
        userAgent: 'Applebot-Extended',
        allow: ['/', '/llms.txt'],
        disallow: ['/admin/', '/api/admin/', '/api/auth/', '/api/experience/'],
      },
      {
        userAgent: 'cohere-ai',
        allow: ['/', '/llms.txt', '/api/projects'],
        disallow: ['/admin/', '/api/admin/', '/api/auth/', '/api/experience/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
