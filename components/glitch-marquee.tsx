"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/components/i18n-context"

const ease = [0.22, 1, 0.36, 1] as const

const TECHS = [
  "JAVA",
  "SPRING BOOT",
  "REACT",
  "AWS",
  "PYTHON",
  "C++",
  "DOCKER",
  "AI-DRIVEN",
  "SYSTEMS DESIGN",
  "AZURE",
]

function LogoBlock({ name, glitch }: { name: string; glitch: boolean }) {
  return (
    <div
      className={`flex items-center justify-center px-8 py-4 border-r-2 border-foreground shrink-0 ${
        glitch ? "animate-glitch" : ""
      }`}
    >
      <span className="text-sm font-mono tracking-[0.15em] uppercase text-foreground whitespace-nowrap">
        {name}
      </span>
    </div>
  )
}

export function GlitchMarquee() {
  const { t } = useLanguage()
  const glitchIndices = [2, 7]

  return (
    <section className="w-full py-16 px-6 lg:px-12">
      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease }}
        className="flex items-center gap-4 mb-8"
      >
        <span className="section-label">{t("marquee.label")}</span>
        <div className="flex-1 border-t border-border" />
        <span className="section-label">005</span>
      </motion.div>

      {/* Marquee */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, ease }}
        className="overflow-hidden border-2 border-foreground"
      >
        <div className="flex animate-marquee" style={{ width: "max-content" }}>
          {[...TECHS, ...TECHS].map((name, i) => (
            <LogoBlock
              key={`${name}-${i}`}
              name={name}
              glitch={glitchIndices.includes(i % TECHS.length)}
            />
          ))}
        </div>
      </motion.div>
    </section>
  )
}
