import { NextResponse, type NextRequest } from "next/server";
import { proxyAuthenticated } from "@/lib/auth/session";

// Mismo criterio que el validador del backend: entero positivo sin ceros a la izquierda
const ID_PATTERN = /^[1-9]\d{0,9}$/;

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    // Se valida antes de reenviar para no armar rutas arbitrarias hacia el backend
    if (!ID_PATTERN.test(id)) {
        return NextResponse.json(
            { status: "error", errors: ["id debe ser un entero positivo"] },
            { status: 400 }
        );
    }

    return proxyAuthenticated(request, `/solicitudes/${id}`);
}
