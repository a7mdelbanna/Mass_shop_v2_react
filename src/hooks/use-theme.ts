import { useEffect, useState } from "react"

type Theme = "light" | "dark"

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check if theme is stored in localStorage
    const storedTheme = localStorage.getItem("theme") as Theme
    if (storedTheme) return storedTheme

    // Check system preference
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark"
    }

    return "light"
  })

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)
    localStorage.setItem("theme", theme)
  }, [theme])

  return { theme, setTheme }
} 