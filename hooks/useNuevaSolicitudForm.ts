
import { useCallback, useRef, useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { IUE_PATTERN, SOLICITUD_LIMITS } from "@/config/solicitudes";
import {
    createSolicitud,
    SessionExpiredError,
    type NuevoExpediente,
} from "@/services/solicitudes/solicitudService";

export type ExpedienteFormData = {
    // Identificador local de la fila (no se envía al backend)
    key: number;
    iue: string;
    numero: string;
    ficha: string;
    nro_archivo: string;
    id_juzgado: string;
    observaciones: string;
};

export type ExpedienteField = Exclude<keyof ExpedienteFormData, "key">;

type SolicitudFormData = {
    id_tipo: number | "";
    origen: string;
    observaciones: string;
};

type SolicitudField = keyof SolicitudFormData;

export type ExpedienteErrors = Partial<Record<ExpedienteField | "identificador", string>>;

type FormErrors = {
    solicitud: Partial<Record<SolicitudField | "expedientes", string>>;
    expedientes: Record<number, ExpedienteErrors>;
};

const REQUIRED = "Por favor, complete este campo";

const EMPTY_ERRORS: FormErrors = { solicitud: {}, expedientes: {} };

let nextKey = 1;

function emptyExpediente(): ExpedienteFormData {
    return {
        key: nextKey++,
        iue: "",
        numero: "",
        ficha: "",
        nro_archivo: "",
        id_juzgado: "",
        observaciones: "",
    };
}

// Devuelve el texto sin espacios en los extremos, o undefined si queda vacío
function optional(value: string) {
    const trimmed = value.trim();
    return trimmed ? trimmed : undefined;
}

function validateExpediente(expediente: ExpedienteFormData): ExpedienteErrors {
    const errors: ExpedienteErrors = {};
    const { EXPEDIENTE_CAMPO_MAX_LENGTH, OBSERVACIONES_MAX_LENGTH } = SOLICITUD_LIMITS;

    const iue = expediente.iue.replace(/\s+/g, "");
    if (iue && !IUE_PATTERN.test(iue)) {
        errors.iue = "Formato sede-numero/año (p. ej. 2-12345/2024)";
    }

    for (const field of ["numero", "ficha", "nro_archivo"] as const) {
        if (expediente[field].trim().length > EXPEDIENTE_CAMPO_MAX_LENGTH) {
            errors[field] = `Hasta ${EXPEDIENTE_CAMPO_MAX_LENGTH} caracteres`;
        }
    }

    if (
        !iue &&
        !expediente.numero.trim() &&
        !expediente.ficha.trim() &&
        !expediente.nro_archivo.trim()
    ) {
        errors.identificador =
            "Indique al menos uno de: IUE, número, ficha o número de archivo";
    }

    const juzgado = Number(expediente.id_juzgado);
    if (!expediente.id_juzgado.trim()) {
        errors.id_juzgado = REQUIRED;
    } else if (!Number.isInteger(juzgado) || juzgado < 1) {
        errors.id_juzgado = "Debe ser un número entero positivo";
    }

    if (expediente.observaciones.trim().length > OBSERVACIONES_MAX_LENGTH) {
        errors.observaciones = `Hasta ${OBSERVACIONES_MAX_LENGTH} caracteres`;
    }

    return errors;
}

function toNuevoExpediente(expediente: ExpedienteFormData): NuevoExpediente {
    return {
        iue: optional(expediente.iue.replace(/\s+/g, "")),
        numero: optional(expediente.numero),
        ficha: optional(expediente.ficha),
        nro_archivo: optional(expediente.nro_archivo),
        id_juzgado: Number(expediente.id_juzgado),
        observaciones: optional(expediente.observaciones),
    };
}

export default function useNuevaSolicitudForm() {
    const { logout } = useAuth();

    const [formData, setFormData] = useState<SolicitudFormData>({
        id_tipo: "",
        origen: "",
        observaciones: "",
    });
    const [expedientes, setExpedientes] = useState<ExpedienteFormData[]>(() => [
        emptyExpediente(),
    ]);
    // Expediente desplegado en el acordeón (uno a la vez, para que la página
    // no crezca aunque la solicitud tenga muchos expedientes)
    const [expandedKey, setExpandedKey] = useState<number | null>(
        () => expedientes[0]?.key ?? null
    );
    const [errors, setErrors] = useState<FormErrors>(EMPTY_ERRORS);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    // Evita envíos duplicados por doble clic antes de que se re-renderice
    const submittingRef = useRef(false);

    const handleChange = useCallback(
        (field: SolicitudField, value: string | number) => {
            setFormData((prev) => ({ ...prev, [field]: value }));
            setErrors((prev) => ({
                ...prev,
                solicitud: { ...prev.solicitud, [field]: undefined },
            }));
        },
        []
    );

    const handleExpedienteChange = useCallback(
        (key: number, field: ExpedienteField, value: string) => {
            setExpedientes((prev) =>
                prev.map((item) =>
                    item.key === key ? { ...item, [field]: value } : item
                )
            );
            setErrors((prev) => {
                const current = prev.expedientes[key];
                if (!current) return prev;

                return {
                    ...prev,
                    expedientes: {
                        ...prev.expedientes,
                        [key]: { ...current, [field]: undefined, identificador: undefined },
                    },
                };
            });
        },
        []
    );

    // Agrega un expediente vacío y lo despliega, plegando el que estaba abierto
    const addExpediente = useCallback(() => {
        if (expedientes.length >= SOLICITUD_LIMITS.MAX_EXPEDIENTES) return;

        const nuevo = emptyExpediente();

        setExpedientes((prev) => [...prev, nuevo]);
        setExpandedKey(nuevo.key);
        setErrors((prev) => ({
            ...prev,
            solicitud: { ...prev.solicitud, expedientes: undefined },
        }));
    }, [expedientes.length]);

    const toggleExpediente = useCallback((key: number, expanded: boolean) => {
        setExpandedKey(expanded ? key : null);
    }, []);

    const removeExpediente = useCallback((key: number) => {
        setExpedientes((prev) => prev.filter((item) => item.key !== key));
        setExpandedKey((current) => (current === key ? null : current));
        setErrors((prev) => {
            const rest = { ...prev.expedientes };
            delete rest[key];
            return { ...prev, expedientes: rest };
        });
    }, []);

    const validateForm = () => {
        const { ORIGEN_MAX_LENGTH, OBSERVACIONES_MAX_LENGTH } = SOLICITUD_LIMITS;
        const solicitudErrors: FormErrors["solicitud"] = {};
        const expedienteErrors: FormErrors["expedientes"] = {};

        if (formData.id_tipo === "") {
            solicitudErrors.id_tipo = "Por favor, seleccione un tipo de solicitud";
        }

        const origen = formData.origen.trim();
        if (!origen) {
            solicitudErrors.origen = REQUIRED;
        } else if (origen.length > ORIGEN_MAX_LENGTH) {
            solicitudErrors.origen = `Hasta ${ORIGEN_MAX_LENGTH} caracteres`;
        }

        if (formData.observaciones.trim().length > OBSERVACIONES_MAX_LENGTH) {
            solicitudErrors.observaciones = `Hasta ${OBSERVACIONES_MAX_LENGTH} caracteres`;
        }

        if (expedientes.length === 0) {
            solicitudErrors.expedientes = "Agregue al menos un expediente";
        }

        for (const expediente of expedientes) {
            const itemErrors = validateExpediente(expediente);
            if (Object.keys(itemErrors).length > 0) {
                expedienteErrors[expediente.key] = itemErrors;
            }
        }

        setErrors({ solicitud: solicitudErrors, expedientes: expedienteErrors });

        // Despliega el primer expediente con errores para que se vean sus campos
        const firstInvalid = expedientes.find((item) => expedienteErrors[item.key]);
        if (firstInvalid) {
            setExpandedKey(firstInvalid.key);
        }

        return (
            Object.keys(solicitudErrors).length === 0 &&
            Object.keys(expedienteErrors).length === 0
        );
    };

    // Devuelve true si la solicitud se registró correctamente
    const handleSubmit = async () => {
        if (submittingRef.current || !validateForm()) return false;

        submittingRef.current = true;
        setIsSubmitting(true);
        setSubmitError("");

        try {
            await createSolicitud({
                id_tipo: formData.id_tipo as number,
                origen: formData.origen.trim(),
                observaciones: optional(formData.observaciones),
                expedientes: expedientes.map(toNuevoExpediente),
            });

            // isSubmitting queda en true: el spinner sigue visible hasta
            // que la página redirige al listado
            return true;
        } catch (error) {
            submittingRef.current = false;
            setIsSubmitting(false);

            if (error instanceof SessionExpiredError) {
                void logout();
                return false;
            }

            setSubmitError(
                error instanceof Error
                    ? error.message
                    : "Ocurrió un error al registrar la solicitud."
            );

            return false;
        }
    };

    const clearSubmitError = useCallback(() => setSubmitError(""), []);

    return {
        formData,
        expedientes,
        expandedKey,
        errors,
        isSubmitting,
        submitError,
        handleChange,
        handleExpedienteChange,
        addExpediente,
        toggleExpediente,
        removeExpediente,
        handleSubmit,
        clearSubmitError,
    };
}
