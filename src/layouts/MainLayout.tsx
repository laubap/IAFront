import {
    Box,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    AppBar,
} from "@mui/material";

import { Outlet, useNavigate } from "react-router-dom";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import WarningIcon from "@mui/icons-material/Warning";
import SettingsIcon from "@mui/icons-material/Settings";

const drawerWidth = 260;

const menuItems = [
    { label: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { label: "Processos", icon: <AccountTreeIcon />, path: "/processos" },
    { label: "Equipamentos", icon: <PrecisionManufacturingIcon />, path: "/equipamentos" },
    { label: "Tags", icon: <LocalOfferIcon />, path: "/tags" },
    { label: "Anomalias", icon: <WarningIcon />, path: "/anomalias" },
    { label: "Configurações", icon: <SettingsIcon />, path: "/configuracoes" },
];

function MainLayout() {
    const navigate = useNavigate();

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            <AppBar
                position="fixed"
                sx={{
                    zIndex: 1201,
                    backgroundColor: "#111827",
                    borderBottom: "1px solid #374151",
                }}
            >
                <Toolbar>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        IA MARRARI
                    </Typography>
                </Toolbar>
            </AppBar>

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
                <Toolbar />

                <List sx={{ px: 1 }}>
                    {menuItems.map((item) => (
                        <ListItemButton
                            key={item.label}
                            onClick={() => navigate(item.path)}
                            sx={{ borderRadius: 2, mb: 0.5 }}
                        >
                            <ListItemIcon sx={{ color: "#9CA3AF" }}>
                                {item.icon}
                            </ListItemIcon>

                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    ))}
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
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
}

export default MainLayout;