'use client'

import { BlogNavigationProps } from '@/types/blog'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function BlogNavigation({ prevBlog, nextBlog, onNavigate }: BlogNavigationProps) {
  const { t } = useTranslation()

  return (
    <>
      {prevBlog ? (
        <div
          onClick={() => onNavigate(prevBlog)}
          className="group sm:p-6 p-4 rounded-lg border border-input-border-color bg-bg-card flex items-center gap-5 cursor-pointer hover:border-primary/50 transition-all duration-300"
        >
          <div className="w-12 h-12 rounded-lg bg-zinc-100 dark:bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
            <ChevronLeft className="h-6 w-6" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-base font-bold text-primary mb-1 break-all whitespace-normal line-clamp-1">{t('previous_blog')}</p>
            <h4 className="text-md font-bold text-subtitle-color break-all whitespace-normal line-clamp-1 group-hover:text-primary transition-colors">{prevBlog.title}</h4>
          </div>
        </div>
      ) : <div />}

      {nextBlog ? (
        <div
          onClick={() => onNavigate(nextBlog)}
          className="group sm:p-6 p-4 rounded-lg border border-input-border-color bg-bg-card flex items-center gap-5 cursor-pointer hover:border-primary/50 transition-all duration-300 text-right"
        >
          <div className="flex-1 overflow-hidden">
            <p className="text-base font-bold text-primary mb-1 break-all whitespace-normal line-clamp-1">{t('next_blog')}</p>
            <h4 className="text-md font-bold text-subtitle-color break-all whitespace-normal line-clamp-1 group-hover:text-primary transition-colors">{nextBlog.title}</h4>
          </div>
          <div className="w-12 h-12 rounded-lg bg-zinc-100 dark:bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
            <ChevronRight className="h-6 w-6" />
          </div>
        </div>
      ) : <div />}
    </>
  )
}
