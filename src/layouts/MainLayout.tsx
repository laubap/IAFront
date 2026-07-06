import {
    Box,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
} from "@mui/material";

import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import { Outlet, useLocation, useNavigate } from "react-router-dom";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import WarningIcon from "@mui/icons-material/Warning";
import SettingsIcon from "@mui/icons-material/Settings";

import Header from "../components/Header/Header";
import AppBreadcrumbs from "../components/Breadcrumbs/AppBreadcrumbs";
import PsychologyIcon from "@mui/icons-material/Psychology";

const drawerWidth = 260;

const menuDashboard = [
    { label: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
];

const menuIndustrial = [
    { label: "Equipamentos", icon: <PrecisionManufacturingIcon />, path: "/equipamentos" },
    { label: "Processos", icon: <AccountTreeIcon />, path: "/processos" },
    { label: "Tags", icon: <LocalOfferIcon />, path: "/tags" },
];

const menuIA = [
    { label: "Anomalias", icon: <WarningIcon />, path: "/anomalias" },
    { label: "Conhecimento da IA", icon: <PsychologyIcon />, path: "/conhecimento-ia" },
];

const menuSistema = [
    { label: "Configurações", icon: <SettingsIcon />, path: "/configuracoes" },
];

function MainLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    function estaAtivo(path: string) {
        return location.pathname === path || location.pathname.startsWith(path + "/");
    }

    function renderMenu(items: typeof menuDashboard) {
        return items.map((item) => {
            const ativo = estaAtivo(item.path);

            return (
                <ListItemButton
                    key={item.label}
                    onClick={() => navigate(item.path)}
                    sx={{
                        borderRadius: 2,
                        mb: 0.7,
                        py: 1.2,
                        backgroundColor: ativo ? "#2563EB" : "transparent",
                        color: ativo ? "#FFFFFF" : "#E5E7EB",
                        transition: "all 0.2s ease",
                        transform: ativo ? "translateX(4px)" : "translateX(0)",
                        "&:hover": {
                            backgroundColor: ativo ? "#2563EB" : "#374151",
                            transform: "translateX(6px) scale(1.02)",
                        },
                    }}
                >
                    <ListItemIcon
                        sx={{
                            color: ativo ? "#FFFFFF" : "#9CA3AF",
                            minWidth: 46,
                            "& svg": {
                                fontSize: 28,
                            },
                        }}
                    >
                        {item.icon}
                    </ListItemIcon>

                    <ListItemText
                        primary={
                            <Typography sx={{ fontWeight: ativo ? 700 : 500 }}>
                                {item.label}
                            </Typography>
                        }
                    />
                </ListItemButton>
            );
        });
    }

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            <Header />

            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        boxSizing: "border-box",
                        backgroundColor: "#1F2937",
                        borderRight: "1px solid #374151",
                    },
                }}
            >
                <Toolbar sx={{ minHeight: "72px !important" }} />

                <List sx={{ px: 1 }}>
                    {renderMenu(menuDashboard)}

                    <Divider sx={{ my: 2 }} />

                    <Typography sx={sectionTitleStyle}>
                        PLANTA INDUSTRIAL
                    </Typography>

                    {renderMenu(menuIndustrial)}

                    <Divider sx={{ my: 2 }} />

                    <Typography sx={sectionTitleStyle}>
                        INTELIGÊNCIA
                    </Typography>

                    {renderMenu(menuIA)}

                    <Divider sx={{ my: 2 }} />

                    <Typography sx={sectionTitleStyle}>
                        SISTEMA
                    </Typography>

                    {renderMenu(menuSistema)}
                </List>
            </Drawer>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    backgroundColor: "#111827",
                    minHeight: "100vh",
                }}
            >
                <Toolbar sx={{ minHeight: "72px !important" }} />

                <AppBreadcrumbs />

                <Outlet />
            </Box>
        </Box>
    );
}

const sectionTitleStyle = {
    color: "#9CA3AF",
    fontSize: 12,
    fontWeight: 700,
    px: 2,
    mb: 1,
    letterSpacing: 1,
};

export default MainLayout;