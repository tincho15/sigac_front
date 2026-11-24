
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import AuthLoading from "@/components/auth/AuthLoading";
import MainLayout from "@/components/layout/MainLayout";
import { HOME_PATH, MANDATORY_PATHS, getRequiredPath } from "@/lib/auth/redirects";

export default function PrivateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, status, refreshUser, isRetrying } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    // Paso obligatorio pendiente: cambio de contraseña y/o activación del 2FA
    const requiredPath = user ? getRequiredPath(user) : null;
    const isMandatoryPage = MANDATORY_PATHS.includes(pathname);

    // Con un paso pendiente solo se puede estar en su página;
    // sin pasos pendientes no se puede entrar a esas páginas.
    const redirectTo =
        requiredPath && pathname !== requiredPath
            ? requiredPath
            : !requiredPath && isMandatoryPage
                ? HOME_PATH
                : null;

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/login");
            return;
        }

        if (status === "authenticated" && redirectTo) {
            router.replace(redirectTo);
        }
    }, [status, redirectTo, router]);

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

    if (redirectTo) {
        return null;
    }

    return (
        <MainLayout>
            {children}
        </MainLayout>
    );
}
