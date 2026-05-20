"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Lock, ExternalLink } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/components/i18n-context"
import Link from "next/link"

const ease = [0.22, 1, 0.36, 1] as const

type Project = {
  id: string
  nameKey: string
  descKey: string
  techs: string[]
  isPrivate: boolean
  category: string
  github?: string
}

const PROJECTS: Project[] = [
  {
    id: "tablerello",
    nameKey: "project.kanban",
    techs: ["Java", "Spring Boot", "Hexagonal", "DDD", "React", "JPA"],
    isPrivate: false,
    category: "backend",
    github: "https://github.com/seega-s/tablerello",
  },
  {
    id: "gestor-Proyectos",
    nameKey: "project.manager",
    techs: ["Next.js", "React", "TypeScript", "Supabase", "Tailwind", "PostgreSQL"],
    isPrivate: false,
    category: "fullstack",
  },
  {
    id: "compilador-minic",
    nameKey: "project.compiler",
    techs: ["C++", "Lexer", "Parser", "AST", "MIPS"],
    isPrivate: false,
    category: "systems",
    github: "https://github.com/seega-s/compilador-miniC",
  },
  {
    id: "nanofiles",
    nameKey: "project.p2p",
    techs: ["Java", "TCP", "UDP", "Sockets", "Multithreading"],
    isPrivate: false,
    category: "systems",
    github: "https://github.com/seega-s/nanoFiles",
  },
  {
    id: "gestor-gastos",
    nameKey: "project.expenses",
    techs: ["Java", "Swing", "Maven", "JSON", "CSS"],
    isPrivate: false,
    category: "fullstack",
    github: "https://github.com/seega-s/ProyectoTDS",
  },
  {
    id: "marketplace-daweb",
    nameKey: "project.marketplace",
    techs: ["React", "Node.js", "Express", "MySQL", "JWT", "Bootstrap"],
    isPrivate: false,
    category: "fullstack",
    github: "https://github.com/seega-s/ProyectoDAWeb",
  },
  {
    id: "orquestador-vm",
    nameKey: "project.orchestrator",
    techs: ["Azure", "Queues", "VM", "Cloud", "C#"],
    isPrivate: true,
    category: "cloud",
  },
]

const CATEGORIES = ["all", "backend", "fullstack", "frontend", "systems", "cloud"]

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease },
  }),
}

export default function ProjectsPage() {
  const { t } = useLanguage()
  const [activeFilter, setActiveFilter] = useState("all")

  const filtered =
    activeFilter === "all"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeFilter)

  return (
    <main className="min-h-screen flex flex-col items-center max-w-[1440px] mx-auto">
      <Navbar />

      <section className="w-full px-6 py-12 lg:px-12">
        {/* Back link */}
        <Link href="/">
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

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="text-3xl lg:text-5xl font-pixel tracking-tight uppercase mb-4"
        >
          {t("projectsPage.title")}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease }}
          className="text-xs lg:text-sm font-mono text-muted-foreground max-w-xl mb-8 leading-relaxed"
        >
          {t("projectsPage.subtitle")}
        </motion.p>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease }}
          className="flex flex-wrap gap-0 border-2 border-foreground mb-8"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 text-[10px] font-mono tracking-[0.15em] uppercase border-r border-foreground/20 last:border-r-0 transition-colors duration-200 cursor-pointer ${activeFilter === cat
                  ? "bg-foreground text-background"
                  : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                }`}
            >
              {cat === "all" ? t("projectsPage.filter.all") : cat}
            </button>
          ))}
        </motion.div>

        {/* Projects grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-0 border-2 border-foreground"
        >
          {filtered.map((project, i) => (
            <motion.div
              key={project.nameKey}
              custom={i}
              variants={cardVariants}
              className="group flex flex-col border border-foreground/10 min-h-[240px] hover:bg-salmon/[0.04] transition-colors duration-300"
            >
              <Link href={`/projects/${project.id}`} className="flex flex-col flex-1">
                {/* Card header */}
                <div className="flex items-center justify-between px-5 py-2.5 border-b border-foreground/10">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-mono">
                    {String(i + 1).padStart(2, "0")} / {project.category.toUpperCase()}
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
                <div className="flex-1 flex flex-col justify-between px-5 py-5">
                  <div>
                    <h2 className="text-lg font-mono font-bold uppercase tracking-wide mb-3 group-hover:text-salmon transition-colors duration-200">
                      {t(`${project.nameKey}.name`)}
                    </h2>
                    <p className="text-xs font-mono text-muted-foreground leading-relaxed">
                      {t(`${project.nameKey}.desc`)}
                    </p>
                  </div>

                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-1.5 mt-5">
                    {project.techs.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 text-[9px] font-mono tracking-wider uppercase border border-foreground/15 text-muted-foreground hover:border-salmon/30 transition-colors duration-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <Footer />
    </main>
  )
}

