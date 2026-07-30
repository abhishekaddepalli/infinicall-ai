'use client'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useAppDirection } from '@/hooks/useAppDirection'
import { cn } from '@/lib/utils'
import { languageApi, useGetActiveLanguagesQuery } from '@/redux/api/languageApi'
import { useAppDispatch } from '@/redux/hooks'
import { Language } from '@/types/language'
import { Check, Globe } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

const LanguageDropdown = () => {
  const { i18n } = useTranslation()
  const { data: languagesData, isLoading } = useGetActiveLanguagesQuery({})
  const [currentLanguage, setCurrentLanguage] = useState<Language | null>(null)
  const [lastDefaultLocale, setLastDefaultLocale] = useState<string | null>(null)
  const direction = useAppDirection()
  const dispatch = useAppDispatch()

  const activeLanguages = useMemo(() => languagesData?.data.languages || [], [languagesData])

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
                  
                  // Re-trigger language change if this is the currently active language
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

      // If the default language has changed (or it's the first load), update the site language
      if (defaultLang && defaultLang.locale !== lastDefaultLocale) {
        i18n.changeLanguage(defaultLang.locale)
        setTimeout(() => {
          setCurrentLanguage(defaultLang)
          setLastDefaultLocale(defaultLang.locale)
        }, 100)
      } else if (!currentLanguage) {
        const current = activeLanguages.find((l) => l.locale === i18n.language) || defaultLang
        setTimeout(() => {
          setCurrentLanguage(current)
        }, 100)
      }
    }
  }, [activeLanguages, i18n, lastDefaultLocale, currentLanguage, dispatch])

  // Update HTML lang attribute
  useEffect(() => {
    document.documentElement.lang = i18n.language || 'en'
  }, [i18n.language])

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
          className="w-5 h-4 object-cover inline-block"
          onError={(e) => {
            ; (e.target as HTMLImageElement).style.display = 'none'
          }}
        />
      )
    }
    return lang.emoji || <Globe className="h-6 w-6" />
  }

  if (isLoading || activeLanguages.length === 0) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="rounded-[8px]  cursor-not-allowed h-9 w-9 sm:h-10 sm:w-10 "
      >
        <Globe className="w-6 h-6 text-white/80" />
      </Button>
    )
  }

  return (
    <DropdownMenu dir={direction}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center p-0! gap-1.5 h-9 w-9 sm:h-10 sm:w-10 rounded-[8px] hover:bg-white/10 glass-button glass-header-card transition-all duration-300 group"
        >
          <div className="flex items-center justify-center text-white/80 transition-transform duration-200">
            <span className="text-[16px] leading-none">
              {currentLanguage ? getLanguageIcon(currentLanguage) : <Globe className="w-5 h-5 text-white/80" />}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 p-2 mt-2 border border-input-border-color dark:border-white/10 bg-bg-card! rounded-border-radius! shadow-2xl animate-in fade-in zoom-in duration-200 z-50"
      >
        <div className="space-y-1 custom-scrollbar max-h-47.5 overflow-auto">
          {activeLanguages.map((lang) => (
            <DropdownMenuItem
              key={lang.id}
              onClick={() => handleLanguageChange(lang)}
              className={cn(
                'flex items-center justify-between px-3 py-2.5 glass-card glass-dark-card   rounded-[8px] cursor-pointer transition-all duration-200',
                i18n.language === lang.locale ? 'bg-primary/10 text-primary' : 'hover:bg-accent',
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl leading-none grayscale-[0.2] group-hover:grayscale-0">
                  {getLanguageIcon(lang)}
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-bold tracking-tight dark:text-white">{lang.name}</span>
                </div>
              </div>
              {i18n.language === lang.locale && <Check className="h-4 w-4 stroke-[3px]" />}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default LanguageDropdown
