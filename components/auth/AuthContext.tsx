
"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

export type AuthUser = {
    id_usuario: number;
    nombre: string;
    email: string;
    debe_cambiar_password: boolean;
    rol: {
        id_rol: number;
        nombre: string;
    };
};

export type AuthStatus =
    | "loading"
    | "authenticated"
    | "unauthenticated"
    | "error";

type AuthContextType = {
    user: AuthUser | null;
    status: AuthStatus;
    isRetrying: boolean;
    login: (user: AuthUser) => void;
    logout: () => void;
    updateUser: (user: AuthUser) => void;
    refreshUser: () => Promise<boolean>;
};

type SessionResult =
    | { status: "authenticated"; user: AuthUser }
    | { status: "unauthenticated" }
    | { status: "error" };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
    children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [status, setStatus] = useState<AuthStatus>("loading");
    const [isRetrying, setIsRetrying] = useState(false);

    // Consulta los datos de la sesión sin modificar estados.
    const fetchCurrentUser = useCallback(async (): Promise<SessionResult> => {
        try {
            const response = await fetch("/api/auth/me", {
                method: "GET",
                cache: "no-store",
            });

            if (response.status === 401) {
                return { status: "unauthenticated" };
            }

            if (!response.ok) {
                return { status: "error" };
            }

            const data = await response.json();

            if (data?.status !== "success" || !data?.user) {
                return { status: "error" };
            }

            return {
                status: "authenticated",
                user: data.user,
            };
        } catch (error) {
            console.error("Error al recuperar la sesión:", error);
            return { status: "error" };
        }
    }, []);

    // Recupera y actualiza los datos del usuario autenticado.
    const refreshUser = useCallback(async (): Promise<boolean> => {
        setIsRetrying(true);

        try {
            const result = await fetchCurrentUser();

            setUser(
                result.status === "authenticated" ? result.user : null
            );
            setStatus(result.status);

            return result.status === "authenticated";
        } finally {
            setIsRetrying(false);
        }
    }, [fetchCurrentUser]);

    // Recuperación automática de sesión al iniciar la aplicación.
    useEffect(() => {
        let isMounted = true;

        const initializeSession = async () => {
            const result = await fetchCurrentUser();

            if (!isMounted) return;

            setUser(
                result.status === "authenticated" ? result.user : null
            );
            setStatus(result.status);
        };

        void initializeSession();

        return () => {
            isMounted = false;
        };
    }, [fetchCurrentUser]);

    const login = (user: AuthUser) => {
        setUser(user);
        setStatus("authenticated");
    };

    const logout = () => {
        setUser(null);
        setStatus("unauthenticated");
    };

    const updateUser = (user: AuthUser) => {
        setUser(user);
        setStatus("authenticated");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                status,
                isRetrying,
                login,
                logout,
                updateUser,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth debe utilizarse dentro de un AuthProvider");
    }

    return context;
}
