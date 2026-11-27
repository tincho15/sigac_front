// Catálogo tipo_solicitud precargado por el seed del gateway (prisma/seed.js).
// TODO: reemplazar por un endpoint de catálogo cuando el gateway lo exponga,
// para no depender de que los ids coincidan con el orden del seed.
export const TIPOS_SOLICITUD = [
    { id_tipo: 1, nombre: "Archivo" },
    { id_tipo: 2, nombre: "Desarchivo" },
    { id_tipo: 3, nombre: "Desarchivo interno" },
] as const;

// Límites de validación del gateway (src/validators/solicitud.validator.js)
export const SOLICITUD_LIMITS = {
    ORIGEN_MAX_LENGTH: 50,
    OBSERVACIONES_MAX_LENGTH: 2000,
    EXPEDIENTE_CAMPO_MAX_LENGTH: 50,
    MAX_EXPEDIENTES: 100,
} as const;

// IUE (Identificador Único de Expediente): sede-numero/anio, p. ej. 2-12345/2024
export const IUE_PATTERN = /^\d{1,4}-\d{1,8}\/\d{4}$/;

export const SOLICITUDES_PATH = "/solicitudes";
export const NEW_SOLICITUD_PATH = "/solicitudes/nueva";
