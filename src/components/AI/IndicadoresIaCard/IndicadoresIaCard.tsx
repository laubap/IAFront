import { Box, Typography } from "@mui/material";

import PsychologyIcon from "@mui/icons-material/Psychology";
import SpeedIcon from "@mui/icons-material/Speed";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

interface Props {
    valor: number;
    score: number;
    risco: number;
    tendencia: string | null;
}

function IndicadoresIaCard({ valor, score, risco, tendencia }: Props) {
    return (
        <Box
            sx={{
                mt: 3,
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr",
                    md: "repeat(4, 1fr)",
                },
                gap: 2,
            }}
        >
            <InfoBox titulo="Valor recebido" valor={valor} icon={<SpeedIcon />} />

            <InfoBox
                titulo="Score IA"
                valor={score.toFixed(2)}
                icon={<PsychologyIcon />}
            />

            <InfoBox
                titulo="Risco processo"
                valor={`${risco}/100`}
                icon={<WarningAmberIcon />}
            />

            <InfoBox
                titulo="Tendência"
                valor={tendencia ?? "não informada"}
                icon={<TrendingUpIcon />}
            />
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
    icon: React.ReactNode;
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

export default IndicadoresIaCard;