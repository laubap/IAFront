import { Breadcrumbs, Link, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const nomes: Record<string, string> = {
    dashboard: "Dashboard",
    equipamentos: "Equipamentos",
    processos: "Processos",
    tags: "Tags",
    anomalias: "Anomalias",
    configuracoes: "Configurações",
};

function AppBreadcrumbs() {
    const location = useLocation();
    const navigate = useNavigate();

    const partes = location.pathname.split("/").filter(Boolean);

    if (partes.length === 0) return null;

    return (
        <Breadcrumbs sx={{ mb: 3, color: "#9CA3AF" }}>
            <Link
                underline="hover"
                color="inherit"
                sx={{ cursor: "pointer" }}
                onClick={() => navigate("/dashboard")}
            >
                Dashboard
            </Link>

            {partes.map((parte, index) => {
                if (parte === "dashboard") return null;

                const ultimo = index === partes.length - 1;
                const caminho = "/" + partes.slice(0, index + 1).join("/");
                const texto = nomes[parte] ?? parte;

                return ultimo ? (
                    <Typography key={caminho} color="text.primary">
                        {texto}
                    </Typography>
                ) : (
                    <Link
                        key={caminho}
                        underline="hover"
                        color="inherit"
                        sx={{ cursor: "pointer" }}
                        onClick={() => navigate(caminho)}
                    >
                        {texto}
                    </Link>
                );
            })}
        </Breadcrumbs>
    );
}

export default AppBreadcrumbs;