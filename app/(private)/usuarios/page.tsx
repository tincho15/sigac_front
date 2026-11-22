import UserList from "@/components/usuarios/UserList";
import MainLayout from "@/components/layout/MainLayout";
import RoleGuard from "@/components/auth/RoleGuard";
import { ROLES } from "@/utils/constants";

export const instant = false;

export default function UsuariosPage() {
    return (
        <RoleGuard allowedRoles={[ROLES.ADMINISTRADOR]}>
            <MainLayout>
                <UserList />
            </MainLayout>
        </RoleGuard>
    );
}
