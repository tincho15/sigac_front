import type { NextRequest } from "next/server";
import { proxyAuthenticated } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
    return proxyAuthenticated(request, "/auth/2fa/status");
}
