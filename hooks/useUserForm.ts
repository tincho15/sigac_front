
import { useState } from "react";

type UserFormData = {
    email: string;
    fullName: string;
    role: string;
};

export default function useUserForm() {
    const [formData, setFormData] = useState<UserFormData>({
        email: "",
        fullName: "",
        role: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (field: keyof UserFormData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = "Por favor, complete este campo";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Por favor, complete este campo";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Formato de correo electrónico no válido";
        }

        if (!formData.role) {
            newErrors.role = "Por favor, seleccione un rol";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    return { formData, errors, handleChange, validateForm };
}
