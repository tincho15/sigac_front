"use client";

import { useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import type { UserListItem } from "@/hooks/useUsers";

type ToggleUserStatusDialogProps = {
    user: UserListItem;
    onClose: () => void;
    onConfirm: () => Promise<void>;
};

/**
 * Diálogo de confirmación previo a activar o desactivar un usuario.
 */
export default function ToggleUserStatusDialog({
    user,
    onClose,
    onConfirm,
}: ToggleUserStatusDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const willDeactivate = user.activo;
    const action = willDeactivate ? "desactivar" : "activar";

    const handleConfirm = async () => {
        setIsSubmitting(true);
        setSubmitError("");

        try {
            await onConfirm();
            onClose();
        } catch (error) {
            setSubmitError(
                error instanceof Error ? error.message : `No se pudo ${action} el usuario.`
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open onClose={isSubmitting ? undefined : onClose} maxWidth="xs" fullWidth>
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    backgroundColor: willDeactivate ? "#FDECEC" : "#EAF5EE",
                    color: willDeactivate ? "#8A1F1F" : "#245B3D",
                    fontSize: "1rem",
                    fontWeight: 700,
                }}
            >
                <WarningAmberRoundedIcon
                    sx={{ color: willDeactivate ? "#D32F2F" : "#27965B" }}
                />
                {willDeactivate ? "Desactivar usuario" : "Activar usuario"}
            </DialogTitle>

            <DialogContent>
                <Typography sx={{ mt: 2 }}>
                    ¿Está seguro de que desea {action} a <strong>{user.nombre}</strong> ({user.email})?
                </Typography>

                <Typography sx={{ mt: 1.5, color: "#64748B", fontSize: "0.85rem" }}>
                    {willDeactivate
                        ? "El usuario no podrá iniciar sesión ni operar en el sistema hasta que sea activado nuevamente."
                        : "El usuario podrá volver a iniciar sesión y operar en el sistema."}
                </Typography>

                {submitError && (
                    <Typography sx={{ mt: 2, color: "#D32F2F", fontSize: "0.875rem" }}>
                        {submitError}
                    </Typography>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                <Button
                    onClick={onClose}
                    disabled={isSubmitting}
                    variant="outlined"
                    sx={{
                        borderRadius: 3,
                        color: "#475569",
                        backgroundColor: "#F1F3F5",
                        border: "1px solid #D8DEE6",
                    }}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleConfirm}
                    disabled={isSubmitting}
                    variant="contained"
                    color={willDeactivate ? "error" : "success"}
                    sx={{ borderRadius: 3, boxShadow: "none" }}
                >
                    {isSubmitting
                        ? "Procesando..."
                        : willDeactivate
                            ? "Desactivar"
                            : "Activar"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
