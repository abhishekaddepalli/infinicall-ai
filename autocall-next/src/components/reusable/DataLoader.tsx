'use client'

import { cn } from '@/lib/utils';
import { DataLoaderProps } from '@/types/shared';
import { AnimatePresence, motion } from 'framer-motion';

const DataLoader = ({
  className,
  height = 'h-[60vh]',
  text,
  size = 'lg',
  textClassName,
  fullPage,
  variant = 'full',
}: DataLoaderProps) => {
  const app_name = 'AutoCall'

  const containerClasses = cn(
    'flex items-center justify-center w-full',
    fullPage ? 'fixed inset-0 h-screen z-100 overflow-hidden' : height,
    className,
  )

  if (variant === 'spinner') {
    const spinnerSizes = {
      sm: 'w-4 h-4',
      md: 'w-8 h-8',
      lg: 'w-12 h-12',
    }

    return (
      <div className={containerClasses}>
        <div className="flex flex-col items-center justify-center gap-4">
          <div 
            className={cn(
              'animate-spin rounded-full border-b-4 border-primary', 
              spinnerSizes[size]
            )} 
          />
          {text && (
            <p
              className={cn(
                'text-muted-foreground font-bold uppercase tracking-wider animate-pulse',
                size === 'sm' ? 'text-xs' : 'text-sm',
                textClassName,
              )}
            >
              {text}
            </p>
          )}
        </div>
      </div>
    )
  }

  const textScale = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl sm:text-5xl',
  }

  const barScale = {
    sm: 'w-24',
    md: 'w-32',
    lg: 'w-40',
  }

  return (
    <div className={containerClasses}>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-8"
        >
          <div className="flex flex-col items-center gap-1">
            <motion.h1
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
              className={cn(
                'font-black tracking-tight text-foreground text-center mb-10',
                textScale[size],
                'font-outfit',
              )}
            >
              {text || app_name}
              <span className="text-primary italic">.</span>
            </motion.h1>
          </div>

          <div
            className={cn(
              'relative h-1.5 bg-muted rounded-full overflow-hidden border border-black/5 dark:border-white/5',
              barScale[size],
            )}
          >
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute top-0 left-0 h-full bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]"
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default DataLoader
