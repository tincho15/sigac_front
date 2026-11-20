import MainLayout from "@/components/layout/MainLayout";
import TwoFactorSettings from "@/components/cuenta/TwoFactorSettings";

export const instant = false;

export default function SeguridadPage() {
    return (
        <MainLayout>
            <TwoFactorSettings />
        </MainLayout>
    );
}
