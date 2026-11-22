// Roles del sistema: deben coincidir con los del backend (src/utils/constants.js)
export const ROLES = {
    ADMINISTRADOR: "Administrador",
    FUNCIONARIO: "Funcionario",
} as const;

export type Rol = (typeof ROLES)[keyof typeof ROLES];

// Identificadores de cada rol en la base de datos (ver prisma/seed.js del backend)
export const ROLE_IDS: Record<Rol, number> = {
    [ROLES.ADMINISTRADOR]: 1,
    [ROLES.FUNCIONARIO]: 2,
};

// Opciones para los selectores de rol en los formularios
export const ROLE_OPTIONS = Object.values(ROLES).map((nombre) => ({
    id_rol: ROLE_IDS[nombre],
    nombre,
}));

export function getRoleName(id_rol: number): Rol | undefined {
    return ROLE_OPTIONS.find((rol) => rol.id_rol === id_rol)?.nombre;
}

export function getRoleId(nombre: string): number | undefined {
    return ROLE_OPTIONS.find((rol) => rol.nombre === nombre)?.id_rol;
}
