
import { useState } from "react";

type UserFormData = {
    email: string;
    nombre: string;
    id_rol: number | "";
};

export default function useUserForm() {
    const [formData, setFormData] = useState<UserFormData>({
        email: "",
        nombre: "",
        id_rol: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [temporaryPassword, setTemporaryPassword] = useState("");
    const [passwordCopied, setPasswordCopied] = useState(false);

    const handleChange = (field: keyof UserFormData, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [field]: "",
        }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.nombre.trim()) {
            newErrors.nombre = "Por favor, complete este campo";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Por favor, complete este campo";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Formato de correo electrónico no válido";
        }

        if (formData.id_rol === "") {
            newErrors.id_rol = "Por favor, seleccione un rol";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return false;

        setIsSubmitting(true);
        setSubmitError("");

        try {
            const response = await fetch("/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email.trim(),
                    nombre: formData.nombre.trim(),
                    id_rol: formData.id_rol,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || data.error || "No se pudo registrar el usuario."
                );
            }

            setTemporaryPassword(data.password);
            setPasswordCopied(false);

            return true;

        } catch (error) {
            setSubmitError(
                error instanceof Error
                    ? error.message
                    : "Ocurrió un error al registrar el usuario."
            );

            return false;

        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCopyPassword = async () => {
        try {
            await navigator.clipboard.writeText(temporaryPassword);
            setPasswordCopied(true);

            setTimeout(() => {
                setPasswordCopied(false);
            }, 2000);
        } catch {
            setPasswordCopied(false);
        }
    };

    return {
        formData,
        errors,
        isSubmitting,
        submitError,
        temporaryPassword,
        passwordCopied,
        handleChange,
        validateForm,
        handleSubmit,
        handleCopyPassword
    };
}
