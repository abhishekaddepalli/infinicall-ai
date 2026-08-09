'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PERMISSIONS } from '@/constants/permissions'
import { useAppDirection } from '@/hooks/useAppDirection'
import { usePermission } from '@/hooks/usePermission'
import { FileText, FolderTree, Hash } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import BlogList from './BlogList'
import CategoryManagement from './CategoryManagement'
import TagManagement from './TagManagement'

const BlogManagement = () => {
  const { t } = useTranslation()
  const direction = useAppDirection()
  const { hasPermission } = usePermission()

  return (
    <div className="space-y-6">

      <Tabs defaultValue="blogs" className="w-full" dir={direction}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-2">
          <div className="flex flex-row items-center gap-4">
            <div className="space-y-0.5">
              <h1 className="text-2xl font-bold text-title tracking-tight">{t('blogs')}</h1>
            </div>
          </div>
          {hasPermission(PERMISSIONS.VIEW_BLOG_CATEGORIES && PERMISSIONS.VIEW_BLOG_TAGS) && (
            <TabsList className="h-auto flex flex-wrap items-center gap-2 sm:gap-3 bg-transparent border-none p-0 relative justify-start">
              <TabsTrigger
                value="blogs"
                className="h-10 px-4 flex gap-2 items-center bg-primary/10 transition-all duration-200 font-semibold text-sm whitespace-nowrap cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-white text-primary hover:text-title rounded-lg"
              >
                <FileText className="w-4 h-4 shrink-0" />
                {t('blogs')}
              </TabsTrigger>
              <TabsTrigger
                value="categories"
                className="h-10 px-4 flex gap-2 items-center bg-primary/10 transition-all duration-200 font-semibold text-sm whitespace-nowrap cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-white text-primary hover:text-title rounded-lg"
              >
                <FolderTree className="w-4 h-4 shrink-0" />
                {t('categories')}
              </TabsTrigger>
              <TabsTrigger
                value="tags"
                className="h-10 px-4 flex gap-2 items-center bg-primary/10 transition-all duration-200 font-semibold text-sm whitespace-nowrap cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-white text-primary hover:text-title rounded-lg"
              >
                <Hash className="w-4 h-4 shrink-0" />
                {t('tags')}
              </TabsTrigger>
            </TabsList>
          )}
        </div>

        <TabsContent value="blogs" className="mt-6">
          <BlogList />
        </TabsContent>
        {hasPermission(PERMISSIONS.VIEW_BLOG_CATEGORIES) && (
          <TabsContent value="categories" className="mt-6">
            <CategoryManagement />
          </TabsContent>
        )}
        {hasPermission(PERMISSIONS.VIEW_BLOG_TAGS) && (
          <TabsContent value="tags" className="mt-6">
            <TagManagement />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

export default BlogManagement
