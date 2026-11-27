import { Chip } from "@mui/material";

type EstadoColors = {
    background: string;
    color: string;
};

// Colores por estado (nombres de la tabla estado, ver prisma/seed.js)
const ESTADO_COLORS: Record<string, EstadoColors> = {
    "Pendiente": { background: "#FFF4E0", color: "#A86400" },
    "En Proceso": { background: "#E8F0FA", color: "#24476A" },
    "Finalizada": { background: "#EAF5EE", color: "#245B3D" },
    "Cancelada": { background: "#F1F3F5", color: "#64748B" },
};

const DEFAULT_COLORS: EstadoColors = {
    background: "#F1F3F5",
    color: "#64748B",
};

type EstadoChipProps = {
    nombre: string;
};

export default function EstadoChip({ nombre }: EstadoChipProps) {
    const colors = ESTADO_COLORS[nombre] ?? DEFAULT_COLORS;

    return (
        <Chip
            label={nombre}
            size="small"
            sx={{
                backgroundColor: colors.background,
                color: colors.color,
                fontWeight: 600,
                borderRadius: 2,
            }}
        />
    );
}
