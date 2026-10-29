
"use client";

import { useState } from "react";
import {
    Box,
    Drawer,
    IconButton,
    Typography,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "./Sidebar";

type MainLayoutProps = {
    children: React.ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleCloseMenu = () => {
        setMobileOpen(false);
    };

    return (
        <Box
            sx={{
                display: "flex",
                minHeight: "100vh",
                backgroundColor: "#F1F4F8",
            }}
        >
            {/* Menú lateral permanente en escritorio */}
            <Box sx={{ display: { xs: "none", md: "block" } }}>
                <Sidebar />
            </Box>

            {/* Menú lateral desplegable en celular */}
            <Drawer
                anchor="left"
                open={mobileOpen}
                onClose={handleCloseMenu}
                sx={{
                    display: { xs: "block", md: "none" },
                    "& .MuiDrawer-paper": {
                        width: 250,
                        border: "none",
                        backgroundColor: "#142D4E",
                    },
                }}
            >
                <Sidebar onNavigate={handleCloseMenu} />
            </Drawer>

            {/* Contenido de la página */}
            <Box
                component="main"
                sx={{
                    flex: 1,
                    minWidth: 0,
                    p: { xs: 3.5, sm: 4, md: 5 },
                }}
            >
                {/* Barra superior visible en celular */}
                <Box
                    sx={{
                        display: { xs: "flex", md: "none" },
                        alignItems: "center",
                        gap: 1,
                        mb: 3,
                    }}
                >
                    <IconButton
                        onClick={() => setMobileOpen(true)}
                        aria-label="Abrir menú"
                        sx={{ color: "#142D4E" }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography sx={{ fontWeight: 700, color: "#142D4E" }}>
                        SIGAC
                    </Typography>
                </Box>

                {children}
            </Box>
        </Box>
    );
}
