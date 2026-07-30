import { apiHandler } from "@/utils/apiHandler";
import { NextRequest } from "next/server";

export async function PATCH(request: NextRequest) {
  return apiHandler(request, `/payment-gateway-config/stripe/toggle`);
}
