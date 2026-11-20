export const AUTH_COOKIE_NAME = "sigac_session";

export const AUTH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60,
};

// Token intermedio del login con 2FA (entre la contraseña y el código de Google Authenticator)
export const TWO_FACTOR_COOKIE_NAME = "sigac_2fa";

export const TWO_FACTOR_COOKIE_OPTIONS = {
    ...AUTH_COOKIE_OPTIONS,
    maxAge: 5 * 60,
};