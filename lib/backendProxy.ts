import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/config/authCookie";

type ProxyOptions = {
    method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
    body?: unknown;
};

/**
 * Reenvía una solicitud al backend adjuntando el token de la sesión
 * (guardado en una cookie httpOnly) y devuelve la respuesta tal cual.
 */
export async function proxyToBackend(path: string, { method, body }: ProxyOptions) {
    try {
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

        const response = await fetch(`${backendUrl}${path}`, {
            method,
            headers: {
                Authorization: `Bearer ${token}`,
                ...(body !== undefined && { "Content-Type": "application/json" }),
            },
            body: body !== undefined ? JSON.stringify(body) : undefined,
            cache: "no-store",
        });

        const data = await response.json().catch(() => null);

        const nextResponse = NextResponse.json(
            data ?? { status: "error", message: "El servidor devolvió una respuesta inesperada." },
            {
                status: response.status,
                headers: { "Cache-Control": "no-store" },
            }
        );

        // Si el backend rechaza el token, limpiar la cookie
        if (response.status === 401) {
            nextResponse.cookies.delete(AUTH_COOKIE_NAME);
        }

        return nextResponse;
    } catch (error) {
        console.error("Error al comunicarse con el Gateway:", error);

        return NextResponse.json(
            { status: "error", message: "No se pudo conectar con el servidor." },
            { status: 502 }
        );
    }
}
