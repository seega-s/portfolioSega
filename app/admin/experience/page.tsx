"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, X, Upload, Save, ZoomIn, ZoomOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { ExperienceNode, ExperienceEdge } from '@/lib/types'

const emptyNode: Omit<ExperienceNode, 'id' | 'position_x' | 'position_y' | 'display_order' | 'created_at'> = {
  node_type: 'work',
  graph_type: 'professional',
  company_name: '',
  logo_url: null,
  role_es: '',
  role_en: '',
  description_es: '',
  description_en: '',
  date_start: '',
  date_end: null,
  techs: [],
  related_project_id: null,
  study_name_es: '',
  study_name_en: ''
}

export default function ExperienceAdmin() {
  const router = useRouter()
  const [nodes, setNodes] = useState<ExperienceNode[]>([])
  const [edges, setEdges] = useState<ExperienceEdge[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [editForm, setEditForm] = useState(emptyNode)
  
  const [activeGraph, setActiveGraph] = useState<'professional' | 'education' | 'personal'>('professional')

  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 })
  const [isPanning, setIsPanning] = useState(false)
  // Canvas state
  const [draggingNode, setDraggingNode] = useState<string | null>(null)
  const [drawingEdge, setDrawingEdge] = useState<{ sourceId: string, startX: number, startY: number, currentX: number, currentY: number } | null>(null)
  const [uploading, setUploading] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchData()
  }, [activeGraph])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/experience?graph=${activeGraph}`)
      if (res.status === 401) {
        router.push('/admin/login')
        return
      }
      const data = await res.json()
      setNodes(data.nodes || [])
      setEdges(data.edges || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const savePositions = async (updatedNodes: ExperienceNode[]) => {
    try {
      await fetch('/api/experience', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedNodes.map(n => ({ id: n.id, position_x: n.position_x, position_y: n.position_y })))
      })
    } catch (err) {
      console.error(err)
    }
  }


  const handlePointerDownNode = (e: React.PointerEvent, id: string) => {
    if (e.target instanceof Element && e.target.closest('.port')) return
    e.currentTarget.setPointerCapture(e.pointerId)
    setDraggingNode(id)
  }

  const handlePointerDownCanvas = (e: React.PointerEvent) => {
    if (e.target === canvasRef.current || (e.target as Element).id === 'grid-bg') {
      e.currentTarget.setPointerCapture(e.pointerId)
      setIsPanning(true)
    }
  }

  const handlePointerMoveCanvas = (e: React.PointerEvent) => {
    if (isPanning) {
      setTransform(prev => ({ ...prev, x: prev.x + e.movementX, y: prev.y + e.movementY }))
    } else if (draggingNode) {
      setNodes(prev => {
        const next = prev.map(n => 
          n.id === draggingNode 
            ? { ...n, position_x: n.position_x + e.movementX / transform.scale, position_y: n.position_y + e.movementY / transform.scale }
            : n
        )
        return next
      })
    }
    if (drawingEdge) {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (rect) {
        setDrawingEdge(prev => prev ? { 
          ...prev, 
          currentX: (e.clientX - rect.left - transform.x) / transform.scale, 
          currentY: (e.clientY - rect.top - transform.y) / transform.scale 
        } : null)
      }
    }
  }

  const handlePointerUpCanvas = (e: React.PointerEvent) => {
    if (isPanning) setIsPanning(false)
    if (draggingNode) {
      savePositions(nodes)
      setDraggingNode(null)
    }
    if (drawingEdge) {
      setDrawingEdge(null)
    }
  }

  const handleWheelCanvas = (e: React.WheelEvent) => {
    const zoom = -e.deltaY * 0.001
    setTransform(prev => {
      const newScale = Math.min(Math.max(0.1, prev.scale + zoom), 3)
      return { ...prev, scale: newScale }
    })
  }
  const startDrawingEdge = (e: React.PointerEvent, sourceId: string) => {
    e.stopPropagation()
    const sNode = document.getElementById(`node-${sourceId}`)
    const sourceNode = nodes.find(n => n.id === sourceId)
    if (!sourceNode) return
    
    const startX = sourceNode.position_x + (sNode?.offsetWidth || 200)
    const startY = sourceNode.position_y + (sNode?.offsetHeight || 80) / 2
    
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    
    const currentX = (e.clientX - rect.left - transform.x) / transform.scale
    const currentY = (e.clientY - rect.top - transform.y) / transform.scale

    setDrawingEdge({
      sourceId,
      startX,
      startY,
      currentX,
      currentY
    })
  }

  const finishDrawingEdge = async (e: React.PointerEvent, targetId: string) => {
    e.stopPropagation()
    if (drawingEdge && drawingEdge.sourceId !== targetId) {
      try {
        const res = await fetch('/api/experience', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ source_node_id: drawingEdge.sourceId, target_node_id: targetId })
        })
        if (res.ok) {
          const newEdge = await res.json()
          setEdges([...edges, newEdge])
        }
      } catch (err) {
        console.error(err)
      }
    }
    setDrawingEdge(null)
  }

  const handleSaveNode = async () => {
    try {
      const method = isEditing && isEditing !== 'new' ? 'PUT' : 'POST'
      const body = { 
        ...editForm,
        graph_type: activeGraph,
        ...(isEditing && isEditing !== 'new' ? { id: isEditing } : {})
      }
      const res = await fetch('/api/experience', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      
      if (res.ok) {
        const savedNode = await res.json()
        if (method === 'POST') {
          setNodes([...nodes, savedNode])
        } else {
          setNodes(nodes.map(n => n.id === savedNode.id ? savedNode : n))
        }
        setIsEditing(null)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteNode = async (id: string) => {
    try {
      const res = await fetch(`/api/experience?nodeId=${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to delete node')
      }
      setNodes(nodes.filter(n => n.id !== id))
      setEdges(edges.filter(e => e.source_node_id !== id && e.target_node_id !== id))
    } catch (err: any) {
      console.error(err)
      alert(err.message)
    }
  }

  const handleDeleteEdge = async (id: string) => {
    try {
      await fetch(`/api/experience?edgeId=${id}`, { method: 'DELETE' })
      setEdges(edges.filter(e => e.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    setUploading(true)
    
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const res = await fetch('/api/experience/upload', {
        method: 'POST',
        body: formData
      })
      
      if (res.ok) {
        const { url } = await res.json()
        setEditForm({ ...editForm, logo_url: url })
      } else {
        const err = await res.json()
        alert(`Error: ${err.error}`)
      }
    } catch (err) {
      console.error(err)
      alert('Error uploading file')
    } finally {
      setUploading(false)
    }
  }

  // Helper to render edges properly with SVG coordinates relative to transform
  const renderEdge = (sourceId: string, targetId: string) => {
    const sNode = document.getElementById(`node-${sourceId}`)
    const tNode = document.getElementById(`node-${targetId}`)
    const sourceNode = nodes.find(n => n.id === sourceId)
    const targetNode = nodes.find(n => n.id === targetId)
    
    if (!sNode || !tNode || !sourceNode || !targetNode) return null

    const startX = sourceNode.position_x + (sNode.offsetWidth || 200)
    const startY = sourceNode.position_y + (sNode.offsetHeight || 80) / 2
    const endX = targetNode.position_x
    const endY = targetNode.position_y + (tNode.offsetHeight || 80) / 2

    return { startX, startY, endX, endY }
  }

  // Force re-render edges when nodes move
  const [, setTick] = useState(0)
  useEffect(() => {
    if (draggingNode) {
      const timer = requestAnimationFrame(() => setTick(t => t + 1))
      return () => cancelAnimationFrame(timer)
    }
  }, [draggingNode, nodes])

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-mono relative overflow-hidden" 
>
      
      {/* UI Overlay */}
      <div className="absolute top-6 left-6 z-50 flex gap-6 font-bold uppercase text-sm">
        <button onClick={() => router.push('/admin')} className="text-[#555] hover:text-white transition-colors">Volver</button>
        <div className="flex gap-4 border-l border-[#333] pl-6">
          <button onClick={() => setActiveGraph('professional')} className={`transition-colors ${activeGraph === 'professional' ? 'text-white' : 'text-[#555] hover:text-white'}`}>Trabajo</button>
          <button onClick={() => setActiveGraph('education')} className={`transition-colors ${activeGraph === 'education' ? 'text-white' : 'text-[#555] hover:text-white'}`}>Educación</button>
          <button onClick={() => setActiveGraph('personal')} className={`transition-colors ${activeGraph === 'personal' ? 'text-white' : 'text-[#555] hover:text-white'}`}>Proyectos</button>
        </div>
      </div>

      <button 
        onClick={() => {
          setEditForm({ ...emptyNode, graph_type: activeGraph, node_type: activeGraph === 'professional' ? 'work' : activeGraph === 'education' ? 'study' : 'project' })
          setIsEditing('new')
        }}
        className="absolute top-6 right-6 z-50 bg-[#f07635] text-white px-4 py-2 font-bold flex items-center gap-2 hover:bg-[#d86a30] uppercase text-sm"
      >
        <Plus className="w-4 h-4" /> NUEVO NODO
      </button>

      {/* Canvas Area */}
      <div ref={canvasRef} className="flex-1 relative bg-black overflow-hidden" 
           style={{ cursor: draggingNode ? 'grabbing' : isPanning ? 'grabbing' : 'grab' }}
           onWheel={handleWheelCanvas}
           onPointerDown={handlePointerDownCanvas}
           onPointerMove={handlePointerMoveCanvas}
           onPointerUp={handlePointerUpCanvas}>
        
        <div 
          className="absolute inset-0 origin-top-left"
          style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})` }}
        >
          <div id="grid-bg" className="absolute" style={{ width: '20000px', height: '20000px', left: '-10000px', top: '-10000px', backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          {/* SVG layer for edges */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" style={{ zIndex: 10 }}>
          {edges.map(edge => {
            const coords = renderEdge(edge.source_node_id, edge.target_node_id)
            if (!coords) return null
            const { startX, startY, endX, endY } = coords
            // Adjust coordinates based on scroll if canvas was scrollable, but here we assume fixed full screen for simplicity
            return (
              <g key={edge.id} className="pointer-events-auto cursor-pointer" onClick={() => handleDeleteEdge(edge.id)}>
                <path 
                  d={`M ${startX} ${startY} C ${startX + 100} ${startY}, ${endX - 100} ${endY}, ${endX} ${endY}`}
                  fill="none" 
                  stroke="#f07635" 
                  strokeWidth="2" 
                  className="hover:stroke-red-500 transition-colors"
                />
              </g>
            )
          })}
          
          {/* Drawing edge */}
          {drawingEdge && (
            <path 
              d={`M ${drawingEdge.startX} ${drawingEdge.startY} L ${drawingEdge.currentX} ${drawingEdge.currentY}`}
              fill="none" 
              stroke="#f07635" 
              strokeWidth="2" 
              strokeDasharray="5,5"
            />
          )}
        </svg>

        {/* Nodes */}
        {nodes.map(node => (
          <div 
            key={node.id}
            id={`node-${node.id}`}
            onPointerDown={(e) => handlePointerDownNode(e, node.id)}
            onDoubleClick={() => {
              setEditForm(node)
              setIsEditing(node.id)
            }}
            className="absolute bg-black text-white border-2 border-white/20 p-3 cursor-grab active:cursor-grabbing hover:border-[#f07635] transition-colors select-none group"
            style={{ 
              width: 260,
              height: 140,
              transform: `translate(${node.position_x}px, ${node.position_y}px)`,
              zIndex: draggingNode === node.id ? 50 : 20
            }}
          >
            {/* Delete button */}
            <button 
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDeleteNode(node.id) }}
              className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-none p-1.5 z-[100] shadow-md cursor-pointer pointer-events-auto flex items-center justify-center"
            >
              <Trash2 className="w-4 h-4 pointer-events-none" />
            </button>

            {/* In Port */}
            <div 
              className="port absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#111] border-2 border-white/40 hover:border-[#f07635] hover:bg-background cursor-crosshair rounded-none"
              onPointerUp={(e) => finishDrawingEdge(e, node.id)}
            />
            
            <div className="flex items-center gap-2">
              {node.logo_url && (
                <img src={node.logo_url} alt="logo" className="w-8 h-8 object-contain bg-black p-1" />
              )}
              <div>
                <div className="text-xs text-white/50 uppercase">{node.node_type}</div>
                <div className="font-bold text-sm truncate max-w-[150px]">
                  {node.node_type === 'study' ? node.study_name_es : (node.node_type === 'project' ? node.company_name : node.company_name)}
                </div>
                <div className="text-xs text-[#f07635] truncate max-w-[150px]">
                  {node.node_type === 'study' ? node.company_name : node.role_es}
                </div>
              </div>
            </div>

            {/* Out Port */}
            <div 
              className="port absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#111] border-2 border-white/40 hover:border-[#f07635] hover:bg-background cursor-crosshair rounded-none"
              onPointerDown={(e) => startDrawingEdge(e, node.id)}
            />
          </div>
        ))}
      </div>


        </div>
      {/* Editor Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 bg-black/80 z-[100] flex justify-end">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-lg bg-black border-l border-white/20 h-full overflow-y-auto p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold uppercase">{isEditing === 'new' ? 'Nuevo Nodo' : 'Editar Nodo'}</h2>
                <button onClick={() => setIsEditing(null)} className="p-2 hover:bg-[#111]"><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-white/50 mb-1 uppercase">Tipo de Nodo</label>
                  <select 
                    value={editForm.node_type}
                    onChange={e => setEditForm({...editForm, node_type: e.target.value as any})}
                    className="w-full bg-black border border-white/20 p-2 text-white focus:border-[#f07635] outline-none"
                  >
                    <option value="work">Trabajo</option>
                    <option value="project">Proyecto</option>
                    <option value="study">Estudios</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-white/50 mb-1 uppercase">Logo (SVG, PNG, etc)</label>
                  <div className="flex gap-2">
                    {editForm.logo_url && (
                      <div className="w-12 h-12 border border-white/20 flex items-center justify-center p-1 bg-black">
                        <img src={editForm.logo_url} alt="Logo" className="max-w-full max-h-full" />
                      </div>
                    )}
                    <label className="flex-1 border border-white/20 bg-black hover:bg-[#111] flex items-center justify-center cursor-pointer p-2 transition-colors">
                      <input type="file" accept="image/*,.svg" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                      {uploading ? <span className="text-sm">Subiendo...</span> : <span className="flex items-center gap-2 text-sm"><Upload className="w-4 h-4" /> Subir Logo</span>}
                    </label>
                  </div>
                </div>

                {editForm.node_type === 'study' ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-white/50 mb-1 uppercase">Institución</label>
                        <input value={editForm.company_name} onChange={e => setEditForm({...editForm, company_name: e.target.value})} className="w-full bg-black border border-white/20 p-2 text-white outline-none focus:border-[#f07635]" />
                      </div>
                      <div>
                        <label className="block text-xs text-white/50 mb-1 uppercase">Título (ES)</label>
                        <input value={editForm.study_name_es} onChange={e => setEditForm({...editForm, study_name_es: e.target.value})} className="w-full bg-black border border-white/20 p-2 text-white outline-none focus:border-[#f07635]" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-white/50 mb-1 uppercase">Título (EN)</label>
                      <input value={editForm.study_name_en} onChange={e => setEditForm({...editForm, study_name_en: e.target.value})} className="w-full bg-black border border-white/20 p-2 text-white outline-none focus:border-[#f07635]" />
                    </div>
                  </>
                ) : editForm.node_type === 'project' ? (
                  <>
                    <div>
                      <label className="block text-xs text-white/50 mb-1 uppercase">Nombre Proyecto</label>
                      <input value={editForm.company_name} onChange={e => setEditForm({...editForm, company_name: e.target.value})} className="w-full bg-black border border-white/20 p-2 text-white outline-none focus:border-[#f07635]" />
                    </div>
                    <div>
                      <label className="block text-xs text-white/50 mb-1 uppercase">Tecnologías (coma separadas)</label>
                      <input value={editForm.techs.join(', ')} onChange={e => setEditForm({...editForm, techs: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})} className="w-full bg-black border border-white/20 p-2 text-white outline-none focus:border-[#f07635]" />
                    </div>
                    <div>
                      <label className="block text-xs text-white/50 mb-1 uppercase">ID Proyecto Relacionado (Opcional)</label>
                      <input value={editForm.related_project_id || ''} onChange={e => setEditForm({...editForm, related_project_id: e.target.value || null})} className="w-full bg-black border border-white/20 p-2 text-white outline-none focus:border-[#f07635]" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-white/50 mb-1 uppercase">Empresa</label>
                        <input value={editForm.company_name} onChange={e => setEditForm({...editForm, company_name: e.target.value})} className="w-full bg-black border border-white/20 p-2 text-white outline-none focus:border-[#f07635]" />
                      </div>
                      <div>
                        <label className="block text-xs text-white/50 mb-1 uppercase">Cargo (ES)</label>
                        <input value={editForm.role_es} onChange={e => setEditForm({...editForm, role_es: e.target.value})} className="w-full bg-black border border-white/20 p-2 text-white outline-none focus:border-[#f07635]" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-white/50 mb-1 uppercase">Cargo (EN)</label>
                      <input value={editForm.role_en} onChange={e => setEditForm({...editForm, role_en: e.target.value})} className="w-full bg-black border border-white/20 p-2 text-white outline-none focus:border-[#f07635]" />
                    </div>
                  </>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/50 mb-1 uppercase">Fecha Inicio (e.g. 2024 o 2024-03)</label>
                    <input value={editForm.date_start} onChange={e => setEditForm({...editForm, date_start: e.target.value})} className="w-full bg-black border border-white/20 p-2 text-white outline-none focus:border-[#f07635]" placeholder="YYYY o YYYY-MM" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs text-white/50 uppercase">Fecha Fin</label>
                      <label className="text-[10px] flex items-center gap-1 cursor-pointer">
                        <input type="checkbox" checked={editForm.date_end === null} onChange={e => setEditForm({...editForm, date_end: e.target.checked ? null : ''})} className="accent-[#f07635]" />
                        Actualidad
                      </label>
                    </div>
                    <input 
                      value={editForm.date_end || ''} 
                      onChange={e => setEditForm({...editForm, date_end: e.target.value})} 
                      className={`w-full bg-black border border-white/20 p-2 text-white outline-none focus:border-[#f07635] ${editForm.date_end === null ? 'opacity-50' : ''}`}
                      disabled={editForm.date_end === null}
                      placeholder="YYYY o YYYY-MM"
                    />
                  </div>
                </div>

                {(editForm.node_type === 'work' || editForm.node_type === 'project') && (
                  <>
                    <div>
                      <label className="block text-xs text-white/50 mb-1 uppercase">Descripción (ES)</label>
                      <textarea value={editForm.description_es} onChange={e => setEditForm({...editForm, description_es: e.target.value})} className="w-full bg-black border border-white/20 p-2 text-white h-24 resize-none outline-none focus:border-[#f07635]" />
                    </div>
                    <div>
                      <label className="block text-xs text-white/50 mb-1 uppercase">Descripción (EN)</label>
                      <textarea value={editForm.description_en} onChange={e => setEditForm({...editForm, description_en: e.target.value})} className="w-full bg-black border border-white/20 p-2 text-white h-24 resize-none outline-none focus:border-[#f07635]" />
                    </div>
                  </>
                )}

                <button 
                  onClick={handleSaveNode}
                  className="w-full bg-[#f07635] hover:bg-[#d86a30] text-white py-3 font-bold uppercase flex justify-center items-center gap-2 mt-4"
                >
                  <Save className="w-5 h-5" /> Guardar Nodo
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
