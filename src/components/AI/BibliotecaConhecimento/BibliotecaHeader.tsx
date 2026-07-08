import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";

interface BibliotecaHeaderProps {
    onAdicionar: () => void;
}

function BibliotecaHeader({ onAdicionar }: BibliotecaHeaderProps) {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 3,
                gap: 2,
                flexWrap: "wrap",
            }}
        >
            <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <AutoStoriesIcon sx={{ color: "#60A5FA", fontSize: 34 }} />

            <Typography
                variant="h4"
                sx={{
                    fontWeight: 800,
                    color: "#FFFFFF",
                }}
            >
                Biblioteca de Conhecimento da IA
            </Typography>
                </Box>

                <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 850, color: "#FFFFFF" }}>
                    Cadastre categorias, tipos de falha e ações recomendadas para ensinar a IA Marrari
                    a interpretar anomalias com base no conhecimento operacional da empresa.
                </Typography>
            </Box>

            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={onAdicionar}
                sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 700,
                    minHeight: 44,
                }}
            >
                Adicionar conhecimento
            </Button>
        </Box>
    );
}

export default BibliotecaHeader;