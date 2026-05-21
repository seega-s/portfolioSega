"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { translations, type Lang } from '@/lib/translations'

type I18nContextType = {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('es')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('SEGA-lang') as Lang | null
    if (saved && (saved === 'es' || saved === 'en')) {
      setLangState(saved)
    }
  }, [])

  const setLang = (newLang: Lang) => {
    setLangState(newLang)
    localStorage.setItem('SEGA-lang', newLang)
  }

  const t = (key: string): string => {
    return translations[lang][key] || key
  }

  // To prevent hydration mismatch, we don't render the children until mounted
  if (!mounted) {
    return null
  }

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useLanguage must be used within an I18nProvider')
  }
  return context
}
