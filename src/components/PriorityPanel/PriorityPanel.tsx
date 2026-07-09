import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Typography,
} from "@mui/material";

import SmartToyIcon from "@mui/icons-material/SmartToy";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface Prioridade {
    tipo: "equipamento" | "processo" | "tag";
    titulo: string;
    descricao: string;
    nivel: "alto" | "medio" | "baixo";
}

interface PriorityPanelProps {
    prioridades?: Prioridade[];
}

function PriorityPanel({ prioridades }: PriorityPanelProps) {
    const lista = prioridades ?? [
        {
            tipo: "equipamento",
            titulo: "Motor Principal Linha 2",
            descricao: "Equipamento saudável no momento, mas com alta criticidade operacional.",
            nivel: "medio",
        },
        {
            tipo: "processo",
            titulo: "Sistema de Resfriamento Linha 2",
            descricao: "Processo monitorado pela IA, sem anomalias críticas recentes.",
            nivel: "baixo",
        },
        {
            tipo: "tag",
            titulo: "PK7.TAG7",
            descricao: "Tag treinada e vinculada ao equipamento principal.",
            nivel: "baixo",
        },
    ];

    function corNivel(nivel: Prioridade["nivel"]) {
        if (nivel === "alto") return "error";
        if (nivel === "medio") return "warning";
        return "success";
    }

    return (
        <Card sx={{ backgroundColor: "#1F2937", borderRadius: 3, height: "100%" }}>
            <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                    <SmartToyIcon sx={{ color: "#60A5FA" }} />

                    <Typography variant="h6">
                        Prioridades da IA
                    </Typography>
                </Box>

                {lista.map((item, index) => (
                    <Box key={`${item.tipo}-${item.titulo}`}>
                        <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                                <Typography sx={{ fontWeight: 700 }}>
                                    {item.titulo}
                                </Typography>

                                <Chip
                                    label={item.nivel}
                                    color={corNivel(item.nivel)}
                                    size="small"
                                />
                            </Box>

                            <Typography color="text.secondary" sx={{ fontSize: 14, mt: 0.5 }}>
                                {item.descricao}
                            </Typography>
                        </Box>

                        {index < lista.length - 1 && <Divider sx={{ my: 2 }} />}
                    </Box>
                ))}

                <Button
                    fullWidth
                    variant="outlined"
                    endIcon={<ArrowForwardIcon />}
                    sx={{ mt: 2 }}
                >
                    Ver detalhes
                </Button>
            </CardContent>
        </Card>
    );
}

export default PriorityPanel;