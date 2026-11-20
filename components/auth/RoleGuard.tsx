"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import type { Rol } from "@/utils/constants";

type RoleGuardProps = {
    allowedRoles: Rol[];
    children: React.ReactNode;
};

export default function RoleGuard({
    allowedRoles,
    children,
}: RoleGuardProps) {
    const { user, status } = useAuth();
    const router = useRouter();

    const hasPermission = user
        ? (allowedRoles as string[]).includes(user.rol.nombre)
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
