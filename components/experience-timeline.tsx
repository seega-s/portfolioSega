"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/components/i18n-context"
import { useRouter } from "next/navigation"
import type { ExperienceNode, ExperienceEdge } from "@/lib/types"

const ease = [0.22, 1, 0.36, 1] as const

/* ─── Date formatter ─── */
function formatDate(dateStr: string, lang: string) {
  if (!dateStr) return ''
  const parts = dateStr.split('-')
  const year = parts[0]
  if (parts.length === 1) return year
  
  const monthNames: Record<string, string[]> = {
    es: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  }
  const m = parseInt(parts[1]) - 1
  return `${(monthNames[lang] || monthNames.en)[m]} ${year}`
}

/* ─── Single Node Card ─── */
function NodeCard({ node, lang, index }: { node: ExperienceNode; lang: string; index: number }) {
  const router = useRouter()
  const [expanded, setExpanded] = useState(false)

  const dateEnd = node.date_end ? formatDate(node.date_end, lang) : (lang === 'es' ? 'Actualidad' : 'Present')
  
  const handleClick = (e: React.MouseEvent) => {
    // Prevent triggering canvas drag
    e.stopPropagation()
    if (node.node_type === 'project' && node.related_project_id) {
      router.push(`/projects/${node.related_project_id}`)
    } else {
      setExpanded(!expanded)
    }
  }

  let primaryText = ''
  let secondaryText = ''
  let descText = ''

  if (node.node_type === 'study') {
    primaryText = node.company_name
    secondaryText = lang === 'es' ? node.study_name_es : node.study_name_en
  } else if (node.node_type === 'project') {
    primaryText = node.company_name
    secondaryText = node.techs?.join(', ') || ''
    descText = lang === 'es' ? node.description_es : node.description_en
  } else {
    primaryText = node.company_name
    secondaryText = lang === 'es' ? node.role_es : node.role_en
    descText = lang === 'es' ? node.description_es : node.description_en
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5), ease }}
      className="relative group cursor-pointer"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onClick={handleClick}
      onPointerDown={(e) => e.stopPropagation()} // Prevent drag start when clicking card
    >
      <div className={`border-2 transition-all duration-300
        ${expanded ? 'border-salmon bg-salmon/5' : 'border-foreground hover:border-salmon/60'}
        ${node.node_type === 'project' && node.related_project_id ? 'hover:bg-salmon/10' : ''}
        `}
        style={{ width: 340 }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-foreground/20">
          <span className="text-[11px] font-mono text-muted-foreground tracking-[0.15em] uppercase">
            {formatDate(node.date_start, lang)} {dateEnd && `— ${dateEnd}`}
          </span>
          <span className="inline-block h-2 w-2 bg-salmon animate-pulse-dot" />
        </div>

        {/* Content */}
        <div className="px-5 py-5 pointer-events-none">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 border-2 border-foreground/30 flex-shrink-0 flex items-center justify-center overflow-hidden bg-muted">
              {node.logo_url ? (
                <img src={node.logo_url} alt={primaryText} className="w-full h-full object-contain p-1.5" />
              ) : (
                <span className="text-xl font-bold font-mono text-foreground/40">
                  {primaryText.charAt(0)}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <div className="text-base font-mono font-bold text-foreground uppercase tracking-wide truncate">
                {primaryText}
              </div>
            </div>
          </div>

          <div className="text-lg font-mono text-salmon font-bold uppercase tracking-[0.1em] mb-3 leading-relaxed">
            {secondaryText}
          </div>

          {descText && (
            <motion.div
              initial={false}
              animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
              transition={{ duration: 0.3, ease }}
              className="overflow-hidden"
            >
              <p className="text-lg font-mono text-foreground/80 leading-relaxed pt-3 border-t border-foreground/10">
                {descText}
              </p>
            </motion.div>
          )}

          {node.node_type === 'project' && node.related_project_id && expanded && (
            <div className="mt-4 pt-3 border-t border-foreground/10 text-sm text-salmon font-bold uppercase tracking-widest flex items-center gap-2">
              <span>{lang === 'es' ? 'VER PROYECTO' : 'VIEW PROJECT'}</span>
              <span>→</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

/* ─── SVG Connection Lines ─── */
function TreeConnections({
  nodes,
  edges,
  offsetY = 0
}: {
  nodes: ExperienceNode[];
  edges: ExperienceEdge[];
  offsetY?: number;
}) {
  const CARD_W = 340
  const CARD_H = 200 // Approximate default height for center
  const CONNECTOR_R = 4

  const posMap = new Map<string, { x: number; y: number; cx: number; cy: number }>()
  
  for (const node of nodes) {
    posMap.set(node.id, {
      x: node.position_x,
      y: node.position_y + offsetY,
      cx: node.position_x + CARD_W / 2,
      cy: node.position_y + offsetY + CARD_H / 2,
    })
  }

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ overflow: 'visible', zIndex: 0 }}
    >
      {edges.map((edge) => {
        const src = posMap.get(edge.source_node_id)
        const tgt = posMap.get(edge.target_node_id)
        if (!src || !tgt) return null

        const x1 = src.x + CARD_W
        const y1 = src.cy
        const x2 = tgt.x
        const y2 = tgt.cy

        // Curved path from right edge of source to left edge of target
        const midX = (x1 + x2) / 2

        return (
          <g key={edge.id}>
            <path
              d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
              fill="none"
              className="stroke-salmon"
              strokeWidth="2"
              opacity="0.5"
            />
            <rect
              x={x1 - CONNECTOR_R}
              y={y1 - CONNECTOR_R}
              width={CONNECTOR_R * 2}
              height={CONNECTOR_R * 2}
              className="fill-background stroke-salmon"
              strokeWidth="2"
              transform={`rotate(45, ${x1}, ${y1})`}
            />
            <rect
              x={x2 - CONNECTOR_R}
              y={y2 - CONNECTOR_R}
              width={CONNECTOR_R * 2}
              height={CONNECTOR_R * 2}
              className="fill-background stroke-foreground"
              strokeWidth="2"
              opacity="0.3"
              transform={`rotate(45, ${x2}, ${y2})`}
            />
          </g>
        )
      })}
    </svg>
  )
}

/* ─── Main Timeline Component ─── */
export function ExperienceTimeline() {
  const { lang, t } = useLanguage()
  const [nodes, setNodes] = useState<ExperienceNode[]>([])
  const [edges, setEdges] = useState<ExperienceEdge[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'all' | 'professional' | 'education' | 'project'>('all')
  const sectionRef = useRef<HTMLDivElement>(null)
  const sectionInView = useInView(sectionRef, { once: true, margin: "-80px" })

  // Canvas View State
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 })
  const [isPanning, setIsPanning] = useState(false)
  const [locked, setLocked] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/experience?graph=${activeTab}`)
      .then(r => r.json())
      .then(data => { setNodes(data.nodes || []); setEdges(data.edges || []) })
      .catch(console.error)
      .finally(() => {
        setLoading(false)
      })
  }, [activeTab])

  const fitToScreen = () => {
    if (!containerRef.current || nodes.length === 0) return;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    let currentOffsetY = 0;
    
    const graphTypes = activeTab === 'all' ? ['professional', 'education'] : [activeTab];
    graphTypes.forEach((graphType) => {
      const graphNodes = nodes.filter(n => n.graph_type === graphType);
      if (graphNodes.length === 0) return;

      const offsetY = activeTab === 'all' ? currentOffsetY : 0;
      
      let maxYForGraph = 0;
      graphNodes.forEach(node => {
        const x = node.position_x;
        const y = node.position_y + offsetY;
        
        if (x < minX) minX = x;
        if (y - 120 < minY) minY = y - 120; // Account for the top title ("// EXPERIENCIA")
        if (x + 360 > maxX) maxX = x + 360; // Card width + spacing
        if (y + 220 > maxY) maxY = y + 220; // Approx Card height
        
        if (node.position_y > maxYForGraph) maxYForGraph = node.position_y;
      });
      
      currentOffsetY += maxYForGraph + 350;
    });

    if (minX !== Infinity) {
      const padding = 100;
      const graphWidth = maxX - minX + padding * 2;
      const graphHeight = maxY - minY + padding * 2;

      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;

      const scaleX = containerWidth / graphWidth;
      const scaleY = containerHeight / graphHeight;
      let scale = Math.min(scaleX, scaleY, 1.5); 
      scale = Math.max(0.15, scale); 

      const scaledWidth = (maxX - minX) * scale;
      const scaledHeight = (maxY - minY) * scale;
      
      const x = (containerWidth - scaledWidth) / 2 - minX * scale;
      const y = (containerHeight - scaledHeight) / 2 - minY * scale;

      setTransform({ x, y, scale });
    }
  };

  // Fit graph to screen whenever data is loaded
  useEffect(() => {
    if (!loading && nodes.length > 0) {
      const timer = setTimeout(() => {
        fitToScreen();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [loading, nodes, activeTab]);

  // Canvas handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    // Start panning if clicking the canvas background
    if ((e.target as Element).id === 'canvas-bg' || e.target === containerRef.current) {
      e.preventDefault(); // Prevent native drag/text selection
      e.currentTarget.setPointerCapture(e.pointerId)
      setIsPanning(true)
    }
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isPanning) {
      setTransform(prev => ({
        ...prev,
        x: prev.x + e.movementX,
        y: prev.y + e.movementY
      }))
    }
  }

  const handlePointerUp = () => {
    if (isPanning) setIsPanning(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    const zoom = -e.deltaY * 0.001
    setTransform(prev => {
      const newScale = Math.min(Math.max(0.2, prev.scale + zoom), 3)
      return { ...prev, scale: newScale }
    })
  }

  // Prevent default page scroll when zooming over the canvas (only when unlocked)
  useEffect(() => {
    const preventDefault = (e: WheelEvent) => {
      if (containerRef.current?.contains(e.target as Node)) {
        e.preventDefault();
      }
    };
    if (!locked) {
      document.addEventListener('wheel', preventDefault, { passive: false });
    }
    return () => {
      document.removeEventListener('wheel', preventDefault);
    };
  }, [locked]);

  return (
    <section ref={sectionRef} id="experiencia" aria-label="Experiencia profesional" className="w-full px-4 sm:px-6 py-12 sm:py-20 lg:px-12">
      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={sectionInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, ease }}
        className="flex items-center gap-4 mb-10"
      >
        <span className="section-label">{t('experience.label')}</span>
        <div className="flex-1 border-t border-border" />
        <span className="inline-block h-2 w-2 bg-salmon animate-blink" />
        <span className="section-label">003</span>
      </motion.div>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1, ease }}
          className="text-2xl lg:text-3xl font-mono font-bold tracking-tight uppercase"
        >
          {t('experience.title.1')}
          <br />
          <span className="text-salmon">{t('experience.title.2')}</span>
        </motion.h2>

        {/* Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2, ease }}
          className="flex border-2 border-foreground/20 p-1 bg-muted/30 max-w-full overflow-x-auto"
        >
          <button 
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 font-mono text-sm uppercase tracking-wider font-bold transition-colors whitespace-nowrap ${activeTab === 'all' ? 'bg-salmon text-background' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {lang === 'es' ? 'Todo' : 'All'}
          </button>
          <button 
            onClick={() => setActiveTab('professional')}
            className={`px-4 py-2 font-mono text-sm uppercase tracking-wider font-bold transition-colors whitespace-nowrap ${activeTab === 'professional' ? 'bg-salmon text-background' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {lang === 'es' ? 'Experiencia' : 'Experience'}
          </button>
          <button 
            onClick={() => setActiveTab('education')}
            className={`px-4 py-2 font-mono text-sm uppercase tracking-wider font-bold transition-colors whitespace-nowrap ${activeTab === 'education' ? 'bg-salmon text-background' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {lang === 'es' ? 'Educación' : 'Education'}
          </button>
          <button 
            onClick={() => setActiveTab('project')}
            className={`px-4 py-2 font-mono text-sm uppercase tracking-wider font-bold transition-colors whitespace-nowrap ${activeTab === 'project' ? 'bg-salmon text-background' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {lang === 'es' ? 'Proyectos' : 'Projects'}
          </button>
        </motion.div>
      </div>

      {/* Interactive Panning/Zooming Canvas — wrapper for canvas + overlay */}
      <div className="relative w-full h-[600px]">
        {/* Canvas (pointer-events disabled when locked so page scroll works) */}
        <div 
          ref={containerRef}
          className="absolute inset-0 border-2 border-dashed border-foreground/10 overflow-hidden bg-background select-none"
          style={{
            cursor: isPanning ? 'grabbing' : 'grab',
            touchAction: 'none',
            pointerEvents: locked ? 'none' : 'auto',
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onWheel={handleWheel}
        >
          {/* Background Grid Pattern */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-20" 
            style={{ 
              backgroundImage: 'radial-gradient(var(--foreground) 1px, transparent 1px)', 
              backgroundSize: `${40 * transform.scale}px ${40 * transform.scale}px`,
              backgroundPosition: `${transform.x}px ${transform.y}px`
            }} 
          />

          {loading ? (
            <div className="absolute inset-0 flex justify-center items-center">
              <span className="text-salmon font-mono animate-pulse uppercase tracking-widest">{lang === 'es' ? 'CARGANDO...' : 'LOADING...'}</span>
            </div>
          ) : nodes.length === 0 ? (
            <div className="absolute inset-0 flex justify-center items-center">
              <span className="text-muted-foreground font-mono uppercase tracking-widest">{lang === 'es' ? 'AÚN NO HAY DATOS' : 'NO DATA YET'}</span>
            </div>
          ) : (
            <div 
              className="absolute origin-top-left"
              style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})` }}
            >
              {/* Catch-all background for panning events inside the transformed layer */}
              <div id="canvas-bg" className="absolute" style={{ width: '20000px', height: '20000px', left: '-10000px', top: '-10000px' }} />
              
              {(() => {
                let currentOffsetY = 0;
                let renderedIndex = 0;

                const renderTypes = activeTab === 'all' ? ['professional', 'education'] : [activeTab];
                return renderTypes.map((graphType) => {
                  
                  const graphNodes = nodes.filter(n => n.graph_type === graphType);
                  if (graphNodes.length === 0) return null;

                  const graphNodeIds = new Set(graphNodes.map(n => n.id));
                  const graphEdges = edges.filter(e => graphNodeIds.has(e.source_node_id) && graphNodeIds.has(e.target_node_id));
                  
                  // Calculate max Y to offset the next category if displaying 'all'
                  let maxYForGraph = 0;
                  let sectionMinX = Infinity;
                  let sectionMinY = Infinity;
                  graphNodes.forEach(n => {
                    if (n.position_y > maxYForGraph) maxYForGraph = n.position_y;
                    if (n.position_x < sectionMinX) sectionMinX = n.position_x;
                    if (n.position_y < sectionMinY) sectionMinY = n.position_y;
                  });

                  const offsetY = activeTab === 'all' ? currentOffsetY : 0;
                  currentOffsetY += maxYForGraph + 350; // Spacing between categories

                  const title = graphType === 'professional' ? (lang === 'es' ? 'Experiencia' : 'Experience') :
                                graphType === 'education' ? (lang === 'es' ? 'Educación' : 'Education') :
                                (lang === 'es' ? 'Proyectos' : 'Projects');

                  return (
                    <div key={graphType} className="absolute" style={{ top: offsetY, left: 0 }}>
                      {activeTab === 'all' && (
                        <div 
                          className="absolute text-xl font-mono font-bold text-salmon uppercase tracking-[0.2em] pointer-events-none"
                          style={{ 
                            left: sectionMinX === Infinity ? 0 : sectionMinX,
                            top: sectionMinY === Infinity ? 0 : sectionMinY - 80 
                          }}
                        >
                          // {title}
                        </div>
                      )}
                      
                      {/* SVG connections layer */}
                      <TreeConnections nodes={graphNodes} edges={graphEdges} />
                      
                      {/* Positioned node cards */}
                      {graphNodes.map((node) => {
                        const idx = renderedIndex++;
                        return (
                          <div
                            key={node.id}
                            className="absolute z-10"
                            style={{ left: node.position_x, top: node.position_y }}
                          >
                            <NodeCard node={node} lang={lang} index={idx} />
                          </div>
                        )
                      })}
                    </div>
                  );
                });
              })()}
            </div>
          )}
        </div>

        {/* Locked Overlay — sibling of the canvas, always receives pointer events */}
        <AnimatePresence>
          {locked && !loading && nodes.length > 0 && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
              className="absolute inset-0 z-40 flex flex-col items-end justify-end cursor-pointer p-6"
              onClick={() => setLocked(false)}
            >
              {/* CTA */}
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                  className="w-16 h-[2px] bg-salmon"
                />
                <p className="text-[10px] font-mono text-muted-foreground tracking-[0.15em] uppercase">
                  {lang === 'es' ? 'CLICK PARA EXPLORAR' : 'CLICK TO EXPLORE'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls Overlay — sibling, visible only when unlocked */}
        <div className={`absolute bottom-4 right-4 flex gap-2 z-50 transition-opacity duration-300 ${locked ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <button 
            onClick={(e) => { e.stopPropagation(); setTransform(prev => ({ ...prev, scale: Math.min(3, prev.scale + 0.2) })) }}
            className="w-8 h-8 flex justify-center items-center border border-foreground/20 bg-background text-foreground hover:bg-salmon hover:text-background transition-colors"
            aria-label="Zoom in"
          >
            +
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setTransform(prev => ({ ...prev, scale: Math.max(0.2, prev.scale - 0.2) })) }}
            className="w-8 h-8 flex justify-center items-center border border-foreground/20 bg-background text-foreground hover:bg-salmon hover:text-background transition-colors"
            aria-label="Zoom out"
          >
            -
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); fitToScreen() }}
            className="px-3 h-8 flex justify-center items-center border border-foreground/20 bg-background text-xs font-mono uppercase hover:bg-foreground hover:text-background transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Mobile hint */}
      {!loading && nodes.length > 0 && (
        <div className="mt-6 text-center lg:hidden">
          <span className="text-[10px] font-mono text-muted-foreground tracking-[0.2em] uppercase animate-pulse">
            ← {lang === 'es' ? 'ARRASTRA PARA EXPLORAR' : 'DRAG TO EXPLORE'} →
          </span>
        </div>
      )}
    </section>
  )
}
