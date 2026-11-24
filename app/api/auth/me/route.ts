import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/config/authCookie";

export async function GET() {
    // Obtener la cookie de autenticación.
    // Se deja fuera del try/catch para que Next.js
    // pueda gestionar correctamente el prerenderizado.
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
        return NextResponse.json(
            { status: "error", message: "No hay una sesión activa." },
            { status: 401 }
        );
    }

    try {
        const backendUrl = process.env.BACKEND_URL;

        if (!backendUrl) {
            throw new Error("La variable BACKEND_URL no está configurada.");
        }

        // Consultar los datos del usuario autenticado.
        const response = await fetch(`${backendUrl}/auth/me`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
        });

        const data = await response.json().catch(() => null);

        // Si el backend rechaza el token, limpiar la cookie.
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

        if (!response.ok) {
            return NextResponse.json(
                data ?? {
                    status: "error",
                    message: "No se pudieron recuperar los datos del usuario.",
                },
                { status: response.status }
            );
        }

        if (data?.status !== "success" || !data?.user) {
            return NextResponse.json(
                {
                    status: "error",
                    message: "El servidor devolvió una respuesta inesperada.",
                },
                { status: 502 }
            );
        }

        return NextResponse.json(data, {
            status: response.status,
            headers: {
                "Cache-Control": "no-store",
            },
        });
    } catch (error) {
        console.error("Error al recuperar la sesión:", error);

        return NextResponse.json(
            { status: "error", message: "No se pudo conectar con el servidor." },
            { status: 502 }
        );
    }
}
