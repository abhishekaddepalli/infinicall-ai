'use client'

import { Button } from '@/components/ui/button'
import { getImageUrl } from '@/lib/utils'
import { BlogSidebarDetailsProps } from '@/types/blog'
import { Calendar, LayoutGrid, User } from 'lucide-react'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'

export default function BlogSidebar({ recentBlogs, onNavigate, onClose }: BlogSidebarDetailsProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-8">
      {/* Author Info */}
      <div className="sm:p-6 p-4 rounded-lg border border-input-border-color bg-bg-card text-center space-y-5">
        <div className="w-20 h-20 rounded-[18px] bg-primary/10 p-1 mx-auto overflow-hidden">
          <div className="w-full h-full rounded-[14px] flex items-center justify-center overflow-hidden bg-bg-card border border-primary/20">
            <User className="w-10 h-10 text-primary" />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold text-title tracking-tight">{t('admin_author')}</h3>
          <p className="text-md font-bold text-subtitle-color mt-1">{t('author_position')}</p>
        </div>
        <p className="text-md text-subtitle-color leading-relaxed">
          &quot;{t('author_quote')}&quot;
        </p>
      </div>

      {/* Recent Posts */}
      <div className="sm:p-6 p-4 rounded-lg border border-input-border-color bg-bg-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <LayoutGrid className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-title">
            {t('recent_blogs')}
          </h3>
        </div>
        <div className="space-y-6">
          {recentBlogs.map((recent) => (
            <div
              key={recent._id || recent.id}
              onClick={() => onNavigate(recent)}
              className="group flex gap-4 cursor-pointer items-center"
            >
              <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-input-border-color">
                {recent.thumbnail ? (
                  <Image
                    src={getImageUrl(recent.thumbnail)}
                    alt={recent.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-primary/5 flex items-center justify-center text-primary font-bold text-lg">
                    {recent.title.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <h4 className="text-base font-bold text-title line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                  {recent.title}
                </h4>
                <div className="flex items-center gap-1.5 text-md font-bold text-subtitle-color">
                  <Calendar className="w-4 h-4" />
                  {new Date(recent.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            </div>
          ))}
          {recentBlogs.length === 0 && (
            <p className="text-md text-subtitle-color text-center py-4">{t('no_other_articles')}</p>
          )}
        </div>
        <Button
          variant="outline"
          className="w-full bg-primary text-white p-padding! border-none mt-8 rounded-radius font-bold h-11 "
          onClick={onClose}
        >
          {t('view_all_blogs')}
        </Button>
      </div>
    </div>
  )
}
