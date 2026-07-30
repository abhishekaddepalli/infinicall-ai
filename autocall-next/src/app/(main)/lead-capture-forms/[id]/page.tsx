import LeadCaptureFormDetail from '@/components/features/lead-capture-forms/LeadCaptureFormDetail'

export default async function EditLeadCaptureFormRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return <LeadCaptureFormDetail id={id} />
}
