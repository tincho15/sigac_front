
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
    alpha,
    Box,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@mui/material";

import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";
import LogoutIcon from "@mui/icons-material/Logout";

import { useAuth } from "@/components/auth/AuthContext";
import ConfirmDialog from "@/components/common/ConfirmDialog";

const navigationItems = [
    { label: "Dashboard", path: "/dashboard", icon: DashboardIcon },
    { label: "Solicitudes", path: "/solicitudes", icon: AssignmentIcon },
    { label: "Usuarios", path: "/usuarios", icon: PeopleIcon },
];

type SidebarProps = {
    onNavigate?: () => void;
};

export default function Sidebar({ onNavigate }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();

    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

    const handleLogout = async () => {
        if (isLoggingOut) return;

        setIsLoggingOut(true);

        try {
            await logout();
        } catch (error) {
            console.error("Error al cerrar la sesión:", error);
        } finally {
            setOpenLogoutDialog(false);
            router.replace("/login");
            onNavigate?.();
        }
    };

    const handleNavigate = () => {
        onNavigate?.();
    };

    return (
        <Box
            component="aside"
            sx={{
                width: 250,
                height: "100vh",
                position: "sticky",
                top: 0,
                display: "flex",
                flexDirection: "column",
                flexShrink: 0,
                p: 2,
                overflowY: "auto",
                bgcolor: "primary.main",
                color: "primary.contrastText",
            }}
        >
            {/* Identidad del sistema */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 6,
                    px: 1,
                    py: 1,
                }}
            >
                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: "primary.light",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <AccountBalanceIcon />
                </Box>

                <Box>
                    <Typography sx={{ fontWeight: 700 }}>
                        SIGAC
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: "0.7rem",
                            color: (theme) =>
                                alpha(theme.palette.primary.contrastText, 0.65),
                        }}
                    >
                        Archivo Central
                    </Typography>
                </Box>
            </Box>

            {/* Navegación */}
            <Typography
                sx={{
                    px: 2,
                    mb: 1.5,
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: (theme) =>
                        alpha(theme.palette.primary.contrastText, 0.55),
                    letterSpacing: 1.2,
                }}
            >
                MENÚ PRINCIPAL
            </Typography>

            <List
                disablePadding
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                }}
            >
                {navigationItems.map(({ label, path, icon: Icon }) => {
                    const isActive =
                        pathname === path || pathname.startsWith(`${path}/`);

                    return (
                        <ListItemButton
                            key={path}
                            component={Link}
                            href={path}
                            selected={isActive}
                            onClick={handleNavigate}
                            sx={{
                                gap: 1.5,
                                px: 2,
                                py: 1.5,
                                borderRadius: 2,
                                color: (theme) =>
                                    alpha(theme.palette.primary.contrastText, 0.72),
                                "& .MuiListItemIcon-root": {
                                    minWidth: "auto",
                                    color: "inherit",
                                },
                                "& .MuiListItemText-primary": {
                                    fontSize: "0.9rem",
                                },
                                "&.Mui-selected": {
                                    bgcolor: "primary.light",
                                    color: "primary.contrastText",
                                },
                                "&.Mui-selected:hover": {
                                    bgcolor: "primary.light",
                                },
                                "&:hover": {
                                    bgcolor: (theme) =>
                                        alpha(theme.palette.primary.contrastText, 0.08),
                                    color: "primary.contrastText",
                                },
                            }}
                        >
                            <ListItemIcon>
                                <Icon />
                            </ListItemIcon>

                            <ListItemText primary={label} />
                        </ListItemButton>
                    );
                })}
            </List>

            {/* Cerrar sesión */}
            <List disablePadding sx={{ mt: "auto" }}>
                <ListItemButton
                    onClick={() => setOpenLogoutDialog(true)}
                    disabled={isLoggingOut}
                    sx={{
                        gap: 1.5,
                        px: 2,
                        py: 1.5,
                        borderRadius: 2,
                        color: (theme) =>
                            alpha(theme.palette.primary.contrastText, 0.72),
                        "& .MuiListItemIcon-root": {
                            minWidth: "auto",
                            color: "inherit",
                        },
                        "& .MuiListItemText-primary": {
                            fontSize: "0.9rem",
                        },
                        "&:hover": {
                            bgcolor: (theme) =>
                                alpha(theme.palette.primary.contrastText, 0.08),
                            color: "primary.contrastText",
                        },
                    }}
                >
                    <ListItemIcon>
                        <LogoutIcon />
                    </ListItemIcon>

                    <ListItemText primary="Cerrar sesión" />
                </ListItemButton>
            </List>

            {/* Diálogo de confirmación */}
            <ConfirmDialog
                open={openLogoutDialog}
                title="¿Cerrar sesión?"
                description="¿Estás seguro de que deseas cerrar tu sesión?"
                confirmText="Cerrar sesión"
                onConfirm={() => void handleLogout()}
                onCancel={() => setOpenLogoutDialog(false)}
                loading={isLoggingOut}
            />

            {/* Cuenta */}
            <Box
                sx={{
                    borderTop: (theme) =>
                        `1px solid ${alpha(theme.palette.primary.contrastText, 0.15)}`,
                    pt: 2,
                    mt: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    px: 1,
                }}
            >
                <Box
                    sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        bgcolor: "primary.light",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    <PeopleIcon sx={{ fontSize: 20 }} />
                </Box>

                <Box sx={{ minWidth: 0 }}>
                    <Typography
                        sx={{ fontSize: "0.85rem", fontWeight: 600 }}
                        noWrap
                    >
                        {user?.nombre ?? "Usuario"}
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: "0.7rem",
                            color: (theme) =>
                                alpha(theme.palette.primary.contrastText, 0.65),
                        }}
                        noWrap
                    >
                        {user?.rol.nombre ?? "Cuenta activa"}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}
