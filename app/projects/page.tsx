"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Lock, ExternalLink } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/components/i18n-context"
import Link from "next/link"
import type { Project } from "@/lib/types"

const ease = [0.22, 1, 0.36, 1] as const

const categories = ["all", "frontend", "backend", "fullstack", "cloud", "systems"]

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease },
  }),
}

export default function ProjectsPage() {
  const { t, lang } = useLanguage()
  const [filter, setFilter] = useState("all")
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/projects', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const filteredProjects = projects.filter((p) => (filter === "all" ? true : p.category === filter))

  return (
    <main className="min-h-screen bg-background flex flex-col selection:bg-salmon selection:text-background">
      <Navbar />

      <div className="flex-1 px-6 py-32 lg:px-12 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-16">
          <Link href="/">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease }}
              className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.15em] uppercase text-muted-foreground hover:text-salmon transition-colors duration-200 mb-8 cursor-pointer"
            >
              <ArrowLeft size={12} />
              {t("nav.portfolio")}
            </motion.span>
          </Link>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="text-4xl lg:text-7xl font-pixel tracking-tighter uppercase mb-6 ascii-dots"
          >
            {t("projects.title")}
          </motion.h1>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease }}
          className="flex flex-wrap gap-2 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 text-xs font-mono tracking-widest uppercase border transition-all duration-300 ${
                filter === cat
                  ? "border-foreground bg-foreground text-background"
                  : "border-foreground/20 text-muted-foreground hover:border-salmon hover:text-salmon"
              }`}
            >
              {cat === 'all' ? t('projectsPage.filter.all') : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        {loading ? (
          <div className="min-h-[400px] flex items-center justify-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {lang === 'es' ? 'Cargando proyectos...' : 'Loading projects...'}
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-2 border-foreground">
            {filteredProjects.map((project, i) => (
              <Link href={`/projects/${project.id}`} key={project.id}>
                <motion.div
                  layout
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  className="group flex flex-col border border-foreground/10 min-h-[250px] hover:bg-salmon/[0.04] transition-colors duration-300 h-full"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-foreground/10">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] tracking-[0.15em] uppercase text-salmon font-mono">
                        {project.category}
                      </span>
                      {project.is_private ? (
                        <span className="flex items-center gap-1 text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-mono">
                          <Lock size={10} />
                          {t("projects.private")}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] tracking-[0.15em] uppercase text-teal font-mono">
                          <ExternalLink size={10} />
                          {t("projects.public")}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between px-6 py-6">
                    <div>
                      <h3 className="text-xl font-mono font-bold uppercase tracking-wide mb-3 group-hover:text-salmon transition-colors duration-200">
                        {lang === 'es' ? project.name_es : project.name_en}
                      </h3>
                      <p className="text-sm font-mono text-muted-foreground leading-relaxed line-clamp-3">
                        {lang === 'es' ? project.desc_es : project.desc_en}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-6">
                      {project.techs.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 text-[10px] font-mono tracking-wider uppercase border border-foreground/15 text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        )}
      </div>
      <Footer />
    </main>
  )
}
