import { NextRequest } from "next/server";
import { apiHandler } from "@/utils/apiHandler";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return apiHandler(request, `/sms-agents/${id}/update`);
}
