import { Suspense } from "react";
import AuthLoading from "@/components/auth/AuthLoading";
import PrivateGuard from "@/components/auth/PrivateGuard";

export default function PrivateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Con cacheComponents, usePathname (en PrivateGuard) suspende durante el
    // prerender de rutas dinámicas: el Suspense evita que falle el build
    return (
        <Suspense fallback={<AuthLoading />}>
            <PrivateGuard>{children}</PrivateGuard>
        </Suspense>
    );
}
