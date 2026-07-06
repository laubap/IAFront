import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import { ThemeProvider } from "@mui/material/styles";

import { ClienteProvider } from "./contexts/ClienteContext";

import App from "./App";
import theme from "./theme/theme";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <ThemeProvider theme={theme}>
        <ClienteProvider>
            <App />
        </ClienteProvider>
            </ThemeProvider>
        </BrowserRouter>
    </StrictMode>
);