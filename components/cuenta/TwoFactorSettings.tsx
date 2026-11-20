"use client";

import { useState, type FormEvent } from "react";
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider,
    Link,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import PhonelinkLockOutlinedIcon from "@mui/icons-material/PhonelinkLockOutlined";
import useTwoFactorSettings from "@/hooks/useTwoFactorSettings";

const CODE_PATTERN = /^\d{6}$/;

const onlyDigits = (value: string) => value.replace(/\D/g, "").slice(0, 6);

// Muestra la clave en bloques de 4 para copiarla a mano sin errores
const formatSecret = (secret: string) => secret.match(/.{1,4}/g)?.join(" ") ?? secret;

const codeInputProps = {
    htmlInput: {
        inputMode: "numeric" as const,
        autoComplete: "one-time-code",
        maxLength: 6,
        style: { letterSpacing: "0.4em" },
    },
};

type TwoFactorSettingsProps = {
    // Activación obligatoria del primer login (pantalla /activar-2fa, sin menú lateral)
    mandatory?: boolean;
};

export default function TwoFactorSettings({ mandatory = false }: TwoFactorSettingsProps) {
    const {
        status,
        enrollment,
        busy,
        error,
        success,
        startSetup,
        cancelSetup,
        confirmEnable,
        disable,
    } = useTwoFactorSettings();

    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [formError, setFormError] = useState("");

    const handleEnable = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormError("");

        if (!CODE_PATTERN.test(code)) {
            setFormError("Ingresá los 6 dígitos que muestra la app.");
            return;
        }

        if (await confirmEnable(code)) {
            setCode("");
        }
    };

    const handleDisable = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormError("");

        if (!password || !CODE_PATTERN.test(code)) {
            setFormError("Ingresá tu contraseña y el código de 6 dígitos.");
            return;
        }

        if (await disable(password, code)) {
            setCode("");
            setPassword("");
        }
    };

    const message = formError || error;

    return (
        <Box sx={{ maxWidth: 780, mx: "auto", py: { xs: 2, md: 4 } }}>
            {mandatory ? (
                <>
                    <Typography variant="h4" sx={{ color: "#142D4E", fontWeight: 700, mb: 2 }}>
                        Activá la verificación en dos pasos
                    </Typography>
                    <Alert severity="info" sx={{ mb: 4 }}>
                        Para proteger tu cuenta, SIGAC exige Google Authenticator. Activalo para
                        poder continuar; a partir de ahora se te pedirá un código al iniciar sesión.
                    </Alert>
                </>
            ) : (
                <>
                    <Typography
                        sx={{ color: "#64748B", fontSize: "0.75rem", fontWeight: 700, letterSpacing: 1, mb: 1 }}
                    >
                        MI CUENTA / SEGURIDAD
                    </Typography>

                    <Typography variant="h4" sx={{ color: "#142D4E", fontWeight: 700, mb: 4 }}>
                        Seguridad
                    </Typography>
                </>
            )}

            <Paper
                elevation={0}
                sx={{
                    border: "1px solid #E0E6ED",
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: "0 4px 18px rgba(20, 45, 78, 0.04)",
                }}
            >
                <Box
                    sx={{
                        px: { xs: 2.5, md: 4 },
                        py: 3,
                        backgroundColor: "#F8FAFC",
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                    }}
                >
                    <Box
                        sx={{
                            width: 46,
                            height: 46,
                            borderRadius: 2.5,
                            backgroundColor: "#E8F0FA",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                        }}
                    >
                        <PhonelinkLockOutlinedIcon sx={{ color: "#24476A", fontSize: 25 }} />
                    </Box>

                    <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontWeight: 700, color: "#263445", fontSize: "1.05rem" }}>
                            Verificación en dos pasos
                        </Typography>
                        <Typography sx={{ color: "#64748B", fontSize: "0.85rem", mt: 0.5 }}>
                            Además de la contraseña, se pedirá un código de Google Authenticator al
                            iniciar sesión.
                        </Typography>
                    </Box>

                    {status === "enabled" && <Chip label="Activada" color="success" size="small" />}
                    {(status === "disabled" || status === "enrolling") && (
                        <Chip label="Desactivada" size="small" />
                    )}
                </Box>

                <Divider sx={{ borderColor: "#E8EDF2" }} />

                <Box sx={{ px: { xs: 2.5, md: 4 }, py: 4, display: "flex", flexDirection: "column", gap: 3 }}>
                    {success && <Alert severity="success">{success}</Alert>}

                    {status === "loading" && (
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                            <CircularProgress size={28} />
                        </Box>
                    )}

                    {status === "unauthenticated" && (
                        <Alert severity="warning">
                            Tu sesión expiró. <Link href="/login">Iniciá sesión nuevamente</Link>.
                        </Alert>
                    )}

                    {status === "error" && (
                        <Alert severity="error">No se pudo consultar el estado de la verificación.</Alert>
                    )}

                    {status === "disabled" && (
                        <>
                            {message && <Alert severity="error">{message}</Alert>}
                            <Box>
                                <Button
                                    variant="contained"
                                    onClick={startSetup}
                                    disabled={busy}
                                    sx={{ borderRadius: 3, boxShadow: "none", py: 1.2, px: 3 }}
                                >
                                    {busy ? "Generando..." : "Activar verificación en dos pasos"}
                                </Button>
                            </Box>
                        </>
                    )}

                    {status === "enrolling" && enrollment && (
                        <Box component="form" noValidate onSubmit={handleEnable} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            <Typography sx={{ color: "#34445A", fontSize: "0.9rem" }}>
                                <strong>1.</strong> Instalá <strong>Google Authenticator</strong> en tu celular
                                (Android o iOS).
                                <br />
                                <strong>2.</strong> En la app tocá <strong>+</strong> → <strong>Escanear un código QR</strong>{" "}
                                y apuntá a esta imagen.
                            </Typography>

                            <Box
                                component="img"
                                src={enrollment.qrCode}
                                alt="Código QR para Google Authenticator"
                                sx={{ width: 200, height: 200, alignSelf: "center", border: "1px solid #E0E6ED", borderRadius: 2 }}
                            />

                            <Box>
                                <Typography sx={{ color: "#64748B", fontSize: "0.85rem", mb: 1 }}>
                                    ¿No podés escanearlo? Elegí <strong>Ingresar una clave de configuración</strong>{" "}
                                    y escribí esta clave (tipo: basada en el tiempo):
                                </Typography>
                                <Box
                                    sx={{
                                        p: 1.5,
                                        backgroundColor: "#F1F4F8",
                                        borderRadius: 2,
                                        fontFamily: "monospace",
                                        fontWeight: 700,
                                        letterSpacing: 1,
                                        color: "#142D4E",
                                        wordBreak: "break-all",
                                    }}
                                >
                                    {formatSecret(enrollment.secret)}
                                </Box>
                            </Box>

                            <Typography sx={{ color: "#34445A", fontSize: "0.9rem" }}>
                                <strong>3.</strong> Ingresá el código de 6 dígitos que aparece en la app para confirmar.
                            </Typography>

                            <TextField
                                value={code}
                                onChange={(e) => setCode(onlyDigits(e.target.value))}
                                placeholder="000000"
                                disabled={busy}
                                slotProps={codeInputProps}
                                sx={{ maxWidth: 220 }}
                            />

                            {message && <Alert severity="error">{message}</Alert>}

                            <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        setCode("");
                                        setFormError("");
                                        cancelSetup();
                                    }}
                                    disabled={busy}
                                    sx={{ borderRadius: 3, py: 1.2 }}
                                >
                                    Cancelar
                                </Button>
                                <Button type="submit" variant="contained" disabled={busy} sx={{ borderRadius: 3, boxShadow: "none", py: 1.2 }}>
                                    {busy ? "Verificando..." : "Confirmar y activar"}
                                </Button>
                            </Box>
                        </Box>
                    )}

                    {status === "enabled" && (
                        <Box component="form" noValidate onSubmit={handleDisable} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                            <Typography sx={{ color: "#34445A", fontSize: "0.9rem" }}>
                                Para desactivarla, confirmá tu contraseña y un código actual de la app.
                            </Typography>

                            <TextField
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Contraseña"
                                autoComplete="current-password"
                                disabled={busy}
                                sx={{ maxWidth: 360 }}
                            />

                            <TextField
                                value={code}
                                onChange={(e) => setCode(onlyDigits(e.target.value))}
                                placeholder="Código de 6 dígitos"
                                disabled={busy}
                                slotProps={codeInputProps}
                                sx={{ maxWidth: 360 }}
                            />

                            {message && <Alert severity="error">{message}</Alert>}

                            <Box>
                                <Button type="submit" variant="outlined" color="error" disabled={busy} sx={{ borderRadius: 3, py: 1.2 }}>
                                    {busy ? "Desactivando..." : "Desactivar verificación en dos pasos"}
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Paper>
        </Box>
    );
}
