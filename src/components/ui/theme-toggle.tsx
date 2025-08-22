import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/hooks/use-theme"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <motion.button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative h-9 w-16 rounded-full p-1 transition-colors duration-300",
        "bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900",
        "shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]",
        "hover:shadow-[inset_0_2px_4px_rgba(0,0,0,0.15),0_0_0_2px_rgba(0,0,0,0.1)]",
        "dark:hover:shadow-[inset_0_2px_4px_rgba(0,0,0,0.4),0_0_0_2px_rgba(255,255,255,0.1)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        "active:scale-[0.98]"
      )}
      whileTap={{ scale: 0.98 }}
      aria-label="Toggle theme"
    >
      <motion.div
        className={cn(
          "absolute inset-0.5 rounded-full bg-white dark:bg-slate-950",
          "transition-colors duration-300"
        )}
        initial={false}
        animate={{
          x: theme === "dark" ? "100%" : "0%",
          translateX: theme === "dark" ? "-100%" : "0%",
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      >
        <div className="relative h-full w-full">
          {/* Sun icon */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center text-amber-500"
            initial={false}
            animate={{
              opacity: theme === "light" ? 1 : 0,
              scale: theme === "light" ? 1 : 0.5,
              rotate: theme === "light" ? 0 : 90,
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
          >
            <Sun className="h-4 w-4" />
          </motion.div>

          {/* Moon icon */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center text-blue-400"
            initial={false}
            animate={{
              opacity: theme === "dark" ? 1 : 0,
              scale: theme === "dark" ? 1 : 0.5,
              rotate: theme === "dark" ? 0 : -90,
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
          >
            <Moon className="h-4 w-4" />
          </motion.div>

          {/* Hover effect - sun rays */}
          <motion.div
            className="absolute inset-0"
            initial={false}
            animate={{
              opacity: isHovered && theme === "light" ? 1 : 0,
            }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-6 w-6 rounded-full bg-amber-500/20 blur-sm" />
            </div>
          </motion.div>

          {/* Hover effect - moon glow */}
          <motion.div
            className="absolute inset-0"
            initial={false}
            animate={{
              opacity: isHovered && theme === "dark" ? 1 : 0,
            }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-6 w-6 rounded-full bg-blue-400/20 blur-sm" />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.button>
  )
} 