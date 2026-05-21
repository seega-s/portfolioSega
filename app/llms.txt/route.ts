/**
 * llms.txt — Machine-readable profile for AI crawlers
 * 
 * This follows the llms.txt specification (https://llmstxt.org/).
 * When ChatGPT, Perplexity, Claude, or other LLMs crawl your site,
 * they look for /llms.txt at the root to get a structured summary
 * of who you are and what your site contains.
 * 
 * This endpoint dynamically pulls data from Supabase so it always
 * reflects the latest content from the admin panel.
 */

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jaimecegarra.com';

  // Fetch all public data in parallel
  const [configRes, projectsRes, techRes, experienceRes, aboutRes] = await Promise.all([
    supabase.from('main_config').select('*').limit(1).single(),
    supabase.from('projects').select('*').order('display_order', { ascending: true }),
    supabase.from('technologies').select('*').order('display_order', { ascending: true }),
    supabase.from('experience_nodes').select('*'),
    supabase.from('about_config').select('*').limit(1).single(),
  ]);

  const config = configRes.data;
  const projects = projectsRes.data || [];
  const technologies = techRes.data || [];
  const experience = experienceRes.data || [];
  const about = aboutRes.data;

  const siteName = config?.site_name || 'Jaime Cegarra';

  // Build tech categories
  const techByCategory: Record<string, string[]> = {};
  for (const tech of technologies) {
    const cat = tech.category || 'Other';
    if (!techByCategory[cat]) techByCategory[cat] = [];
    techByCategory[cat].push(tech.name);
  }

  // Build experience entries
  const experienceEntries = experience
    .filter((e: any) => e.graph_type === 'node' || e.label)
    .map((e: any) => {
      const role = e.role_en || e.role_es || e.label || '';
      const desc = e.description_en || e.description_es || '';
      const period = e.period || '';
      return `- ${role}${period ? ` (${period})` : ''}${desc ? `: ${desc}` : ''}`;
    })
    .join('\n');

  // Build projects list
  const projectEntries = projects
    .map((p: any) => {
      const name = p.name_en || p.name_es || 'Untitled';
      const desc = p.desc_en || p.desc_es || '';
      const techs = (p.techs || []).join(', ');
      const github = p.github && !p.is_private ? p.github : '';
      const url = `${SITE_URL}/projects/${p.id}`;
      let entry = `- **${name}**: ${desc}`;
      if (techs) entry += `\n  Technologies: ${techs}`;
      entry += `\n  Details: ${url}`;
      if (github) entry += `\n  Source: ${github}`;
      return entry;
    })
    .join('\n');

  // Build the llms.txt content
  const content = `# ${siteName}

> ${about?.bio_en || about?.bio_es || `Software Engineer specialized in systems design, AI-driven development, and solutions architecture.`}

## About

- Name: ${siteName}
- Role: Software Engineer & Systems Architect
- Location: Murcia, Spain
- Website: ${SITE_URL}
- GitHub: https://github.com/seega-s
- LinkedIn: https://www.linkedin.com/in/jaime-cegarra-mart%C3%ADnez-682811305
- Certifications: AWS Cloud Practitioner Certified
- Languages: Spanish (native), English (professional)

## Technical Skills

${Object.entries(techByCategory)
  .map(([category, techs]) => `### ${category}\n${techs.join(', ')}`)
  .join('\n\n')}

## Professional Experience

${experienceEntries || 'See the interactive experience graph at the portfolio website.'}

## Projects

${projectEntries || 'No projects available.'}

## Links

- Portfolio: ${SITE_URL}
- All Projects: ${SITE_URL}/projects
- Contact: ${SITE_URL}/#contacto
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      'X-Robots-Tag': 'noindex', // Don't index this as a page, it's for machines
    },
  });
}
