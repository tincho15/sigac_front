"use client";

import { useState, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from "@mui/material";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import LockResetRoundedIcon from "@mui/icons-material/LockResetRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";

import useUsers, { type UserListItem } from "@/hooks/useUsers";
import { useAuth } from "@/components/auth/AuthContext";
import EditUserDialog from "./EditUserDialog";
import ResetPasswordDialog from "./ResetPasswordDialog";
import ToggleUserStatusDialog from "./ToggleUserStatusDialog";

type DialogType = "edit" | "reset" | "toggle";

const headCellSx = {
    color: "#64748B",
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: 0.8,
    backgroundColor: "#F8FAFC",
    borderBottom: "1px solid #E8EDF2",
};

export default function UserList() {
    const router = useRouter();
    const { user: currentUser, refreshUser } = useAuth();
    const { users, isLoading, loadError, fetchUsers, updateUser, setUserActive, resetPassword } =
        useUsers();

    // Menú de acciones
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
    const [menuUser, setMenuUser] = useState<UserListItem | null>(null);

    // Diálogo activo
    const [dialog, setDialog] = useState<{ type: DialogType; user: UserListItem } | null>(null);

    const openMenu = (event: MouseEvent<HTMLElement>, user: UserListItem) => {
        setMenuAnchor(event.currentTarget);
        setMenuUser(user);
    };

    const closeMenu = () => setMenuAnchor(null);

    const openDialog = (type: DialogType) => {
        if (menuUser) setDialog({ type, user: menuUser });
        closeMenu();
    };

    const closeDialog = () => setDialog(null);

    const isSelf = (user: UserListItem) => user.id_usuario === currentUser?.id_usuario;

    const handleSaveUser = async (user: UserListItem, updates: Parameters<typeof updateUser>[1]) => {
        await updateUser(user.id_usuario, updates);

        // Si el administrador editó sus propios datos, refrescar la sesión
        if (isSelf(user)) await refreshUser();
    };

    return (
        <Box sx={{ maxWidth: 1100, mx: "auto", py: { xs: 2, md: 4 } }}>
            {/* Encabezado */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "flex-end" },
                    justifyContent: "space-between",
                    gap: 2,
                    mb: 4,
                }}
            >
                <Box>
                    <Typography
                        sx={{
                            color: "#64748B",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            letterSpacing: 1,
                            mb: 1,
                        }}
                    >
                        GESTIÓN DE USUARIOS
                    </Typography>

                    <Typography variant="h4" sx={{ color: "#142D4E", fontWeight: 700 }}>
                        Usuarios
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<PersonAddAlt1RoundedIcon />}
                    onClick={() => router.push("/usuarios/nuevo")}
                    sx={{ borderRadius: 3, boxShadow: "none", py: 1.2, px: 2.5 }}
                >
                    Agregar usuario
                </Button>
            </Box>

            <Paper
                elevation={0}
                sx={{
                    border: "1px solid #E0E6ED",
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: "0 4px 18px rgba(20, 45, 78, 0.04)",
                }}
            >
                {isLoading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                        <CircularProgress size={32} />
                    </Box>
                ) : loadError ? (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 2,
                            py: 8,
                            px: 2,
                            textAlign: "center",
                        }}
                    >
                        <Typography sx={{ color: "#D32F2F" }}>{loadError}</Typography>
                        <Button variant="outlined" onClick={fetchUsers} sx={{ borderRadius: 3 }}>
                            Reintentar
                        </Button>
                    </Box>
                ) : users.length === 0 ? (
                    <Typography sx={{ py: 8, textAlign: "center", color: "#64748B" }}>
                        No hay usuarios registrados.
                    </Typography>
                ) : (
                    <TableContainer>
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={headCellSx}>NOMBRE</TableCell>
                                    <TableCell sx={headCellSx}>CORREO ELECTRÓNICO</TableCell>
                                    <TableCell sx={headCellSx}>ROL</TableCell>
                                    <TableCell sx={headCellSx}>ESTADO</TableCell>
                                    <TableCell sx={headCellSx} align="right">
                                        ACCIONES
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {users.map((user) => (
                                    <TableRow
                                        key={user.id_usuario}
                                        hover
                                        sx={{
                                            "&:last-child td": { borderBottom: 0 },
                                            opacity: user.activo ? 1 : 0.7,
                                        }}
                                    >
                                        <TableCell sx={{ color: "#263445", fontWeight: 600 }}>
                                            {user.nombre}
                                            {isSelf(user) && (
                                                <Typography
                                                    component="span"
                                                    sx={{ ml: 1, color: "#64748B", fontSize: "0.8rem" }}
                                                >
                                                    (vos)
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell sx={{ color: "#475569" }}>{user.email}</TableCell>
                                        <TableCell sx={{ color: "#475569" }}>{user.rol}</TableCell>
                                        <TableCell>
                                            <Chip
                                                size="small"
                                                label={user.activo ? "Activo" : "Inactivo"}
                                                sx={{
                                                    fontWeight: 600,
                                                    backgroundColor: user.activo ? "#EAF5EE" : "#F1F3F5",
                                                    color: user.activo ? "#245B3D" : "#64748B",
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="Acciones">
                                                <IconButton
                                                    aria-label={`Acciones para ${user.nombre}`}
                                                    aria-haspopup="menu"
                                                    onClick={(event) => openMenu(event, user)}
                                                >
                                                    <MoreVertRoundedIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>

            {/* Menú desplegable de acciones */}
            <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={closeMenu}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <MenuItem onClick={() => openDialog("edit")}>
                    <ListItemIcon>
                        <EditRoundedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Editar usuario</ListItemText>
                </MenuItem>

                <MenuItem onClick={() => openDialog("reset")}>
                    <ListItemIcon>
                        <LockResetRoundedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Reiniciar contraseña</ListItemText>
                </MenuItem>

                {menuUser && (
                    // Un administrador no puede desactivarse a sí mismo
                    <MenuItem
                        onClick={() => openDialog("toggle")}
                        disabled={menuUser.activo && isSelf(menuUser)}
                        sx={{ color: menuUser.activo ? "#D32F2F" : "#27965B" }}
                    >
                        <ListItemIcon sx={{ color: "inherit" }}>
                            {menuUser.activo ? (
                                <BlockRoundedIcon fontSize="small" />
                            ) : (
                                <CheckCircleOutlineRoundedIcon fontSize="small" />
                            )}
                        </ListItemIcon>
                        <ListItemText>
                            {menuUser.activo ? "Desactivar usuario" : "Activar usuario"}
                        </ListItemText>
                    </MenuItem>
                )}
            </Menu>

            {/* Diálogos */}
            {dialog?.type === "edit" && (
                <EditUserDialog
                    key={dialog.user.id_usuario}
                    user={dialog.user}
                    onClose={closeDialog}
                    onSave={(updates) => handleSaveUser(dialog.user, updates)}
                />
            )}

            {dialog?.type === "reset" && (
                <ResetPasswordDialog
                    key={dialog.user.id_usuario}
                    user={dialog.user}
                    onClose={closeDialog}
                    onReset={resetPassword}
                />
            )}

            {dialog?.type === "toggle" && (
                <ToggleUserStatusDialog
                    key={dialog.user.id_usuario}
                    user={dialog.user}
                    onClose={closeDialog}
                    onConfirm={() => setUserActive(dialog.user.id_usuario, !dialog.user.activo)}
                />
            )}
        </Box>
    );
}
