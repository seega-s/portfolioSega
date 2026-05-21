/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  // ── SEO: Remove X-Powered-By header ──
  poweredByHeader: false,

  // ── SEO: Compress responses ──
  compress: true,

  // ── SEO: Image optimization ──
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },

  // ── SEO: Security & Performance Headers ──
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Referrer policy for link equity
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Security headers (improve trust signals)
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          // Permissions policy
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        // GEO: Advertise llms.txt to AI crawlers on the homepage
        source: '/',
        headers: [
          { key: 'Link', value: '</llms.txt>; rel="author"; type="text/plain"' },
          { key: 'X-Llms-Txt', value: '/llms.txt' },
        ],
      },
      {
        // GEO: Allow AI crawlers to read the structured profile efficiently
        source: '/llms.txt',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400' },
        ],
      },
      {
        // GEO: Allow AI crawlers to read the projects API
        source: '/api/projects',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Cache-Control', value: 'public, max-age=600, s-maxage=600, stale-while-revalidate=3600' },
        ],
      },
      {
        // Cache static assets aggressively
        source: '/images/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },
}

export default nextConfig
