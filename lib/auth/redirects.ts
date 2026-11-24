import type { AuthUser } from "@/components/auth/AuthContext";

export const HOME_PATH = "/solicitudes";
export const CHANGE_PASSWORD_PATH = "/change-password";
export const ENABLE_TWO_FACTOR_PATH = "/activar-2fa";

// Pantallas obligatorias: solo se puede estar en ellas mientras el paso esté pendiente
export const MANDATORY_PATHS = [CHANGE_PASSWORD_PATH, ENABLE_TWO_FACTOR_PATH];

// Paso obligatorio pendiente antes de usar el sistema (null si no hay ninguno).
// En el primer login primero se cambia la contraseña temporal y después se activa el 2FA.
export function getRequiredPath(user: AuthUser): string | null {
    if (user.debe_cambiar_password) {
        return CHANGE_PASSWORD_PATH;
    }

    if (user.debe_activar_2fa) {
        return ENABLE_TWO_FACTOR_PATH;
    }

    return null;
}

// A dónde llevar al usuario después de iniciar sesión
export function getLandingPath(user: AuthUser): string {
    return getRequiredPath(user) ?? HOME_PATH;
}
