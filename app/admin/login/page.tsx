"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, ArrowRight, ArrowLeft, ShieldAlert } from 'lucide-react'
import Link from 'next/link'

const MAX_ATTEMPTS = 3
const LOCKOUT_MS = 2 * 60 * 1000 // 2 minutes

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [lockedUntil, setLockedUntil] = useState<number | null>(null)
  const [remainingSeconds, setRemainingSeconds] = useState(0)
  const router = useRouter()

  // Restore lockout state from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem('admin_lockout')
    if (stored) {
      const { until, count } = JSON.parse(stored)
      if (until && Date.now() < until) {
        setLockedUntil(until)
        setAttempts(count)
      } else {
        sessionStorage.removeItem('admin_lockout')
      }
    }
    const storedAttempts = sessionStorage.getItem('admin_attempts')
    if (storedAttempts) {
      setAttempts(parseInt(storedAttempts))
    }
  }, [])

  // Countdown timer while locked
  useEffect(() => {
    if (!lockedUntil) return

    const tick = () => {
      const diff = lockedUntil - Date.now()
      if (diff <= 0) {
        setLockedUntil(null)
        setAttempts(0)
        setRemainingSeconds(0)
        setError('')
        sessionStorage.removeItem('admin_lockout')
        sessionStorage.removeItem('admin_attempts')
      } else {
        setRemainingSeconds(Math.ceil(diff / 1000))
      }
    }

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [lockedUntil])

  const isLocked = lockedUntil !== null && Date.now() < lockedUntil

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLocked) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        // Reset on success
        sessionStorage.removeItem('admin_lockout')
        sessionStorage.removeItem('admin_attempts')
        router.push('/admin')
        router.refresh()
      } else {
        const newAttempts = attempts + 1
        setAttempts(newAttempts)
        sessionStorage.setItem('admin_attempts', String(newAttempts))

        if (newAttempts >= MAX_ATTEMPTS) {
          const until = Date.now() + LOCKOUT_MS
          setLockedUntil(until)
          sessionStorage.setItem('admin_lockout', JSON.stringify({ until, count: newAttempts }))
          setError(`Demasiados intentos. Bloqueado durante 2 minutos.`)
        } else {
          const remaining = MAX_ATTEMPTS - newAttempts
          setError(`Contraseña incorrecta. ${remaining} intento${remaining !== 1 ? 's' : ''} restante${remaining !== 1 ? 's' : ''}.`)
        }
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
      setPassword('')
    }
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Background Dots */}
      <div 
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(#333 1px, transparent 1px)",
          backgroundSize: "32px 32px"
        }}
      />

      {/* Back to portfolio */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors font-mono text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver al Portfolio</span>
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className={`w-16 h-16 flex items-center justify-center mb-4 ${isLocked ? 'bg-red-500/10' : 'bg-[#f07635]/10'}`}>
            {isLocked ? (
              <ShieldAlert className="w-8 h-8 text-red-500" />
            ) : (
              <Lock className="w-8 h-8 text-[#f07635]" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {isLocked ? 'ACCESO BLOQUEADO' : 'ACCESO ADMIN'}
          </h1>
          <p className="text-zinc-400 mt-2 text-sm text-center">
            {isLocked 
              ? `Demasiados intentos fallidos. Espera para reintentar.`
              : 'Introduce la contraseña para acceder al panel de control'
            }
          </p>
        </div>

        {isLocked ? (
          <div className="space-y-6">
            <div className="text-center py-6 border border-red-500/20 bg-red-500/5">
              <div className="text-4xl font-mono font-bold text-red-500 tabular-nums">
                {formatTime(remainingSeconds)}
              </div>
              <p className="text-xs text-zinc-500 mt-2 uppercase tracking-widest">
                Tiempo restante de bloqueo
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                  Contraseña
                </label>
                {attempts > 0 && !isLocked && (
                  <span className="text-[10px] font-mono text-amber-500">
                    {MAX_ATTEMPTS - attempts}/{MAX_ATTEMPTS} intentos
                  </span>
                )}
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-zinc-800 text-white px-4 py-3 focus:outline-none focus:border-[#f07635] transition-colors"
                placeholder="••••••••"
                disabled={isLocked}
              />
            </div>

            {error && (
              <div className={`text-sm p-3 border ${
                attempts >= MAX_ATTEMPTS 
                  ? 'text-red-500 bg-red-500/10 border-red-500/20' 
                  : 'text-amber-500 bg-amber-500/10 border-amber-500/20'
              }`}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || isLocked}
              className="w-full bg-white text-black font-bold py-3 px-4 flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors disabled:opacity-50"
            >
              {loading ? 'VERIFICANDO...' : 'ENTRAR'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  )
}
