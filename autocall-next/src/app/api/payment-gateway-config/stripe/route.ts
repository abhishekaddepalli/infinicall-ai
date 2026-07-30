import { apiHandler } from "@/utils/apiHandler";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return apiHandler(request, `/payment-gateway-config/stripe`);
}

export async function PUT(request: NextRequest) {
  return apiHandler(request, `/payment-gateway-config/stripe`);
}

export async function PATCH(request: NextRequest) {
  return apiHandler(request, `/payment-gateway-config/stripe`);
}