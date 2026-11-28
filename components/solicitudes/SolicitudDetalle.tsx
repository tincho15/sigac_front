"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import EstadoChip from "@/components/solicitudes/EstadoChip";
import useSolicitudDetalle from "@/hooks/useSolicitudDetalle";
import type { SolicitudDetalle as Solicitud, UsuarioResumen } from "@/types/solicitud";

const dateFormatter = new Intl.DateTimeFormat("es-UY", {
    dateStyle: "short",
    timeStyle: "short",
});

const formatDate = (value: string | null | undefined) =>
    value ? dateFormatter.format(new Date(value)) : "—";

const formatUsuario = (usuario: UsuarioResumen | null | undefined) =>
    usuario ? usuario.nombre : "—";

const orDash = (value: string | null | undefined) => (value?.trim() ? value : "—");

export default function SolicitudDetalle() {
    // useParams en lugar de leer params en la página: con cacheComponents,
    // acceder a params en el servidor fuera de <Suspense> bloquea el prerender
    const { id } = useParams<{ id: string }>();
    const { solicitud, status, error, reload } = useSolicitudDetalle(id);

    return (
        <Box sx={{ maxWidth: 1100, mx: "auto", display: "flex", flexDirection: "column", gap: 3 }}>
            <Box>
                <Button
                    component={Link}
                    href="/solicitudes"
                    startIcon={<ArrowBackIcon />}
                    sx={{ mb: 1 }}
                >
                    Volver a solicitudes
                </Button>
            </Box>

            {status === "loading" && (
                <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                    <CircularProgress />
                </Box>
            )}

            {status === "invalid" && (
                <Alert severity="warning">El identificador de la solicitud no es válido.</Alert>
            )}

            {status === "not-found" && (
                <Alert severity="info">La solicitud #{id} no existe.</Alert>
            )}

            {status === "forbidden" && (
                <Alert severity="warning">
                    No tenés permisos para ver esta solicitud. Solo podés ver las solicitudes que tenés asignadas.
                </Alert>
            )}

            {status === "error" && (
                <Alert
                    severity="error"
                    action={<Button color="inherit" size="small" onClick={() => void reload()}>Reintentar</Button>}
                >
                    {error || "No se pudo obtener la solicitud."}
                </Alert>
            )}

            {status === "success" && solicitud && <DetalleContenido solicitud={solicitud} />}
        </Box>
    );
}

