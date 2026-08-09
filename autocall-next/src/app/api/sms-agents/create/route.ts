import { NextRequest } from "next/server";
import { apiHandler } from "@/utils/apiHandler";

export async function POST(request: NextRequest) {
  return apiHandler(request, "/sms-agents/create");
}
