
"use client";

import Link from "next/link";
import {
    Box,
    Button,
    CircularProgress,
    Paper,
    Typography,
    TablePagination,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import { useAuth } from "@/components/auth/AuthContext";
import SolicitudesTable from "@/components/solicitudes/SolicitudesTable";
import useSolicitudes from "@/hooks/useSolicitudes";
import { ROLES } from "@/config/roles";
// Formulario de alta (T-24). Solo el administrador ingresa solicitudes (CU-06).
import { NEW_SOLICITUD_PATH } from "@/config/solicitudes";

export default function SolicitudesList() {
    const { user } = useAuth();

    const {
        status,
        solicitudes,
        total,
        page,
        pageSize,
        nextPage,
        previousPage,
        retry,
    } = useSolicitudes();

    const canCreate = user?.rol.nombre === ROLES.ADMINISTRADOR;

    return (
        <Box sx={{ maxWidth: 1280, mx: "auto", py: { xs: 2, md: 4 } }}>
            {/* Encabezado */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
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
                        GESTIÓN DE SOLICITUDES
                    </Typography>

                    <Typography
                        variant="h4"
                        sx={{ color: "#142D4E", fontWeight: 700 }}
                    >
                        Listado de solicitudes
                    </Typography>
                </Box>

                {canCreate && (
                    <Button
                        component={Link}
                        href={NEW_SOLICITUD_PATH}
                        variant="contained"
                        startIcon={<AddRoundedIcon />}
                        sx={{
                            px: 2.5,
                            py: 1.2,
                            borderRadius: 3,
                            boxShadow: "none",
                        }}
                    >
                        Agregar
                    </Button>
                )}
            </Box>

            {/* Tarjeta con el listado */}
            <Paper
                elevation={0}
                sx={{
                    border: "1px solid #E0E6ED",
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: "0 4px 18px rgba(20, 45, 78, 0.04)",
                }}
            >
                {status === "loading" && (
                    <Box
                        role="status"
                        aria-live="polite"
                        sx={{
                            py: 10,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 2,
                        }}
                    >
                        <CircularProgress size={36} />

                        <Typography sx={{ color: "#64748B", fontSize: "0.9rem" }}>
                            Cargando solicitudes...
                        </Typography>
                    </Box>
                )}

                {status === "error" && (
                    <Box
                        role="alert"
                        sx={{
                            py: 10,
                            px: 2,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 2,
                            textAlign: "center",
                        }}
                    >
                        <ErrorOutlineRoundedIcon
                            sx={{ color: "#D32F2F", fontSize: 40 }}
                        />

                        <Typography sx={{ color: "#263445", fontWeight: 600 }}>
                            No se pudieron cargar las solicitudes
                        </Typography>

                        <Button
                            variant="contained"
                            onClick={retry}
                            sx={{
                                px: 3,
                                py: 1.2,
                                borderRadius: 3,
                                boxShadow: "none",
                            }}
                        >
                            Reintentar
                        </Button>
                    </Box>
                )}

                {status === "success" && solicitudes.length === 0 && (
                    <Box
                        sx={{
                            py: 10,
                            px: 2,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 2,
                            textAlign: "center",
                        }}
                    >
                        <AssignmentOutlinedIcon
                            sx={{ color: "#94A3B8", fontSize: 40 }}
                        />

                        <Typography sx={{ color: "#64748B" }}>
                            No hay solicitudes ingresadas para mostrar
                        </Typography>
                    </Box>
                )}

                {status === "success" && solicitudes.length > 0 && (
                    <>
                        <SolicitudesTable solicitudes={solicitudes} />

                        <TablePagination
                            component="div"
                            count={total}
                            page={page - 1}
                            rowsPerPage={pageSize}
                            rowsPerPageOptions={[10]}
                            onPageChange={(_, newPage) => {
                                if (newPage > page - 1) {
                                    nextPage();
                                } else {
                                    previousPage();
                                }
                            }}
                            labelRowsPerPage="Solicitudes por página:"
                            labelDisplayedRows={({ from, to, count }) =>
                                `${from}-${to} de ${count}`
                            }
                            sx={{
                                borderTop: "1px solid #E0E6ED",
                                color: "#64748B",
                                ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
                                    fontSize: "0.8rem",
                                },
                            }}
                        />
                    </>
                )}
            </Paper>
        </Box>
    );
}
