"use client"

import { useState, useEffect } from "react"
import { Menu, X, Github, Linkedin, Instagram } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"
import { useLanguage } from "@/components/i18n-context"
import Link from "next/link"
import { usePathname } from "next/navigation"

const ease = [0.22, 1, 0.36, 1] as const

function CVIcon({ hovered }: { hovered: boolean }) {
  return (
    <div className="relative w-[14px] h-[14px]">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
        className="absolute inset-0 w-full h-full transition-all duration-300"
        style={{ opacity: hovered ? 0 : 1, transform: hovered ? 'translateY(-4px) scale(0.8)' : 'translateY(0) scale(1)' }}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="9" y1="13" x2="15" y2="13" />
        <line x1="9" y1="17" x2="13" y2="17" />
      </svg>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
        className="absolute inset-0 w-full h-full transition-all duration-300"
        style={{ opacity: hovered ? 1 : 0, transform: hovered ? 'translateY(0) scale(1)' : 'translateY(4px) scale(0.8)' }}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    </div>
  )
}

export function Navbar() {
  const { lang, setLang, t } = useLanguage()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [cvHovered, setCvHovered] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.top = `-${window.scrollY}px`
    } else {
      const scrollY = document.body.style.top
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.top = ''
      if (scrollY) window.scrollTo(0, parseInt(scrollY || '0') * -1)
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.top = ''
    }
  }, [isMobileOpen])

  const navLinks = [
    { label: t("nav.portfolio"), href: "/#portfolio" },
    { label: t("nav.projects"), href: "/projects" },
    { label: t("nav.services"), href: "/services" },
    { label: t("nav.contact"), href: "/#contacto" },
  ]

  const toggleLang = () => setLang(lang === "es" ? "en" : "es")

  const handleLogoClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}
        className={`fixed top-0 left-0 right-0 z-50 w-full px-4 pt-4 lg:px-6 lg:pt-4 transition-all duration-300 ${isScrolled ? "pt-2 lg:pt-2" : ""}`}>
        <nav className={`w-full border-2 border-foreground/20 px-5 py-3 lg:px-8 transition-all duration-300 ${isScrolled ? "bg-background/90 backdrop-blur-md border-foreground/30" : "bg-background/80 backdrop-blur-sm"}`}>
          <div className="flex items-center justify-between">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.4 }}>
              <Link href="/" onClick={handleLogoClick} className="flex items-center gap-1 cursor-pointer group">
                <span className="text-base font-pixel tracking-[0.1em] uppercase font-bold text-foreground group-hover:text-salmon transition-colors duration-200">SEGA</span>
                <span className="inline-block h-2 w-2 bg-salmon animate-pulse-dot" />
              </Link>
            </motion.div>

            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.div key={link.label} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.06, duration: 0.4, ease }}>
                  <Link href={link.href} className="text-[11px] font-mono tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer">{link.label}</Link>
                </motion.div>
              ))}
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.4 }} className="flex items-center gap-3">
              <button onClick={toggleLang} className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 border border-foreground/20 hover:border-salmon text-[10px] font-mono tracking-[0.15em] uppercase text-muted-foreground hover:text-salmon transition-all duration-200 cursor-pointer" aria-label="Toggle language">
                <span className={lang === "es" ? "text-salmon font-bold" : ""}>ES</span>
                <span className="text-border">/</span>
                <span className={lang === "en" ? "text-salmon font-bold" : ""}>EN</span>
              </button>
              <ThemeToggle />
              <div className="hidden md:flex items-center gap-2">
                <a href="https://github.com/seega-s" target="_blank" rel="noopener noreferrer" className="p-1.5 text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer" aria-label="GitHub"><Github size={14} strokeWidth={1.5} /></a>
                <a href="https://www.linkedin.com/in/jaime-cegarra-mart%C3%ADnez-682811305" target="_blank" rel="noopener noreferrer" className="p-1.5 text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer" aria-label="LinkedIn"><Linkedin size={14} strokeWidth={1.5} /></a>
              </div>
              <motion.a href="/cv-jaime-cegarra.pdf" download 
                onMouseEnter={() => setCvHovered(true)} onMouseLeave={() => setCvHovered(false)}
                className="hidden sm:flex items-center bg-foreground text-background cursor-pointer h-9 overflow-hidden"
                animate={{ width: cvHovered ? "150px" : "36px" }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                style={{ originX: 1 }}>
                <span className="flex items-center justify-center w-9 h-9 bg-salmon text-foreground shrink-0"><CVIcon hovered={cvHovered} /></span>
                <span className="whitespace-nowrap overflow-hidden flex items-center h-full" style={{ paddingLeft: '12px' }}>
                  <span className="text-[10px] font-mono tracking-[0.15em] uppercase">{t("nav.cv")}</span>
                </span>
              </motion.a>
              <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="lg:hidden p-2 text-foreground cursor-pointer" aria-label="Toggle menu">
                {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </motion.div>
          </div>
        </nav>
      </motion.div>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease }}
            className="fixed inset-0 z-40 bg-background/98 backdrop-blur-sm pt-24 px-6 pb-[env(safe-area-inset-bottom)] overflow-y-auto">
            <div className="flex flex-col gap-0 border-2 border-foreground">
              {navLinks.map((link, i) => (
                <motion.div key={link.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05, duration: 0.3, ease }}>
                  <Link href={link.href} onClick={() => setIsMobileOpen(false)}
                    className="block px-6 py-4 text-sm font-mono tracking-[0.15em] uppercase text-foreground hover:bg-salmon hover:text-foreground border-b border-foreground/20 last:border-b-0 transition-colors duration-200 cursor-pointer">{link.label}</Link>
                </motion.div>
              ))}
              <div className="px-6 py-4 border-t-2 border-foreground flex items-center justify-between">
                <button onClick={toggleLang} className="flex items-center gap-1.5 text-[11px] font-mono tracking-[0.15em] uppercase text-muted-foreground cursor-pointer">
                  <span className={lang === "es" ? "text-salmon font-bold" : ""}>ES</span><span>/</span><span className={lang === "en" ? "text-salmon font-bold" : ""}>EN</span>
                </button>
                <div className="flex items-center gap-3">
                  <a href="https://github.com/seega-s" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground cursor-pointer" aria-label="GitHub"><Github size={16} /></a>
                  <a href="https://www.linkedin.com/in/jaime-cegarra-mart%C3%ADnez-682811305" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground cursor-pointer" aria-label="LinkedIn"><Linkedin size={16} /></a>
                  <a href="https://www.instagram.com/jaimecegaarra" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground cursor-pointer" aria-label="Instagram"><Instagram size={16} /></a>
                </div>
              </div>
              <a href="/cv-jaime-cegarra.pdf" download onClick={() => setIsMobileOpen(false)} className="flex items-center gap-0 bg-foreground text-background cursor-pointer">
                <span className="flex items-center justify-center w-12 h-12 bg-salmon text-foreground"><CVIcon hovered={false} /></span>
                <span className="flex-1 px-6 py-3 text-xs font-mono tracking-[0.15em] uppercase text-center">{t("nav.cv")}</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-20" />
    </>
  )
}
