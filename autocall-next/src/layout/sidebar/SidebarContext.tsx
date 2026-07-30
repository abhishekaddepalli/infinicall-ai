'use client'

import { SidebarContextType } from '@/types/layout'
import { createContext, useContext, useState } from 'react'

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  return (
    <SidebarContext.Provider value={{ openMenuId, setOpenMenuId }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebarContext = () => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebarContext must be used within a SidebarProvider')
  }
  return context
}
