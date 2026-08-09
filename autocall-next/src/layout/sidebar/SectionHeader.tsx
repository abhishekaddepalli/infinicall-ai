import { cn } from '@/lib/utils'
import { ExtendedSectionHeaderProps } from '@/types/layout'

import { useTranslation } from 'react-i18next'

const SectionHeader = ({ label, isCollapsed }: ExtendedSectionHeaderProps) => {
  const { t } = useTranslation()
  return (
    <div className={cn(
      "px-2 pt-2 pb-1 text-sm font-bold uppercase tracking-wider text-title-color dark:text-white/60 transition-all duration-300",
      isCollapsed && "px-0 py-0 opacity-0 h-0 overflow-hidden mt-0"
    )}>
      {label.includes('.') ? t(label) : t(`${label.toLowerCase().replace(/ /g, '_')}`, { defaultValue: label })}
    </div>
  )
}

export default SectionHeader
