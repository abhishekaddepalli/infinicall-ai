import { apiHandler } from "@/utils/apiHandler";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  return apiHandler(request, `/system-email-templates/${resolvedParams.slug}`);
}
