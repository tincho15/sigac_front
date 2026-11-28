import type { SolicitudDetalle } from "@/types/solicitud";

export type Solicitud = {
    id_solicitud: number;
    fecha: string;
    origen: string;
    tipo: {
        id_tipo: number;
        nombre: string;
    };
    estado: {
        id_estado: number;
        nombre: string;
    };
    cantidad_expedientes: number;
    // Funcionario con la asignación vigente (null si está pendiente de asignación)
    asignado: {
        id_usuario: number;
        nombre: string;
    } | null;
};

export type SolicitudesResponse = {
    status: "success";
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    solicitudes: Solicitud[];
};

type ErrorResponse = {
    status?: "error";
    message?: string;
    errors?: string[];
};

// El backend rechazó el token: la sesión venció o fue revocada
export class SessionExpiredError extends Error {
    constructor() {
        super("La sesión no es válida o ha expirado.");
        this.name = "SessionExpiredError";
    }
}

// Error con el código HTTP para que la vista distinga 401 / 403 / 404
export class SolicitudServiceError extends Error {
    constructor(message: string, public readonly status: number) {
        super(message);
        this.name = "SolicitudServiceError";
    }
}

export async function getSolicitudes(
    page = 1,
    limit = 10
): Promise<SolicitudesResponse> {
    const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
    });

    const response = await fetch(`/api/solicitudes?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
    });

    if (response.status === 401) {
        throw new SessionExpiredError();
    }

    const data: SolicitudesResponse | null = await response
        .json()
        .catch(() => null);

    if (
        !response.ok ||
        data?.status !== "success" ||
        !Array.isArray(data.solicitudes)
    ) {
        throw new Error(
            "No se pudieron cargar las solicitudes."
        );
    }

    return data;
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