function DetalleContenido({ solicitud }: { solicitud: Solicitud }) {
    return (
        <>
            {/* Encabezado */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                <Typography variant="h5" component="h1" sx={{ fontWeight: 700, color: "primary.main" }}>
                    Solicitud #{solicitud.id_solicitud}
                </Typography>
                <EstadoChip nombre={solicitud.estado.nombre} size="medium" />
            </Box>

            {/* Datos generales + asignación */}
            <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" } }}>
                <Section title="Datos generales">
                    <InfoGrid>
                        <InfoItem label="Tipo" value={solicitud.tipo.nombre} />
                        <InfoItem label="Origen" value={solicitud.origen} />
                        <InfoItem label="Fecha" value={formatDate(solicitud.fecha)} />
                        <InfoItem label="Creada por" value={formatUsuario(solicitud.usuario)} />
                    </InfoGrid>

                    {solicitud.email && (
                        <>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>Correo recibido</Typography>
                            <InfoGrid>
                                <InfoItem label="Remitente" value={solicitud.email.remitente} />
                                <InfoItem label="Recibido" value={formatDate(solicitud.email.fecha_recepcion)} />
                                <InfoItem label="Asunto" value={orDash(solicitud.email.asunto)} fullWidth />
                            </InfoGrid>
                        </>
                    )}

                    <Divider sx={{ my: 2 }} />
                    <InfoItem label="Observaciones" value={orDash(solicitud.observaciones)} multiline />
                </Section>

                <Section title="Asignación">
                    {solicitud.asignacion ? (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <InfoItem label="Asignada a" value={formatUsuario(solicitud.asignacion.asignado)} />
                            <InfoItem label="Asignada por" value={formatUsuario(solicitud.asignacion.asignador)} />
                            <InfoItem label="Fecha de asignación" value={formatDate(solicitud.asignacion.fecha_asignacion)} />
                        </Box>
                    ) : (
                        <EmptyText>La solicitud no tiene un responsable asignado.</EmptyText>
                    )}
                </Section>
            </Box>

            {/* Expedientes */}
            <Section title={`Expedientes (${solicitud.expedientes.length})`}>
                {solicitud.expedientes.length === 0 ? (
                    <EmptyText>No hay expedientes asociados.</EmptyText>
                ) : (
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>IUE</TableCell>
                                    <TableCell>Número</TableCell>
                                    <TableCell>Ficha</TableCell>
                                    <TableCell>Nº archivo</TableCell>
                                    <TableCell>Juzgado</TableCell>
                                    <TableCell>Ubicación</TableCell>
                                    <TableCell>Estado</TableCell>
                                    <TableCell>Inicio</TableCell>
                                    <TableCell>Fin</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {solicitud.expedientes.map((exp) => (
                                    <TableRow key={exp.id_expediente}>
                                        <TableCell>{orDash(exp.iue)}</TableCell>
                                        <TableCell>{orDash(exp.numero)}</TableCell>
                                        <TableCell>{orDash(exp.ficha)}</TableCell>
                                        <TableCell>{orDash(exp.nro_archivo)}</TableCell>
                                        <TableCell>{exp.juzgado.numero} - {exp.juzgado.nombre}</TableCell>
                                        <TableCell>
                                            {exp.ubicacion
                                                ? `Piso ${exp.ubicacion.piso} · Est. ${exp.ubicacion.nro_estanteria} · ${exp.ubicacion.anio}`
                                                : "—"}
                                        </TableCell>
                                        <TableCell><EstadoChip nombre={exp.estado.nombre} /></TableCell>
                                        <TableCell>{formatDate(exp.fecha_inicio)}</TableCell>
                                        <TableCell>{formatDate(exp.fecha_fin)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Section>

            {/* Documentos */}
            <Section title={`Documentos (${solicitud.documentos.length})`}>
                {solicitud.documentos.length === 0 ? (
                    <EmptyText>No hay documentos procesados.</EmptyText>
                ) : (
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Tipo</TableCell>
                                    <TableCell>Confianza OCR</TableCell>
                                    <TableCell>Procesado</TableCell>
                                    <TableCell>Datos extraídos</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {solicitud.documentos.map((doc) => (
                                    <TableRow key={doc.id_documento}>
                                        <TableCell>{doc.tipo_documento}</TableCell>
                                        <TableCell>{orDash(doc.confianza_ocr)}</TableCell>
                                        <TableCell>{formatDate(doc.fecha_procesamiento)}</TableCell>
                                        <TableCell sx={{ whiteSpace: "pre-wrap", maxWidth: 420 }}>
                                            {orDash(doc.datos_extraidos)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Section>

            {/* Historial */}
            <Section title="Historial">
                {solicitud.historial.length === 0 ? (
                    <EmptyText>No hay movimientos registrados.</EmptyText>
                ) : (
                    <Box component="ol" sx={{ listStyle: "none", m: 0, p: 0 }}>
                        {solicitud.historial.map((h, index) => (
                            <Box
                                component="li"
                                key={h.id_historial}
                                sx={{
                                    py: 1.5,
                                    borderTop: index === 0 ? "none" : "1px solid",
                                    borderColor: "divider",
                                }}
                            >
                                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
                                    <Typography sx={{ fontWeight: 600 }}>{h.accion}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {formatDate(h.fecha)} · {formatUsuario(h.usuario)}
                                    </Typography>
                                </Box>
                                {h.detalle && (
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, whiteSpace: "pre-wrap" }}>
                                        {h.detalle}
                                    </Typography>
                                )}
                            </Box>
                        ))}
                    </Box>
                )}
            </Section>
        </>
    );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
    return (
        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}>
            <Typography variant="h6" component="h2" sx={{ fontSize: "1rem", fontWeight: 700, mb: 2 }}>
                {title}
            </Typography>
            {children}
        </Paper>
    );
}

function InfoGrid({ children }: { children: ReactNode }) {
    return (
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
            {children}
        </Box>
    );
}

type InfoItemProps = {
    label: string;
    value: string;
    fullWidth?: boolean;
    multiline?: boolean;
};

function InfoItem({ label, value, fullWidth, multiline }: InfoItemProps) {
    return (
        <Box sx={fullWidth ? { gridColumn: "1 / -1" } : undefined}>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                {label}
            </Typography>
            <Typography sx={{ wordBreak: "break-word", whiteSpace: multiline ? "pre-wrap" : undefined }}>
                {value}
            </Typography>
        </Box>
    );
}

function EmptyText({ children }: { children: ReactNode }) {
    return <Typography color="text.secondary">{children}</Typography>;
}
