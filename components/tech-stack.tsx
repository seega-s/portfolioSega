"use client"

import { motion } from "framer-motion"
import { Bot, TerminalSquare, Network, Activity, Share2, Hexagon, Boxes } from "lucide-react"
import { useLanguage } from "@/components/i18n-context"
import { 
  siReact, siJavascript, siHtml5, siNextdotjs,
  siSpringboot, siCplusplus, siPython, siDocker, siGit, siPostgresql
} from 'simple-icons';

const ease = [0.22, 1, 0.36, 1] as const

type TechItem = {
  name: string
  icon: React.ReactNode
}

type TechCategory = {
  labelKey: string
  items: TechItem[]
}

/* ─── SVG icons sourced from SimpleIcons, DevIcon, & Lucide ─── */
const icons = {
  spring: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d={siSpringboot.path} /></svg>,
  cpp: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d={siCplusplus.path} /></svg>,
  react: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d={siReact.path} /></svg>,
  html: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d={siHtml5.path} /></svg>,
  next: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d={siNextdotjs.path} /></svg>,
  sql: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d={siPostgresql.path} /></svg>,
  python: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d={siPython.path} /></svg>,
  docker: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d={siDocker.path} /></svg>,
  git: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d={siGit.path} /></svg>,
  js: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d={siJavascript.path} /></svg>,
  java: <svg width="18" height="18" viewBox="0 0 128 128" fill="currentColor">
          <path d="M47.617 98.12s-4.767 2.774 3.397 3.71c9.892 1.13 14.947.968 25.845-1.092 0 0 2.871 1.795 6.873 3.351-24.439 10.47-55.308-.607-36.115-5.969zm-2.988-13.665s-5.348 3.959 2.823 4.805c10.567 1.091 18.91 1.18 33.354-1.6 0 0 1.993 2.025 5.132 3.131-29.542 8.64-62.446.68-41.309-6.336z"/>
          <path d="M69.802 61.271c6.025 6.935-1.58 13.17-1.58 13.17s15.289-7.891 8.269-17.777c-6.559-9.215-11.587-13.792 15.635-29.58 0 .001-42.731 10.67-22.324 34.187z"/>
          <path d="M102.123 108.229s3.529 2.91-3.888 5.159c-14.102 4.272-58.706 5.56-71.094.171-4.451-1.938 3.899-4.625 6.526-5.192 2.739-.593 4.303-.485 4.303-.485-4.953-3.487-32.013 6.85-13.743 9.815 49.821 8.076 90.817-3.637 77.896-9.468zM49.912 70.294s-22.686 5.389-8.033 7.348c6.188.828 18.518.638 30.011-.326 9.39-.789 18.813-2.474 18.813-2.474s-3.308 1.419-5.704 3.053c-23.042 6.061-67.544 3.238-54.731-2.958 10.832-5.239 19.644-4.643 19.644-4.643zm40.697 22.747c23.421-12.167 12.591-23.86 5.032-22.285-1.848.385-2.677.72-2.677.72s.688-1.079 2-1.543c14.953-5.255 26.451 15.503-4.823 23.725 0-.002.359-.327.468-.617z"/>
          <path d="M76.491 1.587S89.459 14.563 64.188 34.51c-20.266 16.006-4.621 25.13-.007 35.559-11.831-10.673-20.509-20.07-14.688-28.815C58.041 28.42 81.722 22.195 76.491 1.587z"/>
          <path d="M52.214 126.021c22.476 1.437 57-.8 57.817-11.436 0 0-1.571 4.032-18.577 7.231-19.186 3.612-42.854 3.191-56.887.874 0 .001 2.875 2.381 17.647 3.331z"/>
        </svg>,
  aws: <svg width="18" height="18" viewBox="0 0 128 128" fill="currentColor">
         <path d="M108.59 26.148c-1.852 0-3.622.211-5.305.715-1.684.504-3.117 1.223-4.379 2.188a10.829 10.829 0 0 0-3.031 3.453c-.757 1.348-1.137 2.906-1.137 4.676 0 2.187.716 4.25 2.106 6.105 1.386 1.895 3.66 3.324 6.734 4.293l6.106 1.895c2.062.675 3.496 1.391 4.254 2.191.757.801 1.136 1.765 1.136 2.945 0 1.726-.758 3.074-2.191 4-1.43.925-3.492 1.391-6.145 1.391-1.687 0-3.328-.168-5.011-.504a23.102 23.102 0 0 1-4.633-1.476c-.421-.168-.801-.336-1.051-.418a2.357 2.357 0 0 0-.758-.13c-.634 0-.969.423-.969 1.305v2.149a2.919 2.919 0 0 0 .254 1.18c.168.38.629.8 1.305 1.18 1.094.628 2.734 1.179 4.84 1.683 2.105.504 4.297.758 6.484.758 2.15 0 4.129-.297 6.024-.883 1.808-.551 3.367-1.309 4.672-2.36 1.304-1.01 2.316-2.273 3.074-3.707.714-1.429 1.094-3.07 1.094-4.882 0-2.188-.633-4.168-1.938-5.895-1.304-1.727-3.491-3.074-6.523-4.043l-5.98-1.895c-2.23-.713-3.79-1.516-4.634-2.316-.84-.797-1.261-1.808-1.261-2.988 0-1.726.671-2.95 1.98-3.746 1.305-.801 3.199-1.18 5.598-1.18 2.988 0 5.683.547 8.086 1.64.714.337 1.261.508 1.597.508.633 0 .969-.463.969-1.347v-1.98c0-.59-.125-1.051-.379-1.391-.25-.378-.672-.715-1.262-1.051-.422-.254-1.011-.504-1.77-.758a32.528 32.528 0 0 0-2.398-.676c-.886-.168-1.769-.336-2.738-.46a21.347 21.347 0 0 0-2.82-.169zm-86.822.082c-2.316 0-4.508.254-6.57.801-2.063.505-3.831 1.137-5.303 1.895-.59.297-.97.59-1.18.883-.211.296-.293.8-.293 1.476v2.063c0 .882.293 1.304.883 1.304.168 0 .378-.043.674-.125.293-.086.796-.254 1.472-.547a33.416 33.416 0 0 1 4.547-1.433A19.176 19.176 0 0 1 20.547 32c3.242 0 5.513.633 6.863 1.938 1.304 1.303 1.98 3.534 1.98 6.734v3.074c-1.683-.379-3.283-.715-4.843-.926-1.558-.21-3.031-.336-4.461-.336-4.34 0-7.75 1.094-10.316 3.286-2.571 2.187-3.832 5.093-3.832 8.671 0 3.368 1.05 6.063 3.113 8.086 2.066 2.02 4.887 3.032 8.422 3.032 4.97 0 9.097-1.938 12.379-5.813a34.153 34.153 0 0 0 1.304 2.484 13.28 13.28 0 0 0 1.516 1.98c.422.38.844.59 1.266.59.334 0 .714-.128 1.093-.378l2.653-1.77c.546-.42.8-.843.8-1.261a1.86 1.86 0 0 0-.293-.97 22.469 22.469 0 0 1-1.347-3.03c-.297-.925-.465-2.19-.465-3.75h-.086V40c0-4.633-1.176-8.086-3.492-10.36-2.36-2.273-6.025-3.41-11.033-3.41zm19.58 1.012c-.676 0-1.012.379-1.012 1.051 0 .297.129.844.379 1.687l9.894 32.547c.254.8.547 1.387.887 1.641.336.297.84.422 1.598.422h3.62c.759 0 1.347-.125 1.684-.422.34-.293.591-.84.801-1.684l6.485-27.117 6.527 27.16c.168.84.46 1.387.8 1.684.337.292.883.422 1.684.422h3.621c.715 0 1.262-.167 1.598-.422.34-.253.633-.8.887-1.64L90.949 30.02c.168-.46.25-.797.293-1.051.043-.254.086-.466.086-.676 0-.715-.379-1.05-1.055-1.05H86.36c-.757 0-1.308.166-1.644.421-.293.25-.59.8-.84 1.64L76.59 57.517l-6.653-28.211c-.166-.8-.464-1.39-.8-1.64-.336-.298-.884-.423-1.684-.423h-3.367c-.758 0-1.348.167-1.688.422-.335.25-.588.8-.796 1.64l-6.57 27.876-7.075-27.875c-.25-.8-.504-1.39-.84-1.64-.297-.298-.844-.423-1.644-.423h-4.125zM21.64 47.496a31.816 31.816 0 0 1 3.96.25 34.401 34.401 0 0 1 3.872.719v1.765c0 1.435-.168 2.653-.422 3.665-.25 1.01-.758 1.895-1.43 2.695-1.137 1.262-2.484 2.187-4 2.695-1.516.504-2.949.758-4.336.758-1.937 0-3.41-.508-4.422-1.559-1.054-1.01-1.558-2.484-1.558-4.464 0-2.106.675-3.704 2.062-4.84 1.391-1.137 3.454-1.684 6.274-1.684zM118 73.348c-4.432.063-9.664 1.052-13.621 3.832-1.223.883-1.012 2.062.336 1.894 4.508-.547 14.44-1.726 16.21.547 1.77 2.23-1.976 11.62-3.663 15.79-.504 1.26.59 1.769 1.726.8 7.41-6.231 9.348-19.242 7.832-21.137-.757-.925-4.388-1.79-8.82-1.726zM1.63 75.859c-.926.116-1.347 1.236-.368 2.121 16.508 14.902 38.359 23.872 62.613 23.872 17.305 0 37.43-5.43 51.281-15.66 2.273-1.689.298-4.254-2.02-3.204-15.533 6.57-32.421 9.77-47.788 9.77-22.778 0-44.8-6.273-62.653-16.633-.39-.231-.755-.304-1.064-.266z" />
       </svg>,
  azure: <svg width="18" height="18" viewBox="0 0 128 128" fill="currentColor">
           <path d="M43.983 4.653a5.911 5.911 0 015.6 4.022l35.91 106.396a5.911 5.911 0 01-5.603 7.802h41.38a5.917 5.917 0 004.8-2.465 5.909 5.909 0 00.798-5.34L90.961 8.672a5.91 5.91 0 00-5.602-4.022zm-1.336.478a5.92 5.92 0 00-5.61 4.029L1.132 115.55a5.91 5.91 0 005.6 7.8h28.893c1.239 0 2.446-.41 3.452-1.113a5.923 5.923 0 002.157-2.916l7.019-20.71-13.411-12.857c-.246-.273-1.353-2.274-.369-4.002 1.108-1.659 2.955-1.659 2.955-1.659h17.285l9.074-26.145L48.274 8.321c-.042-.205-.914-1.365-2.281-2.28-1.37-.915-3.345-.909-3.345-.909zm-4.88 75.74a2.724 2.724 0 00-1.86 4.718l37.83 35.31c1.101 1.03 2.502 1.631 4.007 1.631 0 0 1.282.068 2.055-.033 1.817-.273 3.525-1.768 4.09-2.39 1.457-1.939.794-4.95.794-4.95l-11.45-34.28z" />
         </svg>,
  ai: <Bot size={18} strokeWidth={1.5} />,
  prompt: <TerminalSquare size={18} strokeWidth={1.5} />,
  llm: <Network size={18} strokeWidth={1.5} />,
  tcp: <Activity size={18} strokeWidth={1.5} />,
  p2p: <Share2 size={18} strokeWidth={1.5} />,
  hex: <Hexagon size={18} strokeWidth={1.5} />,
  ddd: <Boxes size={18} strokeWidth={1.5} />,
}

