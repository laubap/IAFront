import { Box, Typography } from "@mui/material";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";

interface FeedbackSemelhante {
    totalOcorrencias: number;
    motivoMaisComum: string;
    percentual: number;
    mensagem: string;
}

interface Props {
    feedback: FeedbackSemelhante | null;
}

function ConhecimentoIaCard({ feedback }: Props) {
    if (!feedback) return null;

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
                <HistoryEduIcon color="primary" />

                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Conhecimento da IA
                </Typography>
            </Box>

            <Typography color="text.secondary" sx={{ mb: 2 }}>
                A IA encontrou registros anteriores parecidos com esta ocorrência.
            </Typography>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        md: "repeat(3, 1fr)",
                    },
                    gap: 2,
                }}
            >
                <InfoBox titulo="Ocorrências semelhantes" valor={feedback.totalOcorrencias} />
                <InfoBox titulo="Motivo mais recorrente" valor={feedback.motivoMaisComum} />
                <InfoBox titulo="Confiança" valor={`${feedback.percentual}%`} />
            </Box>

            <Typography color="text.secondary" sx={{ mt: 2 }}>
                {feedback.mensagem}
            </Typography>
        </Box>
    );
}

function InfoBox({ titulo, valor }: { titulo: string; valor: string | number }) {
    return (
        <Box
            sx={{
                backgroundColor: "#111827",
                border: "1px solid #374151",
                borderRadius: 2,
                p: 2,
            }}
        >
            <Typography sx={{ color: "#9CA3AF", fontSize: 13 }}>
                {titulo}
            </Typography>

            <Typography sx={{ fontWeight: 800, mt: 1 }}>
                {valor}
            </Typography>
        </Box>
    );
}

export default ConhecimentoIaCard;