import { RouteParams } from '@/types/waba'
import { apiHandler } from '@/utils/apiHandler'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  return apiHandler(request, `/whatsapp-template/${id}`)
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  return apiHandler(request, `/whatsapp-template/${id}`)
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
  return apiHandler(request, `/whatsapp-template/${id}`)
}
