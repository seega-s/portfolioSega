import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jaimecegarra.dev'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString()

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/services`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // Dynamic project routes — essential for AI crawlers to discover individual projects
  let projectRoutes: MetadataRoute.Sitemap = []
  try {
    const { data: projects } = await supabase
      .from('projects')
      .select('id, updated_at, created_at')
      .order('display_order', { ascending: true })

    if (projects) {
      projectRoutes = projects.map((project) => ({
        url: `${SITE_URL}/projects/${project.id}`,
        lastModified: project.updated_at || project.created_at || now,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      }))
    }
  } catch (error) {
    console.error('Error fetching projects for sitemap:', error)
  }

  return [...staticRoutes, ...projectRoutes]
}
