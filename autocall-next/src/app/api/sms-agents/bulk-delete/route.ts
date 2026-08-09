import { NextRequest } from "next/server";
import { apiHandler } from "@/utils/apiHandler";

export async function DELETE(request: NextRequest) {
  return apiHandler(request, "/sms-agents/bulk-delete");
}