const TECH_CATEGORIES: TechCategory[] = [
  {
    labelKey: "tech.backend",
    items: [
      { name: "Java", icon: icons.java },
      { name: "Spring Boot", icon: icons.spring },
      { name: "C++", icon: icons.cpp },
      { name: "Python", icon: icons.python },
      { name: "SQL", icon: icons.sql },
    ],
  },
  {
    labelKey: "tech.frontend",
    items: [
      { name: "React", icon: icons.react },
      { name: "JavaScript", icon: icons.js },
      { name: "HTML/CSS", icon: icons.html },
      { name: "Next.js", icon: icons.next },
    ],
  },
  {
    labelKey: "tech.cloud",
    items: [
      { name: "AWS", icon: icons.aws },
      { name: "Azure", icon: icons.azure },
      { name: "Docker", icon: icons.docker },
      { name: "Git", icon: icons.git },
    ],
  },
  {
    labelKey: "tech.ai",
    items: [
      { name: "AI Dev", icon: icons.ai },
      { name: "Prompt Eng.", icon: icons.prompt },
      { name: "LLM Integration", icon: icons.llm },
    ],
  },
  {
    labelKey: "tech.other",
    items: [
      { name: "TCP/UDP", icon: icons.tcp },
      { name: "P2P Networks", icon: icons.p2p },
      { name: "Arch. Hexagonal", icon: icons.hex },
      { name: "DDD", icon: icons.ddd },
    ],
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease },
  }),
}

