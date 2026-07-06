import { useEffect, useState } from "react";
import {
    Box,
    Chip,
    Grid,
    Typography,
} from "@mui/material";

import StatusCard from "../../components/StatusCard/StatusCard";
import InfoCard from "../../components/InfoCard/InfoCard";
import HealthChart from "../../components/Charts/HealthChart";
import AnomalyChart from "../../components/Charts/AnomalyChart";
import EquipmentChart from "../../components/Charts/EquipmentChart";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import DashboardIcon from "@mui/icons-material/Dashboard";
import QuickActions from "../../components/QuickActions/QuickActions";
import PriorityPanel from "../../components/PriorityPanel/PriorityPanel";
import { api } from "../../services/api";

interface Anomalia {
    id: number;
    clienteId: string;
    tagName: string;
    valor: number;
    score: number;
    ehAnomalia: boolean;
    riscoProcesso: number;
    classificacaoRisco: string | null;
    dataDeteccao: string;
}

interface Processo {
    id: number;
    clienteId: string;
    nome: string;
    area: string | null;
    criticidade: string | null;
}

interface Equipamento {
    id: number;
    clienteId: string;
    nome: string;
    area: string | null;
    tipoEquipamento: string | null;
    criticidade: string | null;
}

interface DashboardGeral {
    saudeGeral: number;
    totalProcessos: number;
    totalEquipamentos: number;
    totalTagsConfiguradas: number;
    totalAnomalias: number;
    processos: Processo[];
    equipamentos: Equipamento[];
    ultimasAnomalias: Anomalia[];
}

function Dashboard() {
    const [dados, setDados] = useState<DashboardGeral | null>(null);

    useEffect(() => {
        api.get("/dashboard-geral")
            .then((response) => setDados(response.data))
            .catch((error) => {
                console.error("Erro ao buscar dashboard geral:", error);
            });
    }, []);

    function formatarData(data: string) {
        return new Date(data).toLocaleString("pt-BR");
    }

    return (
        <Box>
            <SectionTitle
                titulo="Dashboard Geral"
                subtitulo="Visão geral da operação industrial monitorada pela IA Marrari."
                icon={<DashboardIcon />}
            />

            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, md: 3 }}>
                    <StatusCard titulo="Saúde Geral" valor={dados ? `${dados.saudeGeral}%` : "-"} cor="#22C55E" />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                    <StatusCard titulo="Processos" valor={dados?.totalProcessos ?? "-"} cor="#3B82F6" />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                    <StatusCard titulo="Equipamentos" valor={dados?.totalEquipamentos ?? "-"} cor="#F59E0B" />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                    <StatusCard titulo="Anomalias" valor={dados?.totalAnomalias ?? "-"} cor="#EF4444" />
                </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <PriorityPanel />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <QuickActions />
                </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <InfoCard titulo="Saúde Geral">
                        <HealthChart saude={dados?.saudeGeral ?? 0} />
                    </InfoCard>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <InfoCard titulo="Distribuição de Anomalias">
                        <AnomalyChart
                            totalAnomalias={dados?.totalAnomalias ?? 0}
                            totalTags={dados?.totalTagsConfiguradas ?? 0}
                        />
                    </InfoCard>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <InfoCard titulo="Criticidade dos Equipamentos">
                        <EquipmentChart equipamentos={dados?.equipamentos ?? []} />
                    </InfoCard>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <StatusCard titulo="Tags Configuradas" valor={dados?.totalTagsConfiguradas ?? "-"} cor="#8B5CF6" />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <StatusCard titulo="Sistema" valor="Online" cor="#22C55E" />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <StatusCard titulo="Cliente" valor="PK2" cor="#06B6D4" />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <InfoCard titulo="Últimas Anomalias">
                        {!dados || dados.ultimasAnomalias.length === 0 ? (
                            <Typography color="text.secondary">
                                Nenhuma anomalia recente encontrada.
                            </Typography>
                        ) : (
                            dados.ultimasAnomalias.map((anomalia) => (
                                <Box key={anomalia.id} sx={{ mb: 2 }}>
                                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                        <Chip
                                            label={anomalia.classificacaoRisco ?? "sem risco"}
                                            color={
                                                anomalia.classificacaoRisco === "alto" ||
                                                anomalia.classificacaoRisco === "critico"
                                                    ? "error"
                                                    : "warning"
                                            }
                                            size="small"
                                        />

                                        <Typography sx={{ fontWeight: 700 }}>
                                            {anomalia.tagName}
                                        </Typography>
                                    </Box>

                                    <Typography color="text.secondary" sx={{ fontSize: 14, mt: 0.5 }}>
                                        Valor: {anomalia.valor} | Score: {anomalia.score.toFixed(2)} | Risco: {anomalia.riscoProcesso}/100
                                    </Typography>

                                    <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                                        {formatarData(anomalia.dataDeteccao)}
                                    </Typography>
                                </Box>
                            ))
                        )}
                    </InfoCard>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <InfoCard titulo="Equipamentos Recentes">
                        {!dados || dados.equipamentos.length === 0 ? (
                            <Typography color="text.secondary">
                                Nenhum equipamento cadastrado.
                            </Typography>
                        ) : (
                            dados.equipamentos.map((equipamento) => (
                                <Box key={equipamento.id} sx={{ mb: 2 }}>
                                    <Typography sx={{ fontWeight: 700 }}>
                                        {equipamento.nome}
                                    </Typography>

                                    <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                                        {equipamento.area ?? "-"} • {equipamento.tipoEquipamento ?? "-"}
                                    </Typography>

                                    <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                                        Criticidade: {equipamento.criticidade ?? "não informada"}
                                    </Typography>
                                </Box>
                            ))
                        )}
                    </InfoCard>
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <InfoCard titulo="Processos Recentes">
                        {!dados || dados.processos.length === 0 ? (
                            <Typography color="text.secondary">
                                Nenhum processo cadastrado.
                            </Typography>
                        ) : (
                            dados.processos.map((processo) => (
                                <Box key={processo.id} sx={{ mb: 2 }}>
                                    <Typography sx={{ fontWeight: 700 }}>
                                        {processo.nome}
                                    </Typography>

                                    <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                                        {processo.area ?? "-"} • Criticidade: {processo.criticidade ?? "não informada"}
                                    </Typography>
                                </Box>
                            ))
                        )}
                    </InfoCard>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Dashboard;