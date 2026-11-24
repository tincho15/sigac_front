import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";

type Status = "loading" | "disabled" | "enrolling" | "enabled" | "unauthenticated" | "error";

type Enrollment = {
    qrCode: string;
    secret: string;
};

type ApiResult = {
    ok: boolean;
    status: number;
    data: Record<string, unknown> | null;
};

async function request(path: string, body?: unknown): Promise<ApiResult> {
    const response = await fetch(path, {
        method: body === undefined ? "GET" : "POST",
        headers: { "Content-Type": "application/json" },
        body: body === undefined ? undefined : JSON.stringify(body),
        cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    return { ok: response.ok, status: response.status, data };
}

function errorMessage(result: ApiResult, fallback: string) {
    const { data } = result;

    if (Array.isArray(data?.errors) && data.errors.length > 0) {
        return String(data.errors[0]);
    }

    return typeof data?.message === "string" ? data.message : fallback;
}

export default function useTwoFactorSettings() {
    // refreshUser actualiza debe_activar_2fa en el AuthContext: el layout privado
    // usa ese dato para liberar el acceso (o volver a exigir la activación)
    const { logout, refreshUser } = useAuth();
    const [status, setStatus] = useState<Status>("loading");
    const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Sesión rechazada por el backend: el AuthContext pasa a "unauthenticated"
    // y el layout privado redirige a /login
    useEffect(() => {
        if (status === "unauthenticated") {
            logout();
        }
    }, [status, logout]);

    // Ejecuta una accion contra el backend manejando carga, errores y sesion vencida
    const run = useCallback(
        async (action: () => Promise<ApiResult>, fallback: string) => {
            setBusy(true);
            setError("");
            setSuccess("");

            try {
                const result = await action();

                if (result.status === 401) {
                    setStatus("unauthenticated");
                    return null;
                }

                if (!result.ok) {
                    setError(errorMessage(result, fallback));
                    return null;
                }

                return result.data;
            } catch {
                setError("No se pudo conectar con el servidor.");
                return null;
            } finally {
                setBusy(false);
            }
        },
        []
    );

    useEffect(() => {
        let active = true;

        request("/api/auth/2fa/status")
            .then((result) => {
                if (!active) return;

                if (result.status === 401) {
                    setStatus("unauthenticated");
                } else if (!result.ok) {
                    setStatus("error");
                } else {
                    setStatus(result.data?.enabled ? "enabled" : "disabled");
                }
            })
            .catch(() => active && setStatus("error"));

        return () => {
            active = false;
        };
    }, []);

    const startSetup = async () => {
        const data = await run(
            () => request("/api/auth/2fa/setup", {}),
            "No se pudo generar el código QR."
        );

        if (data) {
            setEnrollment({ qrCode: String(data.qrCode), secret: String(data.secret) });
            setStatus("enrolling");
        }
    };

    const cancelSetup = () => {
        setEnrollment(null);
        setError("");
        setStatus("disabled");
    };

    const confirmEnable = async (code: string) => {
        const data = await run(
            () => request("/api/auth/2fa/enable", { code }),
            "No se pudo activar la verificación en dos pasos."
        );

        if (data) {
            setEnrollment(null);
            setStatus("enabled");
            setSuccess("La verificación en dos pasos quedó activada.");
            await refreshUser();
        }

        return Boolean(data);
    };

    const disable = async (password: string, code: string) => {
        const data = await run(
            () => request("/api/auth/2fa/disable", { password, code }),
            "No se pudo desactivar la verificación en dos pasos."
        );

        if (data) {
            setStatus("disabled");
            setSuccess("La verificación en dos pasos quedó desactivada.");
            await refreshUser();
        }

        return Boolean(data);
    };

    return {
        status,
        enrollment,
        busy,
        error,
        success,
        startSetup,
        cancelSetup,
        confirmEnable,
        disable,
    };
}
