import UserForm from "@/components/usuarios/UserForm";
import MainLayout from "@/components/layout/MainLayout";
import RoleGuard from "@/components/auth/RoleGuard";
import { ROLES } from "@/utils/constants";

export const instant = false;

export default function NuevoUsuarioPage() {
    return (
        <RoleGuard allowedRoles={[ROLES.ADMINISTRADOR]}>
            <MainLayout>
                <UserForm />
            </MainLayout>
        </RoleGuard>
    );
}
