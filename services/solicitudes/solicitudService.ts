import type { SolicitudDetalle } from "@/types/solicitud";

type ErrorResponse = {
    status?: "error";
    message?: string;
    errors?: string[];
};

// Error con el código HTTP para que la vista distinga 401 / 403 / 404
export class SolicitudServiceError extends Error {
    constructor(message: string, public readonly status: number) {
        super(message);
        this.name = "SolicitudServiceError";
    }
}

export async function getSolicitudDetalle(id: string): Promise<SolicitudDetalle> {
    const response = await fetch(`/api/solicitudes/${encodeURIComponent(id)}`, {
        method: "GET",
        cache: "no-store",
    });

    const data: (SolicitudDetalle & ErrorResponse) | ErrorResponse | null = await response
        .json()
        .catch(() => null);

    if (!response.ok || !data || !("id_solicitud" in data)) {
        const message = data?.errors?.join(". ")
            || data?.message
            || "No se pudo obtener la solicitud.";

        throw new SolicitudServiceError(message, response.ok ? 502 : response.status);
    }

    return data;
}
