"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Instagram } from "lucide-react"
import { useLanguage } from "@/components/i18n-context"
import Link from "next/link"

const ease = [0.22, 1, 0.36, 1] as const

export function Footer() {
  const { t } = useLanguage()

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease }}
      className="w-full border-t-2 border-foreground px-6 py-8 lg:px-12"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left: Logo + Copyright */}
        <div className="flex flex-col gap-1">
          <Link href="/" className="flex items-center gap-1 cursor-pointer group">
            <span className="text-xs font-pixel tracking-[0.1em] uppercase font-bold text-foreground group-hover:text-salmon transition-colors duration-200">
              SEGA
            </span>
            <span className="inline-block h-1.5 w-1.5 bg-salmon" />
          </Link>
          <span className="text-[10px] font-mono tracking-widest text-muted-foreground">
            {t("footer.rights")}
          </span>
          <span className="text-[10px] font-mono tracking-widest text-salmon/60">
            {t("footer.built")}
          </span>
        </div>

        {/* Center: Navigation */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-6">
          {[
            { label: t("nav.portfolio"), href: "/#portfolio" },
            { label: t("nav.projects"), href: "/projects" },
            { label: t("nav.services"), href: "/services" },
            { label: t("nav.contact"), href: "/#contacto" },
          ].map((link, i) => (
            <motion.div
              key={link.label}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.4, ease }}
            >
              <Link
                href={link.href}
                className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Right: Social icons */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/seega-s"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
            aria-label="GitHub"
          >
            <Github size={14} strokeWidth={1.5} />
          </a>
          <a
            href="https://www.linkedin.com/in/jaime-cegarra-mart%C3%ADnez-682811305"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
            aria-label="LinkedIn"
          >
            <Linkedin size={14} strokeWidth={1.5} />
          </a>
          <a
            href="https://www.instagram.com/jaimecegaarra"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
            aria-label="Instagram"
          >
            <Instagram size={14} strokeWidth={1.5} />
          </a>
        </div>
      </div>

      {/* ASCII decoration — hidden on mobile to prevent overflow */}
      <div className="mt-6 pt-4 border-t border-foreground/10 hidden sm:block">
        <pre className="font-mono text-[8px] text-muted-foreground/20 leading-tight select-none text-center overflow-hidden">
          {`═══════════════════════════════════════════════════════════════════
  SEGA. // DISEÑO DE SISTEMAS · DESARROLLO IMPULSADO POR IA · 2026
═══════════════════════════════════════════════════════════════════`}
        </pre>
      </div>
    </motion.footer>
  )
}
