
"use client";

import { useState, type FormEvent } from "react";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    IconButton,
    InputAdornment,
    Link,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setErrorMessage("");

        // Validar campos obligatorios
        if (!email.trim() || !password) {
            setErrorMessage("Por favor, complete todos los campos.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json().catch(() => null);

            if (response.status === 401) {
                setErrorMessage("Credenciales inválidas, intente nuevamente.");
                return;
            }

            if (!response.ok) {
                setErrorMessage(
                    data?.message || "No se pudo iniciar sesión. Intentá nuevamente."
                );
                return;
            }

            if (data?.status !== "success" || !data?.token || !data?.user) {
                setErrorMessage("El servidor devolvió una respuesta inesperada.");
                return;
            }

        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            setErrorMessage("No se pudo conectar con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: 440,
                mx: "auto",
            }}
        >
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
                        Iniciar sesión
                    </Typography>

                    <Typography
                        color="text.secondary"
                        sx={{ fontSize: "0.875rem" }}
                    >
                        Accedé al sistema para gestionar tus solicitudes
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
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Correo electrónico"
                        disabled={loading}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailOutlinedIcon color="action" fontSize="small" />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    <TextField
                        fullWidth
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Contraseña"
                        disabled={loading}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOutlinedIcon color="action" fontSize="small" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                            aria-label={
                                                showPassword
                                                    ? "Ocultar contraseña"
                                                    : "Mostrar contraseña"
                                            }
                                            disabled={loading}
                                        >
                                            {showPassword ? (
                                                <VisibilityOff fontSize="small" />
                                            ) : (
                                                <Visibility fontSize="small" />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />

                    {errorMessage && (
                        <Alert severity="error">
                            {errorMessage}
                        </Alert>
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
                            "Ingresar"
                        )}
                    </Button>

                    <Box sx={{ textAlign: "center", mt: 1 }}>
                        <Link
                            href="#"
                            underline="hover"
                            color="text.secondary"
                            sx={{ fontSize: "0.875rem" }}
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
}
