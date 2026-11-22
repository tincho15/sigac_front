"use client";

import { useCallback, useEffect, useState } from "react";

export type UserListItem = {
    id_usuario: number;
    nombre: string;
    email: string;
    activo: boolean;
    rol: string;
};

export type UserUpdate = Partial<{
    nombre: string;
    email: string;
    id_rol: number;
    activo: boolean;
}>;

type ApiError = {
    message?: string;
    error?: string;
    errors?: string[];
};

function getErrorMessage(data: ApiError | null, fallback: string) {
    if (data?.errors?.length) return data.errors.join(". ");
    return data?.message || data?.error || fallback;
}

async function requestJson<T>(url: string, init: RequestInit, fallbackError: string): Promise<T> {
    const response = await fetch(url, {
        ...init,
        headers: { "Content-Type": "application/json", ...init.headers },
        cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(getErrorMessage(data, fallbackError));
    }

    return data as T;
}

type LoadResult =
    | { ok: true; data: UserListItem[] }
    | { ok: false; error: string };

async function requestUsers(): Promise<LoadResult> {
    const fallback = "No se pudo obtener el listado de usuarios.";

    try {
        const data = await requestJson<UserListItem[]>("/api/users", { method: "GET" }, fallback);
        return { ok: true, data };
    } catch (error) {
        return { ok: false, error: error instanceof Error ? error.message : fallback };
    }
}

export default function useUsers() {
    const [users, setUsers] = useState<UserListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    const applyResult = useCallback((result: LoadResult) => {
        if (result.ok) {
            setUsers(result.data);
            setLoadError("");
        } else {
            setLoadError(result.error);
        }
        setIsLoading(false);
    }, []);

    const loadUsers = useCallback(
        () => requestUsers().then(applyResult),
        [applyResult]
    );

    // Carga inicial: el estado solo se actualiza al resolverse la solicitud
    useEffect(() => {
        let ignore = false;

        requestUsers().then((result) => {
            if (!ignore) applyResult(result);
        });

        return () => {
            ignore = true;
        };
    }, [applyResult]);

    // Reintento manual desde la UI (muestra el indicador de carga)
    const fetchUsers = () => {
        setIsLoading(true);
        setLoadError("");
        return loadUsers();
    };

    const updateUser = async (id_usuario: number, updates: UserUpdate) => {
        await requestJson(
            `/api/users/${id_usuario}`,
            { method: "PATCH", body: JSON.stringify(updates) },
            "No se pudo actualizar el usuario."
        );

        // Se vuelve a pedir el listado (sin spinner) para respetar el orden del backend
        await loadUsers();
    };

    const setUserActive = (id_usuario: number, activo: boolean) =>
        updateUser(id_usuario, { activo });

    const resetPassword = async (email: string) => {
        const data = await requestJson<{ email: string; password: string }>(
            "/api/users/reset-password",
            { method: "POST", body: JSON.stringify({ email }) },
            "No se pudo reiniciar la contraseña."
        );

        return data.password;
    };

    return {
        users,
        isLoading,
        loadError,
        fetchUsers,
        updateUser,
        setUserActive,
        resetPassword,
    };
}
