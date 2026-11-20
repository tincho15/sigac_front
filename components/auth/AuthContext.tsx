
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
    // 2FA obligatoria: true mientras el usuario no haya activado Google Authenticator
    debe_activar_2fa: boolean;
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
    refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
    children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [status, setStatus] = useState<AuthStatus>("loading");
    const [isRetrying, setIsRetrying] = useState(false);

    const refreshUser = useCallback(async () => {
        setIsRetrying(true);

        try {
            const response = await fetch("/api/auth/me", {
                method: "GET",
                cache: "no-store",
            });

            if (response.status === 401) {
                setUser(null);
                setStatus("unauthenticated");
                return;
            }

            if (!response.ok) {
                setUser(null);
                setStatus("error");
                return;
            }

            const data = await response.json();

            if (data?.status !== "success" || !data?.user) {
                setUser(null);
                setStatus("error");
                return;
            }

            setUser(data.user);
            setStatus("authenticated");

        } catch (error) {
            console.error("Error al recuperar la sesión:", error);
            setUser(null);
            setStatus("error");
        } finally {
            setIsRetrying(false);
        }
    }, []);

    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

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
