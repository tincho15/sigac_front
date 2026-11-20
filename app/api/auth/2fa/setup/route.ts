import type { NextRequest } from "next/server";
import { proxyAuthenticated } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
    return proxyAuthenticated(request, "/auth/2fa/setup", "POST");
}
