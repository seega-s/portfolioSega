"use client"

import Link from 'next/link'
import { Monitor, GitBranch, Workflow, Search, Code, LogOut, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AdminRoot() {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  const sections = [
    {
      title: "Página Principal",
      icon: Monitor,
      href: "/admin/main",
      description: "Atributos, redes sociales, subtítulos"
    },
    {
      title: "Experiencia",
      icon: GitBranch,
      href: "/admin/experience",
      description: "Editor de grafo interactivo"
    },
    {
      title: "Proyectos",
      icon: Workflow,
      href: "/admin/projects",
      description: "Gestión de portfolio"
    },
    {
      title: "Sobre mí",
      icon: Search,
      href: "/admin/about",
      description: "Información personal y biografía"
    },
    {
      title: "Stack",
      icon: Code,
      href: "/admin/stack",
      description: "Tecnologías y herramientas"
    }
  ]

  return (
    <div className="min-h-screen bg-black flex flex-col p-8 font-mono">
      {/* Header */}
      <div className="flex justify-between items-start mb-24">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-zinc-500 uppercase tracking-widest">Panel de Administración</h1>
          <p className="text-zinc-700 text-sm mt-2">Módulos de edición del sistema</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={handleLogout}
            className="border border-zinc-800 text-zinc-500 hover:text-zinc-300 px-4 py-2 uppercase text-xs font-bold transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Salir
          </button>
          <Link 
            href="/"
            className="bg-[#f07635] text-white px-6 py-2 uppercase text-xs font-bold hover:bg-[#d86a30] transition-colors flex items-center justify-center gap-2"
          >
            Volver al Portfolio <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Main Navigation - Horizontal List */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-4">
          {sections.map((section, idx) => {
            const Icon = section.icon
            return (
              <Link 
                href={section.href} 
                key={idx}
                className="group flex flex-col items-center justify-center p-12 min-h-[400px] border border-zinc-800 text-zinc-600 hover:text-zinc-300 hover:border-zinc-500 hover:bg-zinc-900/30 transition-all bg-black"
              >
                <Icon className="w-12 h-12 stroke-[1.5] mb-6 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-center">
                  <h2 className="font-bold uppercase tracking-widest mb-3">{section.title}</h2>
                  <p className="text-xs text-zinc-700 max-w-[200px] leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {section.description}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
