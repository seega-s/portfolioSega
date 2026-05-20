"use client"

import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Lock } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/components/i18n-context"
import Link from "next/link"

const ease = [0.22, 1, 0.36, 1] as const

/* ─── GitHub SVG icon ─── */
const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
)

/* ─── Project data with extended detail info ─── */
type ProjectDetail = {
  id: string
  nameKey: string
  techs: string[]
  isPrivate: boolean
  category: string
  github?: string
  features: { es: string[]; en: string[] }
  architecture: { es: string[]; en: string[] }
}

const PROJECT_DETAILS: ProjectDetail[] = [
  {
    id: "tablerello",
    nameKey: "project.kanban",
    techs: ["Java", "Spring Boot", "Hexagonal Architecture", "DDD", "React", "JPA", "H2", "REST API", "Maven"],
    isPrivate: false,
    category: "backend",
    github: "https://github.com/seega-s/tablerello",
    features: {
      es: [
        "Tableros Kanban con columnas personalizables y tarjetas arrastrables",
        "Sistema de invitaciones a tableros con aceptación/rechazo",
        "Roles de usuario (propietario, miembro) con permisos diferenciados",
        "Persistencia con JPA/Hibernate sobre H2 embebido",
        "API REST completa con DTOs para desacoplar dominio de interfaz",
      ],
      en: [
        "Kanban boards with customizable columns and draggable cards",
        "Board invitation system with accept/reject flow",
        "User roles (owner, member) with differentiated permissions",
        "JPA/Hibernate persistence on embedded H2 database",
        "Complete REST API with DTOs to decouple domain from interface",
      ],
    },
    architecture: {
      es: [
        "Arquitectura hexagonal pura con puertos y adaptadores",
        "Domain-Driven Design: agregados, entidades, value objects y servicios de dominio",
        "Separación clara: dominio → aplicación (use cases) → infraestructura (adaptadores)",
        "Controllers como adaptadores primarios, repositorios JPA como adaptadores secundarios",
      ],
      en: [
        "Pure hexagonal architecture with ports and adapters",
        "Domain-Driven Design: aggregates, entities, value objects, and domain services",
        "Clear separation: domain → application (use cases) → infrastructure (adapters)",
        "Controllers as primary adapters, JPA repositories as secondary adapters",
      ],
    },
  },
  {
    id: "gestor-Proyectos",
    nameKey: "project.manager",
    techs: ["Next.js", "React", "TypeScript", "Supabase", "PostgreSQL", "Tailwind CSS", "shadcn/ui", "Framer Motion", "GitHub API"],
    isPrivate: false,
    category: "fullstack",
    features: {
      es: [
        "Vistas de proyecto: Kanban, Gantt, listas y calendario con drag-and-drop",
        "Integración con GitHub: commits, PRs, estado de CI/CD en tiempo real",
        "Módulo Cloud FinOps: optimización de costes multi-nube (AWS, GCP, Azure)",
        "Chat en tiempo real entre miembros del equipo con Supabase Realtime",
        "Sistema de temas claro/oscuro completo con tokens de diseño",
        "Autenticación con Supabase Auth y Row Level Security",
      ],
      en: [
        "Project views: Kanban, Gantt, lists, and calendar with drag-and-drop",
        "GitHub integration: commits, PRs, real-time CI/CD status",
        "Cloud FinOps module: multi-cloud cost optimization (AWS, GCP, Azure)",
        "Real-time team chat powered by Supabase Realtime",
        "Complete light/dark theme system with design tokens",
        "Authentication with Supabase Auth and Row Level Security",
      ],
    },
    architecture: {
      es: [
        "Next.js App Router con Server Components y Client Components",
        "Base de datos PostgreSQL gestionada por Supabase con RLS",
        "Componentes modulares basados en shadcn/ui con Tailwind CSS",
        "API routes de Next.js para lógica de servidor y webhooks de GitHub",
      ],
      en: [
        "Next.js App Router with Server Components and Client Components",
        "PostgreSQL database managed by Supabase with RLS",
        "Modular components based on shadcn/ui with Tailwind CSS",
        "Next.js API routes for server logic and GitHub webhooks",
      ],
    },
  },
  {
    id: "compilador-minic",
    nameKey: "project.compiler",
    techs: ["C++", "Flex (Lexer)", "Bison (Parser)", "AST", "Semantic Analysis", "MIPS Assembly", "GNU Make"],
    isPrivate: false,
    category: "systems",
    github: "https://github.com/seega-s/compilador-miniC",
    features: {
      es: [
        "Análisis léxico con Flex: tokenización de un subconjunto de C",
        "Análisis sintáctico recursivo descendente con Bison para generar AST",
        "Análisis semántico: comprobación de tipos, alcance de variables y declaraciones",
        "Generación de código MIPS: compilación a ensamblador ejecutable en SPIM/MARS",
        "Gestión de errores con mensajes descriptivos y número de línea",
      ],
      en: [
        "Lexical analysis with Flex: tokenization of a C subset",
        "Recursive descent parsing with Bison generating AST",
        "Semantic analysis: type checking, variable scope, and declarations",
        "MIPS code generation: compilation to executable assembly for SPIM/MARS",
        "Error handling with descriptive messages and line numbers",
      ],
    },
    architecture: {
      es: [
        "Pipeline clásico de compilación: fuente → léxico → sintáctico → semántico → generación",
        "AST como representación intermedia central del programa",
        "Tabla de símbolos con soporte de ámbitos anidados",
        "Generador de código MIPS con gestión de registros y pila",
      ],
      en: [
        "Classic compilation pipeline: source → lexer → parser → semantic → codegen",
        "AST as the central intermediate program representation",
        "Symbol table with nested scope support",
        "MIPS code generator with register and stack management",
      ],
    },
  },
  {
    id: "nanofiles",
    nameKey: "project.p2p",
    techs: ["Java", "TCP Sockets", "UDP Datagrams", "Multithreading", "Binary Protocol", "Directory Server"],
    isPrivate: false,
    category: "systems",
    github: "https://github.com/seega-s/nanoFiles",
    features: {
      es: [
        "Servidor de directorio central para registro y descubrimiento de peers",
        "Protocolo de control TCP para comandos de gestión y consultas",
        "Transferencia de archivos sobre UDP con protocolo binario propietario",
        "Multithreading para manejar múltiples transferencias simultáneas",
        "Protocolo de descubrimiento de peers en red local",
      ],
      en: [
        "Central directory server for peer registration and discovery",
        "TCP control protocol for management commands and queries",
        "File transfer over UDP with proprietary binary protocol",
        "Multithreading for handling multiple simultaneous transfers",
        "Peer discovery protocol on local network",
      ],
    },
    architecture: {
      es: [
        "Arquitectura cliente-servidor con descubrimiento peer-to-peer",
        "Protocolo binario propio sobre UDP para eficiencia en transferencias",
        "Separación de planos: control (TCP) y datos (UDP)",
        "Gestión de hilos con ThreadPool para conexiones concurrentes",
      ],
      en: [
        "Client-server architecture with peer-to-peer discovery",
        "Custom binary protocol over UDP for transfer efficiency",
        "Separation of planes: control (TCP) and data (UDP)",
        "Thread management with ThreadPool for concurrent connections",
      ],
    },
  },
  {
    id: "gestor-gastos",
    nameKey: "project.expenses",
    techs: ["Java", "Swing", "Maven", "JSON Persistence", "CSS", "JUnit", "Observer Pattern"],
    isPrivate: false,
    category: "fullstack",
    github: "https://github.com/seega-s/ProyectoTDS",
    features: {
      es: [
        "Registro y categorización de gastos personales con categorías personalizables",
        "Estadísticas visuales con gráficos de distribución por categoría",
        "Gestión de gastos compartidos entre grupos de personas con liquidación",
        "Sistema de alertas configurables por umbral de gasto",
        "Persistencia local con serialización JSON",
        "Interfaz de línea de comandos (CLI) alternativa",
      ],
      en: [
        "Personal expense registration and categorization with custom categories",
        "Visual statistics with category distribution charts",
        "Shared expense management between groups with settlement",
        "Configurable alert system with spending thresholds",
        "Local persistence with JSON serialization",
        "Alternative command-line interface (CLI)",
      ],
    },
    architecture: {
      es: [
        "Patrón MVC para separación de interfaz (Swing) y lógica de negocio",
        "Patrón Observer para actualización reactiva de vistas",
        "Persistencia desacoplada con interfaz de repositorio y adaptador JSON",
        "Estructura Maven modular con gestión de dependencias",
      ],
      en: [
        "MVC pattern for separation of interface (Swing) and business logic",
        "Observer pattern for reactive view updates",
        "Decoupled persistence with repository interface and JSON adapter",
        "Modular Maven structure with dependency management",
      ],
    },
  },
  {
    id: "marketplace-daweb",
    nameKey: "project.marketplace",
    techs: ["React", "Node.js", "Express", "MySQL", "JWT", "Bootstrap 5", "REST API", "Sequelize"],
    isPrivate: false,
    category: "fullstack",
    github: "https://github.com/seega-s/ProyectoDAWeb",
    features: {
      es: [
        "CRUD completo de productos con imágenes y categorías",
        "Autenticación y autorización con JSON Web Tokens (JWT)",
        "Búsqueda avanzada con filtros por categoría, precio y vendedor",
        "Diseño responsive con Bootstrap 5 y componentes reutilizables",
        "API REST con Express y validación de datos en servidor",
      ],
      en: [
        "Complete product CRUD with images and categories",
        "Authentication and authorization with JSON Web Tokens (JWT)",
        "Advanced search with filters by category, price, and seller",
        "Responsive design with Bootstrap 5 and reusable components",
        "REST API with Express and server-side data validation",
      ],
    },
    architecture: {
      es: [
        "Frontend SPA con React y React Router para navegación client-side",
        "Backend API REST con Express y middleware de autenticación JWT",
        "Base de datos MySQL con ORM Sequelize para modelos y migraciones",
        "Separación de rutas, controladores y servicios en el backend",
      ],
      en: [
        "Frontend SPA with React and React Router for client-side navigation",
        "Backend REST API with Express and JWT authentication middleware",
        "MySQL database with Sequelize ORM for models and migrations",
        "Separation of routes, controllers, and services in the backend",
      ],
    },
  },
  {
    id: "orquestador-vm",
    nameKey: "project.orchestrator",
    techs: ["C#", ".NET", "Azure Queues", "Azure VMs", "Cloud Architecture", "REST API"],
    isPrivate: true,
    category: "cloud",
    features: {
      es: [
        "Orquestación de máquinas virtuales en Azure con colas de mensajes",
        "Provisioning automático de VMs bajo demanda",
        "Monitorización de estado y health checks",
        "Sistema de colas para distribución de tareas",
        "Desarrollado durante prácticas profesionales en Maibound",
      ],
      en: [
        "Azure virtual machine orchestration with message queues",
        "Automatic on-demand VM provisioning",
        "Status monitoring and health checks",
        "Queue system for task distribution",
        "Built during professional internship at Maibound",
      ],
    },
    architecture: {
      es: [
        "Arquitectura basada en eventos con Azure Queue Storage",
        "API REST en .NET para gestión y control de VMs",
        "Patrón productor-consumidor para procesamiento de tareas",
        "Infraestructura cloud-native con Azure SDK",
      ],
      en: [
        "Event-driven architecture with Azure Queue Storage",
        "REST API in .NET for VM management and control",
        "Producer-consumer pattern for task processing",
        "Cloud-native infrastructure with Azure SDK",
      ],
    },
  },
]

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
  const project = PROJECT_DETAILS.find((p) => p.id === id)

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

  const features = project.features[lang]
  const architecture = project.architecture[lang]

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
              {project.category.toUpperCase()}
            </span>
            {project.isPrivate ? (
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
              className="text-3xl lg:text-5xl font-pixel tracking-tight uppercase mb-4"
            >
              {t(`${project.nameKey}.name`)}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5, ease }}
              className="text-xs lg:text-sm font-mono text-muted-foreground max-w-2xl leading-relaxed mb-6"
            >
              {t(`${project.nameKey}.desc`)}
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
            ) : project.isPrivate ? (
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

            {/* Architecture */}
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
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
