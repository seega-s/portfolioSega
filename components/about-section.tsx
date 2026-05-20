"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { useLanguage } from "@/components/i18n-context"

const ease = [0.22, 1, 0.36, 1] as const

/* ── Scramble text reveal ── */
function ScrambleText({ text, className }: { text: string; className?: string }) {
  const [display, setDisplay] = useState(text)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-50px" })
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_./:"

  useEffect(() => {
    if (!inView) return
    let iteration = 0
    const interval = setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((char, i) => {
            if (char === " ") return " "
            if (i < iteration) return text[i]
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join("")
      )
      iteration += 0.5
      if (iteration >= text.length) {
        setDisplay(text)
        clearInterval(interval)
      }
    }, 30)
    return () => clearInterval(interval)
  }, [inView, text])

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  )
}

/* ── Blinking dot ── */
function BlinkDot() {
  return <span className="inline-block h-2 w-2 bg-salmon animate-blink" />
}

export function AboutSection() {
  const { t } = useLanguage()

  return (
    <section id="portfolio" className="w-full px-6 py-20 lg:px-12">
      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease }}
        className="flex items-center gap-4 mb-8"
      >
        <span className="section-label">{t("about.label")}</span>
        <div className="flex-1 border-t border-border" />
        <BlinkDot />
        <span className="section-label">002</span>
      </motion.div>

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-0 border-2 border-foreground">
        {/* Left: Photo placeholder */}
        <motion.div
          initial={{ opacity: 0, x: -30, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease }}
          className="relative w-full lg:w-1/2 min-h-[350px] lg:min-h-[550px] border-b-2 lg:border-b-0 lg:border-r-2 border-foreground overflow-hidden bg-muted flex items-center justify-center"
        >
          {/* Top overlay bar */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2 bg-foreground/5 border-b border-foreground/10">
            <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
              RENDER: profile_photo.jpg
            </span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-salmon font-mono animate-blink">
              LIVE
            </span>
          </div>

          {/* PLACEHOLDER — Replace with your photo */}
          <div className="flex flex-col items-center gap-4 text-muted-foreground">
            <pre className="font-mono text-xs text-center leading-relaxed opacity-30">
{`┌─────────────────────┐
│                     │
│    ┌───────────┐    │
│    │           │    │
│    │   FOTO    │    │
│    │           │    │
│    └───────────┘    │
│                     │
│   JAIME CEGARRA     │
│                     │
└─────────────────────┘`}
            </pre>
            <span className="text-[10px] tracking-[0.2em] uppercase font-mono opacity-40">
              // REEMPLAZAR CON FOTO REAL
            </span>
          </div>

          {/* Bottom overlay */}
          <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2 bg-foreground/5 border-t border-foreground/10">
            <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50 font-mono">
              {"FORMAT: JPG / 1:1"}
            </span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50 font-mono">
              {"RES: 800x800"}
            </span>
          </div>
        </motion.div>

        {/* Right: Content */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.1, ease }}
          className="flex flex-col w-full lg:w-1/2"
        >
          {/* Header bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b-2 border-foreground">
            <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
              MANIFEST.md
            </span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-teal font-mono">
              v2.0
            </span>
          </div>

          {/* Content body */}
          <div className="flex-1 flex flex-col justify-between px-5 py-6 lg:py-8">
            <div className="flex flex-col gap-5">
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: 0.2, ease }}
                className="text-2xl lg:text-3xl font-mono font-bold tracking-tight uppercase text-balance"
              >
                {t("about.title.1")}
                <br />
                <span className="text-salmon">{t("about.title.2")}</span>
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: 0.3, duration: 0.5, ease }}
                className="flex flex-col gap-3"
              >
                <p className="text-xs lg:text-sm font-mono text-muted-foreground leading-relaxed">
                  {t("about.p1")}
                </p>
                <p className="text-xs lg:text-sm font-mono text-muted-foreground leading-relaxed">
                  {t("about.p2")}
                </p>
                <p className="text-xs lg:text-sm font-mono text-foreground/80 leading-relaxed font-medium">
                  {t("about.p3")}
                </p>
              </motion.div>

              {/* Philosophy quote */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0.8 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5, ease }}
                style={{ transformOrigin: "left" }}
                className="flex items-start gap-3 py-3 px-4 border-l-4 border-salmon bg-salmon/5"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-salmon font-mono font-bold">
                    {t("about.philosophy")}
                  </span>
                  <span className="text-xs font-mono text-foreground/70 italic leading-relaxed">
                    {t("about.philosophy.text")}
                  </span>
                </div>
              </motion.div>

              {/* Experience */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.5, ease }}
                className="flex flex-col gap-2 py-3 border-t-2 border-foreground"
              >
                <span className="text-[10px] tracking-[0.2em] uppercase text-teal font-mono font-bold">
                  {t("about.experience")}
                </span>
                <div>
                  <span className="text-sm font-mono font-bold text-foreground">
                    <ScrambleText text={t("about.experience.role")} />
                  </span>
                  <p className="text-xs font-mono text-muted-foreground leading-relaxed mt-1">
                    {t("about.experience.desc")}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
