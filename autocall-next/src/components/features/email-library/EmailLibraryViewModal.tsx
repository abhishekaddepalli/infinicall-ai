import Spinner from '@/components/reusable/Spinner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useGetEmailLibraryTemplateByIdQuery } from '@/redux/api/emailLibraryApi';
import { EmailLibraryViewModalProps, EmailTemplate } from '@/types/email-library';
import DOMPurify from 'isomorphic-dompurify';
import { useTranslation } from 'react-i18next';

export default function EmailLibraryViewModal({ isOpen, onClose, templateId }: EmailLibraryViewModalProps) {
  const { t } = useTranslation()

  const { data: response, isLoading } = useGetEmailLibraryTemplateByIdQuery(
    templateId || '',
    { skip: !templateId || !isOpen }
  )

  const template = response?.data as EmailTemplate | undefined

  const decodeHtml = (html: string) => {
    if (!html) return '';
    return html
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px]! max-w-[calc(100%-2rem)]! max-h-[90vh] overflow-y-auto no-scrollbar bg-bg-card border border-input-border-color p-0 gap-0!">
        <DialogHeader className="sm:px-6 px-4 py-4 border-b border-input-border-color mb-0! text-left rtl:text-right">
          <DialogTitle className="text-xl font-bold text-title">
            {t('view_email_template', 'View Email Template')}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        ) : template ? (
          <div className="flex flex-col h-full">
            <div className="sm:p-6 p-4 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <h4 className="text-base font-semibold text-subtitle-color mb-1">{t('name', 'Name')}</h4>
                  <p className="text-md font-medium text-title break-all whitespace-normal line-clamp-2">{template.name}</p>
                </div>
              </div>

              <div>
                <h4 className="text-base font-semibold text-subtitle-color mb-1">{t('subject', 'Subject')}</h4>
                <p className="text-md font-medium text-title break-all whitespace-normal line-clamp-4">{template.subject}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-subtitle-color mb-2">{t('content', 'Email Content')}</h4>
                <div
                  className="p-4 rounded-lg bg-bg-body border border-input-border-color max-w-none break-words whitespace-normal
                  [&_h1]:text-3xl [&_h1]:font-extrabold [&_h1]:text-title [&_h1]:mb-4 [&_h1]:mt-6
                  [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-title [&_h2]:mb-3 [&_h2]:mt-5
                  [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-title [&_h3]:mb-3 [&_h3]:mt-4
                  [&_p]:mb-4 [&_p]:text-subtitle-color [&_p]:leading-relaxed
                  [&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline
                  [&_strong]:text-title [&_strong]:font-bold
                  [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul_li]:mb-1
                  [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol_li]:mb-1
                  [&_blockquote]:border-l-4 [&_blockquote]:border-primary/50 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4 [&_blockquote]:text-subtitle-color/80"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(decodeHtml(template.body)) }}
                />
              </div>
            </div>

            <div className="sm:p-6 p-4 pt-4 border-t border-input-border-color flex justify-end gap-3 bg-bg-card mt-auto rounded-b-lg">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="rounded-lg font-semibold text-md h-11 p-padding! shadow-none bg-subcard border-input-border-color text-title"
              >
                {t('close', 'Close')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-64 text-subtitle-color">
            {t('template_not_found', 'Template not found')}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
