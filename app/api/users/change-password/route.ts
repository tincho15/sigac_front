
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/config/authCookie";

export async function POST(request: Request) {
    try {
        // Obtener la cookie de autenticación
        const cookieStore = await cookies();
        const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

        if (!token) {
            return NextResponse.json(
                { status: "error", message: "No hay una sesión activa." },
                { status: 401 }
            );
        }

        const backendUrl = process.env.BACKEND_URL;

        if (!backendUrl) {
            throw new Error("La variable BACKEND_URL no está configurada.");
        }

        const body = await request.json();

        // Enviar la solicitud al backend
        const response = await fetch(
            `${backendUrl}/users/change-password`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
                cache: "no-store",
            }
        );

        const data = await response.json().catch(() => null);

        // Si el backend rechaza el token, limpiar la cookie
        if (response.status === 401) {
            const nextResponse = NextResponse.json(
                data ?? {
                    status: "error",
                    message: "La sesión no es válida o ha expirado.",
                },
                { status: 401 }
            );

            nextResponse.cookies.delete(AUTH_COOKIE_NAME);

            return nextResponse;
        }

        return NextResponse.json(
            data ?? {
                status: "error",
                message: "El servidor devolvió una respuesta inesperada.",
            },
            { status: response.status }
        );

    } catch (error) {
        console.error("Error al cambiar la contraseña:", error);

        return NextResponse.json(
            { status: "error", message: "No se pudo conectar con el servidor." },
            { status: 502 }
        );
    }
}
