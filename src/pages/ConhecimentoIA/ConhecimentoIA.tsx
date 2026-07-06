import { useEffect, useState } from "react";

import {
    Box,
    Card,
    CardContent,
    CircularProgress,
    Typography,
} from "@mui/material";

import PsychologyIcon from "@mui/icons-material/Psychology";
import SchoolIcon from "@mui/icons-material/School";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    LineChart,
    Line,
} from "recharts";

import SectionTitle from "../../components/SectionTitle/SectionTitle";
import { api } from "../../services/api";

interface ConhecimentoIAResponse {
    totalAnomalias: number;
    totalFeedbacks: number;
    tiposFalhaAprendidos: number;
    percentualFeedback: number;
    confiancaIa: number;

    principaisMotivos: {
        motivo: string;
        total: number;
    }[];

    tagsComMaisAnomalias: {
        tagName: string;
        total: number;
    }[];

    anomaliasPorDia: {
        data: string;
        total: number;
    }[];

    distribuicaoRisco: {
        risco: string;
        total: number;
    }[];

    ultimosFeedbacks: {
        id: number;
        tagName: string;
        motivo: string;
        descricao: string;
        acaoTomada: string;
        dataRegistro: string;
    }[];

    mensagem: string;
}

function ConhecimentoIA() {
    const [dados, setDados] = useState<ConhecimentoIAResponse>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/conhecimento-ia")
            .then((response) => setDados(response.data))
            .finally(() => setLoading(false));
    }, []);

    if (loading)
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
                <CircularProgress />
            </Box>
        );

    if (!dados) return null;

    return (
        <Box>

            <SectionTitle
                titulo="Conhecimento da IA"
                subtitulo={dados.mensagem}
                icon={<PsychologyIcon />}
            />

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        md: "repeat(4,1fr)",
                    },
                    gap: 2,
                    mb: 4,
                }}
            >
                <ResumoCard
                    titulo="Anomalias"
                    valor={dados.totalAnomalias}
                    icon={<ReportProblemIcon />}
                />

                <ResumoCard
                    titulo="Feedbacks"
                    valor={dados.totalFeedbacks}
                    icon={<AssignmentTurnedInIcon />}
                />

                <ResumoCard
                    titulo="Tipos aprendidos"
                    valor={dados.tiposFalhaAprendidos}
                    icon={<SchoolIcon />}
                />

                <ResumoCard
                    titulo="Confiança IA"
                    valor={`${dados.confiancaIa}%`}
                    icon={<PsychologyIcon />}
                />
            </Box>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        lg: "2fr 1fr",
                    },
                    gap: 3,
                }}
            >
                <Card sx={{ backgroundColor: "#1F2937" }}>
                    <CardContent>

                        <Typography
                            variant="h6"
                            sx={{ mb: 3, fontWeight: 700 }}
                        >
                            Evolução das Anomalias
                        </Typography>

                        <ResponsiveContainer
                            width="100%"
                            height={300}
                        >
                            <LineChart data={dados.anomaliasPorDia}>
                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis
                                    dataKey="data"
                                    tickFormatter={(v) =>
                                        new Date(v).toLocaleDateString("pt-BR")
                                    }
                                />

                                <YAxis />

                                <Tooltip />

                                <Line
                                    dataKey="total"
                                    stroke="#3B82F6"
                                    strokeWidth={3}
                                />
                            </LineChart>
                        </ResponsiveContainer>

                    </CardContent>
                </Card>

                <Card sx={{ backgroundColor: "#1F2937" }}>
                    <CardContent>

                        <Typography
                            variant="h6"
                            sx={{ mb: 3, fontWeight: 700 }}
                        >
                            Principais Causas
                        </Typography>

                        <ResponsiveContainer
                            width="100%"
                            height={300}
                        >
                            <BarChart data={dados.principaisMotivos}>
                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis dataKey="motivo" />

                                <YAxis />

                                <Tooltip />

                                <Bar
                                    dataKey="total"
                                    fill="#3B82F6"
                                />

                            </BarChart>
                        </ResponsiveContainer>

                    </CardContent>
                </Card>

            </Box>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        lg: "1fr 1fr",
                    },
                    gap: 3,
                    mt: 3,
                }}
            >
                <Card sx={{ backgroundColor: "#1F2937" }}>
                    <CardContent>

                        <Typography
                            variant="h6"
                            sx={{ mb: 2, fontWeight: 700 }}
                        >
                            Tags com mais ocorrências
                        </Typography>

                        {dados.tagsComMaisAnomalias.map((tag) => (

                            <Box
                                key={tag.tagName}
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    py: 1,
                                    borderBottom: "1px solid #374151",
                                }}
                            >
                                <Typography>
                                    {tag.tagName}
                                </Typography>

                                <Typography sx={{ fontWeight: 700 }}>
                                    {tag.total}
                                </Typography>

                            </Box>

                        ))}

                    </CardContent>
                </Card>

                <Card sx={{ backgroundColor: "#1F2937" }}>
                    <CardContent>

                        <Typography
                            variant="h6"
                            sx={{ mb: 2, fontWeight: 700 }}
                        >
                            Últimos Aprendizados
                        </Typography>

                        {dados.ultimosFeedbacks.map((feedback) => (

                            <Box
                                key={feedback.id}
                                sx={{
                                    mb: 2,
                                    pb: 2,
                                    borderBottom: "1px solid #374151",
                                }}
                            >
                                <Typography sx={{ fontWeight: 700 }}>
                                    {feedback.tagName}
                                </Typography>

                                <Typography color="text.secondary">
                                    Motivo: {feedback.motivo}
                                </Typography>

                                <Typography color="text.secondary">
                                    {feedback.descricao}
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 1,
                                        fontSize: 13,
                                        color: "#9CA3AF",
                                    }}
                                >
                                    {new Date(feedback.dataRegistro).toLocaleString("pt-BR")}
                                </Typography>

                            </Box>

                        ))}

                    </CardContent>
                </Card>

            </Box>

        </Box>
    );
}

function ResumoCard({
    titulo,
    valor,
    icon,
}: {
    titulo: string;
    valor: string | number;
    icon: React.ReactNode;
}) {
    return (
        <Card
            sx={{
                backgroundColor: "#1F2937",
            }}
        >
            <CardContent>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    }}
                >
                    {icon}

                    <Typography color="text.secondary">
                        {titulo}
                    </Typography>

                </Box>

                <Typography
                    variant="h4"
                    sx={{
                        mt: 2,
                        fontWeight: 800,
                    }}
                >
                    {valor}
                </Typography>

            </CardContent>
        </Card>
    );
}

export default ConhecimentoIA;