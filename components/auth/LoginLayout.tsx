import { Box } from "@mui/material";
import LoginBranding from "./LoginBranding";
import LoginForm from "./LoginForm";

export default function LoginLayout() {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "grid",
               gridTemplateColumns: { xs: "1fr", md: "40% 60%" },
                backgroundColor: "background.default",
            }}
        >
            <LoginBranding />

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: { xs: 3, sm: 5, md: 6 },
                }}
            >
                <LoginForm />
            </Box>
        </Box>
    );
}