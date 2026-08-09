'use client'

import WhatsAppTemplateForm from '@/components/features/whatsapp-templates/WhatsAppTemplateForm'
import { useParams } from 'next/navigation'

export default function EditPage() {
  const params = useParams()
  const id = params.id as string

  return <WhatsAppTemplateForm templateId={id} />
}
