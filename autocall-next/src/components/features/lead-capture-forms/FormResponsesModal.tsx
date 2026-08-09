'use client'

import Spinner from '@/components/reusable/Spinner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useGetFormResponsesQuery } from '@/redux/api/formApi';
import { FormResponsesModalProps } from '@/types/form';
import { FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function FormResponsesModal({ isOpen, onClose, formId }: FormResponsesModalProps) {
  const { t } = useTranslation()
  const { data: response, isLoading } = useGetFormResponsesQuery(formId as string, {
    skip: !formId || !isOpen,
  })

  const responses = response?.data || []

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[85vh] p-0 border-none rounded-modal-radius! bg-white dark:bg-bg-card flex flex-col overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-input-border-color shrink-0">
          <DialogTitle className="text-xl font-bold text-title dark:text-white">
            {t('form_responses', 'Form Responses')}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto bg-slate-50/50 dark:bg-transparent p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-subtitle-color">
              <Spinner />
              <p>{t('loading_responses', 'Loading responses...')}</p>
            </div>
          ) : responses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-title dark:text-white mb-2">
                {t('no_responses_title', 'No Responses Yet')}
              </h3>
              <p className="text-md text-subtitle-color max-w-sm">
                {t('no_responses_subtitle', 'This form hasn\'t received any submissions yet. Once users submit the form, their responses will appear here.')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {responses.map((sub, index) => (
                <div key={sub._id || index} className="bg-white dark:bg-bg-card p-5 rounded-radius border border-input-border-color shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20">
                  <div className="text-sm text-subtitle-color mb-4 flex items-center justify-between border-b border-input-border-color pb-3">
                    <span className="font-bold text-title dark:text-white">Response {responses.length - index}</span>
                    <span className="font-medium">{new Date(sub.created_at).toLocaleString()}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(sub.responses || {}).map(([key, value]) => (
                      <div key={key} className="space-y-1.5 flex flex-col bg-slate-50 dark:bg-white/5 p-3 rounded-lg border border-input-border-color">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">{key.replace(/_/g, ' ')}</span>
                        <div className="text-md font-bold text-title break-all">{String(value)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
