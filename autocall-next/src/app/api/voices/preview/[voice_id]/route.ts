import { apiHandler } from '@/utils/apiHandler'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ voice_id: string }> }) {
  const { voice_id } = await params;
  return apiHandler(request, `/voices/preview/${voice_id}`);
}
