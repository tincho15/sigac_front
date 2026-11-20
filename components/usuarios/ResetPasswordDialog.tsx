"use client";

import { useEffect, useRef, useState } from "react";
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";

import type { UserListItem } from "@/hooks/useUsers";

type ResetPasswordDialogProps = {
    user: UserListItem;
    onClose: () => void;
    onReset: (email: string) => Promise<string>;
};

/**
 * Reinicia la contraseña del usuario al abrirse y muestra la
 * contraseña temporal generada por el backend.
 */
export default function ResetPasswordDialog({ user, onClose, onReset }: ResetPasswordDialogProps) {
    const [temporaryPassword, setTemporaryPassword] = useState("");
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);
    const requested = useRef(false);

    useEffect(() => {
        // Evita una doble solicitud en modo estricto de desarrollo
        if (requested.current) return;
        requested.current = true;

        onReset(user.email)
            .then(setTemporaryPassword)
            .catch((err) =>
                setError(err instanceof Error ? err.message : "No se pudo reiniciar la contraseña.")
            );
    }, [onReset, user.email]);

    const isLoading = !temporaryPassword && !error;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(temporaryPassword);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            setCopied(false);
        }
    };

    return (
        <Dialog open onClose={isLoading ? undefined : onClose} maxWidth="xs" fullWidth>
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    backgroundColor: error ? "#FDECEC" : "#EAF5EE",
                    color: error ? "#8A1F1F" : "#245B3D",
                    fontSize: "1rem",
                    fontWeight: 700,
                }}
            >
                {error ? (
                    <ErrorOutlineRoundedIcon sx={{ color: "#D32F2F" }} />
                ) : (
                    <CheckCircleRoundedIcon sx={{ color: "#27965B" }} />
                )}
                {error
                    ? "No se pudo reiniciar la contraseña"
                    : isLoading
                        ? "Reiniciando contraseña..."
                        : "Contraseña reiniciada correctamente"}
            </DialogTitle>

            <DialogContent>
                {isLoading && (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                        <CircularProgress size={32} />
                    </Box>
                )}

                {error && <Typography sx={{ mt: 2 }}>{error}</Typography>}

                {temporaryPassword && (
                    <>
                        <Typography sx={{ mt: 2, mb: 1 }}>
                            Contraseña temporal de <strong>{user.nombre}</strong>:
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
                            <Typography sx={{ fontWeight: 700, letterSpacing: 1, color: "#142D4E" }}>
                                {temporaryPassword}
                            </Typography>

                            <Button
                                aria-label="Copiar contraseña temporal"
                                onClick={handleCopy}
                                size="small"
                                startIcon={
                                    copied ? (
                                        <CheckCircleRoundedIcon fontSize="small" />
                                    ) : (
                                        <ContentCopyRoundedIcon fontSize="small" />
                                    )
                                }
                                sx={{
                                    minWidth: "auto",
                                    color: copied ? "#27965B" : "#24476A",
                                    textTransform: "none",
                                    borderRadius: 2,
                                    px: 1,
                                }}
                            >
                                {copied ? "¡Copiada!" : "Copiar"}
                            </Button>
                        </Box>

                        <Typography sx={{ mt: 2, color: "#64748B", fontSize: "0.85rem" }}>
                            El usuario deberá establecer una nueva contraseña al iniciar sesión.
                        </Typography>
                    </>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                    onClick={onClose}
                    disabled={isLoading}
                    variant="contained"
                    sx={{ borderRadius: 3, px: 2, py: 1.2, boxShadow: "none" }}
                >
                    {error ? "Cerrar" : "Entendido"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
