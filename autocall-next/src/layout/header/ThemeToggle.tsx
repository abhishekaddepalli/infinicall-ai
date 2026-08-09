'use client'

import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useRef, useSyncExternalStore } from 'react'
import { useTranslation } from 'react-i18next'

const ThemeToggle = () => {
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()
  const themeBtnRef = useRef<HTMLButtonElement>(null)

  const mounted = useSyncExternalStore(
    () => () => { },
    () => true,
    () => false
  )

  if (!mounted) {
    return <div className="w-9 h-9 sm:w-10 sm:h-10" />
  }

  const darkMode = theme === 'dark'

  const handleThemeToggle = () => {
    if (!themeBtnRef.current) return

    const rect = themeBtnRef.current.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    if (!document.startViewTransition) {
      setTheme(darkMode ? 'light' : 'dark')
      return
    }

    const transition = document.startViewTransition(() => {
      setTheme(darkMode ? 'light' : 'dark')
    })

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`
      ]

      document.documentElement.animate(
        {
          clipPath: clipPath
        },
        {
          duration: 500,
          easing: 'ease-in-out',
          pseudoElement: '::view-transition-new(root)'
        }
      )
    })
  }

  return (
    <Button
      ref={themeBtnRef}
      variant="ghost"
      size="icon"
      onClick={handleThemeToggle}
      className="w-9 h-9 sm:w-10 sm:h-10 p-2 sm:p-2.5 rounded-lg transition-all duration-200 cursor-pointer bg-transparent text-white/80 hover:bg-white/10"
    >
      {darkMode ? (
        <Sun className="w-6 h-6" />
      ) : (
        <Moon className="w-6 h-6" />
      )}
      <span className="sr-only">{t('toggle_theme') || 'Toggle theme'}</span>
    </Button>
  )
}

export default ThemeToggle
