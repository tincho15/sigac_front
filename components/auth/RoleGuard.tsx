"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";

type RoleGuardProps = {
    allowedRoles: string[];
    children: React.ReactNode;
};

export default function RoleGuard({
    allowedRoles,
    children,
}: RoleGuardProps) {
    const { user, status } = useAuth();
    const router = useRouter();

    const hasPermission = user
        ? allowedRoles.includes(user.rol.nombre.toUpperCase())
        : false;

    useEffect(() => {
        if (status === "authenticated" && !hasPermission) {
            router.replace("/solicitudes");
        }
    }, [status, hasPermission, router]);

    if (status !== "authenticated" || !hasPermission) {
        return null;
    }

    return <>{children}</>;
}
