"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { I18nContext, type Language, translations, type TranslationKey } from "@/lib/i18n"
import { useAuth } from "@/components/auth-provider"
import { updateUserData } from "@/lib/firebase"

// Theme Context
interface ThemeContextType {
  darkMode: boolean
  setDarkMode: (dark: boolean) => void
  toggleDarkMode: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  setDarkMode: () => {},
  toggleDarkMode: () => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

// Combined Provider
interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  const { user, userData } = useAuth()
  const [darkMode, setDarkModeState] = useState(false)
  const [language, setLanguageState] = useState<Language>('en')
  const [mounted, setMounted] = useState(false)

  // Initialize from userData or localStorage
  useEffect(() => {
    setMounted(true)
    
    if (userData) {
      setDarkModeState(userData.darkMode ?? false)
      setLanguageState(userData.language ?? 'en')
    } else {
      // Fallback to localStorage for non-authenticated users
      const storedDarkMode = localStorage.getItem('darkMode')
      const storedLanguage = localStorage.getItem('language') as Language
      if (storedDarkMode) setDarkModeState(storedDarkMode === 'true')
      if (storedLanguage) setLanguageState(storedLanguage)
    }
  }, [userData])

  // Apply dark mode class to document
  useEffect(() => {
    if (!mounted) return
    
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode, mounted])

  const setDarkMode = async (dark: boolean) => {
    setDarkModeState(dark)
    localStorage.setItem('darkMode', String(dark))
    
    if (user) {
      try {
        await updateUserData(user.uid, { darkMode: dark })
      } catch (err) {
        console.error('Failed to save dark mode preference:', err)
      }
    }
  }

  const toggleDarkMode = () => setDarkMode(!darkMode)

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
    
    if (user) {
      try {
        await updateUserData(user.uid, { language: lang })
      } catch (err) {
        console.error('Failed to save language preference:', err)
      }
    }
  }

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.en[key] || key
  }

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode, toggleDarkMode }}>
      <I18nContext.Provider value={{ language, t, setLanguage }}>
        {children}
      </I18nContext.Provider>
    </ThemeContext.Provider>
  )
}
