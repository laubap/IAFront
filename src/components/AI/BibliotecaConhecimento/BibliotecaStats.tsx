import { Box, Card, CardContent, Typography } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import SearchIcon from "@mui/icons-material/Search";
import BuildIcon from "@mui/icons-material/Build";
import PsychologyIcon from "@mui/icons-material/Psychology";

interface BibliotecaStatsProps {
    totalCategorias: number;
    totalMotivos: number;
    totalAcoes: number;
    totalFeedbacks?: number;
}

function BibliotecaStats({
    totalCategorias,
    totalMotivos,
    totalAcoes,
    totalFeedbacks = 0,
}: BibliotecaStatsProps) {
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr",
                    md: "repeat(4, 1fr)",
                },
                gap: 2,
                mb: 3,
            }}
        >
            <StatCard titulo="Categorias" valor={totalCategorias} icon={<FolderIcon />} />
            <StatCard titulo="Tipos de Falha" valor={totalMotivos} icon={<SearchIcon />} />
            <StatCard titulo="Ações" valor={totalAcoes} icon={<BuildIcon />} />
            <StatCard titulo="Feedbacks" valor={totalFeedbacks} icon={<PsychologyIcon />} />
        </Box>
    );
}

function StatCard({
    titulo,
    valor,
    icon,
}: {
    titulo: string;
    valor: number;
    icon: React.ReactNode;
}) {
    return (
        <Card sx={{ backgroundColor: "#1F2937", borderRadius: 3 }}>
            <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ color: "#60A5FA", display: "flex" }}>{icon}</Box>

                    <Typography color="text.secondary">{titulo}</Typography>
                </Box>

                <Typography variant="h4" sx={{ mt: 2, fontWeight: 800 }}>
                    {valor}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default BibliotecaStats;