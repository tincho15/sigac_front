
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

// El backend rechazó el token: la sesión venció o fue revocada
export class SessionExpiredError extends Error {
    constructor() {
        super("La sesión no es válida o ha expirado.");
        this.name = "SessionExpiredError";
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

// Expediente indicado por sus datos. El backend reutiliza el expediente si ya
// existe uno con el mismo IUE (y datos coincidentes) o lo registra si es nuevo.
export type NuevoExpediente = {
    iue?: string;
    numero?: string;
    ficha?: string;
    nro_archivo?: string;
    id_juzgado: number;
    observaciones?: string;
};

export type NuevaSolicitud = {
    id_tipo: number;
    origen: string;
    observaciones?: string;
    expedientes: NuevoExpediente[];
};

export type SolicitudCreada = {
    id_solicitud: number;
    fecha: string;
    origen: string;
    observaciones: string | null;
    tipo: { id_tipo: number; nombre: string };
    estado: { id_estado: number; nombre: string };
    pendiente_asignacion: boolean;
};

type ErrorResponse = {
    message?: string;
    error?: string;
    errors?: string[];
};

export async function createSolicitud(
    solicitud: NuevaSolicitud
): Promise<SolicitudCreada> {
    const response = await fetch("/api/solicitudes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(solicitud),
    });

    if (response.status === 401) {
        throw new SessionExpiredError();
    }

    const data: (SolicitudCreada & ErrorResponse) | null = await response
        .json()
        .catch(() => null);

    if (!response.ok || !data) {
        // El backend devuelve errors[] (validación), message o error (permisos)
        const errorMessage = data?.errors?.join(". ")
            || data?.message
            || data?.error
            || "No se pudo registrar la solicitud.";

        throw new Error(errorMessage);
    }

    return data;
}
