
"use client";

import { usePathname, useRouter } from "next/navigation";
import { Box, Typography } from "@mui/material";

import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";
import LogoutIcon from "@mui/icons-material/Logout";

const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
    { label: "Solicitudes", path: "/solicitudes", icon: <AssignmentIcon /> },
    { label: "Usuarios", path: "/usuarios", icon: <PeopleIcon /> },
    { label: "Cerrar sesión", path: "/logout", icon: <LogoutIcon /> },
];

type SidebarProps = {
    onNavigate?: () => void;
};

export default function Sidebar({ onNavigate }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <Box
            sx={{
                width: 250,
                height: "100vh",
                position: "sticky",
                overflowY: "auto",
                top: 0,
                backgroundColor: "#142D4E",
                display: "flex",
                flexDirection: "column",
                p: 2,
                flexShrink: 0,
                color: "#FFFFFF",
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
                        backgroundColor: "#24476A",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <AccountBalanceIcon sx={{ color: "#FFFFFF" }} />
                </Box>

                <Box>
                    <Typography sx={{ fontWeight: 700, color: "#FFFFFF" }}>
                        SIGAC
                    </Typography>
                    <Typography sx={{ fontSize: "0.7rem", color: "#AABBD0" }}>
                        Archivo Central
                    </Typography>
                </Box>
            </Box>

            {/* Menú principal */}
            <Typography
                sx={{
                    px: 2,
                    mb: 1.5,
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "#8FA4BD",
                    letterSpacing: 1.2,
                }}
            >
                MENÚ PRINCIPAL
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {menuItems.map((item) => {
                    const isActive =
                        pathname === item.path ||
                        pathname.startsWith(`${item.path}/`);

                    return (
                        <Box
                            key={item.path}
                            onClick={() => {
                                router.push(item.path);
                                onNavigate?.();
                            }}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                                px: 2,
                                py: 1.5,
                                borderRadius: 2,
                                cursor: "pointer",
                                color: isActive ? "#FFFFFF" : "#B8C6D8",
                                backgroundColor: isActive ? "#24476A" : "transparent",
                                fontWeight: isActive ? 600 : 400,
                                transition: "all 0.2s",
                                "&:hover": {
                                    backgroundColor: isActive ? "#24476A" : "#1C3A5B",
                                    color: "#FFFFFF",
                                },
                            }}
                        >
                            {item.icon}

                            <Typography
                                sx={{
                                    fontSize: "0.9rem",
                                    fontWeight: "inherit",
                                    color: "inherit",
                                }}
                            >
                                {item.label}
                            </Typography>
                        </Box>
                    );
                })}
            </Box>

            {/* Cuenta */}
            <Box sx={{ mt: "auto", pt: 2 }}>
                <Box
                    sx={{
                        borderTop: "1px solid #34506F",
                        pt: 2,
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
                            backgroundColor: "#24476A",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <PeopleIcon sx={{ color: "#FFFFFF", fontSize: 20 }} />
                    </Box>

                    <Box>
                        <Typography
                            sx={{
                                fontSize: "0.85rem",
                                color: "#FFFFFF",
                                fontWeight: 600,
                            }}
                        >
                            Administrador
                        </Typography>
                        <Typography sx={{ fontSize: "0.7rem", color: "#AABBD0" }}>
                            Cuenta activa
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
