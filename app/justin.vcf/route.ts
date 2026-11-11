import { NextResponse } from "next/server";
import { justinVcfBytes, justinVcfHeaders } from "@/lib/justin-vcf";

export const runtime = "nodejs";

export function GET() {
  return new NextResponse(justinVcfBytes(), {
    status: 200,
    headers: {
      ...justinVcfHeaders("inline"),
      "Cache-Control": "public, max-age=86400",
    },
  });
}
