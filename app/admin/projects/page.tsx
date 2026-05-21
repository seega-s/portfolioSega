"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, LogOut, Check, X, GitBranch } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Project } from '@/lib/types'

const emptyProject: Omit<Project, 'display_order' | 'created_at'> = {
  id: '',
  name_es: '',
  name_en: '',
  desc_es: '',
  desc_en: '',
  techs: [],
  is_private: false,
  category: 'fullstack',
  github: '',
  features_es: [],
  features_en: [],
  architecture_es: [],
  architecture_en: [],
}

const emptyProjectForm = {
  ...emptyProject,
  techs: '',
  features_es: '',
  features_en: '',
  architecture_es: '',
  architecture_en: '',
}

function ProjectForm({
  initialData,
  editingId,
  onClose,
  onSuccess
}: {
  initialData: typeof emptyProjectForm
  editingId: string | null
  onClose: () => void
  onSuccess: () => void
}) {
  const [formData, setFormData] = useState(initialData)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const projectPayload = {
      ...formData,
      techs: formData.techs.split(',').map(item => item.trim()).filter(Boolean),
      features_es: formData.features_es.split('\n').map(item => item.trim()).filter(Boolean),
      features_en: formData.features_en.split('\n').map(item => item.trim()).filter(Boolean),
      architecture_es: formData.architecture_es.split('\n').map(item => item.trim()).filter(Boolean),
      architecture_en: formData.architecture_en.split('\n').map(item => item.trim()).filter(Boolean),
    }

    try {
      let res;
      if (editingId) {
        res = await fetch('/api/projects', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...projectPayload, id: editingId }),
        })
      } else {
        res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectPayload),
        })
      }
      
      if (!res.ok) {
        const errorData = await res.json()
        console.error('Error saving:', errorData)
        alert('Error guardando el proyecto: ' + (errorData.error || 'Error desconocido'))
        return
      }

      alert('Proyecto guardado correctamente');
      onSuccess()
    } catch (err) {
      console.error(err)
      alert('Error de red al guardar')
    }
  }

  const togglePrivate = () => {
    setFormData(prev => ({ ...prev, is_private: !prev.is_private }))
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 overflow-y-auto backdrop-blur-sm">
      <div className="min-h-screen p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black border border-zinc-800 w-full max-w-4xl shadow-2xl"
        >
          <div className="flex justify-between items-center p-6 border-b border-zinc-800 bg-zinc-900/50">
            <h2 className="text-xl font-bold">{editingId ? 'EDITAR PROYECTO' : 'NUEVO PROYECTO'}</h2>
            <button onClick={onClose} className="text-zinc-500 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">ID (Slug)</label>
                <input
                  required
                  disabled={!!editingId}
                  value={formData.id}
                  onChange={e => setFormData({ ...formData, id: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 px-4 py-2 focus:border-[#f07635] outline-none disabled:opacity-50"
                  placeholder="mi-proyecto"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Categoría</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 px-4 py-2 focus:border-[#f07635] outline-none"
                >
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="fullstack">Fullstack</option>
                  <option value="cloud">Cloud</option>
                  <option value="systems">Systems</option>
                </select>
              </div>
              <div className="flex items-end pb-2 gap-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={togglePrivate}
                    className={`relative inline-flex h-6 w-11 items-center transition-colors border border-zinc-800 ${formData.is_private ? 'bg-[#f07635]' : 'bg-zinc-900'}`}
                    aria-pressed={formData.is_private}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform bg-white transition-transform ${formData.is_private ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                  <span 
                    className="text-sm font-bold uppercase cursor-pointer select-none"
                    onClick={togglePrivate}
                  >
                    Es Privado
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Enlace GitHub (Opcional si es privado)</label>
              <input
                value={formData.github || ''}
                onChange={e => setFormData({ ...formData, github: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 px-4 py-2 focus:border-[#f07635] outline-none"
                placeholder="https://github.com/..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-mono text-[#f07635] border-b border-zinc-800 pb-2">ESPAÑOL</h3>
                <div>
                  <label className="block text-xs text-zinc-500 uppercase mb-1">Nombre</label>
                  <input required value={formData.name_es} onChange={e => setFormData({ ...formData, name_es: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 px-4 py-2 outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 uppercase mb-1">Descripción Breve</label>
                  <textarea required value={formData.desc_es} onChange={e => setFormData({ ...formData, desc_es: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 px-4 py-2 outline-none h-24" />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 uppercase mb-1">Características (Una por línea)</label>
                  <textarea required value={formData.features_es} onChange={e => setFormData({ ...formData, features_es: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 px-4 py-2 outline-none h-24" />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 uppercase mb-1">Arquitectura (Una por línea)</label>
                  <textarea required value={formData.architecture_es} onChange={e => setFormData({ ...formData, architecture_es: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 px-4 py-2 outline-none h-24" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-mono text-[#f07635] border-b border-zinc-800 pb-2">ENGLISH</h3>
                <div>
                  <label className="block text-xs text-zinc-500 uppercase mb-1">Name</label>
                  <input required value={formData.name_en} onChange={e => setFormData({ ...formData, name_en: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 px-4 py-2 outline-none" />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 uppercase mb-1">Short Description</label>
                  <textarea required value={formData.desc_en} onChange={e => setFormData({ ...formData, desc_en: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 px-4 py-2 outline-none h-24" />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 uppercase mb-1">Features (One per line)</label>
                  <textarea required value={formData.features_en} onChange={e => setFormData({ ...formData, features_en: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 px-4 py-2 outline-none h-24" />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 uppercase mb-1">Architecture (One per line)</label>
                  <textarea required value={formData.architecture_en} onChange={e => setFormData({ ...formData, architecture_en: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 px-4 py-2 outline-none h-24" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Tecnologías (Separadas por comas)</label>
              <input
                required
                value={formData.techs}
                onChange={e => setFormData({ ...formData, techs: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 px-4 py-2 focus:border-[#f07635] outline-none font-mono text-sm"
                placeholder="React, Next.js, Tailwind..."
              />
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-zinc-800">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 font-bold text-zinc-400 hover:text-white transition-colors"
              >
                CANCELAR
              </button>
              <button
                type="submit"
                className="bg-white text-black px-8 py-3 font-bold flex items-center gap-2 hover:bg-zinc-200 transition-colors"
              >
                <Check className="w-5 h-5" />
                GUARDAR
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState(emptyProjectForm)
  
  const router = useRouter()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects', { cache: 'no-store' })
      const data = await res.json()
      setProjects(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este proyecto?')) return
    try {
      await fetch(`/api/projects?id=${id}`, { method: 'DELETE' })
      await fetchProjects()
    } catch (err) {
      console.error(err)
    }
  }

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === projects.length - 1) return

    const newProjects = [...projects]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    const tempOrder = newProjects[index].display_order
    newProjects[index].display_order = newProjects[targetIndex].display_order
    newProjects[targetIndex].display_order = tempOrder

    const tempProject = newProjects[index]
    newProjects[index] = newProjects[targetIndex]
    newProjects[targetIndex] = tempProject

    // Recalcular display_order para garantizar consistencia secuencial
    const updatedProjects = newProjects.map((p, idx) => ({ ...p, display_order: idx }))

    setProjects(updatedProjects)

    try {
      await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProjects.map(p => ({ id: p.id, display_order: p.display_order }))),
      })
    } catch (err) {
      console.error(err)
    }
  }

  const handleEdit = (project: Project) => {
    setEditingId(project.id)
    setFormData({
      ...project,
      techs: project.techs.join(', '),
      features_es: project.features_es.join('\n'),
      features_en: project.features_en.join('\n'),
      architecture_es: project.architecture_es.join('\n'),
      architecture_en: project.architecture_en.join('\n'),
    })
    setIsFormOpen(true)
  }

  const handleAddNew = () => {
    setEditingId(null)
    setFormData(emptyProjectForm)
    setIsFormOpen(true)
  }

  const handleFormSuccess = () => {
    setIsFormOpen(false)
    fetchProjects()
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="flex justify-between items-center mb-12 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ADMINISTRACIÓN DE PROYECTOS</h1>
          <p className="text-zinc-500 mt-2">Gestiona el portfolio desde aquí</p>
        </div>
        <div className="flex gap-4">
          <Link href="/admin"
            className="border border-zinc-800 text-zinc-400 px-5 py-3 font-bold flex items-center gap-2 hover:text-[#f07635] hover:border-[#f07635] transition-colors">
            VOLVER AL PANEL
          </Link>
          <button
            onClick={handleAddNew}
            className="bg-[#f07635] text-white px-6 py-3 font-bold flex items-center gap-2 hover:bg-[#d86a30] transition-colors"
          >
            <Plus className="w-5 h-5" />
            NUEVO PROYECTO
          </button>
          <button
            onClick={handleLogout}
            className="border border-zinc-800 text-zinc-400 px-4 py-3 hover:text-white hover:border-zinc-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-zinc-500 font-mono">CARGANDO...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col gap-4"
              >
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black border border-zinc-800 p-1">
                  <button onClick={() => handleMove(index, 'up')} disabled={index === 0} className="p-2 hover:bg-zinc-800 disabled:opacity-30">
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleMove(index, 'down')} disabled={index === projects.length - 1} className="p-2 hover:bg-zinc-800 disabled:opacity-30">
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleEdit(project)} className="p-2 hover:bg-blue-900/30 text-blue-400">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(project.id)} className="p-2 hover:bg-red-900/30 text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <div className="flex gap-2 items-center mb-2">
                    <span className="text-xs font-mono text-[#f07635] bg-[#f07635]/10 px-2 py-1">
                      {project.category}
                    </span>
                    <span className={`text-xs font-mono px-2 py-1 border ${project.is_private ? 'border-zinc-500 text-zinc-500' : 'border-green-500/50 text-green-400 bg-green-500/10'}`}>
                      {project.is_private ? 'PRIVADO' : 'PÚBLICO'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold">{project.name_es}</h3>
                  <p className="text-zinc-400 text-sm mt-2 line-clamp-2">{project.desc_es}</p>
                </div>

                <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-zinc-800/50">
                  {project.techs.slice(0, 3).map(tech => (
                    <span key={tech} className="text-xs font-mono bg-zinc-800 text-zinc-300 px-2 py-1">
                      {tech}
                    </span>
                  ))}
                  {project.techs.length > 3 && (
                    <span className="text-xs font-mono bg-zinc-800 text-zinc-500 px-2 py-1">
                      +{project.techs.length - 3}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {isFormOpen && (
        <ProjectForm
          initialData={formData}
          editingId={editingId}
          onClose={() => setIsFormOpen(false)}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  )
}

