import { NextResponse } from "next/server";

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

        return NextResponse.json(data, {
            status: response.status,
        });
    } catch (error) {
        console.error("Error al comunicarse con el Gateway:", error);

        return NextResponse.json(
            { message: "No se pudo conectar con el servidor." },
            { status: 502 }
        );
    }
}