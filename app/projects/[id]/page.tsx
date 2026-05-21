"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Lock } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/components/i18n-context"
import Link from "next/link"
import type { Project } from "@/lib/types"

const ease = [0.22, 1, 0.36, 1] as const

/* ─── GitHub SVG icon ─── */
const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
)

/* ─── Stagger animations ─── */
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
}

export default function ProjectDetailPage() {
  const params = useParams()
  const { t, lang } = useLanguage()
  const id = params.id as string
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/projects?id=${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found")
        return res.json()
      })
      .then((data) => setProject(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center max-w-[1440px] mx-auto">
        <Navbar />
        <section className="w-full px-6 py-24 lg:px-12 flex-1 flex flex-col items-center justify-center">
          <div className="min-h-[400px] flex items-center justify-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {lang === 'es' ? 'Cargando proyecto...' : 'Loading project...'}
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  if (!project) {
    return (
      <main className="min-h-screen flex flex-col items-center max-w-[1440px] mx-auto">
        <Navbar />
        <section className="w-full px-6 py-24 lg:px-12 flex-1 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-pixel uppercase mb-4">404</h1>
          <p className="text-sm font-mono text-muted-foreground mb-8">Proyecto no encontrado / Project not found</p>
          <Link href="/projects" className="text-xs font-mono tracking-[0.15em] uppercase text-salmon hover:underline">
            {t("projectDetail.back")}
          </Link>
        </section>
        <Footer />
      </main>
    )
  }

  const features = lang === 'es' ? project.features_es : project.features_en
  const architecture = lang === 'es' ? project.architecture_es : project.architecture_en

  return (
    <main className="min-h-screen flex flex-col items-center max-w-[1440px] mx-auto">
      <Navbar />

      <section className="w-full px-6 py-12 lg:px-12">
        {/* Back link */}
        <Link href="/projects">
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease }}
            className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.15em] uppercase text-muted-foreground hover:text-salmon transition-colors duration-200 cursor-pointer mb-8"
          >
            <ArrowLeft size={12} />
            {t("projectDetail.back")}
          </motion.span>
        </Link>

        {/* Header */}
        <div className="border-2 border-foreground mb-8">
          {/* Top bar */}
          <div className="flex items-center justify-between px-5 py-2.5 border-b border-foreground/20 bg-foreground/[0.03]">
            <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
              {project.category}
            </span>
            {project.is_private ? (
              <span className="flex items-center gap-1 text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-mono">
                <Lock size={10} />
                {t("projects.private")}
              </span>
            ) : (
              <span className="text-[10px] tracking-[0.15em] uppercase text-teal font-mono">
                {t("projects.public")}
              </span>
            )}
          </div>

          {/* Title + GitHub */}
          <div className="px-6 py-8 lg:px-10 lg:py-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="text-3xl lg:text-5xl font-pixel tracking-tight uppercase mb-4 ascii-dots"
            >
              {lang === 'es' ? project.name_es : project.name_en}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5, ease }}
              className="text-xs lg:text-sm font-mono text-muted-foreground max-w-2xl leading-relaxed mb-6"
            >
              {lang === 'es' ? project.desc_es : project.desc_en}
            </motion.p>

            {/* GitHub button */}
            {project.github ? (
              <motion.a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4, ease }}
                className="inline-flex items-center gap-2.5 px-5 py-2.5 border-2 border-foreground text-xs font-mono tracking-[0.15em] uppercase hover:bg-foreground hover:text-background transition-colors duration-200"
              >
                <GitHubIcon />
                {t("projectDetail.github")}
              </motion.a>
            ) : project.is_private ? (
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4, ease }}
                className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-foreground/20 text-xs font-mono tracking-[0.15em] uppercase text-muted-foreground cursor-not-allowed"
              >
                <Lock size={12} />
                {t("projectDetail.private")}
              </motion.span>
            ) : null}
          </div>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border-2 border-foreground">
          {/* Tech Stack — left column */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="border-b lg:border-b-0 lg:border-r border-foreground/20 px-6 py-6"
          >
            <motion.h2
              variants={fadeUp}
              className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono mb-5"
            >
              {t("projectDetail.tech")}
            </motion.h2>
            <div className="flex flex-wrap gap-2">
              {project.techs.map((tech) => (
                <motion.span
                  key={tech}
                  variants={fadeUp}
                  className="px-3 py-1 text-[10px] font-mono tracking-wider uppercase border border-foreground/15 text-foreground/80 hover:border-salmon/40 hover:text-salmon transition-colors duration-200"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Features + Architecture — right columns */}
          <div className="lg:col-span-2">
            {/* Features */}
            {features && features.length > 0 && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={stagger}
                className="px-6 py-6 border-b border-foreground/20"
              >
                <motion.h2
                  variants={fadeUp}
                  className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono mb-5"
                >
                  {t("projectDetail.features")}
                </motion.h2>
                <ul className="space-y-2.5">
                  {features.map((feat, i) => (
                    <motion.li
                      key={i}
                      variants={fadeUp}
                      className="flex items-start gap-3 text-xs font-mono text-foreground/80 leading-relaxed"
                    >
                      <span className="text-salmon mt-0.5 shrink-0">▸</span>
                      {feat}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Architecture */}
            {architecture && architecture.length > 0 && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={stagger}
                className="px-6 py-6"
              >
                <motion.h2
                  variants={fadeUp}
                  className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono mb-5"
                >
                  {t("projectDetail.architecture")}
                </motion.h2>
                <ul className="space-y-2.5">
                  {architecture.map((item, i) => (
                    <motion.li
                      key={i}
                      variants={fadeUp}
                      className="flex items-start gap-3 text-xs font-mono text-foreground/80 leading-relaxed"
                    >
                      <span className="text-teal mt-0.5 shrink-0">◆</span>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
