import RoleGuard from "@/components/auth/RoleGuard";
import NuevaSolicitudForm from "@/components/solicitudes/NuevaSolicitudForm";

export const instant = false;

// Solo el administrador ingresa solicitudes (CU-06)
export default function NuevaSolicitudPage() {
    return (
        <RoleGuard allowedRoles={["ADMINISTRADOR"]}>
            <NuevaSolicitudForm />
        </RoleGuard>
    );
}
