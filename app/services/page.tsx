"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Clock } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/components/i18n-context"
import Link from "next/link"

const ease = [0.22, 1, 0.36, 1] as const

export default function ServicesPage() {
  const { t } = useLanguage()

  return (
    <main className="min-h-screen flex flex-col items-center max-w-[1440px] mx-auto">
      <Navbar />

      <section className="w-full px-6 py-12 lg:px-12 flex-1 flex flex-col items-center justify-center min-h-[60vh]">
        {/* Back link */}
        <Link href="/" className="self-start">
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease }}
            className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.15em] uppercase text-muted-foreground hover:text-salmon transition-colors duration-200 cursor-pointer mb-8"
          >
            <ArrowLeft size={12} />
            {t("projectsPage.back")}
          </motion.span>
        </Link>

        {/* Coming Soon block */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease }}
          className="flex flex-col items-center text-center max-w-lg border-2 border-foreground p-10 lg:p-16"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="mb-6"
          >
            <Clock size={48} strokeWidth={1} className="text-salmon" />
          </motion.div>

          <h1 className="text-3xl lg:text-5xl font-pixel tracking-tight uppercase mb-4 ascii-dots">
            {t("services.title")}
          </h1>
          <span className="inline-block px-4 py-1.5 mb-6 border-2 border-salmon text-[11px] font-mono tracking-[0.2em] uppercase text-salmon font-bold animate-blink">
            {t("services.coming")}
          </span>
          <p className="text-xs lg:text-sm font-mono text-muted-foreground leading-relaxed mb-8">
            {t("services.subtitle")}
          </p>

          <Link href="/#contacto">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-0 bg-foreground text-background text-sm font-mono tracking-wider uppercase cursor-pointer"
            >
              <span className="flex items-center justify-center w-10 h-10 bg-salmon">
                <span className="text-foreground text-xs font-bold">→</span>
              </span>
              <span className="px-6 py-2.5">{t("services.cta")}</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Decorative ASCII */}
        <motion.pre
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-12 font-mono text-[8px] text-muted-foreground/20 leading-tight select-none text-center"
        >
{`╔════════════════════════════════════════╗
║  SERVICE_MODULE: LOADING...           ║
║  STATUS: IN_DEVELOPMENT              ║
║  ETA: Q3 2026                        ║
║  PRIORITY: HIGH                      ║
╚════════════════════════════════════════╝`}
        </motion.pre>
      </section>

      <Footer />
    </main>
  )
}
