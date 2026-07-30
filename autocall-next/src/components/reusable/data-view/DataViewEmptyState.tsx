import { DataViewEmptyStateProps } from "@/types/shared";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function DataViewEmptyState({ icon, title, description, actionLabel, onAction }: DataViewEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center bg-bg-card rounded-lg border border-dashed border-input-border-color">
      {icon && (
        <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-bold text-title mb-2">{title}</h3>
      <p className="text-subtitle-color mb-6 max-w-sm text-md">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="bg-primary hover:bg-primary/90 text-white font-bold h-10 p-padding! rounded-lg flex items-center justify-center gap-2">
          <Plus className="h-4 w-4" strokeWidth={3} />
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
