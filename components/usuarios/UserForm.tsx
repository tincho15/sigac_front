
"use client";

import {
    Box,
    Button,
    Divider,
    MenuItem,
    Paper,
    TextField,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useUserForm from "@/hooks/useUserForm";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";

export default function UserForm() {
    const router = useRouter();
    const [successOpen, setSuccessOpen] = useState(false);
    const [temporaryPassword, setTemporaryPassword] = useState("");
    const [passwordCopied, setPasswordCopied] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const { formData, errors, handleChange, validateForm } = useUserForm();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        setSubmitError("");

        try {
            const response = await fetch("/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email.trim(),
                    nombre: formData.nombre.trim(),
                    id_rol: formData.id_rol,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || "No se pudo registrar el usuario.");
            }

            setTemporaryPassword(data.password);
            setPasswordCopied(false);
            setSuccessOpen(true);

        } catch (error) {
            setSubmitError(
                error instanceof Error
                    ? error.message
                    : "Ocurrió un error al registrar el usuario."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCopyPassword = async () => {
        try {
            await navigator.clipboard.writeText(temporaryPassword);
            setPasswordCopied(true);

            setTimeout(() => {
                setPasswordCopied(false);
            }, 2000);
        } catch {
            setPasswordCopied(false);
        }
    };

    const fieldStyles = {
        "& .MuiOutlinedInput-root": {
            borderRadius: 4,
            backgroundColor: "#FFFFFF",
            "& fieldset": {
                borderColor: "#DCE3EC",
            },
            "&:hover fieldset": {
                borderColor: "#AABBD0",
            },
            "&.Mui-focused fieldset": {
                borderColor: "#24476A",
            },
        },
    };

    return (
        <Box sx={{ maxWidth: 780, mx: "auto", py: { xs: 2, md: 4 } }}>
            {/* Encabezado */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 4,
                }}
            >
                <Box>
                    <Typography
                        sx={{
                            color: "#64748B",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            letterSpacing: 1,
                            mb: 1,
                        }}
                    >
                        GESTIÓN DE USUARIOS / AGREGAR NUEVO
                    </Typography>

                    <Typography
                        variant="h4"
                        sx={{
                            color: "#142D4E",
                            fontWeight: 700,
                            mb: 1,
                        }}
                    >
                        Alta de usuario
                    </Typography>

                    <Typography sx={{ color: "#64748B", fontSize: "0.95rem" }}>
                        Complete los datos para registrar un nuevo usuario en el sistema.
                    </Typography>
                </Box>
            </Box>

            {/* Tarjeta del formulario */}
            <Paper
                elevation={0}
                sx={{
                    border: "1px solid #E0E6ED",
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: "0 4px 18px rgba(20, 45, 78, 0.04)",
                }}
            >
                {/* Encabezado de la tarjeta */}
                <Box sx={{ px: { xs: 2.5, md: 4 }, py: 3 }}>
                    <Typography
                        sx={{ fontWeight: 700, color: "#263445", fontSize: "1.05rem" }}
                    >
                        Información del usuario
                    </Typography>

                    <Typography sx={{ color: "#64748B", fontSize: "0.85rem", mt: 0.5 }}>
                        Los campos marcados con * son obligatorios.
                    </Typography>
                </Box>

                <Divider sx={{ borderColor: "#E8EDF2" }} />

                {/* Campos */}
                <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit}
                    sx={{
                        px: { xs: 2.5, md: 4 },
                        py: 4,
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                    }}
                >
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <Typography sx={{ color: "#34445A", fontSize: "0.875rem", fontWeight: 600, px: 1 }}>
                            Nombre completo *
                        </Typography>

                        <TextField
                            fullWidth
                            value={formData.nombre}
                            onChange={(e) => handleChange("nombre", e.target.value)}
                            error={!!errors.nombre}
                            helperText={errors.nombre}
                            placeholder="Ingrese nombre y apellido"
                            sx={fieldStyles}
                        />
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <Typography sx={{ color: "#34445A", fontSize: "0.875rem", fontWeight: 600, px: 1 }}>
                            Correo electrónico *
                        </Typography>

                        <TextField
                            fullWidth
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            error={!!errors.email}
                            helperText={errors.email}
                            placeholder="usuario@ejemplo.com"
                            sx={fieldStyles}
                        />
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <Typography sx={{ color: "#34445A", fontSize: "0.875rem", fontWeight: 600, px: 1 }}>
                            Rol *
                        </Typography>

                        <TextField
                            select
                            fullWidth
                            value={formData.id_rol}
                            onChange={(e) =>
                                handleChange(
                                    "id_rol",
                                    e.target.value === "" ? "" : Number(e.target.value)
                                )
                            }
                            error={!!errors.id_rol}
                            helperText={errors.id_rol}
                            sx={fieldStyles}
                            slotProps={{
                                select: {
                                    displayEmpty: true,
                                    renderValue: (selected) => {
                                        if (selected === "") {
                                            return (
                                                <span style={{ color: "#94A3B8" }}>
                                                    Seleccione un rol
                                                </span>
                                            );
                                        }

                                        return selected === 1
                                            ? "Administrador"
                                            : "Funcionario";
                                    },
                                },
                            }}
                        >
                            <MenuItem value={1}>Administrador</MenuItem>
                            <MenuItem value={2}>Funcionario</MenuItem>
                        </TextField>
                    </Box>

                    {/* Mensaje de error del backend */}
                    {submitError && (
                        <Typography sx={{ color: "#D32F2F", fontSize: "0.875rem" }}>
                            {submitError}
                        </Typography>
                    )}


                    {/* Botones */}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            justifyContent: "flex-end",
                            gap: 2,
                            width: "100%",
                        }}
                    >
                        <Button
                            variant="outlined"
                            onClick={() => router.push("/usuarios")}
                            sx={{
                                width: { xs: "100%", sm: "140px" },
                                py: 1.2,
                                borderRadius: 3,
                                textTransform: "none",
                                color: "#475569",
                                borderColor: "#CBD5E1",
                                "&:hover": {
                                    borderColor: "#94A3B8",
                                    backgroundColor: "#F8FAFC",
                                },
                            }}
                        >
                            Cancelar
                        </Button>

                        <Button
                            variant="contained"
                            type="submit"
                            disabled={isSubmitting}
                            sx={{
                                width: { xs: "100%", sm: "140px" },
                                py: 1.2,
                                borderRadius: 3,
                                textTransform: "none",
                                backgroundColor: "#142D4E",
                                boxShadow: "none",
                                "&:hover": {
                                    backgroundColor: "#24476A",
                                    boxShadow: "none",
                                },
                            }}
                        >
                            {isSubmitting ? "Registrando..." : "Agregar"}
                        </Button>
                    </Box>
                </Box>
            </Paper>

            {/* Diálogo de alta exitosa */}
            <Dialog
                open={successOpen}
                onClose={() => setSuccessOpen(false)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        backgroundColor: "#EAF5EE",
                        color: "#245B3D",
                        fontSize: "1rem",
                        fontWeight: 700,
                    }}
                >
                    <CheckCircleRoundedIcon sx={{ color: "#27965B" }} />
                    Usuario registrado correctamente
                </DialogTitle>

                <DialogContent>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                        Contraseña temporal:
                    </Typography>

                    <Box
                        sx={{
                            p: 2,
                            backgroundColor: "#F1F4F8",
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 2,
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: 700,
                                letterSpacing: 1,
                                color: "#142D4E",
                            }}
                        >
                            {temporaryPassword}
                        </Typography>

                        <Button
                            aria-label="Copiar contraseña temporal"
                            onClick={handleCopyPassword}
                            size="small"
                            startIcon={
                                passwordCopied ? (
                                    <CheckCircleRoundedIcon fontSize="small" />
                                ) : (
                                    <ContentCopyRoundedIcon fontSize="small" />
                                )
                            }
                            sx={{
                                minWidth: "auto",
                                color: passwordCopied ? "#27965B" : "#24476A",
                                textTransform: "none",
                                borderRadius: 2,
                                px: 1,
                            }}
                        >
                            {passwordCopied ? "¡Copiada!" : "Copiar"}
                        </Button>
                    </Box>

                    <Typography
                        sx={{
                            mt: 2,
                            color: "#64748B",
                            fontSize: "0.85rem",
                        }}
                    >
                        El usuario deberá establecer una nueva contraseña al iniciar sesión.
                    </Typography>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={() => setSuccessOpen(false)}
                        variant="contained"
                        sx={{
                            borderRadius: 3,
                            px: 2,
                            py: 1.2,
                            textTransform: "none",
                            backgroundColor: "#142D4E",
                            boxShadow: "none",
                            "&:hover": {
                                backgroundColor: "#24476A",
                                boxShadow: "none",
                            },
                        }}
                    >
                        Entendido
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
