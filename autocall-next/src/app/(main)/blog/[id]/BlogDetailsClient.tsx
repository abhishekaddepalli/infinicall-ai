'use client'

import BlogDetails from '@/components/features/blog/BlogDetails'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ROUTES } from '@/constants/routes'
import { useGetBlogByIdQuery, useGetBlogsQuery } from '@/redux/api/blogApi'
import { Blog } from '@/types/blog'
import { useParams, useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

export default function BlogDetailsClient() {
  const { id } = useParams()
  const router = useRouter()
  const { t } = useTranslation()

  const { data: blog, isLoading: isBlogLoading, error: blogError } = useGetBlogByIdQuery(id as string)
  const { data: blogsResponse, isLoading: isAllLoading } = useGetBlogsQuery({ limit: 100 })

  if (isBlogLoading || isAllLoading) {
    return (
      <div className="animate-in fade-in duration-700 pb-20">
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <Skeleton className="h-11 w-32 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-[1.5rem] border border-input-border-color bg-bg-card overflow-hidden">
               <Skeleton className="aspect-[21/9] w-full rounded-none" />
               <div className="sm:px-6 px-4 py-6 border-b border-input-border-color flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-6 sm:gap-10">
                 <div className="flex items-center gap-3">
                   <Skeleton className="w-10 h-10 rounded-lg" />
                   <div className="space-y-2">
                     <Skeleton className="w-16 h-4" />
                     <Skeleton className="w-24 h-3" />
                   </div>
                 </div>
                 <div className="flex items-center gap-3">
                   <Skeleton className="w-10 h-10 rounded-lg" />
                   <div className="space-y-2">
                     <Skeleton className="w-16 h-4" />
                     <Skeleton className="w-24 h-3" />
                   </div>
                 </div>
               </div>
               <div className="sm:p-6 p-4 space-y-4">
                 <Skeleton className="h-10 w-3/4 rounded-md mb-8" />
                 <Skeleton className="h-4 w-full rounded-md" />
                 <Skeleton className="h-4 w-5/6 rounded-md" />
                 <Skeleton className="h-4 w-4/6 rounded-md" />
                 <Skeleton className="h-4 w-full rounded-md mt-4" />
                 <Skeleton className="h-4 w-11/12 rounded-md" />
                 <Skeleton className="h-64 w-full mt-8 rounded-xl" />
               </div>
            </div>
          </div>
          <div className="lg:col-span-1 space-y-8">
            <div className="rounded-[1.5rem] border border-input-border-color bg-bg-card p-6 flex flex-col items-center space-y-4">
              <Skeleton className="w-20 h-20 rounded-xl" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-12 w-full mt-4" />
            </div>
            <div className="rounded-[1.5rem] border border-input-border-color bg-bg-card p-6 space-y-6">
              <div className="flex items-center gap-3">
                 <Skeleton className="w-10 h-10 rounded-lg" />
                 <Skeleton className="h-5 w-32" />
              </div>
              <div className="space-y-4">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="flex gap-4">
                     <Skeleton className="w-16 h-16 rounded-xl shrink-0" />
                     <div className="space-y-2 w-full py-1">
                       <Skeleton className="h-4 w-full" />
                       <Skeleton className="h-3 w-2/3" />
                     </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (blogError || !blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h2 className="text-2xl font-bold">{t('blog_not_found')}</h2>
        <Button
          onClick={() => router.push(ROUTES.BLOGS)}
          className="text-primary hover:underline font-semibold"
        >
          {t('return_to_blog_list')}
        </Button>
      </div>
    )
  }

  const allBlogs = blogsResponse?.blogs || []

  return (
    <div>
      <BlogDetails
        blog={blog}
        allBlogs={allBlogs}
        onClose={() => router.push(ROUTES.BLOGS)}
        onNavigate={(b: Blog) => router.push(`/blog/${b._id || b.id}`)}
      />
    </div>
  )
}
