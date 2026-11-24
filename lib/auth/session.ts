// Utilidades de sesion para los Route Handlers (solo servidor).
// Los JWT se guardan en cookies httpOnly (ver config/authCookie.ts): el JavaScript
// del navegador nunca los ve, lo que evita que un XSS pueda robarlos.
import { NextResponse, type NextRequest } from "next/server";
import {
    AUTH_COOKIE_NAME,
    AUTH_COOKIE_OPTIONS,
    TWO_FACTOR_COOKIE_NAME,
    TWO_FACTOR_COOKIE_OPTIONS,
} from "@/config/authCookie";

export function getBackendUrl() {
    const backendUrl = process.env.BACKEND_URL;

    if (!backendUrl) {
        throw new Error("La variable BACKEND_URL no está configurada.");
    }

    return backendUrl;
}

export function setSessionCookie(response: NextResponse, token: string) {
    response.cookies.set(AUTH_COOKIE_NAME, token, AUTH_COOKIE_OPTIONS);
}

export function setTwoFactorCookie(response: NextResponse, tempToken: string) {
    response.cookies.set(TWO_FACTOR_COOKIE_NAME, tempToken, TWO_FACTOR_COOKIE_OPTIONS);
}

export function clearCookie(response: NextResponse, name: string) {
    response.cookies.set(name, "", { ...AUTH_COOKIE_OPTIONS, maxAge: 0 });
}

type BackendRequest = {
    method?: "GET" | "POST";
    body?: unknown;
    token?: string;
};

export async function callBackend(path: string, { method = "GET", body, token }: BackendRequest = {}) {
    const response = await fetch(`${getBackendUrl()}${path}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));

    return { status: response.status, data };
}

export function gatewayUnavailable(error: unknown) {
    console.error("Error al comunicarse con el Gateway:", error);

    return NextResponse.json(
        { message: "No se pudo conectar con el servidor." },
        { status: 502 }
    );
}

// Reenvia una solicitud autenticada al backend usando el JWT de la cookie de sesion
export async function proxyAuthenticated(
    request: NextRequest,
    path: string,
    method: "GET" | "POST" = "GET"
) {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
        return NextResponse.json(
            { status: "error", message: "No hay una sesión activa." },
            { status: 401 }
        );
    }

    try {
        const body = method === "POST" ? await request.json().catch(() => ({})) : undefined;
        const { status, data } = await callBackend(path, { method, body, token });

        const response = NextResponse.json(data, {
            status,
            headers: { "Cache-Control": "no-store" },
        });

        // Igual que /api/auth/me: si el backend rechaza el token, se limpia la cookie
        if (status === 401) {
            clearCookie(response, AUTH_COOKIE_NAME);
        }

        return response;
    } catch (error) {
        return gatewayUnavailable(error);
    }
}
