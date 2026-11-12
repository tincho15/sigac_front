
import { Box, Typography } from "@mui/material";

export default function LoginBranding() {
    return (
        <Box
            sx={{
                display: { xs: "none", md: "flex" },
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                textAlign: "center",
                background: "linear-gradient(160deg, #142D4E 0%, #0D2038 100%)",
                color: "primary.contrastText",
                px: 8,
                py: 7,
            }}
        >
            <Box sx={{ maxWidth: 480, my: "auto" }}>
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 800,
                        letterSpacing: "0.05em",
                        mb: 4,
                    }}
                >
                    SIGAC
                </Typography>

                <Box
                    sx={{
                        width: 50,
                        height: 4,
                        borderRadius: 2,
                        bgcolor: "warning.main",
                        mx: "auto",
                        mb: 3,
                    }}
                />

                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 700,
                        lineHeight: 1.35,
                        mb: 2,
                    }}
                >
                    Sistema Integral de Gestión del Archivo Central
                </Typography>

                <Typography
                    sx={{
                        opacity: 0.78,
                        lineHeight: 1.6,
                        fontSize: "0.95rem",
                    }}
                >
                    Gestión eficiente y segura de las solicitudes de archivo judicial.
                </Typography>
            </Box>

            <Typography
                sx={{
                    fontSize: "0.8rem",
                    opacity: 0.5,
                    letterSpacing: "0.02em",
                }}
            >
                Poder Judicial · Plataforma de Gestión Documental
            </Typography>
        </Box>
    );
}
