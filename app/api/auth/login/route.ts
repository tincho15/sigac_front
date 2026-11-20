import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, TWO_FACTOR_COOKIE_NAME } from "@/config/authCookie";
import {
    callBackend,
    clearCookie,
    gatewayUnavailable,
    setSessionCookie,
    setTwoFactorCookie,
} from "@/lib/auth/session";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { status, data } = await callBackend("/auth/login", {
            method: "POST",
            body,
        });

        if (status < 200 || status >= 300) {
            return NextResponse.json(data, { status });
        }

        // Usuario con 2FA: el token intermedio queda en una cookie httpOnly
        // y el navegador solo se entera de que tiene que pedir el codigo
        if (data?.status === "2fa_required" && data?.tempToken) {
            const response = NextResponse.json({ status: "2fa_required" });
            setTwoFactorCookie(response, data.tempToken);
            clearCookie(response, AUTH_COOKIE_NAME);
            return response;
        }

        if (data?.status !== "success" || !data?.token || !data?.user) {
            return NextResponse.json(
                { message: "El servidor devolvió una respuesta inesperada." },
                { status: 502 }
            );
        }

        // El JWT queda en la cookie de sesion; al navegador solo le llegan los datos del usuario
        const { token, ...userData } = data;

        const response = NextResponse.json(userData, { status });
        setSessionCookie(response, token);
        clearCookie(response, TWO_FACTOR_COOKIE_NAME);

        return response;
    } catch (error) {
        return gatewayUnavailable(error);
    }
}
