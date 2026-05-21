"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { ExperienceTimeline } from "@/components/experience-timeline"
import { TechStack } from "@/components/tech-stack"
import { ProjectsPreview } from "@/components/projects-preview"
import { GlitchMarquee } from "@/components/glitch-marquee"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { ScrollIndicator } from "@/components/scroll-indicator"

type SectionItem = {
  key: string
  label: string
  visible: boolean
  order: number
}

const SECTION_MAP: Record<string, { component: React.ComponentType; id: string }> = {
  hero: { component: HeroSection, id: "hero" },
  about: { component: AboutSection, id: "aboutme" },
  experience: { component: ExperienceTimeline, id: "experiencia" },
  tech: { component: TechStack, id: "tech" },
  projects: { component: ProjectsPreview, id: "portfolio" },
  marquee: { component: GlitchMarquee, id: "marquee" },
  contact: { component: ContactSection, id: "contacto" },
}

const DEFAULT_SECTIONS: SectionItem[] = [
  { key: "hero", label: "Hero", visible: true, order: 0 },
  { key: "about", label: "About Me", visible: true, order: 1 },
  { key: "experience", label: "Experience", visible: true, order: 2 },
  { key: "tech", label: "Tech Stack", visible: true, order: 3 },
  { key: "projects", label: "Projects", visible: true, order: 4 },
  { key: "marquee", label: "Tech Marquee", visible: true, order: 5 },
  { key: "contact", label: "Contact", visible: true, order: 6 },
]

export default function Home() {
  const [sections, setSections] = useState<SectionItem[]>(DEFAULT_SECTIONS)

  useEffect(() => {
    fetch('/api/admin/main', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.section_order && Array.isArray(data.section_order)) {
          setSections(data.section_order)
        }
      })
      .catch(() => {})
  }, [])

  const sortedVisible = sections
    .filter(s => s.visible)
    .sort((a, b) => a.order - b.order)

  // Find the first visible section after hero for the scroll indicator target
  const firstAfterHero = sortedVisible.find(s => s.key !== 'hero')
  const scrollTargetId = firstAfterHero ? SECTION_MAP[firstAfterHero.key]?.id : 'aboutme'

  return (
    <main className="min-h-screen flex flex-col items-center w-full max-w-[1440px] mx-auto responsive-scale">
      <Navbar />
      {sortedVisible.map(section => {
        const entry = SECTION_MAP[section.key]
        if (!entry) return null
        const Component = entry.component
        return <Component key={section.key} />
      })}
      <Footer />
      <ScrollIndicator targetId={scrollTargetId} />
    </main>
  )
}
