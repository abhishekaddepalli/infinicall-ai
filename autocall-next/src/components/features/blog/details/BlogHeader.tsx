'use client'

import { Badge } from '@/components/ui/badge'
import { getImageUrl } from '@/lib/utils'
import { BlogHeaderProps, Category } from '@/types/blog'
import { User } from 'lucide-react'
import Image from 'next/image'

export default function BlogHeader({ blog }: BlogHeaderProps) {
  return (
    <div className="relative w-full overflow-hidden flex flex-col justify-end min-h-[250px] sm:min-h-[400px]">
      {blog.thumbnail ? (
        <Image
          src={getImageUrl(blog.thumbnail)}
          alt={blog.title}
          fill
          className="object-cover"
          unoptimized
        />
      ) : (
        <div className="absolute inset-0 z-0 w-full h-full bg-primary/5 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-8 w-8 text-primary" />
          </div>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 z-0" />
      <div className="relative z-10 p-6 sm:p-10 w-full mt-auto">
        <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
          {(blog.categories as Category[]).map((cat) => (
            <Badge key={cat._id || cat.id} className="bg-primary hover:bg-primary/90 text-white border-none rounded-full px-3 sm:px-4 py-1 text-[10px] sm:text-[11px] font-bold shadow-sm">
              {cat.name}
            </Badge>
          ))}
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight break-all line-clamp-2 whitespace-normal">
          {blog.title}
        </h1>
      </div>
    </div>
  )
}
