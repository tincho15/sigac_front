
"use client";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    MenuItem,
    Paper,
    Snackbar,
    TextField,
    Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import FolderOpenRoundedIcon from "@mui/icons-material/FolderOpenRounded";
import NoteAddRoundedIcon from "@mui/icons-material/NoteAddRounded";
import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import ExpedienteAccordion from "@/components/solicitudes/ExpedienteAccordion";
import Field from "@/components/solicitudes/FormField";
import useNuevaSolicitudForm from "@/hooks/useNuevaSolicitudForm";
import {
    SOLICITUD_LIMITS,
    SOLICITUDES_PATH,
    TIPOS_SOLICITUD,
} from "@/config/solicitudes";

function CardHeader({
    icon,
    title,
    description,
    action,
}: {
    icon: ReactNode;
    title: string;
    description: string;
    action?: ReactNode;
}) {
    return (
        <Box
            sx={{
                px: { xs: 2.5, md: 4 },
                py: 3,
                backgroundColor: "#F8FAFC",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2,
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                    sx={{
                        width: 46,
                        height: 46,
                        borderRadius: 2.5,
                        backgroundColor: "#E8F0FA",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        color: "#24476A",
                    }}
                >
                    {icon}
                </Box>

                <Box>
                    <Typography
                        sx={{ fontWeight: 700, color: "#263445", fontSize: "1.05rem" }}
                    >
                        {title}
                    </Typography>

                    <Typography sx={{ color: "#64748B", fontSize: "0.85rem", mt: 0.5 }}>
                        {description}
                    </Typography>
                </Box>
            </Box>

            {action}
        </Box>
    );
}

const cardSx = {
    border: "1px solid #E0E6ED",
    borderRadius: 3,
    overflow: "hidden",
    boxShadow: "0 4px 18px rgba(20, 45, 78, 0.04)",
};

const secondaryButtonSx = {
    py: 1.2,
    px: 2.5,
    borderRadius: 3,
    color: "#475569",
    backgroundColor: "#F1F3F5",
    border: "1px solid #D8DEE6",
    "&:hover": {
        backgroundColor: "#E5E9EF",
        borderColor: "#C5CDD8",
    },
};

export default function NuevaSolicitudForm() {
    const router = useRouter();

    const {
        formData,
        expedientes,
        expandedKey,
        errors,
        isSubmitting,
        submitError,
        handleChange,
        handleExpedienteChange,
        addExpediente,
        toggleExpediente,
        removeExpediente,
        handleSubmit,
        clearSubmitError,
    } = useNuevaSolicitudForm();

    const canAddExpediente = expedientes.length < SOLICITUD_LIMITS.MAX_EXPEDIENTES;

    return (
        <Box sx={{ maxWidth: 980, mx: "auto", py: { xs: 2, md: 4 } }}>
            {/* Encabezado */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
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
                        GESTIÓN DE SOLICITUDES / AGREGAR NUEVA
                    </Typography>

                    <Typography variant="h4" sx={{ color: "#142D4E", fontWeight: 700 }}>
                        Nueva solicitud
                    </Typography>
                </Box>

                {/* Carga automática a partir de un documento */}
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                    <Button
                        variant="outlined"
                        startIcon={<PhotoCameraRoundedIcon />}
                        disabled={isSubmitting}
                        onClick={() => {
                            // TODO: cargar la solicitud a partir de una foto (extracción con sigac_extractor)
                        }}
                        sx={secondaryButtonSx}
                    >
                        Cargar por foto
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<PictureAsPdfRoundedIcon />}
                        disabled={isSubmitting}
                        onClick={() => {
                            // TODO: cargar la solicitud a partir de un PDF (extracción con sigac_extractor)
                        }}
                        sx={secondaryButtonSx}
                    >
                        Cargar por PDF
                    </Button>
                </Box>
            </Box>

            <Box
                component="form"
                noValidate
                onSubmit={(event) => {
                    event.preventDefault();

                    void handleSubmit().then((success) => {
                        if (success) {
                            router.push(SOLICITUDES_PATH);
                        }
                    });
                }}
                sx={{ display: "flex", flexDirection: "column", gap: 3 }}
            >
                {/* Datos de la solicitud */}
                <Paper elevation={0} sx={cardSx}>
                    <CardHeader
                        icon={<NoteAddRoundedIcon sx={{ fontSize: 25 }} />}
                        title="Información de la solicitud"
                        description="Ingrese el tipo, el origen y las observaciones de la solicitud."
                    />

                    <Divider sx={{ borderColor: "#E8EDF2" }} />

                    <Box
                        sx={{
                            px: { xs: 2.5, md: 4 },
                            py: 4,
                            display: "flex",
                            flexDirection: "column",
                            gap: 3,
                        }}
                    >
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                                gap: 3,
                            }}
                        >
                            <Field label="Tipo de solicitud *">
                                <TextField
                                    select
                                    fullWidth
                                    disabled={isSubmitting}
                                    value={formData.id_tipo}
                                    onChange={(e) =>
                                        handleChange(
                                            "id_tipo",
                                            e.target.value === "" ? "" : Number(e.target.value)
                                        )
                                    }
                                    error={!!errors.solicitud.id_tipo}
                                    helperText={errors.solicitud.id_tipo}
                                    slotProps={{
                                        select: {
                                            displayEmpty: true,
                                            renderValue: (selected) =>
                                                selected === "" ? (
                                                    <span style={{ color: "#94A3B8" }}>
                                                        Seleccione un tipo
                                                    </span>
                                                ) : (
                                                    TIPOS_SOLICITUD.find(
                                                        (tipo) => tipo.id_tipo === selected
                                                    )?.nombre
                                                ),
                                        },
                                    }}
                                >
                                    {TIPOS_SOLICITUD.map((tipo) => (
                                        <MenuItem key={tipo.id_tipo} value={tipo.id_tipo}>
                                            {tipo.nombre}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Field>

                            <Field label="Origen *">
                                <TextField
                                    fullWidth
                                    disabled={isSubmitting}
                                    value={formData.origen}
                                    onChange={(e) => handleChange("origen", e.target.value)}
                                    error={!!errors.solicitud.origen}
                                    helperText={errors.solicitud.origen}
                                    placeholder="Quién realiza la solicitud (p. ej. Juzgado 3)"
                                    slotProps={{
                                        htmlInput: { maxLength: SOLICITUD_LIMITS.ORIGEN_MAX_LENGTH },
                                    }}
                                />
                            </Field>
                        </Box>

                        <Field label="Observaciones">
                            <TextField
                                fullWidth
                                multiline
                                minRows={3}
                                disabled={isSubmitting}
                                value={formData.observaciones}
                                onChange={(e) => handleChange("observaciones", e.target.value)}
                                error={!!errors.solicitud.observaciones}
                                helperText={errors.solicitud.observaciones}
                                placeholder="Observaciones de la solicitud (opcional)"
                                slotProps={{
                                    htmlInput: {
                                        maxLength: SOLICITUD_LIMITS.OBSERVACIONES_MAX_LENGTH,
                                    },
                                }}
                            />
                        </Field>
                    </Box>
                </Paper>

                {/* Expedientes */}
                <Paper elevation={0} sx={cardSx}>
                    <CardHeader
                        icon={<FolderOpenRoundedIcon sx={{ fontSize: 25 }} />}
                        title={`Expedientes (${expedientes.length})`}
                        description="Indique el juzgado y al menos uno de: IUE, número, ficha o número de archivo."
                        action={
                            <Button
                                variant="outlined"
                                startIcon={<AddRoundedIcon />}
                                onClick={addExpediente}
                                disabled={isSubmitting || !canAddExpediente}
                                sx={{ borderRadius: 3, py: 1 }}
                            >
                                Agregar expediente
                            </Button>
                        }
                    />

                    <Divider sx={{ borderColor: "#E8EDF2" }} />

                    <Box
                        sx={{
                            px: { xs: 2.5, md: 4 },
                            py: 3,
                            display: "flex",
                            flexDirection: "column",
                            gap: 1.5,
                        }}
                    >
                        {expedientes.length === 0 && (
                            <Typography
                                sx={{
                                    color: errors.solicitud.expedientes ? "#D32F2F" : "#64748B",
                                    textAlign: "center",
                                    py: 2,
                                }}
                            >
                                {errors.solicitud.expedientes ??
                                    "No hay expedientes agregados a la solicitud."}
                            </Typography>
                        )}

                        {expedientes.map((expediente, index) => (
                            <ExpedienteAccordion
                                key={expediente.key}
                                expediente={expediente}
                                index={index}
                                errors={errors.expedientes[expediente.key]}
                                expanded={expandedKey === expediente.key}
                                disabled={isSubmitting}
                                onToggle={toggleExpediente}
                                onChange={handleExpedienteChange}
                                onRemove={removeExpediente}
                            />
                        ))}

                        {/* Con muchos expedientes evita volver arriba para agregar otro */}
                        {expedientes.length > 0 && (
                            <Button
                                startIcon={<AddRoundedIcon />}
                                onClick={addExpediente}
                                disabled={isSubmitting || !canAddExpediente}
                                sx={{
                                    mt: 0.5,
                                    py: 1.2,
                                    borderRadius: 2.5,
                                    border: "1px dashed #C5CDD8",
                                    color: "#24476A",
                                    "&:hover": { backgroundColor: "#F1F5FA" },
                                }}
                            >
                                {canAddExpediente
                                    ? "Agregar otro expediente"
                                    : `Máximo de ${SOLICITUD_LIMITS.MAX_EXPEDIENTES} expedientes alcanzado`}
                            </Button>
                        )}
                    </Box>
                </Paper>

                {/* Botones */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        justifyContent: "flex-end",
                        gap: 2,
                    }}
                >
                    <Button
                        variant="outlined"
                        onClick={() => router.push(SOLICITUDES_PATH)}
                        disabled={isSubmitting}
                        sx={{ ...secondaryButtonSx, width: { xs: "100%", sm: "140px" } }}
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant="contained"
                        type="submit"
                        disabled={isSubmitting}
                        aria-busy={isSubmitting}
                        startIcon={
                            isSubmitting ? (
                                <CircularProgress size={18} color="inherit" />
                            ) : undefined
                        }
                        sx={{
                            width: { xs: "100%", sm: "160px" },
                            py: 1.2,
                            borderRadius: 3,
                            boxShadow: "none",
                        }}
                    >
                        {isSubmitting ? "Guardando..." : "Guardar"}
                    </Button>
                </Box>
            </Box>

            {/* Error al registrar la solicitud */}
            <Snackbar
                open={!!submitError}
                autoHideDuration={8000}
                onClose={(_, reason) => {
                    if (reason !== "clickaway") clearSubmitError();
                }}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    severity="error"
                    variant="filled"
                    onClose={clearSubmitError}
                    sx={{ width: "100%", maxWidth: 640 }}
                >
                    <Typography sx={{ fontWeight: 700, fontSize: "0.9rem" }}>
                        No se pudo guardar la solicitud
                    </Typography>
                    <Typography sx={{ fontSize: "0.85rem" }}>{submitError}</Typography>
                </Alert>
            </Snackbar>
        </Box>
    );
}
