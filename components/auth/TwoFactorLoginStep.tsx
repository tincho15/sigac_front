"use client";

import { useState, type FormEvent } from "react";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    InputAdornment,
    Link,
    TextField,
    Typography,
} from "@mui/material";
import PhonelinkLockOutlinedIcon from "@mui/icons-material/PhonelinkLockOutlined";
import type { AuthUser } from "@/components/auth/AuthContext";

type TwoFactorLoginStepProps = {
    onSuccess: (user: AuthUser) => void;
    // Vuelve al formulario de contraseña, opcionalmente con un mensaje para mostrar alli
    onCancel: (message?: string) => void;
};

const CODE_PATTERN = /^\d{6}$/;

export default function TwoFactorLoginStep({ onSuccess, onCancel }: TwoFactorLoginStepProps) {
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage("");

        if (!CODE_PATTERN.test(code)) {
            setErrorMessage("Ingresá los 6 dígitos que muestra Google Authenticator.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/auth/2fa/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code }),
            });

            const data = await response.json().catch(() => null);

            if (response.ok && data?.status === "success" && data?.user) {
                onSuccess(data.user);
                return;
            }

            // Demasiados intentos: el backend invalida el paso intermedio y hay que volver a empezar
            if (response.status === 429) {
                onCancel(data?.message || "Demasiados intentos fallidos. Iniciá sesión nuevamente.");
                return;
            }

            setCode("");
            setErrorMessage(
                data?.message || "No se pudo verificar el código. Intentá nuevamente."
            );
        } catch (error) {
            console.error("Error al verificar el código:", error);
            setErrorMessage("No se pudo conectar con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" color="primary" sx={{ fontWeight: 700, mb: 1 }}>
                    Verificación en dos pasos
                </Typography>

                <Typography color="text.secondary" sx={{ fontSize: "0.875rem" }}>
                    Abrí Google Authenticator en tu celular e ingresá el código de 6 dígitos
                    de la cuenta SIGAC.
                </Typography>
            </Box>

            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
            >
                <TextField
                    fullWidth
                    autoFocus
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="000000"
                    disabled={loading}
                    slotProps={{
                        htmlInput: {
                            inputMode: "numeric",
                            autoComplete: "one-time-code",
                            maxLength: 6,
                            "aria-label": "Código de verificación",
                            style: { letterSpacing: "0.5em", fontSize: "1.25rem" },
                        },
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <PhonelinkLockOutlinedIcon color="action" fontSize="small" />
                                </InputAdornment>
                            ),
                        },
                    }}
                />

                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

                <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{ mt: 1, py: 1.4, borderRadius: 2, boxShadow: "none", fontWeight: 600 }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Verificar"}
                </Button>

                <Box sx={{ textAlign: "center", mt: 1 }}>
                    <Link
                        component="button"
                        type="button"
                        onClick={() => onCancel()}
                        underline="hover"
                        color="text.secondary"
                        sx={{ fontSize: "0.875rem" }}
                    >
                        Volver al inicio de sesión
                    </Link>
                </Box>
            </Box>
        </>
    );
}
