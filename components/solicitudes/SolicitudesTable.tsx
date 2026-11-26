import Link from "next/link";
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import EstadoChip from "@/components/solicitudes/EstadoChip";
import type { Solicitud } from "@/services/solicitudes/solicitudService";

const HEADER_CELL_SX = {
    color: "#34445A",
    fontSize: "0.8rem",
    fontWeight: 700,
    backgroundColor: "#F8FAFC",
    borderBottom: "1px solid #E0E6ED",
    whiteSpace: "nowrap",
};

const BODY_CELL_SX = {
    color: "#263445",
    fontSize: "0.875rem",
    borderBottom: "1px solid #E8EDF2",
};

function formatFecha(fecha: string) {
    return new Date(fecha).toLocaleDateString("es-UY", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

function formatExpedientes(cantidad: number) {
    return cantidad === 1 ? "1 expediente" : `${cantidad} expedientes`;
}

type SolicitudesTableProps = {
    solicitudes: Solicitud[];
};

export default function SolicitudesTable({ solicitudes }: SolicitudesTableProps) {
    return (
        <TableContainer>
            <Table aria-label="Listado de solicitudes">
                <TableHead>
                    <TableRow>
                        <TableCell sx={HEADER_CELL_SX}>Solicitud</TableCell>
                        <TableCell sx={HEADER_CELL_SX}>Fecha</TableCell>
                        <TableCell sx={HEADER_CELL_SX}>Estado</TableCell>
                        <TableCell sx={HEADER_CELL_SX}>Expedientes</TableCell>
                        <TableCell sx={HEADER_CELL_SX}>Funcionario asignado</TableCell>
                        <TableCell sx={HEADER_CELL_SX} />
                    </TableRow>
                </TableHead>

                <TableBody>
                    {solicitudes.map((solicitud) => (
                        <TableRow
                            key={solicitud.id_solicitud}
                            hover
                            sx={{ "&:last-child td": { borderBottom: 0 } }}
                        >
                            <TableCell sx={BODY_CELL_SX}>
                                <Typography
                                    sx={{
                                        color: "#142D4E",
                                        fontWeight: 700,
                                        fontSize: "0.9rem",
                                    }}
                                >
                                    #{solicitud.id_solicitud}
                                </Typography>

                                <Typography
                                    sx={{ color: "#64748B", fontSize: "0.78rem" }}
                                >
                                    {solicitud.tipo.nombre} · {solicitud.origen}
                                </Typography>
                            </TableCell>

                            <TableCell sx={BODY_CELL_SX}>
                                {formatFecha(solicitud.fecha)}
                            </TableCell>

                            <TableCell sx={BODY_CELL_SX}>
                                <EstadoChip nombre={solicitud.estado.nombre} />
                            </TableCell>

                            <TableCell sx={BODY_CELL_SX}>
                                {formatExpedientes(solicitud.cantidad_expedientes)}
                            </TableCell>

                            <TableCell sx={BODY_CELL_SX}>
                                {solicitud.asignado ? (
                                    solicitud.asignado.nombre
                                ) : (
                                    <Typography
                                        component="span"
                                        sx={{
                                            color: "#94A3B8",
                                            fontSize: "inherit",
                                            fontStyle: "italic",
                                        }}
                                    >
                                        Sin asignar
                                    </Typography>
                                )}
                            </TableCell>

                            <TableCell sx={BODY_CELL_SX} align="right">
                                <Button
                                    component={Link}
                                    href={`/solicitudes/${solicitud.id_solicitud}`}
                                    size="small"
                                    sx={{ color: "#24476A", fontWeight: 600 }}
                                >
                                    Ver detalle
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
