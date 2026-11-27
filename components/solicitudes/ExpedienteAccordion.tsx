
"use client";

import { memo } from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    TextField,
    Typography,
} from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import FormField from "@/components/solicitudes/FormField";
import { SOLICITUD_LIMITS } from "@/config/solicitudes";
import type {
    ExpedienteErrors,
    ExpedienteField,
    ExpedienteFormData,
} from "@/hooks/useNuevaSolicitudForm";

const EXPEDIENTE_FIELDS: {
    field: ExpedienteField;
    label: string;
    placeholder: string;
    numeric?: boolean;
}[] = [
    { field: "iue", label: "IUE", placeholder: "2-12345/2024" },
    { field: "numero", label: "Número", placeholder: "Número de expediente" },
    { field: "ficha", label: "Ficha", placeholder: "Ficha" },
    { field: "nro_archivo", label: "Nro. de archivo", placeholder: "Número de archivo" },
    // TODO: reemplazar por un selector cuando el gateway exponga el catálogo de juzgados
    { field: "id_juzgado", label: "Juzgado (ID) *", placeholder: "ID del juzgado", numeric: true },
];

// Resumen que se muestra con el expediente plegado
function describeExpediente(expediente: ExpedienteFormData) {
    const partes = [
        expediente.iue.trim() && `IUE ${expediente.iue.trim()}`,
        expediente.numero.trim() && `Nº ${expediente.numero.trim()}`,
        expediente.ficha.trim() && `Ficha ${expediente.ficha.trim()}`,
        expediente.nro_archivo.trim() && `Archivo ${expediente.nro_archivo.trim()}`,
        expediente.id_juzgado.trim() && `Juzgado ${expediente.id_juzgado.trim()}`,
    ].filter(Boolean);

    return partes.length > 0 ? partes.join(" · ") : "Sin datos cargados";
}

type ExpedienteAccordionProps = {
    expediente: ExpedienteFormData;
    index: number;
    errors?: ExpedienteErrors;
    expanded: boolean;
    disabled: boolean;
    onToggle: (key: number, expanded: boolean) => void;
    onChange: (key: number, field: ExpedienteField, value: string) => void;
    onRemove: (key: number) => void;
};

// Memoizado: al escribir en un expediente no se vuelven a renderizar los demás,
// lo que importa cuando la solicitud tiene muchos expedientes
function ExpedienteAccordion({
    expediente,
    index,
    errors,
    expanded,
    disabled,
    onToggle,
    onChange,
    onRemove,
}: ExpedienteAccordionProps) {
    const hasErrors = !!errors && Object.values(errors).some(Boolean);
    const summaryId = `expediente-${expediente.key}-summary`;
    const detailsId = `expediente-${expediente.key}-details`;

    return (
        <Accordion
            disableGutters
            elevation={0}
            expanded={expanded}
            onChange={(_, isExpanded) => onToggle(expediente.key, isExpanded)}
            // Los campos de los expedientes plegados no se montan en el DOM
            slotProps={{ transition: { unmountOnExit: true } }}
            sx={{
                border: "1px solid",
                borderColor: hasErrors ? "#F1B4B4" : "#E0E6ED",
                borderRadius: "10px !important",
                overflow: "hidden",
                "&::before": { display: "none" },
            }}
        >
            <AccordionSummary
                id={summaryId}
                aria-controls={detailsId}
                expandIcon={<ExpandMoreRoundedIcon />}
                sx={{
                    px: { xs: 2, md: 2.5 },
                    backgroundColor: expanded ? "#F8FAFC" : "transparent",
                    "& .MuiAccordionSummary-content": {
                        minWidth: 0,
                        alignItems: "center",
                        gap: 2,
                    },
                }}
            >
                <Typography sx={{ fontWeight: 700, color: "#263445", flexShrink: 0 }}>
                    Expediente {index + 1}
                </Typography>

                <Typography
                    noWrap
                    sx={{ color: "#64748B", fontSize: "0.85rem", minWidth: 0, flex: 1 }}
                >
                    {describeExpediente(expediente)}
                </Typography>

                {hasErrors && (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            color: "#D32F2F",
                            fontSize: "0.8rem",
                            flexShrink: 0,
                        }}
                    >
                        <ErrorOutlineRoundedIcon sx={{ fontSize: 18 }} />
                        <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                            Revisar datos
                        </Box>
                    </Box>
                )}
            </AccordionSummary>

            <AccordionDetails
                id={detailsId}
                sx={{
                    px: { xs: 2, md: 2.5 },
                    pt: 2.5,
                    pb: 2,
                    borderTop: "1px solid #E8EDF2",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "1fr 1fr",
                            md: "repeat(5, 1fr)",
                        },
                        gap: 2,
                    }}
                >
                    {EXPEDIENTE_FIELDS.map(({ field, label, placeholder, numeric }) => (
                        <FormField key={field} label={label}>
                            <TextField
                                fullWidth
                                size="small"
                                disabled={disabled}
                                value={expediente[field]}
                                onChange={(e) => onChange(expediente.key, field, e.target.value)}
                                error={!!errors?.[field]}
                                helperText={errors?.[field]}
                                placeholder={placeholder}
                                slotProps={{
                                    htmlInput: numeric
                                        ? { inputMode: "numeric", pattern: "[0-9]*" }
                                        : { maxLength: SOLICITUD_LIMITS.EXPEDIENTE_CAMPO_MAX_LENGTH },
                                }}
                            />
                        </FormField>
                    ))}
                </Box>

                {errors?.identificador && (
                    <Typography sx={{ color: "#D32F2F", fontSize: "0.8rem", px: 1 }}>
                        {errors.identificador}
                    </Typography>
                )}

                <FormField label="Observaciones del expediente">
                    <TextField
                        fullWidth
                        size="small"
                        disabled={disabled}
                        value={expediente.observaciones}
                        onChange={(e) =>
                            onChange(expediente.key, "observaciones", e.target.value)
                        }
                        error={!!errors?.observaciones}
                        helperText={errors?.observaciones}
                        placeholder="Observaciones (opcional)"
                        slotProps={{
                            htmlInput: { maxLength: SOLICITUD_LIMITS.OBSERVACIONES_MAX_LENGTH },
                        }}
                    />
                </FormField>

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                        size="small"
                        startIcon={<DeleteOutlineRoundedIcon fontSize="small" />}
                        onClick={() => onRemove(expediente.key)}
                        disabled={disabled}
                        aria-label={`Quitar expediente ${index + 1}`}
                        sx={{
                            color: "#64748B",
                            borderRadius: 2,
                            "&:hover": { color: "#D32F2F", backgroundColor: "#FDECEC" },
                        }}
                    >
                        Quitar expediente
                    </Button>
                </Box>
            </AccordionDetails>
        </Accordion>
    );
}

export default memo(ExpedienteAccordion);
