"use client"

import { motion } from "framer-motion"
import { ArrowRight, Lock, ExternalLink } from "lucide-react"
import { useLanguage } from "@/components/i18n-context"
import Link from "next/link"

const ease = [0.22, 1, 0.36, 1] as const

type Project = {
  nameKey: string
  descKey: string
  techs: string[]
  isPrivate: boolean
}

const PROJECTS: Project[] = [
  {
    nameKey: "project.kanban",
    techs: ["Java", "Spring Boot", "Hexagonal", "DDD", "React"],
    isPrivate: false,
  },
  {
    nameKey: "project.manager",
    techs: ["Java", "Spring Boot", "DDD", "Hexagonal"],
    isPrivate: false,
  },
  {
    nameKey: "project.compiler",
    techs: ["C++", "Lexer", "AST", "MIPS"],
    isPrivate: false,
  },
  {
    nameKey: "project.p2p",
    techs: ["Java", "TCP", "UDP", "Sockets"],
    isPrivate: false,
  },
  {
    nameKey: "project.expenses",
    techs: ["Java", "React", "SQL"],
    isPrivate: false,
  },
  {
    nameKey: "project.marketplace",
    techs: ["React", "Node.js", "MySQL", "JWT"],
    isPrivate: false,
  },
  {
    nameKey: "project.orchestrator",
    techs: ["Azure", "Queues", "VM", "Cloud"],
    isPrivate: true,
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease },
  }),
}

export function ProjectsPreview() {
  const { t } = useLanguage()

  return (
    <section className="w-full px-6 py-20 lg:px-12">
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

      {/* Projects grid — 2x3 */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-2 border-foreground"
      >
        {PROJECTS.map((project, i) => (
          <motion.div
            key={project.nameKey}
            custom={i}
            variants={cardVariants}
            className="group flex flex-col border border-foreground/10 min-h-[200px] hover:bg-salmon/[0.04] transition-colors duration-300"
          >
            {/* Card header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-foreground/10">
              <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
                {String(i + 1).padStart(2, "0")}
              </span>
              {project.isPrivate ? (
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

            {/* Card body */}
            <div className="flex-1 flex flex-col justify-between px-4 py-4">
              <div>
                <h3 className="text-sm font-mono font-bold uppercase tracking-wide mb-2 group-hover:text-salmon transition-colors duration-200">
                  {t(`${project.nameKey}.name`)}
                </h3>
                <p className="text-xs font-mono text-muted-foreground leading-relaxed">
                  {t(`${project.nameKey}.desc`)}
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
        ))}
      </motion.div>
    </section>
  )
}
