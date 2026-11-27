import type { NextRequest } from "next/server";
import { proxyAuthenticated } from "@/lib/auth/session";
import { ROLES } from "@/config/roles";

// Listado de solicitudes: el backend devuelve todas al administrador
// y solo las asignadas al funcionario autenticado
export async function GET(request: NextRequest) {
    return proxyAuthenticated(request, "/solicitudes");
}

// Alta de una solicitud con sus expedientes: solo el administrador (CU-06)
export async function POST(request: NextRequest) {
    return proxyAuthenticated(request, "/solicitudes", "POST", {
        allowedRoles: [ROLES.ADMINISTRADOR],
    });
}
