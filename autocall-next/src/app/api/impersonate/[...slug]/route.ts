import { apiHandler } from '@/utils/apiHandler'
import { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const resolvedParams = await params;
  const path = resolvedParams.slug.join('/')
  return apiHandler(request, `/impersonate/${path}`)
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const resolvedParams = await params;
  const path = resolvedParams.slug.join('/')
  return apiHandler(request, `/impersonate/${path}`)
}
