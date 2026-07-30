import { apiHandler } from "@/utils/apiHandler";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return apiHandler(request, "/landing-page");
}

export async function PUT(request: NextRequest) {
  return apiHandler(request, "/landing-page");
}
