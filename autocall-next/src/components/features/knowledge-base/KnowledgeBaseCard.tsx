'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { KnowledgeBaseCardProps } from "@/types/knowledgeBase"
import { format } from "date-fns"
import { CalendarDays, FileText, Globe, Link2, Pencil, Trash2 } from "lucide-react"

const KnowledgeBaseCard = ({ item, onDelete, onEdit, isSelected, onSelect }: KnowledgeBaseCardProps) => {
  const getTypeIcon = () => {
    switch (item.type) {
      case 'url':
        return <Link2 className="w-5 h-5" />
      case 'file':
        return <Globe className="w-5 h-5" />
      case 'text':
        return <FileText className="w-5 h-5" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  const formatSize = (bytes?: number) => {
    if (!bytes) return '0 KB'
    const kb = bytes / 1024
    if (kb < 1024) return `${kb.toFixed(2)} KB`
    const mb = kb / 1024
    return `${mb.toFixed(2)} MB`
  }

  return (
    <div
      className={cn(
        "bg-bg-card rounded-radius sm:p-5 p-4 transition-all duration-300 group relative flex flex-col h-full border",
        isSelected
          ? "border-primary shadow-sm ring-1 ring-primary/20"
          : "border-input-border-color hover:border-primary/40 hover:shadow-md"
      )}
    >
      {/* Absolute Checkbox (Floating on the right side) */}
      <div className={cn(
        "absolute top-4 right-4 z-20 transition-opacity duration-200",
        isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      )}>
        {onSelect && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelect(item.id)}
          />
        )}
      </div>

      {/* Center Icon */}
      <div className="mb-4 flex justify-start mt-1">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-300">
          {getTypeIcon()}
        </div>
      </div>

      {/* Title & Subtitle */}
      <div className="mb-4 flex flex-col min-w-0">
        <h3 className="text-md font-bold text-title truncate mb-1.5 group-hover:text-primary transition-colors pr-6">
          {item.name}
        </h3>
        <p className="text-sm text-subtitle-color break-all whitespace-normal line-clamp-2">
          {item.url || item.content || item.file_path?.split('/').pop() || 'Text content'}
        </p>
      </div>

      {/* Type & Size Badges */}
      <div className="flex items-center gap-2 mb-6">
        <Badge variant="outline" className="capitalize px-3 py-0.5 rounded-lg text-[11px] font-bold bg-primary/5 text-primary border-primary/20">
          {item.type}
        </Badge>
        <span className="text-xs text-title font-bold">
          {formatSize(item.file_size)}
        </span>
      </div>

      {/* Footer: Date and Actions */}
      <div className="mt-auto pt-4 border-t border-input-border-color dark:border-white/5 flex items-center justify-between z-20">
        <div className="flex items-center gap-1.5 text-subtitle-color">
          <CalendarDays className="w-4 h-4 text-subtitle-color" />
          <span className="text-sm font-medium text-subtitle-color">
            {item.created_at ? format(new Date(item.created_at), 'MMM d, yyyy') : ''}
          </span>
        </div>

        <div className="flex items-center">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(item);
            }}
            variant="ghost"
            size="icon"
            className="text-edit"
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item);
            }}
            variant="ghost"
            size="icon"
            className="text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default KnowledgeBaseCard
