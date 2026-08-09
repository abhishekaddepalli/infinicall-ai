import { apiHandler } from '@/utils/apiHandler'
import { NextRequest } from 'next/server'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string; eventId: string }> }) {
  const { id, eventId } = await params
  return apiHandler(request, `/google-calendars/${id}/events/${eventId}`)
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string; eventId: string }> }) {
  const { id, eventId } = await params
  return apiHandler(request, `/google-calendars/${id}/events/${eventId}`)
}
