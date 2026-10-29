import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#142D4E",
      dark: "#0D2038",
      light: "#24476A",
      contrastText: "#FFFFFF",
    },

    secondary: {
      main: "#24476A",
    },

    background: {
      default: "#F4F6F9",
      paper: "#FFFFFF",
    },

    text: {
      primary: "#263445",
      secondary: "#64748B",
    },

    success: {
      main: "#2E7D32",
    },

    error: {
      main: "#D32F2F",
    },

    warning: {
      main: "#ED9B22",
    },
  },

  shape: {
    borderRadius: 8,
  },
});

export default theme;