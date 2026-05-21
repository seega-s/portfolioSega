"use client"

import React, { useState, useRef, useEffect } from 'react'

export function DraggableCanvas({ children, width = 4000, height = 4000 }: { children: React.ReactNode, width?: number, height?: number }) {
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 })
  const [isPanning, setIsPanning] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only pan if middle click or background click (prevent capturing button clicks)
    if (e.button === 1 || (e.target as Element).id === 'canvas-bg' || (e.target === containerRef.current)) {
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

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isPanning) setIsPanning(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    // Prevent default scroll
    const zoom = -e.deltaY * 0.001
    setTransform(prev => {
      const newScale = Math.min(Math.max(0.2, prev.scale + zoom), 3)
      return { ...prev, scale: newScale }
    })
  }

  useEffect(() => {
    const preventDefault = (e: WheelEvent) => {
      if (containerRef.current?.contains(e.target as Node)) {
        e.preventDefault();
      }
    };
    document.addEventListener('wheel', preventDefault, { passive: false });
    return () => {
      document.removeEventListener('wheel', preventDefault);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[500px] border-2 border-dashed border-foreground/10 overflow-hidden bg-black/5"
      style={{ cursor: isPanning ? 'grabbing' : 'grab', touchAction: 'none' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onWheel={handleWheel}
    >
      <div 
        className="absolute inset-0 origin-top-left"
        style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})` }}
      >
        <div id="canvas-bg" className="absolute inset-0" style={{ width: width, height: height, left: -width/2, top: -height/2 }} />
        {children}
      </div>
    </div>
  )
}
