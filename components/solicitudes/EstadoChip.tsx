import { Chip, type ChipProps } from "@mui/material";

type EstadoColors = {
    background: string;
    color: string;
};

// Colores por estado (nombres de la tabla estado, ver prisma/seed.js).
// Las claves van en mayúsculas para comparar sin distinguir mayúsculas/minúsculas.
const ESTADO_COLORS: Record<string, EstadoColors> = {
    "PENDIENTE": { background: "#FFF4E0", color: "#A86400" },
    "EN PROCESO": { background: "#E8F0FA", color: "#24476A" },
    "FINALIZADA": { background: "#EAF5EE", color: "#245B3D" },
    "CANCELADA": { background: "#F1F3F5", color: "#64748B" },
};

const DEFAULT_COLORS: EstadoColors = {
    background: "#F1F3F5",
    color: "#64748B",
};

type EstadoChipProps = {
    nombre: string;
    size?: ChipProps["size"];
};

export default function EstadoChip({ nombre, size = "small" }: EstadoChipProps) {
    const colors = ESTADO_COLORS[nombre.toUpperCase()] ?? DEFAULT_COLORS;

    return (
        <Chip
            label={nombre}
            size={size}
            sx={{
                backgroundColor: colors.background,
                color: colors.color,
                fontWeight: 600,
                borderRadius: 2,
            }}
        />
    );
}
