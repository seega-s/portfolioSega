"use client"

import { useEffect, useState, useCallback } from "react"
import { ArrowRight, Download, Github, Linkedin, Instagram } from "lucide-react"
import { motion } from "framer-motion"
import { useLanguage } from "@/components/i18n-context"
import Link from "next/link"

const ease = [0.22, 1, 0.36, 1] as const

/* ── Typewriter with rotating roles ── */
function TypewriterRoles() {
  const { t } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  const roles = [
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

/* ── Hero Section ── */
export function HeroSection() {
  const { t } = useLanguage()

  return (
    <section className="relative w-full px-6 pt-8 pb-16 lg:px-24 lg:pt-12 lg:pb-24 overflow-hidden">
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
        <motion.h1
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease }}
          className="font-pixel text-3xl xs:text-4xl sm:text-7xl lg:text-8xl xl:text-9xl tracking-tight text-foreground mb-4 select-none leading-none"
        >
          {t("hero.name")}
        </motion.h1>

        {/* Typewriter subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease }}
          className="text-lg lg:text-2xl font-mono tracking-wide mb-6 h-10"
        >
          <TypewriterRoles />
        </motion.div>

        {/* Bio */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45, ease }}
          className="text-xs lg:text-sm text-muted-foreground max-w-xl mb-8 leading-relaxed font-mono"
        >
          {t("hero.bio")}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6, ease }}
          className="flex flex-col sm:flex-row items-center gap-3 mb-10"
        >
          {/* Primary CTA */}
          <Link href="/#portfolio">
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
          className="flex items-center gap-4"
        >
          <a
            href="https://github.com/seega-s"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 border border-foreground/10 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all duration-200 cursor-pointer"
            aria-label="GitHub"
          >
            <Github size={16} strokeWidth={1.5} />
          </a>
          <a
            href="https://www.linkedin.com/in/jaime-cegarra-mart%C3%ADnez-682811305"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 border border-foreground/10 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all duration-200 cursor-pointer"
            aria-label="LinkedIn"
          >
            <Linkedin size={16} strokeWidth={1.5} />
          </a>
          <a
            href="https://www.instagram.com/jaimecegaarra"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 border border-foreground/10 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all duration-200 cursor-pointer"
            aria-label="Instagram"
          >
            <Instagram size={16} strokeWidth={1.5} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
