import { Box } from "@mui/material";
import ChangePasswordForm from "./ChangePasswordForm";

export default function ChangePasswordLayout() {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "background.default",
                p: { xs: 2, sm: 4 },
            }}
        >
            <Box sx={{ width: "100%", maxWidth: 480 }}>
                <ChangePasswordForm />
            </Box>
        </Box>
    );
}