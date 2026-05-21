"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Lock, ExternalLink } from "lucide-react"
import { useLanguage } from "@/components/i18n-context"
import Link from "next/link"
import type { Project } from "@/lib/types"

const ease = [0.22, 1, 0.36, 1] as const

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease },
  }),
}

export function ProjectsPreview() {
  const { t, lang } = useLanguage()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/projects', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="portfolio" aria-label="Proyectos destacados" className="w-full px-4 sm:px-6 py-12 sm:py-20 lg:px-12">
      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease }}
        className="flex items-center gap-4 mb-8"
      >
        <span className="section-label">{t("projects.label")}</span>
        <div className="flex-1 border-t border-border" />
        <span className="section-label">004</span>
      </motion.div>

      {/* Title + View All */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          className="text-2xl lg:text-4xl font-pixel tracking-tight uppercase"
        >
          {t("projects.title")}
        </motion.h2>

        <Link href="/projects">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.15em] uppercase text-salmon hover:text-foreground transition-colors duration-200 cursor-pointer"
          >
            {t("projects.viewAll")}
            <ArrowRight size={12} />
          </motion.span>
        </Link>
      </div>

      {loading ? (
        <div className="min-h-[200px] flex items-center justify-center font-mono text-xs uppercase text-muted-foreground tracking-widest">
          {lang === 'es' ? 'Cargando...' : 'Loading...'}
        </div>
      ) : (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-0 border-2 border-foreground"
        >
          {projects.slice(0, 4).map((project, i) => (
            <Link href={`/projects/${project.id}`} key={project.id}>
              <motion.div
                custom={i}
                variants={cardVariants}
                className="group flex flex-col border border-foreground/10 min-h-[200px] hover:bg-salmon/[0.04] transition-colors duration-300 h-full"
              >
                {/* Card header */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-foreground/10">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {project.is_private ? (
                    <span className="flex items-center gap-1 text-[10px] tracking-[0.15em] uppercase text-muted-foreground font-mono">
                      <Lock size={10} />
                      {t("projects.private")}
                    </span>
                  ) : (
                    <span
                      onClick={(e) => {
                        if (project.github) {
                          e.preventDefault();
                          window.open(project.github, '_blank', 'noopener,noreferrer');
                        }
                      }}
                      className={`flex items-center gap-1 text-[10px] tracking-[0.15em] uppercase font-mono ${project.github ? 'text-teal hover:underline cursor-pointer' : 'text-teal'}`}
                    >
                      <ExternalLink size={10} />
                      {t("projects.public")}
                    </span>
                  )}
                </div>

                {/* Card body */}
                <div className="flex-1 flex flex-col justify-between px-4 py-4">
                  <div>
                    <h3 className="text-sm font-mono font-bold uppercase tracking-wide mb-2 group-hover:text-salmon transition-colors duration-200">
                      {lang === 'es' ? project.name_es : project.name_en}
                    </h3>
                    <p className="text-xs font-mono text-muted-foreground leading-relaxed line-clamp-3">
                      {lang === 'es' ? project.desc_es : project.desc_en}
                    </p>
                  </div>

                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {project.techs.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 text-[9px] font-mono tracking-wider uppercase border border-foreground/15 text-muted-foreground"
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
    </section>
  )
}
