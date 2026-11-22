import { NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/backendProxy";

// Reiniciar la contraseña de un usuario (devuelve una contraseña temporal)
export async function POST(request: Request) {
    const body = await request.json().catch(() => null);

    if (body === null) {
        return NextResponse.json(
            { status: "error", message: "El cuerpo de la solicitud no es válido." },
            { status: 400 }
        );
    }

    return proxyToBackend("/users/reset-password", { method: "POST", body });
}
