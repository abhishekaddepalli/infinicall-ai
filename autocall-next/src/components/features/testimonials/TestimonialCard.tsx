'use client'

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { usePermission } from "@/hooks/usePermission"
import { cn } from "@/lib/utils"
import { TestimonialCardProps } from "@/types/testimonial"
import { Edit2, Star, Trash2, User } from "lucide-react"
import Image from "next/image"

const TestimonialCard = ({ testimonial, onEdit, onDelete, onToggleStatus }: TestimonialCardProps) => {
  const { isAdmin } = usePermission()
  const hasAdminAccess = isAdmin()

  return (
    <div className="group flex flex-col h-full bg-bg-card rounded-lg p-4 sm:p-6 border border-input-border-color transition-all duration-300">

      {/* User Info & Switch */}
      <div className="flex justify-between items-start mb-5">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-primary/10 shrink-0">
            {testimonial.user_image ? (
              <Image
                src={
                  testimonial.user_image.startsWith('http')
                    ? testimonial.user_image
                    : `${process.env.NEXT_PUBLIC_STORAGE_URL}${testimonial.user_image.startsWith('/') ? '' : '/'}${testimonial.user_image}`
                }
                alt={testimonial.user_name}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-primary  bg-primary/10">
                <User className="w-5 h-5" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex flex-col justify-center">
            <h4 className="font-semibold text-title text-base truncate">
              {testimonial.user_name}
            </h4>
            <p className="text-subtitle-color text-md truncate font-medium">
              {testimonial.user_post}
            </p>
          </div>
        </div>
        {hasAdminAccess && (
          <Switch
            checked={testimonial.status}
            onCheckedChange={() => onToggleStatus(testimonial)}
            className="data-[state=checked]:bg-primary scale-90 origin-top-right ml-3"
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col mb-6">
        <h3 className="text-base font-semibold text-title mb-2 line-clamp-2 break-all whitespace-normal">
          {testimonial.title}
        </h3>
        <p className="text-subtitle-color text-md break-all whitespace-normal leading-relaxed line-clamp-4">
          {testimonial.description}
        </p>
      </div>

      {/* Footer: Stars & Actions */}
      <div className="flex items-center justify-between mt-auto">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-4.5 h-4.5",
                i < (testimonial.rating || 5)
                  ? "fill-[#FBBF24] text-[#FBBF24]"
                  : "fill-gray-100 text-gray-100 dark:fill-gray-800 dark:text-gray-800"
              )}
            />
          ))}
        </div>

        {/* Action buttons */}
        {hasAdminAccess && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(testimonial)}
              className="h-9 w-9 rounded-lg text-edit bg-edit/10 hover:text-white hover:bg-edit transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(testimonial)}
              className="h-9 w-9 rounded-lg text-destructive hover:text-white hover:bg-destructive bg-destructive/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default TestimonialCard
