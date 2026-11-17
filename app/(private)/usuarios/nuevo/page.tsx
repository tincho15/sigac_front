import UserForm from "@/components/usuarios/UserForm";
import MainLayout from "@/components/layout/MainLayout";
import RoleGuard from "@/components/auth/RoleGuard";

export const instant = false;

export default function NuevoUsuarioPage() {
    return (
        <RoleGuard allowedRoles={["ADMINISTRADOR"]}>
            <MainLayout>
                <UserForm />
            </MainLayout>
        </RoleGuard>
    );
}
