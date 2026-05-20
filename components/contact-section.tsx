"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { Send, Mail } from "lucide-react"
import { useLanguage } from "@/components/i18n-context"

const ease = [0.22, 1, 0.36, 1] as const

/* ── Scramble email reveal ── */
function ScrambleEmail() {
  const email = "jaimecegarra2005@gmail.com"
  const [display, setDisplay] = useState(email)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-50px" })
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789@._"

  useEffect(() => {
    if (!inView) return
    let iteration = 0
    const interval = setInterval(() => {
      setDisplay(
        email
          .split("")
          .map((char, i) => {
            if (char === "@" || char === ".") return char
            if (i < iteration) return email[i]
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join("")
      )
      iteration += 0.4
      if (iteration >= email.length) {
        setDisplay(email)
        clearInterval(interval)
      }
    }, 25)
    return () => clearInterval(interval)
  }, [inView])

  return (
    <span ref={ref} className="font-mono text-salmon text-sm lg:text-base">
      {display}
    </span>
  )
}

export function ContactSection() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const mailto = `mailto:jaimecegarra2005@gmail.com?subject=${encodeURIComponent(
      `[Portfolio] ${formData.subject}`
    )}&body=${encodeURIComponent(
      `Nombre: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
    )}`
    window.location.href = mailto
  }

  return (
    <section id="contacto" className="w-full px-6 py-20 lg:px-12">
      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease }}
        className="flex items-center gap-4 mb-8"
      >
        <span className="section-label">{t("contact.label")}</span>
        <div className="flex-1 border-t border-border" />
        <span className="section-label">006</span>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-0 border-2 border-foreground">
        {/* Left: Info panel */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease }}
          className="w-full lg:w-2/5 border-b-2 lg:border-b-0 lg:border-r-2 border-foreground flex flex-col"
        >
          {/* Header bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b-2 border-foreground">
            <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
              CONTACT.sh
            </span>
            <span className="h-1.5 w-1.5 bg-teal animate-pulse-dot" />
          </div>

          <div className="flex-1 flex flex-col justify-between px-5 py-6 lg:py-8">
            <div className="flex flex-col gap-6">
              <h2 className="text-3xl lg:text-4xl font-pixel tracking-tight uppercase">
                {t("contact.title")}
              </h2>
              <p className="text-xs lg:text-sm font-mono text-muted-foreground leading-relaxed">
                {t("contact.subtitle")}
              </p>

              {/* Direct email */}
              <div className="flex flex-col gap-2 py-4 border-t-2 border-foreground">
                <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
                  {t("contact.direct")}
                </span>
                <a
                  href="mailto:jaimecegarra2005@gmail.com"
                  className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <Mail size={14} className="text-salmon" />
                  <ScrambleEmail />
                </a>
              </div>
            </div>

            {/* Terminal-style decoration */}
            <div className="mt-6 p-3 bg-foreground/[0.03] border border-foreground/10">
              <pre className="font-mono text-[10px] text-muted-foreground/50 leading-relaxed">
{`> connecting to jaime...
> status: AVAILABLE
> response_time: < 24h
> preferred: email
> [OK] ready for input_`}
              </pre>
            </div>
          </div>
        </motion.div>

        {/* Right: Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.1, ease }}
          className="w-full lg:w-3/5 flex flex-col"
        >
          {/* Header bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b-2 border-foreground">
            <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
              {">"} INPUT_FORM
            </span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-salmon font-mono animate-blink">
              ACTIVE
            </span>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
            {/* Form fields */}
            <div className="flex-1 flex flex-col">
              {/* Name + Email row */}
              <div className="flex flex-col sm:flex-row">
                <div className="flex-1 border-b border-foreground/10 sm:border-r">
                  <label className="block px-5 pt-3 pb-1 text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
                    {t("contact.name")}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t("contact.namePlaceholder")}
                    className="w-full px-5 pb-3 bg-transparent text-sm font-mono text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
                  />
                </div>
                <div className="flex-1 border-b border-foreground/10">
                  <label className="block px-5 pt-3 pb-1 text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
                    {t("contact.email")}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t("contact.emailPlaceholder")}
                    className="w-full px-5 pb-3 bg-transparent text-sm font-mono text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="border-b border-foreground/10">
                <label className="block px-5 pt-3 pb-1 text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
                  {t("contact.subject")}
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder={t("contact.subjectPlaceholder")}
                  className="w-full px-5 pb-3 bg-transparent text-sm font-mono text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
                />
              </div>

              {/* Message */}
              <div className="flex-1">
                <label className="block px-5 pt-3 pb-1 text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
                  {t("contact.message")}
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={t("contact.messagePlaceholder")}
                  className="w-full px-5 pb-3 bg-transparent text-sm font-mono text-foreground placeholder:text-muted-foreground/40 focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Submit button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="flex items-center gap-0 bg-foreground text-background cursor-pointer w-full"
            >
              <span className="flex items-center justify-center w-12 h-12 bg-salmon">
                <Send size={16} strokeWidth={2} className="text-foreground" />
              </span>
              <span className="flex-1 px-6 py-3 text-xs font-mono tracking-[0.15em] uppercase text-center">
                {t("contact.send")}
              </span>
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
