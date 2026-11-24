import TwoFactorSettings from "@/components/cuenta/TwoFactorSettings";

export const instant = false;

// Paso obligatorio del primer login: el layout privado trae aquí al usuario
// mientras debe_activar_2fa sea true y lo libera cuando lo activa
export default function ActivarTwoFactorPage() {
    return (
        <div className="min-h-screen bg-[#F1F4F8] px-4 py-6 md:py-12">
            <TwoFactorSettings mandatory />
        </div>
    );
}
