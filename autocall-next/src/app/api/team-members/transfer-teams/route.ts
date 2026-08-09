import { NextRequest } from 'next/server';
import { apiHandler } from '@/utils/apiHandler';

export async function GET(request: NextRequest) {
  return apiHandler(request, '/team-members/transfer-teams');
}
