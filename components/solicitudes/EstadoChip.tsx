import { Chip, type ChipProps } from "@mui/material";

// Colores según los estados precargados en el seed del backend
const ESTADO_COLORS: Record<string, ChipProps["color"]> = {
    "PENDIENTE": "warning",
    "EN PROCESO": "info",
    "FINALIZADA": "success",
    "CANCELADA": "error",
};

type EstadoChipProps = {
    nombre: string;
    size?: ChipProps["size"];
};

export default function EstadoChip({ nombre, size = "small" }: EstadoChipProps) {
    return (
        <Chip
            label={nombre}
            size={size}
            color={ESTADO_COLORS[nombre.toUpperCase()] ?? "default"}
            sx={{ fontWeight: 600 }}
        />
    );
}
