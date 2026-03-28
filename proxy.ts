import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase-middleware";

export async function proxy(request: NextRequest) {
  console.log("proxy pathname:", request.nextUrl.pathname);
  return updateSession(request);
}

export const config = {
  matcher: ["/admin/:path*"],
};