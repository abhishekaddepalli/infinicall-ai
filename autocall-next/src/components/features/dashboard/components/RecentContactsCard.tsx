'use client'

import { ROUTES } from '@/constants/routes'
import { motion } from 'framer-motion'
import Link from 'next/link'

export function RecentContactsCard({ stats, cardVariants, t }: any) {
  return (
    <motion.div
      variants={cardVariants}
      className="sm:p-6 p-4 rounded-lg border border-input-border-color bg-bg-card flex flex-col h-111.75"
    >
      <div className="flex flex-wrap gap-3 items-center justify-between border-b border-input-border-color pb-4 shrink-0">
          <div className="flex flex-col">
            <h2 className="text-base font-semibold text-title tracking-tight">
              {t('recent_contacts')}
            </h2>
            <span className="text-md font-medium text-subtitle-color mt-0.5">
              {t('desc_recent_contacts', 'Review recently added customer profiles and leads.')}
            </span>
          </div>
          <Link href={ROUTES.CONTACT_HUB} className="text-md font-bold text-subtitle-color cursor-pointer">
            {t('see_all', 'See All')}
          </Link>
        </div>

      <div className="overflow-auto mt-4 flex-1 no-scrollbar space-y-3">
        {(stats.tables.recentContacts || []).map((contact: any, i: number) => {
          const name = contact.first_name ? `${contact.first_name} ${contact.last_name || ''}`.trim() : contact.phone_number
          const initials = contact.first_name 
            ? `${contact.first_name[0] || ''}${contact.last_name?.[0] || ''}`.toUpperCase()
            : contact.phone_number?.slice(1, 3) || 'U'

          return (
            <div key={i} className="flex items-center p-3 bg-subcard rounded-lg border border-input-border-color dark:hover:border-white/10 transition-colors">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10  text-primary text-xs font-bold mr-3 shrink-0">
                {initials}
              </div>
              <div className="flex-1 flex flex-col min-w-0 pr-3">
                <span className="text-md font-bold text-title truncate">
                  {name}
                </span>
                <span className="text-md text-subtitle-color mt-0.5 truncate">
                  {contact.phone_number}
                </span>
              </div>
              <div className="shrink-0">
                <span className="inline-block px-2.5 py-1 rounded-full bg-bg-card text-subtitle-color text-[10px] font-bold tracking-wide">
                  {contact.created_at ? new Date(contact.created_at).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          )
        })}
        {(!stats.tables.recentContacts || stats.tables.recentContacts.length === 0) && (
          <div className="py-6 text-center text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
            {t('no_contacts')}
          </div>
        )}
      </div>
    </motion.div>
  )
}
