"use client"

import { useEffect, useState, useCallback } from "react"
import { ArrowRight, Download, Github, Linkedin, Instagram } from "lucide-react"
// Link import removed — scroll indicator is now a fixed component
import { motion } from "framer-motion"
import { useLanguage } from "@/components/i18n-context"
import Link from "next/link"

const ease = [0.22, 1, 0.36, 1] as const

/* ── Typewriter with rotating roles ── */
function TypewriterRoles({ customRoles }: { customRoles?: string[] }) {
  const { t } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  const roles = customRoles && customRoles.length > 0 ? customRoles : [
    t("hero.role.1"),
    t("hero.role.2"),
    t("hero.role.3"),
    t("hero.role.4"),
    t("hero.role.5"),
  ]

  const tick = useCallback(() => {
    const currentRole = roles[currentIndex]

    if (!isDeleting) {
      setDisplayText(currentRole.substring(0, displayText.length + 1))
      if (displayText.length === currentRole.length) {
        setTimeout(() => setIsDeleting(true), 2000)
        return
      }
    } else {
      setDisplayText(currentRole.substring(0, displayText.length - 1))
      if (displayText.length === 0) {
        setIsDeleting(false)
        setCurrentIndex((prev) => (prev + 1) % roles.length)
        return
      }
    }
  }, [displayText, isDeleting, currentIndex, roles])

  useEffect(() => {
    const speed = isDeleting ? 40 : 80
    const timer = setTimeout(tick, speed)
    return () => clearTimeout(timer)
  }, [tick, isDeleting])

  return (
    <span className="inline-flex items-center">
      <span className="text-salmon">{displayText}</span>
      <span className="typing-cursor ml-0.5 h-6 lg:h-8">&nbsp;</span>
    </span>
  )
}

/* ── ASCII decorative frame ── */
function AsciiFrame() {
  return (
    <div className="hidden lg:block absolute inset-0 pointer-events-none select-none overflow-hidden opacity-[0.06]">
      <pre className="font-mono text-[8px] leading-[10px] text-foreground whitespace-pre absolute top-4 left-4">
{`╔══════════════════════════════╗
║  PROFILE_LOADED              ║
║  STATUS: ACTIVE              ║
║  SECTOR: SOFTWARE_ENG        ║
║  CLEARANCE: UNRESTRICTED     ║
╠══════════════════════════════╣
║  > init portfolio.exe        ║
║  > loading modules...        ║
║  > rendering interface...    ║
║  > [OK] ALL SYSTEMS GO       ║
╚══════════════════════════════╝`}
      </pre>
      <pre className="font-mono text-[8px] leading-[10px] text-foreground whitespace-pre absolute bottom-4 right-4 text-right">
{`┌──────────────────────────────┐
│  LAT: 37.9922° N             │
│  LON: 1.1307° W              │
│  LOC: MURCIA, ESPAÑA         │
│  TZ: CET (UTC+1)             │
│  BUILD: v2.0.26              │
└──────────────────────────────┘`}
      </pre>
    </div>
  )
}

/* ── Stats row ── */
function StatBlock({ value, label, delay }: { value: string; label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease }}
      className="flex flex-col items-center gap-0.5 px-4 py-2 border border-foreground/15"
    >
      <span className="text-xl lg:text-2xl font-pixel tracking-tight text-foreground">
        {value}
      </span>
      <span className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
        {label}
      </span>
    </motion.div>
  )
}

