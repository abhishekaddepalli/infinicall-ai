'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BlogDetailsProps, Tag } from '@/types/blog'
import DOMPurify from 'dompurify'
import { ArrowLeft, Calendar, Search, Tag as TagIcon, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import BlogHeader from './details/BlogHeader'
import BlogNavigation from './details/BlogNavigation'
import BlogSidebar from './details/BlogSidebar'

export default function BlogDetails({ blog, allBlogs, onClose, onNavigate }: BlogDetailsProps) {
  const { t } = useTranslation()

  const currentIndex = allBlogs.findIndex(b => (b._id || b.id) === (blog._id || blog.id))
  const prevBlog = currentIndex > 0 ? allBlogs[currentIndex - 1] : null
  const nextBlog = currentIndex < allBlogs.length - 1 ? allBlogs[currentIndex + 1] : null

  const recentBlogs = allBlogs
    .filter(b => (b._id || b.id) !== (blog._id || blog.id))
    .slice(0, 5)

  const decodeHtml = (html: string) => {
    return html
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  };

  const decodedContent = decodeHtml(blog.content || "");
  const sanitizedContent = DOMPurify.sanitize(decodedContent, {
    ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'u', 's', 'ul', 'ol', 'li', 'br', 'a', 'span', 'div', 'img', 'blockquote', 'code', 'pre', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'class', 'style', 'width', 'height'],
  })

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 pb-20">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-8 sm:mb-12">
        <Button
          variant="ghost"
          onClick={onClose}
          className="h-11 rounded-radius hover:bg-primary/10 text-zinc-500 dark:text-zinc-400 hover:text-primary gap-2 px-4 font-bold transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
          {t('back_to_blogs')}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Content Card */}
          <div className="rounded-modal-radius border border-input-border-color bg-bg-card overflow-hidden animate-in zoom-in-95 duration-700">
            <BlogHeader blog={blog} />

            {/* Meta Info */}
            <div className="sm:px-6 px-4 py-6 border-b border-input-border-color flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-6 sm:gap-10">
              <div className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <User className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-md text-title font-bold mb-0.5">{t('author')}</p>
                  <p className="text-sm font-bold text-subtitle-color">{t('admin_team')}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <Calendar className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-md text-title font-bold mb-0.5">{t('published')}</p>
                  <p className="text-sm font-bold text-subtitle-color">
                    {blog.created_at ? new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : t('unknown_date')}
                  </p>
                </div>
              </div>
            </div>

            {/* Article Content */}
            <div className="sm:p-6 p-4">
              <div
                className="
                  text-zinc-600 dark:text-zinc-400 leading-relaxed text-base break-words
                  [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-zinc-900 dark:[&_h1]:text-white [&_h1]:mb-4 [&_h1]:mt-8 [&_h1]:tracking-tight
                  [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-zinc-900 dark:[&_h2]:text-white [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:tracking-tight
                  [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-zinc-900 dark:[&_h3]:text-white [&_h3]:mb-3 [&_h3]:mt-5
                  [&_h4]:text-lg [&_h4]:font-bold [&_h4]:text-zinc-900 dark:[&_h4]:text-white [&_h4]:mb-2 [&_h4]:mt-4
                  [&_p]:mb-4
                  [&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline
                  [&_strong]:text-zinc-900 dark:[&_strong]:text-white [&_strong]:font-bold
                  [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul_li]:mb-1.5 [&_ul_li::marker]:text-zinc-400
                  [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol_li]:mb-1.5 [&_ol_li::marker]:text-zinc-400
                  [&_img]:rounded-2xl [&_img]:shadow-lg [&_img]:my-8 [&_img]:max-w-full [&_img]:h-auto
                  [&_blockquote]:border-l-4 [&_blockquote]:border-primary/50 [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:my-6 [&_blockquote]:text-zinc-500
                  [&_pre]:bg-zinc-100 dark:[&_pre]:bg-zinc-900 [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_pre]:mb-4
                  [&_code]:bg-zinc-100 dark:[&_code]:bg-zinc-900 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:font-mono [&_code]:text-sm
                "
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              />

              {/* SEO Data Section */}
              {(blog.meta_title || blog.meta_description) && (
                <div className="mt-5 sm:p-6 p-4 rounded-modal-radius bg-subcard border border-input-border-color space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Search className="h-4 w-4" />
                    </div>
                    <h3 className="text-md font-bold text-title">
                      {t('seo_data')}
                    </h3>
                  </div>
                  {blog.meta_title && (
                    <div>
                      <p className="text-md font-bold text-subtitle-color mb-1">{t('meta_title')}</p>
                      <p className="text-sm font-semibold text-title">{blog.meta_title}</p>
                    </div>
                  )}
                  {blog.meta_description && (
                    <div>
                      <p className="text-md font-bold text-subtitle-color mb-1">{t('meta_description')}</p>
                      <p className="text-sm text-title leading-relaxed">{blog.meta_description}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tags Section */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="mt-5 pt-4 sm:pt-6 border-t border-input-border-color">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <TagIcon className="h-4 w-4" />
                    </div>
                    <h3 className="text-md font-bold text-title">
                      {t('related_tags')}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(blog.tags as Tag[]).map((tag) => (
                      <Badge
                        key={tag._id || tag.id}
                        className="bg-primary/10 hover:bg-primary/15 text-primary border-none px-3 py-1 text-[11px] font-medium rounded-full shadow-none transition-colors"
                      >
                        #{tag.title}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Controls */}
          <BlogNavigation prevBlog={prevBlog} nextBlog={nextBlog} onNavigate={onNavigate} />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <BlogSidebar recentBlogs={recentBlogs} onNavigate={onNavigate} onClose={onClose} />
        </div>
      </div>
    </div>
  )
}
