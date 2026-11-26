import type { NextRequest } from "next/server";
import { proxyAuthenticated } from "@/lib/auth/session";

// Listado de solicitudes: el backend devuelve todas al administrador
// y solo las asignadas al funcionario autenticado
export async function GET(request: NextRequest) {
    return proxyAuthenticated(request, "/solicitudes");
}