/* ── HeroSection ── */
export function HeroSection() {
  const { t, lang } = useLanguage()
  const [config, setConfig] = useState<any>(null)

  useEffect(() => {
    fetch('/api/admin/main', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(console.error)
  }, [])

  const subtitle = config 
    ? ((lang === 'es' ? config.subtitle_es : config.subtitle_en) || t("hero.bio"))
    : t("hero.bio");

  return (
    <section aria-label="Jaime Cegarra — Software Engineer" itemScope itemType="https://schema.org/Person" className="relative w-full px-4 sm:px-6 pt-6 sm:pt-8 pb-12 sm:pb-16 lg:px-24 lg:pt-12 lg:pb-24 overflow-hidden">
      <AsciiFrame />

      <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto">
        {/* Greeting label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease }}
          className="flex items-center gap-3 mb-6"
        >
          <span className="h-1.5 w-1.5 bg-salmon animate-pulse-dot" />
          <span className="section-label">{t("hero.greeting")}</span>
          <div className="w-16 border-t border-border" />
        </motion.div>

        {/* Name — Pixel font */}
        <h1 itemProp="name" className="contents">
          <motion.span
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, ease }}
            className="font-pixel text-2xl xs:text-3xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl tracking-tight text-foreground mb-4 select-none leading-none ascii-dots block"
          >
            {config?.site_name || t("hero.name")}
          </motion.span>
        </h1>

        {/* Typewriter subtitle */}
        <div itemProp="jobTitle" className="contents">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease }}
            className="text-lg lg:text-2xl font-mono tracking-wide mb-6 h-10"
          >
            <TypewriterRoles customRoles={config?.titles} />
          </motion.div>
        </div>

        {/* Bio */}
        <p itemProp="description" className="contents">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45, ease }}
            className="text-xs lg:text-sm text-muted-foreground max-w-xl mb-8 leading-relaxed font-mono whitespace-pre-line block"
          >
            {subtitle}
          </motion.span>
        </p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6, ease }}
          className="flex flex-col sm:flex-row items-center gap-3 mb-10"
        >
          {/* Primary CTA */}
          <Link href="#portfolio">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group flex items-center gap-0 bg-foreground text-background text-sm font-mono tracking-wider uppercase cursor-pointer"
            >
              <span className="flex items-center justify-center w-10 h-10 bg-salmon">
                <motion.span
                  className="inline-flex"
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <ArrowRight size={16} strokeWidth={2} className="text-foreground" />
                </motion.span>
              </span>
              <span className="px-5 py-2.5">{t("hero.cta.portfolio")}</span>
            </motion.button>
          </Link>

          {/* Secondary CTA */}
          <motion.a
            href="/cv-jaime-cegarra.pdf"
            download
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 border-2 border-foreground/20 hover:border-salmon px-5 py-2.5 text-sm font-mono tracking-wider uppercase text-muted-foreground hover:text-salmon transition-colors duration-200 cursor-pointer"
          >
            <Download size={14} strokeWidth={2} />
            {t("hero.cta.cv")}
          </motion.a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.75, ease }}
          className="flex flex-wrap items-center justify-center gap-4 mb-8"
        >
          <StatBlock value="7+" label={t("hero.stat.projects")} delay={0.8} />
          <StatBlock value="10+" label={t("hero.stat.technologies")} delay={0.88} />
          <StatBlock value="✓" label={t("hero.stat.certified")} delay={0.96} />
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          {(!config || config.github) && (
            <a href={config?.github || "https://github.com/seega-s"} target="_blank" rel="noopener noreferrer" className="p-2 border border-foreground/10 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all duration-200 cursor-pointer" aria-label="GitHub" itemProp="sameAs">
              <Github size={16} strokeWidth={1.5} />
            </a>
          )}
          {(!config || config.linkedin) && (
            <a href={config?.linkedin || "https://www.linkedin.com/in/jaime-cegarra-mart%C3%ADnez-682811305"} target="_blank" rel="noopener noreferrer" className="p-2 border border-foreground/10 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all duration-200 cursor-pointer" aria-label="LinkedIn" itemProp="sameAs">
              <Linkedin size={16} strokeWidth={1.5} />
            </a>
          )}
          {(!config || config.instagram) && (
            <a href={config?.instagram || "https://www.instagram.com/jaimecegaarra"} target="_blank" rel="noopener noreferrer" className="p-2 border border-foreground/10 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all duration-200 cursor-pointer" aria-label="Instagram" itemProp="sameAs">
              <Instagram size={16} strokeWidth={1.5} />
            </a>
          )}
          {config?.x && (
            <a href={config.x} target="_blank" rel="noopener noreferrer" className="p-2 border border-foreground/10 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all duration-200 cursor-pointer" aria-label="X (Twitter)">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.961h-1.04l11.115 13.809z"></path></svg>
            </a>
          )}
          {config?.youtube && (
            <a href={config.youtube} target="_blank" rel="noopener noreferrer" className="p-2 border border-foreground/10 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all duration-200 cursor-pointer" aria-label="YouTube">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 fill-current"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path></svg>
            </a>
          )}
          {config?.reddit && (
            <a href={config.reddit} target="_blank" rel="noopener noreferrer" className="p-2 border border-foreground/10 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all duration-200 cursor-pointer" aria-label="Reddit">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 fill-current"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.688-.561-1.249-1.249-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"></path></svg>
            </a>
          )}
          {config?.email && (
            <a href={`mailto:${config.email}`} className="p-2 border border-foreground/10 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all duration-200 cursor-pointer" aria-label="Email">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 fill-current"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path></svg>
            </a>
          )}
        </motion.div>

        {/* Spacer to account for fixed scroll indicator at bottom */}
        <div className="mt-8 lg:mt-12" />
      </div>
    </section>
  )
}
