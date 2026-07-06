import { Box, Button, Chip, Divider, Typography } from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import PsychologyIcon from "@mui/icons-material/Psychology";
import SpeedIcon from "@mui/icons-material/Speed";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AnaliseInteligenteCard from "../AI/AnaliseInteligenteCard";
import ConhecimentoIaCard from "../AI/ConhecimentoIaCard";
import IndicadoresIaCard from "../AI/IndicadoresIaCard";
import TendenciaAnomaliaCard from "../AI/TendenciaAnomaliaCard";

interface FeedbackSemelhante {
    totalOcorrencias: number;
    motivoMaisComum: string;
    percentual: number;
    mensagem: string;
}

export interface AnomaliaDiagnostic {
    id: number;
    tagName: string;
    tipoTag: string;
    valor: number;
    score: number;
    mensagem: string;
    riscoProcesso: number;
    classificacaoRisco: string | null;
    tendenciaRisco: string | null;
    tendenciaValor: string | null;
    feedbackSemelhante: FeedbackSemelhante | null;
}

interface Props {
    anomalia: AnomaliaDiagnostic;
    onRegistrarCausa: (anomalia: AnomaliaDiagnostic) => void;
}

function AnomaliaDiagnosticCard({ anomalia, onRegistrarCausa }: Props) {

    return (
        <Box
            sx={{
                p: 3,
                backgroundColor: "#111827",
                borderLeft: "4px solid #EF4444",
            }}
        >

            <AnaliseInteligenteCard
            mensagem={anomalia.mensagem}
            classificacao={anomalia.classificacaoRisco}
            tipoTag={anomalia.tipoTag}
            data={new Date().toISOString()}
        />

<IndicadoresIaCard
    valor={anomalia.valor}
    score={anomalia.score}
    risco={anomalia.riscoProcesso}
    tendencia={anomalia.tendenciaValor}
/>

<TendenciaAnomaliaCard tagName={anomalia.tagName} horas={6} />

<ConhecimentoIaCard feedback={anomalia.feedbackSemelhante} />

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                <Button
                    variant="contained"
                    startIcon={<EditNoteIcon />}
                    onClick={() => onRegistrarCausa(anomalia)}
                >
                    Registrar causa da anomalia
                </Button>
            </Box>
        </Box>
    );
}

function InfoBox({
    titulo,
    valor,
    icon,
}: {
    titulo: string;
    valor: string | number;
    icon?: React.ReactNode;
}) {
    return (
        <Box
            sx={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: 2,
                p: 2,
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {icon}
                <Typography sx={{ color: "#9CA3AF", fontSize: 13 }}>
                    {titulo}
                </Typography>
            </Box>

            <Typography sx={{ fontWeight: 800, mt: 1 }}>
                {valor}
            </Typography>
        </Box>
    );
}

export default AnomaliaDiagnosticCard;