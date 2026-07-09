import { Box } from "@mui/material";

import AnaliseInteligenteCard from "../AI/AnaliseInteligenteCard";
import ConhecimentoIaCard from "../AI/ConhecimentoIaCard";
import IndicadoresIaCard from "../AI/IndicadoresIaCard";
import TendenciaAnomaliaCard from "../AI/TendenciaAnomaliaCard";
import FeedbackHistoricoCard from "../AI/FeedbackHistoricoCard";

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
    dataDeteccao: string;
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

                <TendenciaAnomaliaCard
        tagName={anomalia.tagName}
        horas={6}
        dataAnomalia={anomalia.dataDeteccao}
    />

            <ConhecimentoIaCard feedback={anomalia.feedbackSemelhante} />

            <FeedbackHistoricoCard
                anomaliaId={anomalia.id}
                onRegistrarNovo={() => onRegistrarCausa(anomalia)}
            />
        </Box>
    );
}

export default AnomaliaDiagnosticCard;