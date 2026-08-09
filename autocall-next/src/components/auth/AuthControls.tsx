'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useAppDirection } from '@/hooks/useAppDirection'
import { cn } from '@/lib/utils'
import { languageApi, useGetActiveLanguagesQuery } from '@/redux/api/languageApi'
import { useAppDispatch } from '@/redux/hooks'
import { Language } from '@/types/language'
import { Check, ChevronDown, Globe, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../ui/button'

const UnifiedAuthControls = ({ className }: { className?: string }) => {
  const { i18n } = useTranslation()
  const { data: languagesData, isLoading } = useGetActiveLanguagesQuery({})
  const [currentLanguage, setCurrentLanguage] = useState<Language | null>(null)
  const direction = useAppDirection()
  const dispatch = useAppDispatch()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const activeLanguages = useMemo(() => languagesData?.data.languages || [], [languagesData])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (activeLanguages.length > 0) {
      activeLanguages.forEach((lang) => {
        if (lang.front_translation_file) {
          dispatch(languageApi.endpoints.getTranslations.initiate(lang.locale))
            .unwrap()
            .then(data => {
              if (data?.success && data?.data) {
                const translationKey = Object.keys(data.data)[0];
                const translationData = data.data[translationKey];

                if (translationData) {
                  i18n.addResourceBundle(lang.locale, 'translation', translationData, true, true)

                  if (i18n.language === lang.locale) {
                    i18n.changeLanguage(lang.locale)
                  }
                }
              }
            })
            .catch(err => console.error("Failed to load translation for", lang.locale, err))
        }
      })

      const defaultLang = activeLanguages.find((l) => l.is_default) || activeLanguages[0]
      const current = activeLanguages.find((l) => l.locale === i18n.language) || defaultLang
      setCurrentLanguage(current)
    }
  }, [activeLanguages, i18n, i18n.language, dispatch])

  const handleLanguageChange = (lang: Language) => {
    i18n.changeLanguage(lang.locale)
    setCurrentLanguage(lang)
  }

  const getLanguageIcon = (lang: Language) => {
    if (lang.flag) {
      const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL || ''
      const flagUrl = lang.flag.startsWith('http')
        ? lang.flag
        : `${storageUrl.replace(/\/$/, '')}/${lang.flag.replace(/^\//, '')}`
      return (
        <Image
          src={flagUrl}
          alt={lang.name}
          width={24}
          height={24}
          unoptimized
          className="w-5 h-[15px] object-cover inline-block rounded-[2px]"
          onError={(e) => {
            ; (e.target as HTMLImageElement).style.display = 'none'
          }}
        />
      )
    }
    return <Globe className="h-4 w-4" />
  }

  const isDark = theme === 'dark'

  return (
    <div className={cn("absolute top-4 right-4 sm:top-8 sm:right-8 xl:top-12 xl:right-12 flex items-center bg-[#07131C] border border-[#1A2D3D] p-[5px] rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.4)] z-50 transition-colors", className)}>

      {/* Language Section */}
      <DropdownMenu dir={direction}>
        <DropdownMenuTrigger className="outline-none flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/5 transition-colors cursor-pointer">
          {!isLoading && currentLanguage ? getLanguageIcon(currentLanguage) : <Globe className="w-4 h-4 text-white" />}
          <span className="text-[14px] font-bold text-white tracking-wide uppercase mt-0.5">
            {!isLoading && currentLanguage ? currentLanguage.locale : 'EN'}
          </span>
          <ChevronDown className="w-4 h-4 text-white stroke-[2.5px]" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48 p-2 mt-2 border border-input-border-color dark:border-white/10 bg-bg-card! rounded-border-radius! shadow-2xl z-50"
        >
          <div className="space-y-1 custom-scrollbar max-h-47.5 overflow-auto">
            {activeLanguages.map((lang, idx) => (
              <DropdownMenuItem
                key={lang.id || lang.locale || `lang-${idx}`}
                onClick={() => handleLanguageChange(lang)}
                className={cn(
                  'flex items-center justify-between px-3 py-2.5 rounded-[8px] cursor-pointer transition-all duration-200',
                  i18n.language === lang.locale ? 'bg-primary/10 text-primary' : 'hover:bg-accent',
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl leading-none">
                    {getLanguageIcon(lang)}
                  </span>
                  <span className="text-sm font-bold tracking-tight dark:text-white">{lang.name}</span>
                </div>
                {i18n.language === lang.locale && <Check className="h-4 w-4 stroke-[3px]" />}
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Divider */}
      <div className="w-[1px] h-[18px] bg-[#2A3A4A] mx-2"></div>

      {/* Theme Toggle Section */}
      {mounted ? (
        <Button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          type="button"
          className="relative flex items-center justify-center w-9 h-9 p-0! mx-1 rounded-full! bg-primary text-white shadow-[0_2px_8px_rgba(45,115,255,0.4)] transition-transform duration-300"
        >
          <div className={cn("absolute inset-0 flex items-center justify-center transition-all duration-500", isDark ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100")}>
            <Sun className="w-[18px] h-[18px]" />
          </div>
          <div className={cn("absolute inset-0 flex items-center justify-center transition-all duration-500", isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50")}>
            <Moon className="w-[18px] h-[18px]" />
          </div>
        </Button>
      ) : (
        <div className="w-9 h-9 mx-1"></div>
      )}
    </div>
  )
}

export const AuthControls = UnifiedAuthControls
