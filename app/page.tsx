"use client"

import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { TechStack } from "@/components/tech-stack"
import { ProjectsPreview } from "@/components/projects-preview"
import { GlitchMarquee } from "@/components/glitch-marquee"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center max-w-[1440px] mx-auto">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <TechStack />
      <ProjectsPreview />
      <GlitchMarquee />
      <ContactSection />
      <Footer />
    </main>
  )
}
