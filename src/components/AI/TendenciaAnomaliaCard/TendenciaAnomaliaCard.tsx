import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import {
    CartesianGrid,
    Line,
    LineChart,
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
}

function TendenciaAnomaliaCard({ tagName, horas = 6 }: Props) {
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

    const valores = historico.map((item) => item.valor);

    const maior = valores.length ? Math.max(...valores) : null;
    const menor = valores.length ? Math.min(...valores) : null;
    const media = valores.length
        ? valores.reduce((soma, valor) => soma + valor, 0) / valores.length
        : null;

    const valorInicial = valores[0];
    const valorFinal = valores[valores.length - 1];

    const variacao =
        valorInicial && valorFinal
            ? ((valorFinal - valorInicial) / Math.abs(valorInicial)) * 100
            : 0;

    function calcularTendencia() {
        if (valores.length < 3) return "insuficiente";

        if (Math.abs(variacao) < 2) return "estável";

        return variacao > 0 ? "crescimento" : "queda";
    }

    function interpretar() {
        const tendencia = calcularTendencia();

        if (tendencia === "insuficiente") {
            return "Ainda não há leituras suficientes para interpretar a tendência recente desta tag.";
        }

        if (tendencia === "crescimento") {
            return `Nas últimas ${horas} horas, a tag apresentou tendência de crescimento, com variação aproximada de ${variacao.toFixed(2)}%.`;
        }

        if (tendencia === "queda") {
            return `Nas últimas ${horas} horas, a tag apresentou tendência de queda, com variação aproximada de ${Math.abs(variacao).toFixed(2)}%.`;
        }

        return `Nas últimas ${horas} horas, a tag permaneceu estável, sem variação relevante no comportamento recente.`;
    }

    const dadosGrafico = historico.map((item) => ({
        hora: new Date(item.dataHora).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
        }),
        valor: item.valor,
    }));

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
                Histórico resumido das últimas {horas} horas.
            </Typography>

            {carregando && (
                <Typography color="text.secondary">
                    Carregando tendência da tag...
                </Typography>
            )}

            {erro && (
                <Typography color="error">
                    {erro}
                </Typography>
            )}

            {!carregando && !erro && historico.length === 0 && (
                <Typography color="text.secondary">
                    Nenhum histórico encontrado para esta tag.
                </Typography>
            )}

            {!carregando && !erro && historico.length > 0 && (
                <>
                    <ResponsiveContainer width="100%" height={240}>
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

                            <Line
                                type="monotone"
                                dataKey="valor"
                                stroke="#60A5FA"
                                strokeWidth={3}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "repeat(4, 1fr)",
                            },
                            gap: 2,
                            mt: 3,
                        }}
                    >
                        <InfoBox titulo="Maior valor" valor={formatarNumero(maior)} />
                        <InfoBox titulo="Menor valor" valor={formatarNumero(menor)} />
                        <InfoBox titulo="Média" valor={formatarNumero(media)} />
                        <InfoBox titulo="Tendência" valor={calcularTendencia()} />
                    </Box>

                    <Box
                        sx={{
                            mt: 3,
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: "#111827",
                            border: "1px solid #374151",
                        }}
                    >
                        <Typography sx={{ fontWeight: 800, mb: 1 }}>
                            Interpretação da IA
                        </Typography>

                        <Typography color="text.secondary">
                            {interpretar()}
                        </Typography>
                    </Box>
                </>
            )}
        </Box>
    );
}

function InfoBox({
    titulo,
    valor,
}: {
    titulo: string;
    valor: string | number;
}) {
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

function formatarNumero(valor: number | null) {
    if (valor === null || Number.isNaN(valor)) return "-";

    return valor.toFixed(2);
}

export default TendenciaAnomaliaCard;