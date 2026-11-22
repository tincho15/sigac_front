import { NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/backendProxy";

// Listar usuarios
export async function GET() {
    return proxyToBackend("/users", { method: "GET" });
}

// Crear usuario
export async function POST(request: Request) {
    const body = await request.json().catch(() => null);

    if (body === null) {
        return NextResponse.json(
            { status: "error", message: "El cuerpo de la solicitud no es válido." },
            { status: 400 }
        );
    }

    return proxyToBackend("/users", { method: "POST", body });
}
