import { Fragment, useEffect, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Collapse,
    FormControlLabel,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";

import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import VisibilityIcon from "@mui/icons-material/Visibility";

import SectionTitle from "../../components/SectionTitle/SectionTitle";
import FeedbackAnomaliaDialog from "../../components/FeedbackAnomaliaDialog/FeedbackAnomaliaDialog";
import AnomaliaDiagnosticCard from "../../components/AnomaliaDiagnosticCard/AnomaliaDiagnosticCard";
import { api } from "../../services/api";

interface FeedbackSemelhante {
    totalOcorrencias: number;
    motivoMaisComum: string;
    percentual: number;
    mensagem: string;
}

interface Anomalia {
    id: number;
    clienteId: string;
    tagName: string;
    tipoTag: string;
    valor: number;
    score: number;
    ehAnomalia: boolean;
    mensagem: string;
    criticidade: string | null;
    riscoProcesso: number;
    classificacaoRisco: string | null;
    tendenciaRisco: string | null;
    tendenciaValor: string | null;
    dataDeteccao: string;
    feedbackSemelhante: FeedbackSemelhante | null;
    status: number;
}

function Anomalias() {
    const [anomalias, setAnomalias] = useState<Anomalia[]>([]);
    const [diagnosticoAberto, setDiagnosticoAberto] = useState<number | null>(
        null
    );
    const [dialogFeedback, setDialogFeedback] = useState(false);
    const [anomaliaSelecionada, setAnomaliaSelecionada] =
        useState<Anomalia | null>(null);
    const [mostrarDescartadas, setMostrarDescartadas] = useState(false);

    useEffect(() => {
        carregarAnomalias();
    }, []);

    function carregarAnomalias() {
        api.get("/anomalias")
            .then((response) => setAnomalias(response.data))
            .catch((error) =>
                console.error("Erro ao buscar anomalias:", error)
            );
    }

    const problematicas = anomalias.filter((anomalia) => {
        const risco = anomalia.classificacaoRisco?.toLowerCase();

        const ehProblematica =
            anomalia.ehAnomalia ||
            risco === "alto" ||
            risco === "critico" ||
            risco === "crítico" ||
            anomalia.score >= 3;

        const estaDescartada = anomalia.status === 2;

        return (
            ehProblematica &&
            (mostrarDescartadas || !estaDescartada)
        );
    });

    function formatarData(data: string) {
        return new Date(data).toLocaleString("pt-BR");
    }

    function corRisco(risco: string | null) {
        const valor = risco?.toLowerCase();

        if (
            valor === "critico" ||
            valor === "crítico" ||
            valor === "alto"
        ) {
            return "error";
        }

        if (
            valor === "medio" ||
            valor === "médio" ||
            valor === "moderado"
        ) {
            return "warning";
        }

        return "success";
    }

    function textoStatus(status: number) {
        if (status === 2) return "Descartada";
        if (status === 1) return "Confirmada";

        return "Pendente";
    }

    function corStatus(status: number) {
        if (status === 2) return "error";
        if (status === 1) return "success";

        return "warning";
    }

    function alternarDiagnostico(id: number) {
        setDiagnosticoAberto((atual) =>
            atual === id ? null : id
        );
    }

    function abrirFeedback(anomalia: Anomalia) {
        setAnomaliaSelecionada(anomalia);
        setDialogFeedback(true);
    }

    function fecharFeedback() {
        setDialogFeedback(false);
        setAnomaliaSelecionada(null);

        // Atualiza os status depois que o feedback foi registrado.
        carregarAnomalias();
    }

    return (
        <Box>
            <SectionTitle
                titulo="Anomalias"
                subtitulo="Tags problemáticas detectadas automaticamente pela IA Marrari."
                icon={<WarningAmberRoundedIcon />}
            />

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mb: 2,
                }}
            >
                <FormControlLabel
                    control={
                        <Switch
                            checked={mostrarDescartadas}
                            onChange={(event) =>
                                setMostrarDescartadas(
                                    event.target.checked
                                )
                            }
                        />
                    }
                    label="Mostrar descartadas"
                />
            </Box>

            <Card
                sx={{
                    backgroundColor: "#1F2937",
                    borderRadius: 3,
                }}
            >
                <CardContent>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Tag</TableCell>
                                <TableCell>Valor</TableCell>
                                <TableCell>Score</TableCell>
                                <TableCell>Risco</TableCell>
                                <TableCell>Tendência</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Data</TableCell>
                                <TableCell align="right">
                                    Ação
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {problematicas.map((anomalia) => (
                                <Fragment key={anomalia.id}>
                                    <TableRow hover>
                                        <TableCell>
                                            <Typography
                                                sx={{
                                                    fontWeight: 700,
                                                }}
                                            >
                                                {anomalia.tagName}
                                            </Typography>

                                            <Typography
                                                color="text.secondary"
                                                sx={{ fontSize: 13 }}
                                            >
                                                {anomalia.clienteId}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            {anomalia.valor}
                                        </TableCell>

                                        <TableCell>
                                            {anomalia.score.toFixed(2)}
                                        </TableCell>

                                        <TableCell>
                                            <Chip
                                                label={
                                                    anomalia.classificacaoRisco ??
                                                    "sem risco"
                                                }
                                                color={corRisco(
                                                    anomalia.classificacaoRisco
                                                )}
                                                size="small"
                                            />
                                        </TableCell>

                                        <TableCell>
                                            {anomalia.tendenciaValor ??
                                                "-"}
                                        </TableCell>

                                        <TableCell>
                                            <Chip
                                                label={textoStatus(
                                                    anomalia.status
                                                )}
                                                color={corStatus(
                                                    anomalia.status
                                                )}
                                                size="small"
                                            />
                                        </TableCell>

                                        <TableCell>
                                            {formatarData(
                                                anomalia.dataDeteccao
                                            )}
                                        </TableCell>

                                        <TableCell align="right">
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                startIcon={
                                                    <VisibilityIcon />
                                                }
                                                onClick={() =>
                                                    alternarDiagnostico(
                                                        anomalia.id
                                                    )
                                                }
                                            >
                                                Ver diagnóstico
                                            </Button>
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell
                                            colSpan={8}
                                            sx={{
                                                py: 0,
                                                borderBottom: 0,
                                            }}
                                        >
                                            <Collapse
                                                in={
                                                    diagnosticoAberto ===
                                                    anomalia.id
                                                }
                                                timeout="auto"
                                                unmountOnExit
                                            >
                                                <AnomaliaDiagnosticCard
                                                    anomalia={
                                                        anomalia
                                                    }
                                                    onRegistrarCausa={() =>
                                                        abrirFeedback(
                                                            anomalia
                                                        )
                                                    }
                                                />
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                </Fragment>
                            ))}
                        </TableBody>
                    </Table>

                    {problematicas.length === 0 && (
                        <Typography
                            color="text.secondary"
                            sx={{ mt: 3 }}
                        >
                            {mostrarDescartadas
                                ? "Nenhuma anomalia encontrada."
                                : "Nenhuma anomalia pendente ou confirmada encontrada no momento."}
                        </Typography>
                    )}
                </CardContent>
            </Card>

            {anomaliaSelecionada && (
                <FeedbackAnomaliaDialog
                    open={dialogFeedback}
                    onClose={fecharFeedback}
                    anomaliaId={anomaliaSelecionada.id}
                    tagName={anomaliaSelecionada.tagName}
                />
            )}
        </Box>
    );
}

export default Anomalias;