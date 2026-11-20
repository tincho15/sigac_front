import { NextResponse, type NextRequest } from "next/server";
import { TWO_FACTOR_COOKIE_NAME as TWO_FACTOR_COOKIE } from "@/config/authCookie";
import {
    callBackend,
    clearCookie,
    gatewayUnavailable,
    setSessionCookie,
} from "@/lib/auth/session";

// Segundo paso del login: canjea la cookie intermedia + codigo de 6 digitos por la sesion
export async function POST(request: NextRequest) {
    const tempToken = request.cookies.get(TWO_FACTOR_COOKIE)?.value;

    if (!tempToken) {
        return NextResponse.json(
            { message: "La verificación expiró. Iniciá sesión nuevamente." },
            { status: 401 }
        );
    }

    try {
        const { code } = await request.json().catch(() => ({}));
        const { status, data } = await callBackend("/auth/2fa/login", {
            method: "POST",
            body: { tempToken, code },
        });

        // Misma forma de respuesta que /api/auth/login: { status, user } sin el token
        if (status === 200 && data?.status === "success" && data?.token && data?.user) {
            const response = NextResponse.json({ status: "success", user: data.user });
            setSessionCookie(response, data.token);
            clearCookie(response, TWO_FACTOR_COOKIE);
            return response;
        }

        const response = NextResponse.json(data, { status });

        // Demasiados intentos: el token intermedio ya no sirve
        if (status === 429) {
            clearCookie(response, TWO_FACTOR_COOKIE);
        }

        return response;
    } catch (error) {
        return gatewayUnavailable(error);
    }
}
