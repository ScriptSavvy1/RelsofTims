import { createContext, useContext, useState, useEffect } from 'react'

const DarkModeContext = createContext()

export function DarkModeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage first, then system preference
    const stored = localStorage.getItem('darkMode')
    if (stored !== null) {
      return stored === 'true'
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  // Initialize dark mode class immediately on mount to prevent flash
  useEffect(() => {
    const stored = localStorage.getItem('darkMode')
    const shouldBeDark = stored !== null 
      ? stored === 'true' 
      : window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (shouldBeDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  useEffect(() => {
    // Update localStorage when mode changes
    localStorage.setItem('darkMode', isDark.toString())
    
    // Update document class for Tailwind dark mode
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  const toggleDarkMode = () => {
    setIsDark((prev) => !prev)
  }

  return (
    <DarkModeContext.Provider value={{ isDark, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  )
}

export function useDarkMode() {
  const context = useContext(DarkModeContext)
  if (!context) {
    throw new Error('useDarkMode must be used within DarkModeProvider')
  }
  return context
}

