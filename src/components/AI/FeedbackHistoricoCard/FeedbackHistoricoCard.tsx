import { useEffect, useState } from "react";
import { Box, Button, Chip, Typography } from "@mui/material";
import PsychologyIcon from "@mui/icons-material/Psychology";
import { api } from "../../../services/api";

interface FeedbackAnomalia {
    id: number;
    anomaliaId: number;
    tagName: string;
    categoriaFalha: string | null;
    tipoFalha: string | null;
    descricao: string | null;
    acaoTomada: string | null;
    dataRegistro: string;
}

interface Props {
    anomaliaId: number;
    onRegistrarNovo: () => void;
}

function FeedbackHistoricoCard({ anomaliaId, onRegistrarNovo }: Props) {
    const [feedbacks, setFeedbacks] = useState<FeedbackAnomalia[]>([]);
    const [carregando, setCarregando] = useState(false);

    useEffect(() => {
        setCarregando(true);

        api.get(`/anomalias/${anomaliaId}/feedback`)
            .then((response) => setFeedbacks(response.data))
            .catch((error) => console.error("Erro ao buscar feedbacks:", error))
            .finally(() => setCarregando(false));
    }, [anomaliaId]);

    return (
        <Box
            sx={{
                mt: 3,
                p: 3,
                borderRadius: 3,
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <PsychologyIcon color="primary" />

                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Conhecimento registrado
                </Typography>
            </Box>

            {carregando && (
                <Typography color="text.secondary">
                    Carregando conhecimento registrado...
                </Typography>
            )}

            {!carregando && feedbacks.length === 0 && (
                <>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                        Esta anomalia ainda não foi contextualizada por um operador.
                        Você pode registrar a causa para ajudar a IA em próximas ocorrências semelhantes.
                    </Typography>

                    <Button variant="contained" onClick={onRegistrarNovo}>
                        Registrar contexto da anomalia
                    </Button>
                </>
            )}

            {!carregando && feedbacks.length > 0 && (
                <>
                    {feedbacks.map((feedback) => (
                        <Box
                            key={feedback.id}
                            sx={{
                                mb: 2,
                                p: 2,
                                borderRadius: 2,
                                backgroundColor: "#111827",
                                border: "1px solid #374151",
                            }}
                        >
                            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                                <Chip
                                    label={feedback.categoriaFalha ?? "Categoria não informada"}
                                    size="small"
                                    sx={{ backgroundColor: "#1E3A8A", color: "#E5E7EB" }}
                                />

                                <Chip
                                    label={feedback.tipoFalha ?? "Tipo de falha não informado"}
                                    size="small"
                                    sx={{ backgroundColor: "#92400E", color: "#E5E7EB" }}
                                />
                            </Box>

                            <Typography sx={{ fontWeight: 700 }}>
                                Descrição
                            </Typography>

                            <Typography color="text.secondary" sx={{ mb: 2 }}>
                                {feedback.descricao || "Sem descrição informada."}
                            </Typography>

                            <Typography sx={{ fontWeight: 700 }}>
                                Ação tomada
                            </Typography>

                            <Typography color="text.secondary" sx={{ mb: 2 }}>
                                {feedback.acaoTomada || "Nenhuma ação informada."}
                            </Typography>

                            <Typography sx={{ fontSize: 13, color: "#9CA3AF" }}>
                                Registrado em{" "}
                                {new Date(feedback.dataRegistro).toLocaleString("pt-BR")}
                            </Typography>
                        </Box>
                    ))}

                    <Button variant="outlined" onClick={onRegistrarNovo}>
                        Registrar novo feedback
                    </Button>
                </>
            )}
        </Box>
    );
}

export default FeedbackHistoricoCard;