'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PERMISSIONS } from '@/constants/permissions'
import { usePermission } from '@/hooks/usePermission'
import { getImageUrl } from '@/lib/utils'
import { BlogCardProps, Category, Tag } from '@/types/blog'
import { Calendar, ChevronRight, Pencil, Trash2, User } from 'lucide-react'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'

export default function BlogCard({ blog, onEdit, onDelete, onClick }: BlogCardProps) {
  const { t } = useTranslation()
  const { hasPermission } = usePermission()

  const canEdit = hasPermission(PERMISSIONS.UPDATE_BLOGS)
  const canDelete = hasPermission(PERMISSIONS.DELETE_BLOGS)
  return (
    <div
      className="group relative flex flex-col p-4 rounded-lg border border-input-border-color bg-bg-card overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] h-full cursor-pointer"
      onClick={() => onClick(blog)}
    >
      {/* Image Section */}
      <div className="relative flex-none aspect-[1.6] rounded-lg overflow-hidden transition-all duration-500">
        <div className="absolute inset-0 transition-all duration-300">
          <div className="relative w-full h-full rounded-lg overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.05)]">
            {blog.thumbnail ? (
              <Image
                src={getImageUrl(blog.thumbnail)}
                alt={blog.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-primary/5 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">{blog.title.charAt(0)}</span>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Floating Badges */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
              <div className="flex flex-wrap gap-2">
                {(blog.categories as Category[]).slice(0, 2).map((cat) => (
                  <Badge
                    key={cat._id || cat.id}
                    className="bg-primary hover:bg-primary/90 text-white border-none text-[11px] font-medium px-3 py-1 rounded-full capitalize shadow-sm"
                  >
                    {cat.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Action Buttons (Visible on hover) */}
            {(canEdit || canDelete) && (
              <div className="absolute inset-0 rounded-lg flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100 bg-black/40 backdrop-blur-[2px]">
                {canEdit && (
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-10 w-10 rounded-lg bg-edit/90 hover:bg-edit text-white transition-all shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation()
                      onEdit(blog)
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
                {canDelete && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-10 w-10 rounded-lg text-white bg-destructive/90 dark:bg-destructive/90 dark:hover:bg-destructive/90 hover:bg-destructive transition-all shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(blog._id || (blog as any).id)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="pt-5 flex flex-col flex-1">
        <div className="flex items-center gap-3 text-xs font-medium text-subtitle-color mb-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
          <span className="text-subtitle-color">|</span>
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            {t('admin')}
          </div>
        </div>

        <h3 className="text-lg font-bold leading-tight line-clamp-2 text-zinc-900 dark:text-white transition-colors group-hover:text-primary mb-4] font-bold leading-tight line-clamp-2 text-zinc-900 dark:text-white transition-colors group-hover:text-primary mb-4">
          {blog.title}
        </h3>

        <div className="flex-1" />

        {/* Footer Section */}
        <div className="pt-4 mt-2 border-t border-zinc-100 dark:border-zinc-800/50 flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {(blog.tags as Tag[]).slice(0, 2).map((tag) => (
              <Badge
                key={tag._id || (tag as any).id}
                className="bg-primary/10 hover:bg-primary/15 text-primary border-none text-[11px] font-medium px-3 py-1 rounded-full shadow-none"
              >
                #{tag.title}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center gap-1.5 text-primary font-semibold text-md group/btn shrink-0 ml-auto">
            {t('read_more')}
            <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </div>
        </div>
      </div>
    </div>
  )
}
