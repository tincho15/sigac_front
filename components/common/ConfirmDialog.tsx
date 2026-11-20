
"use client";

import LogoutIcon from "@mui/icons-material/Logout";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";

type ConfirmDialogProps = {
    open: boolean;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function ConfirmDialog({
    open,
    title,
    description,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    loading = false,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    const handleClose = () => {
        if (!loading) {
            onCancel();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="xs"
            slotProps={{
                paper: {
                    sx: {
                        width: "calc(100% - 32px)",
                        borderRadius: { xs: 3, sm: 3.5 },
                        p: { xs: 1, sm: 2 },
                        boxShadow: "0 12px 40px rgba(20, 45, 78, 0.16)",
                        m: { xs: 2, sm: 3 },
                    },
                },
            }}
        >
            <DialogContent
                sx={{
                    px: { xs: 2, sm: 2.5 },
                    pt: { xs: 2.5, sm: 3.5 },
                    pb: { xs: 1, sm: 2 },
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        mb: 2,
                    }}
                >
                    <Box
                        sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 2.5,
                            bgcolor: "action.hover",
                            color: "primary.main",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                        }}
                    >
                        <LogoutIcon sx={{ fontSize: 23 }} />
                    </Box>

                    <DialogTitle
                        sx={{
                            p: 0,
                            color: "text.primary",
                            fontWeight: 700,
                            fontSize: { xs: "1.1rem", sm: "1.2rem" },
                        }}
                    >
                        {title}
                    </DialogTitle>
                </Box>

                <Typography
                    sx={{
                        color: "text.secondary",
                        fontSize: "0.9rem",
                        lineHeight: 1.6,
                    }}
                >
                    {description}
                </Typography>
            </DialogContent>

            <DialogActions
                sx={{
                    px: { xs: 2, sm: 2.5 },
                    pt: { xs: 2, sm: 2.5 },
                    pb: { xs: 2, sm: 3 },
                    gap: 1.5,
                    display: "flex",
                }}
            >
                <Button
                    onClick={onCancel}
                    disabled={loading}
                    variant="contained"
                    sx={{
                        flex: 1,
                        minWidth: 0,
                        height: 44,
                        borderRadius: 3,
                        bgcolor: "grey.200",
                        color: "text.primary",
                        fontWeight: 600,
                        boxShadow: "none",
                        "&:hover": {
                            bgcolor: "grey.300",
                            boxShadow: "none",
                        },
                    }}
                >
                    {cancelText}
                </Button>

                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    sx={{
                        flex: 1,
                        minWidth: 0,
                        height: 44,
                        borderRadius: 3,
                        fontWeight: 600,
                        boxShadow: "none",
                        "&:hover": {
                            bgcolor: "primary.dark",
                            boxShadow: "none",
                        },
                    }}
                >
                    {loading ? "Procesando..." : confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
