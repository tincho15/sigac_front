// Tipos del detalle de solicitud.
// Reflejan el DTO del backend (Backend/src/dtos/solicitud.dto.js -> toSolicitudDetalleResponse).
// Las fechas llegan serializadas como string ISO.

export type UsuarioResumen = {
    id_usuario: number;
    nombre: string;
    email: string;
};

export type Catalogo = {
    nombre: string;
};

export type TipoSolicitud = Catalogo & { id_tipo: number };

export type EstadoSolicitud = Catalogo & { id_estado: number };

export type EmailRecibido = {
    id_email: number;
    remitente: string;
    asunto: string | null;
    fecha_recepcion: string;
};

export type AsignacionActual = {
    id_asignacion: number;
    fecha_asignacion: string;
    asignado: UsuarioResumen | null;
    asignador: UsuarioResumen | null;
};

export type ExpedienteSolicitud = {
    id_expediente: number;
    iue: string | null;
    numero: string | null;
    ficha: string | null;
    nro_archivo: string | null;
    juzgado: {
        id_juzgado: number;
        numero: string;
        nombre: string;
    };
    ubicacion: {
        id_ubicacion: number;
        piso: string;
        nro_estanteria: string;
        anio: string;
    } | null;
    // Datos de la relación solicitud-expediente
    estado: EstadoSolicitud;
    observaciones: string | null;
    fecha_inicio: string;
    fecha_fin: string | null;
};

export type DocumentoSolicitud = {
    id_documento: number;
    tipo_documento: string;
    datos_extraidos: string | null;
    confianza_ocr: string | null;
    fecha_procesamiento: string;
};

export type HistorialSolicitud = {
    id_historial: number;
    fecha: string;
    accion: string;
    detalle: string | null;
    usuario: UsuarioResumen | null;
};

export type SolicitudDetalle = {
    id_solicitud: number;
    fecha: string;
    origen: string;
    observaciones: string | null;
    tipo: TipoSolicitud;
    estado: EstadoSolicitud;
    usuario: UsuarioResumen | null;
    email: EmailRecibido | null;
    asignacion: AsignacionActual | null;
    expedientes: ExpedienteSolicitud[];
    documentos: DocumentoSolicitud[];
    historial: HistorialSolicitud[];
};
