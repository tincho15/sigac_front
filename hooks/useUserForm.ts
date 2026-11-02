
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

    return { formData, errors, handleChange, validateForm };
}
