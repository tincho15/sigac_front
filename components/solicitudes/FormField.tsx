import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

// Campo de formulario con la etiqueta encima del input
export default function FormField({
    label,
    children,
}: {
    label: string;
    children: ReactNode;
}) {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography
                sx={{
                    color: "#34445A",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    px: 1,
                }}
            >
                {label}
            </Typography>
            {children}
        </Box>
    );
}
