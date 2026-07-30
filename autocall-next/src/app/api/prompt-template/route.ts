import { apiHandler } from '@/utils/apiHandler'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const isSelf = searchParams.get('self') === 'true'
  const path = isSelf ? '/template/self' : '/template/all'
  return apiHandler(request, path)
}

export async function POST(request: NextRequest) {
  return apiHandler(request, '/template/create')
}
