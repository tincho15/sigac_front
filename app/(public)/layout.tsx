"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import AuthLoading from "@/components/auth/AuthLoading";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, status, refreshUser, isRetrying } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated" && user) {
            if (user.debe_cambiar_password) {
                router.replace("/change-password");
            } else {
                router.replace("/solicitudes");
            }
        }
    }, [status, user, router]);

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

    if (status === "authenticated") {
        return null;
    }

    return <>{children}</>;
}