export function TechStack() {
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
        <span className="section-label">{t("tech.label")}</span>
        <div className="flex-1 border-t border-border" />
        <span className="section-label">003</span>
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease }}
        className="text-2xl lg:text-4xl font-pixel tracking-tight uppercase mb-8"
      >
        {t("tech.title")}
      </motion.h2>

      {/* AWS Certification badge */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1, ease }}
        className="mb-8 inline-flex items-center gap-3 border-2 border-teal px-4 py-2"
      >
        <span className="text-teal font-mono text-sm font-bold flex items-center gap-2">
          <span className="w-4 h-4">{icons.aws}</span> AWS
        </span>
        <div className="h-4 w-px bg-teal/30" />
        <span className="text-[10px] tracking-[0.15em] uppercase text-teal font-mono">
          Cloud Practitioner Certified
        </span>
      </motion.div>

      {/* Tech categories */}
      <div className="flex flex-col gap-6">
        {TECH_CATEGORIES.map((category, catIndex) => (
          <motion.div
            key={category.labelKey}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="flex flex-col gap-3"
          >
            {/* Category label */}
            <motion.span
              custom={catIndex}
              variants={cardVariants}
              className="text-[10px] tracking-[0.2em] uppercase text-salmon font-mono font-bold"
            >
              {t(category.labelKey)}
            </motion.span>

            {/* Tech items grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-0">
              {category.items.map((tech, techIndex) => (
                <motion.div
                  key={tech.name}
                  custom={catIndex * 5 + techIndex}
                  variants={cardVariants}
                  whileHover={{ scale: 1.02, backgroundColor: "hsl(var(--accent) / 0.08)" }}
                  className="flex items-center gap-3 px-4 py-3 border border-foreground/10 hover:border-salmon/40 transition-colors duration-200 cursor-default"
                >
                  <span className="text-salmon/70 w-5 h-4 shrink-0 flex items-center justify-center">
                    {tech.icon}
                  </span>
                  <span className="text-xs font-mono text-foreground tracking-wide">
                    {tech.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
