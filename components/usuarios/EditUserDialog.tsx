"use client";

import { useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    TextField,
    Typography,
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

import { ROLE_OPTIONS, getRoleId } from "@/utils/constants";
import type { UserListItem, UserUpdate } from "@/hooks/useUsers";

type EditUserDialogProps = {
    user: UserListItem;
    onClose: () => void;
    onSave: (updates: UserUpdate) => Promise<void>;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const labelSx = { color: "#34445A", fontSize: "0.875rem", fontWeight: 600, px: 1 };

/**
 * Diálogo para editar nombre, correo y rol de un usuario.
 * Se monta de nuevo para cada usuario, por lo que el estado inicial
 * se toma directamente de sus datos.
 */
export default function EditUserDialog({ user, onClose, onSave }: EditUserDialogProps) {
    const initialRoleId = getRoleId(user.rol) ?? "";

    const [nombre, setNombre] = useState(user.nombre);
    const [email, setEmail] = useState(user.email);
    const [idRol, setIdRol] = useState<number | "">(initialRoleId);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitError, setSubmitError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!nombre.trim()) {
            newErrors.nombre = "Por favor, complete este campo";
        }

        if (!email.trim()) {
            newErrors.email = "Por favor, complete este campo";
        } else if (!EMAIL_PATTERN.test(email.trim())) {
            newErrors.email = "Formato de correo electrónico no válido";
        }

        if (idRol === "") {
            newErrors.id_rol = "Por favor, seleccione un rol";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        // Solo se envían los campos que cambiaron
        const updates: UserUpdate = {};
        if (nombre.trim() !== user.nombre) updates.nombre = nombre.trim();
        if (email.trim().toLowerCase() !== user.email.toLowerCase()) {
            updates.email = email.trim();
        }
        if (idRol !== "" && idRol !== initialRoleId) updates.id_rol = idRol;

        if (Object.keys(updates).length === 0) {
            onClose();
            return;
        }

        setIsSubmitting(true);
        setSubmitError("");

        try {
            await onSave(updates);
            onClose();
        } catch (error) {
            setSubmitError(
                error instanceof Error ? error.message : "No se pudo actualizar el usuario."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open onClose={isSubmitting ? undefined : onClose} maxWidth="sm" fullWidth>
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    backgroundColor: "#F8FAFC",
                    color: "#142D4E",
                    fontSize: "1rem",
                    fontWeight: 700,
                }}
            >
                <EditRoundedIcon sx={{ color: "#24476A" }} />
                Editar usuario
            </DialogTitle>

            <DialogContent>
                <Box
                    component="form"
                    id="edit-user-form"
                    noValidate
                    onSubmit={(event) => {
                        event.preventDefault();
                        handleSubmit();
                    }}
                    sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 3 }}
                >
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <Typography sx={labelSx}>Nombre completo *</Typography>
                        <TextField
                            fullWidth
                            value={nombre}
                            onChange={(e) => {
                                setNombre(e.target.value);
                                setErrors((prev) => ({ ...prev, nombre: "" }));
                            }}
                            error={!!errors.nombre}
                            helperText={errors.nombre}
                        />
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <Typography sx={labelSx}>Correo electrónico *</Typography>
                        <TextField
                            fullWidth
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setErrors((prev) => ({ ...prev, email: "" }));
                            }}
                            error={!!errors.email}
                            helperText={errors.email}
                        />
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <Typography sx={labelSx}>Rol *</Typography>
                        <TextField
                            select
                            fullWidth
                            value={idRol}
                            onChange={(e) => {
                                setIdRol(e.target.value === "" ? "" : Number(e.target.value));
                                setErrors((prev) => ({ ...prev, id_rol: "" }));
                            }}
                            error={!!errors.id_rol}
                            helperText={errors.id_rol}
                        >
                            {ROLE_OPTIONS.map((rol) => (
                                <MenuItem key={rol.id_rol} value={rol.id_rol}>
                                    {rol.nombre}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>

                    {submitError && (
                        <Typography sx={{ color: "#D32F2F", fontSize: "0.875rem" }}>
                            {submitError}
                        </Typography>
                    )}
                </Box>
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
                    type="submit"
                    form="edit-user-form"
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{ borderRadius: 3, boxShadow: "none" }}
                >
                    {isSubmitting ? "Guardando..." : "Guardar cambios"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
