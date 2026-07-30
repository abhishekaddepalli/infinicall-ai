import { apiHandler } from '@/utils/apiHandler'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ google_account_id: string }> }) {
  const { google_account_id } = await params
  return apiHandler(request, `/google-calendars/fetch-calendars/${google_account_id}`)
}