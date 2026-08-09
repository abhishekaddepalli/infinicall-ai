import { FlowBuilderEditor } from "@/components/features/workflow-builder/FlowBuilderEditor";

export default async function FlowEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return <FlowBuilderEditor id={id} />
}
