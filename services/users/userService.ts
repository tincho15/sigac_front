
export type ChangePasswordData = {
    currentPassword?: string;
    newPassword: string;
};

type ApiResponse = {
    status: "success" | "error";
    message?: string;
    errors?: string[];
};

export async function changePassword(
    passwordData: ChangePasswordData
): Promise<void> {
    const response = await fetch("/api/users/change-password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(passwordData),
    });

    const data: ApiResponse | null = await response
        .json()
        .catch(() => null);

    if (!response.ok || data?.status !== "success") {
        const errorMessage = data?.errors?.join(". ")
            || data?.message
            || "No se pudo cambiar la contraseña.";

        throw new Error(errorMessage);
    }
}
