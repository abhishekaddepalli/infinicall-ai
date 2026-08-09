'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import languages from '@/data/languages.json'
import { cn } from '@/lib/utils'
import { LanguageSelectorProps } from '@/types/language'
import { Globe, Plus, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function LanguageSelector({
  selectedLang,
  onSelect,
  isSelectOpen,
  setIsSelectOpen,
  searchQuery,
  setSearchQuery,
  error,
}: LanguageSelectorProps) {

  const { t } = useTranslation()
  const filteredLanguages = languages.filter(
    (lang) =>
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.locale.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCustomAdd = () => {
    onSelect({
      name: searchQuery,
      locale: '',
      emoji: '🌐',
      code: '',
      isCustom: true
    })
    setIsSelectOpen(false)
  }

  return (
    <div className="space-y-2">
      <div className="relative group/selector">
        <div
          onClick={() => setIsSelectOpen(!isSelectOpen)}
          className={cn(
            "w-full h-11 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-white/5 px-3 flex items-center justify-between cursor-pointer transition-all hover:bg-zinc-100 dark:hover:bg-white/10",
          )}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 border border-zinc-200 dark:border-white/10">
              {selectedLang ? (
                <span className="text-lg">{selectedLang.emoji || '🌐'}</span>
              ) : (
                <Globe className="w-3.5 h-3.5" />
              )
            }
            </div>
            <span className={cn(
              "font-semibold text-xs",
              selectedLang ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-500 dark:text-zinc-400"
            )}>
              {selectedLang ? selectedLang.name : t('click_to_choose_language')}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center -space-y-0.5 opacity-30">
            <div className="w-1.5 h-1.5 border-r border-b border-zinc-900 dark:border-white rotate-45" />
          </div>
        </div>

        {isSelectOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-xl shadow-xl z-[100] animate-in fade-in zoom-in-95 duration-200">
            <div className="relative mb-2 px-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
              <Input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-10 pr-4 bg-zinc-50 dark:bg-white/5 rounded-lg text-xs focus:ring-1 focus:ring-primary/20 border-zinc-200 dark:border-white/10"
                placeholder={t('search_languages')}
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            <div className="max-h-[220px] overflow-y-auto custom-scrollbar space-y-0.5 px-1">
              {filteredLanguages.map((lang) => (
                <div
                  key={lang.locale}
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelect(lang)
                    setIsSelectOpen(false)
                  }}
                  className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-white/5 cursor-pointer transition-all group/langitem"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">
                      {lang.emoji}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">{lang.name}</span>
                      <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">{lang.locale}</span>
                    </div>
                  </div>
                  <Plus className="w-3 h-3 text-zinc-300 group-hover/langitem:text-primary transition-colors" />
                </div>
              ))}

              {filteredLanguages.length === 0 && searchQuery && (
                <div className="p-4 text-center space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-white/5 mx-auto flex items-center justify-center">
                    <Globe className="w-5 h-5 text-zinc-300" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{searchQuery}</p>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">{t('this_language_is_not_our_system')}</p>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCustomAdd()
                    }}
                    className="w-full rounded-lg bg-primary text-white gap-2 font-semibold h-9 text-xs shadow-sm hover:bg-primary/90"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {t('create_new_language')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-[11px] text-destructive font-bold ml-1">{error}</p>}
    </div>
  )
}
