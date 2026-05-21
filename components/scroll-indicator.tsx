"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/components/i18n-context"

export function ScrollIndicator({ targetId = "aboutme" }: { targetId?: string }) {
  const { lang } = useLanguage()
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      // Hide once user has scrolled past 40% of viewport height
      setVisible(window.scrollY < window.innerHeight * 0.4)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTarget = () => {
    const el = document.getElementById(targetId)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="fixed inset-x-0 bottom-6 z-40 flex flex-col items-center gap-1.5 cursor-pointer pointer-events-none"
        >
          <div className="pointer-events-auto flex flex-col items-center gap-1.5" onClick={scrollToTarget}>
            <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono bg-background/80 backdrop-blur-sm px-3 py-1 border border-foreground/10">
              {lang === "es" ? "Desliza" : "Scroll"}
            </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="p-1.5 text-muted-foreground hover:text-salmon transition-colors bg-background/80 backdrop-blur-sm border border-foreground/10"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
