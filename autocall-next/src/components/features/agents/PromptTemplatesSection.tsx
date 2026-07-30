'use client'

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useGetPromptTemplatesQuery } from "@/redux/api/promptTemplateApi"
import { useGetTemplateCategoriesQuery } from "@/redux/api/templateCategoryApi"
import { PromptTemplatesSectionProps } from '@/types/agent'
import { LayoutGrid } from "lucide-react"
import { useState } from 'react'
import { useTranslation } from "react-i18next"
import { Autoplay, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { PromptTemplateCard } from "./PromptTemplateCard"

export function PromptTemplatesSection({ onApplyTemplate }: PromptTemplatesSectionProps) {
  const { t } = useTranslation()
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all")

  const { data: categoriesResponse } = useGetTemplateCategoriesQuery({ limit: 100 })
  const categories = categoriesResponse?.categories || []

  const { data: templatesResponse, isLoading } = useGetPromptTemplatesQuery({
    category: selectedCategoryId === "all" ? undefined : selectedCategoryId,
    limit: 100,
    sort_by: 'created_at',
    sort_order: 'DESC',
  })

  const templates = templatesResponse?.templates || []

  const handleCategoryClick = (categoryId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    setSelectedCategoryId(categoryId)
    const button = event.currentTarget
    const container = button.closest('.table-custom-scrollbar')
    if (button && container) {
      const containerWidth = (container as HTMLElement).offsetWidth
      const buttonWidth = button.offsetWidth
      const buttonLeft = button.offsetLeft

      const scrollPosition = buttonLeft - (containerWidth / 2) + (buttonWidth / 2)

      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="bg-bg-card p-4 sm:p-6 rounded-radius border border-input-border-color transition-all duration-300 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-xl font-black flex items-center gap-2.5">
            <span>{t("conversation_templates")}</span>
          </h2>
        </div>
      </div>

      {/* Category Pills horizontal scroll list */}
      <div className="space-y-4">
        <div className="w-full overflow-x-auto table-custom-scrollbar pb-3">
          <div className="flex flex-row flex-nowrap items-center gap-2.5">
            <Button
              variant={selectedCategoryId === "all" ? "default" : "outline"}
              size="sm"
              onClick={(e) => handleCategoryClick("all", e)}
              className={cn(
                "rounded-lg h-10 p-padding!  text-xs font-black transition-all border-none shrink-0",
                selectedCategoryId === "all"
                  ? "bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]"
                  : "bg-subcard text-slate-600 dark:text-zinc-400"
              )}
            >
              {t("all_templates")}
            </Button>

            {categories.map((cat: any) => (
              <Button
                key={cat.id || cat._id}
                variant={selectedCategoryId === (cat.id || cat._id) ? "default" : "outline"}
                size="sm"
                onClick={(e) => handleCategoryClick(cat.id || cat._id || "", e)}
                className={cn(
                  "rounded-full px-5 py-2.5 text-xs font-black transition-all border-none h-10 shrink-0",
                  selectedCategoryId === (cat.id || cat._id)
                    ? "bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]"
                    : "bg-subcard text-slate-600 dark:text-zinc-400"
                )}
              >
                {cat.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Templates list grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-60 rounded-3xl bg-slate-100 dark:bg-zinc-900 animate-pulse border border-slate-200/50 dark:border-white/5" />
            ))}
          </div>
        ) : templates.length === 0 ? (
          <div className="flex flex-col items-center justify-center sm:p-12 p-4 text-center rounded-radius border border-dashed border-input-border-color dark:border-white/10 bg-input-color dark:bg-zinc-900/10">
            <LayoutGrid className="w-8 h-8 text-muted-foreground/30 mb-3 animate-pulse" />
            <p className="text-sm font-black text-subtitle-color">
              {t('no_prompt_templates_found')}
            </p>
          </div>
        ) : (
          <div className="pt-4 animate-in fade-in slide-in-from-bottom-2 duration-300 w-full overflow-hidden">
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
              breakpoints={{
                640: {
                  slidesPerView: 1.5,
                },
                768: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
              }}
              className="!pb-12"
            >
              {templates.map((template) => (
                <SwiperSlide key={template.id || template._id} className="!h-auto flex">
                  <div className="w-full h-full">
                    <PromptTemplateCard
                      template={template}
                      onApplyTemplate={onApplyTemplate}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
    </div>
  )
}
