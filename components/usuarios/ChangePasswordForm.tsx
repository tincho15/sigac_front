"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    IconButton,
    InputAdornment,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { useAuth } from "@/components/auth/AuthContext";
import { changePassword } from "@/services/users/userService";

export default function ChangePasswordForm() {
    const router = useRouter();
    const { user, status, refreshUser } = useAuth();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    if (status === "loading") {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!user) {
        return null;
    }

    const isMandatory = user.debe_cambiar_password;

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage("");

        if (!isMandatory && !currentPassword) {
            setErrorMessage("Ingresá tu contraseña actual.");
            return;
        }

        if (!newPassword) {
            setErrorMessage("Ingresá una nueva contraseña.");
            return;
        }

        if (newPassword.length < 8) {
            setErrorMessage("La contraseña debe tener al menos 8 caracteres.");
            return;
        }

        if (new TextEncoder().encode(newPassword).length > 72) {
            setErrorMessage("La contraseña no puede superar los 72 bytes.");
            return;
        }

        if (
            !/[a-z]/.test(newPassword) ||
            !/[A-Z]/.test(newPassword) ||
            !/[0-9]/.test(newPassword)
        ) {
            setErrorMessage(
                "La contraseña debe incluir al menos una mayúscula, una minúscula y un número."
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage("Las contraseñas no coinciden.");
            return;
        }

        try {
            setLoading(true);

            await changePassword({
                ...(!isMandatory && { currentPassword }),
                newPassword,
            });

            const refreshed = await refreshUser();

            if (!refreshed) {
                setErrorMessage(
                    "La contraseña se cambió, pero no se pudo actualizar la sesión."
                );
                return;
            }

            router.replace("/solicitudes");
        } catch (error) {
            console.error("Error al cambiar la contraseña:", error);

            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "No se pudo cambiar la contraseña."
            );
        } finally {
            setLoading(false);
        }
    };

    const passwordAdornment = (
        visible: boolean,
        onToggle: () => void
    ) => (
        <InputAdornment position="end">
            <IconButton
                onClick={onToggle}
                edge="end"
                disabled={loading}
                aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
                {visible ? (
                    <VisibilityOff fontSize="small" />
                ) : (
                    <Visibility fontSize="small" />
                )}
            </IconButton>
        </InputAdornment>
    );

    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 3, sm: 4 },
                border: 1,
                borderColor: "divider",
                borderRadius: 3,
                boxShadow: "0 4px 18px rgba(20, 45, 78, 0.06)",
            }}
        >
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h5"
                    color="primary"
                    sx={{ fontWeight: 700, mb: 1 }}
                >
                    Cambio de contraseña
                </Typography>

                <Typography color="text.secondary" sx={{ fontSize: "0.875rem" }}>
                    {isMandatory
                        ? "Para continuar, necesitás establecer una nueva contraseña."
                        : "Ingresá tu contraseña actual y elegí una nueva."}
                </Typography>
            </Box>

            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
            >
                {!isMandatory && (
                    <TextField
                        fullWidth
                        label="Contraseña actual"
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(event) => setCurrentPassword(event.target.value)}
                        disabled={loading}
                        autoComplete="current-password"
                        slotProps={{
                            input: {
                                endAdornment: passwordAdornment(
                                    showCurrentPassword,
                                    () => setShowCurrentPassword(!showCurrentPassword)
                                ),
                            },
                        }}
                    />
                )}

                <TextField
                    fullWidth
                    label="Nueva contraseña"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    disabled={loading}
                    autoComplete="new-password"
                    slotProps={{
                        input: {
                            endAdornment: passwordAdornment(
                                showNewPassword,
                                () => setShowNewPassword(!showNewPassword)
                            ),
                        },
                    }}
                />

                <TextField
                    fullWidth
                    label="Confirmar nueva contraseña"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    disabled={loading}
                    autoComplete="new-password"
                    slotProps={{
                        input: {
                            endAdornment: passwordAdornment(
                                showConfirmPassword,
                                () => setShowConfirmPassword(!showConfirmPassword)
                            ),
                        },
                    }}
                />

                {errorMessage && (
                    <Alert severity="error">{errorMessage}</Alert>
                )}

                <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{
                        mt: 1,
                        py: 1.4,
                        borderRadius: 2,
                        boxShadow: "none",
                        fontWeight: 600,
                    }}
                >
                    {loading ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        "Cambiar contraseña"
                    )}
                </Button>
            </Box>
        </Paper>
    );
}
