type ApiResponse = {
    status: "success" | "error";
    message?: string;
};

export async function logout(): Promise<void> {
    const response = await fetch("/api/auth/logout", {
        method: "POST",
        cache: "no-store",
    });

    const data: ApiResponse | null = await response
        .json()
        .catch(() => null);

    if (!response.ok || data?.status !== "success") {
        throw new Error(
            data?.message || "No se pudo cerrar la sesión."
        );
    }
}