
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/config/authCookie";

export async function POST() {
    // Obtener el token de la cookie HttpOnly.
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    // Preparar una respuesta que elimine la cookie.
    const createResponse = (
        body: object,
        status: number
    ) => {
        const response = NextResponse.json(body, { status });
        response.cookies.delete(AUTH_COOKIE_NAME);
        return response;
    };

    // Si no hay token, no hay una sesión que revocar.
    if (!token) {
        return createResponse(
            { status: "success", message: "Sesión cerrada." },
            200
        );
    }

    try {
        const backendUrl = process.env.BACKEND_URL;

        if (!backendUrl) {
            throw new Error("La variable BACKEND_URL no está configurada.");
        }

        const response = await fetch(`${backendUrl}/auth/logout`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        const data = await response.json().catch(() => null);

        return createResponse(
            data ?? {
                status: "error",
                message: "No se pudo cerrar la sesión.",
            },
            response.status
        );

    } catch (error) {
        console.error("Error al cerrar la sesión:", error);

        return createResponse(
            {
                status: "error",
                message: "No se pudo conectar con el servidor.",
            },
            502
        );
    }
}
