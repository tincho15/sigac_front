import { NextResponse, type NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/backendProxy";

// Actualizar datos de un usuario (nombre, email, id_rol, activo)
export async function PATCH(
    request: NextRequest,
    ctx: RouteContext<"/api/users/[id]">
) {
    const { id } = await ctx.params;
    const body = await request.json().catch(() => null);

    if (body === null) {
        return NextResponse.json(
            { status: "error", message: "El cuerpo de la solicitud no es válido." },
            { status: 400 }
        );
    }

    return proxyToBackend(`/users/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body,
    });
}
