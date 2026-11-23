
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import AuthLoading from "@/components/auth/AuthLoading";
import MainLayout from "@/components/layout/MainLayout";

export default function PrivateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, status, refreshUser, isRetrying } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const isChangePasswordPage = pathname === "/change-password";

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/login");
            return;
        }

        // Si debe cambiar la contraseña, debe ir a esa página.
        if (
            status === "authenticated" &&
            user?.debe_cambiar_password &&
            !isChangePasswordPage
        ) {
            router.replace("/change-password");
            return;
        }

        // Si no debe cambiarla, no puede acceder a esa página.
        if (
            status === "authenticated" &&
            user &&
            !user.debe_cambiar_password &&
            isChangePasswordPage
        ) {
            router.replace("/solicitudes");
            return;
        }
    }, [status, user, isChangePasswordPage, router]);

    if (status === "loading") {
        return <AuthLoading />;
    }

    if (status === "error") {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4">
                <p>No se pudo verificar tu sesión.</p>

                <button
                    onClick={refreshUser}
                    disabled={isRetrying}
                    className="cursor-pointer rounded-lg bg-blue-900 px-5 py-2 text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isRetrying ? "Reintentando..." : "Reintentar"}
                </button>
            </div>
        );
    }

    if (status !== "authenticated" || !user) {
        return null;
    }

    if (
        user.debe_cambiar_password &&
        !isChangePasswordPage
    ) {
        return null;
    }

    if (
        !user.debe_cambiar_password &&
        isChangePasswordPage
    ) {
        return null;
    }

    return (
        <MainLayout>
            {children}
        </MainLayout>
    );
}
