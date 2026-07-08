import { Box, Card, CardContent, Typography } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import SearchIcon from "@mui/icons-material/Search";
import BuildIcon from "@mui/icons-material/Build";

function BibliotecaExplicacao() {
    return (
        <Card sx={{ backgroundColor: "#1F2937", borderRadius: 3, mb: 3 }}>
            <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                    Como a biblioteca funciona?
                </Typography>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            md: "1fr auto 1fr auto 1fr",
                        },
                        gap: 2,
                        alignItems: "center",
                    }}
                >
                    <InfoStep
                        icon={<FolderIcon />}
                        titulo="Categoria de Falha"
                        texto="Agrupa problemas semelhantes, como Mecânica, Elétrica ou Instrumentação."
                    />

                    <Seta />

                    <InfoStep
                        icon={<SearchIcon />}
                        titulo="Tipo de Falha"
                        texto="Representa a causa específica dentro da categoria, como sensor descalibrado ou rolamento desgastado."
                    />

                    <Seta />

                    <InfoStep
                        icon={<BuildIcon />}
                        titulo="Ações Recomendadas"
                        texto="Define os procedimentos sugeridos pela IA quando esse tipo de falha for identificado."
                    />
                </Box>
            </CardContent>
        </Card>
    );
}

function InfoStep({
    icon,
    titulo,
    texto,
}: {
    icon: React.ReactNode;
    titulo: string;
    texto: string;
}) {
    return (
        <Box
            sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: "#111827",
                border: "1px solid #374151",
                minHeight: 130,
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Box sx={{ color: "#60A5FA", display: "flex" }}>{icon}</Box>

                <Typography sx={{ fontWeight: 800 }}>{titulo}</Typography>
            </Box>

            <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                {texto}
            </Typography>
        </Box>
    );
}

function Seta() {
    return (
        <Typography
            sx={{
                color: "#60A5FA",
                fontWeight: 800,
                fontSize: 26,
                textAlign: "center",
                display: { xs: "none", md: "block" },
            }}
        >
            →
        </Typography>
    );
}

export default BibliotecaExplicacao;