
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import {
    getSolicitudes,
    SessionExpiredError,
    type Solicitud,
} from "@/services/solicitudes/solicitudService";

type Status = "loading" | "success" | "error";

const PAGE_SIZE = 10;

export default function useSolicitudes() {
    const { logout } = useAuth();

    const [status, setStatus] = useState<Status>("loading");
    const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    // Cada reintento incrementa el contador y vuelve a ejecutar la consulta.
    const [attempt, setAttempt] = useState(0);

    // Evita repetir consultas cuando cambia la referencia de logout.
    const logoutRef = useRef(logout);

    useEffect(() => {
        logoutRef.current = logout;
    }, [logout]);

    useEffect(() => {
        let active = true;

        setStatus("loading");

        getSolicitudes(page, PAGE_SIZE)
            .then((data) => {
                if (!active) return;

                setSolicitudes(data.solicitudes);
                setTotal(data.total);
                setTotalPages(data.totalPages);
                setStatus("success");
            })
            .catch((error) => {
                if (!active) return;

                if (error instanceof SessionExpiredError) {
                    void logoutRef.current();
                    return;
                }

                setStatus("error");
            });

        return () => {
            active = false;
        };
    }, [page, attempt]);

    const retry = useCallback(() => {
        setStatus("loading");
        setAttempt((current) => current + 1);
    }, []);

    const nextPage = useCallback(() => {
        setPage((current) =>
            Math.min(current + 1, totalPages)
        );
    }, [totalPages]);

    const previousPage = useCallback(() => {
        setPage((current) => Math.max(current - 1, 1));
    }, []);

    return {
        status,
        solicitudes,
        total,
        page,
        totalPages,
        pageSize: PAGE_SIZE,
        nextPage,
        previousPage,
        retry,
    };
}
