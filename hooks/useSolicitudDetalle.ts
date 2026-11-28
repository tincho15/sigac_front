import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import {
    getSolicitudDetalle,
    SolicitudServiceError,
} from "@/services/solicitudes/solicitudService";
import type { SolicitudDetalle } from "@/types/solicitud";

export type SolicitudDetalleStatus =
    | "loading"
    | "success"
    | "invalid"
    | "not-found"
    | "forbidden"
    | "error";

export default function useSolicitudDetalle(id: string) {
    const { logout } = useAuth();
    const [solicitud, setSolicitud] = useState<SolicitudDetalle | null>(null);
    const [status, setStatus] = useState<SolicitudDetalleStatus>("loading");
    const [error, setError] = useState("");

    const load = useCallback(
        async (signal?: { cancelled: boolean }) => {
            setStatus("loading");
            setError("");

            try {
                const data = await getSolicitudDetalle(id);
                if (signal?.cancelled) return;

                setSolicitud(data);
                setStatus("success");
            } catch (err) {
                if (signal?.cancelled) return;

                const httpStatus = err instanceof SolicitudServiceError ? err.status : 0;
                const message = err instanceof Error ? err.message : "No se pudo obtener la solicitud.";

                setSolicitud(null);
                setError(message);

                // Sesión rechazada: el AuthContext pasa a "unauthenticated"
                // y el layout privado redirige a /login
                if (httpStatus === 401) {
                    void logout();
                    return;
                }

                setStatus(
                    httpStatus === 400 ? "invalid"
                        : httpStatus === 403 ? "forbidden"
                            : httpStatus === 404 ? "not-found"
                                : "error"
                );
            }
        },
        [id, logout]
    );

    useEffect(() => {
        const signal = { cancelled: false };
        // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial de datos
        void load(signal);

        return () => {
            signal.cancelled = true;
        };
    }, [load]);

    const reload = useCallback(() => load(), [load]);

    return { solicitud, status, error, reload };
}
