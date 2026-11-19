import { NextResponse } from "next/server";
import {
    AUTH_COOKIE_NAME,
    AUTH_COOKIE_OPTIONS,
} from "@/config/authCookie";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const backendUrl = process.env.BACKEND_URL;

        if (!backendUrl) {
            throw new Error("La variable BACKEND_URL no está configurada.");
        }

        const response = await fetch(`${backendUrl}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
            cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, {
                status: response.status,
            });
        }

        if (
            data?.status !== "success" ||
            !data?.token ||
            !data?.user
        ) {
            return NextResponse.json(
                { message: "El servidor devolvió una respuesta inesperada." },
                { status: 502 }
            );
        }

        const { token, ...userData } = data;

        const nextResponse = NextResponse.json(userData, {
            status: response.status,
        });

        nextResponse.cookies.set(
            AUTH_COOKIE_NAME,
            token,
            AUTH_COOKIE_OPTIONS
        );

        return nextResponse;

    } catch (error) {
        console.error("Error al comunicarse con el Gateway:", error);

        return NextResponse.json(
            { message: "No se pudo conectar con el servidor." },
            { status: 502 }
        );
    }
}
