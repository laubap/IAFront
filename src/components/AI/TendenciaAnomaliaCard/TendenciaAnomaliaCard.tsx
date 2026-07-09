import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import {
    CartesianGrid,
    Line,
    LineChart,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import { api } from "../../../services/api";

interface HistoricoItem {
    dataHora: string;
    valor: number;
}

interface Props {
    tagName: string;
    horas?: number;
    dataAnomalia?: string;
}

function TendenciaAnomaliaCard({ tagName, horas = 6, dataAnomalia }: Props) {
    const [historico, setHistorico] = useState<HistoricoItem[]>([]);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");

    useEffect(() => {
        if (!tagName) return;

        setCarregando(true);
        setErro("");

        api.get(`/tags/historico?tagName=${encodeURIComponent(tagName)}&horas=${horas}`)
            .then((response) => setHistorico(response.data))
            .catch((error) => {
                console.error("Erro ao buscar histórico da tag:", error);
                setErro("Não foi possível carregar a tendência da tag.");
            })
            .finally(() => setCarregando(false));
    }, [tagName, horas]);

    const pontoAnomalia = encontrarPontoMaisProximo();

    const dadosGrafico = historico.map((item) => ({
        dataHora: item.dataHora,
        hora: new Date(item.dataHora).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
        }),
        valor: item.valor,
        ehAnomalia: pontoAnomalia?.dataHora === item.dataHora,
    }));

    function encontrarPontoMaisProximo() {
        if (!dataAnomalia || historico.length === 0) return null;

        const dataAlvo = new Date(dataAnomalia).getTime();

        return historico.reduce((maisProximo, atual) => {
            const diffAtual = Math.abs(new Date(atual.dataHora).getTime() - dataAlvo);
            const diffMaisProximo = Math.abs(new Date(maisProximo.dataHora).getTime() - dataAlvo);

            return diffAtual < diffMaisProximo ? atual : maisProximo;
        });
    }

    function renderDot(props: any) {
        const { cx, cy, payload } = props;

        if (!payload.ehAnomalia) return null;

        return (
            <circle
                cx={cx}
                cy={cy}
                r={7}
                fill="#EF4444"
                stroke="#FEE2E2"
                strokeWidth={3}
            />
        );
    }

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
                <TrendingUpIcon color="primary" />

                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Tendência da Tag
                </Typography>
            </Box>

            <Typography color="text.secondary" sx={{ mb: 2 }}>
                Histórico próximo ao momento em que a anomalia foi detectada.
            </Typography>

            {carregando && (
                <Typography color="text.secondary">
                    Carregando tendência da tag...
                </Typography>
            )}

            {erro && <Typography color="error">{erro}</Typography>}

            {!carregando && !erro && historico.length > 0 && (
                <>
                    <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={dadosGrafico}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />

                            <XAxis dataKey="hora" stroke="#9CA3AF" />

                            <YAxis stroke="#9CA3AF" />

                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#111827",
                                    border: "1px solid #374151",
                                    color: "#E5E7EB",
                                }}
                            />

                            {pontoAnomalia && (
                                <ReferenceLine
                                    x={new Date(pontoAnomalia.dataHora).toLocaleTimeString("pt-BR", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                    stroke="#EF4444"
                                    strokeDasharray="4 4"
                                    label={{
                                        value: "Anomalia",
                                        fill: "#EF4444",
                                        fontSize: 12,
                                    }}
                                />
                            )}

                            <Line
                                type="monotone"
                                dataKey="valor"
                                stroke="#60A5FA"
                                strokeWidth={3}
                                dot={renderDot}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>

                    {pontoAnomalia && (
                        <Box
                            sx={{
                                mt: 2,
                                p: 2,
                                borderRadius: 2,
                                backgroundColor: "#111827",
                                border: "1px solid #374151",
                            }}
                        >
                            <Typography sx={{ fontWeight: 800, color: "#EF4444" }}>
                                Momento da anomalia
                            </Typography>

                            <Typography color="text.secondary">
                                {new Date(pontoAnomalia.dataHora).toLocaleString("pt-BR")} — valor{" "}
                                {pontoAnomalia.valor.toFixed(2)}
                            </Typography>
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
}

export default TendenciaAnomaliaCard;