import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { copy, type Translation } from '../i18n/translations'
import type { Locale, Theme } from '../types'

interface AppContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  theme: Theme
  toggleTheme: () => void
  t: Translation
}

const AppContext = createContext<AppContextValue | null>(null)

function initialLocale(): Locale {
  return localStorage.getItem('anna-locale') === 'en' ? 'en' : 'ru'
}

function initialTheme(): Theme {
  const saved = localStorage.getItem('anna-theme')
  if (saved === 'light' || saved === 'dark') return saved
  return matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)
  const [theme, setTheme] = useState<Theme>(initialTheme)

  const setLocale = (next: Locale) => {
    setLocaleState(next)
    localStorage.setItem('anna-locale', next)
  }

  const toggleTheme = () => setTheme((current) => {
    const next = current === 'light' ? 'dark' : 'light'
    localStorage.setItem('anna-theme', next)
    return next
  })

  useEffect(() => {
    document.documentElement.lang = locale
    if (document.documentElement.dataset.page !== 'design') {
      document.title = 'Anna Gromyko — AI Product Builder'
      const description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
      if (description) description.content = locale === 'ru'
        ? 'Проектирование и запуск цифровых продуктов на стыке бизнес-логики, UX, AI, автоматизации и данных.'
        : 'Designing and shipping digital products at the intersection of business logic, UX, AI, automation, and data.'
    }
  }, [locale])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
  }, [theme])

  const value = useMemo(() => ({ locale, setLocale, theme, toggleTheme, t: copy[locale] }), [locale, theme])
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}
