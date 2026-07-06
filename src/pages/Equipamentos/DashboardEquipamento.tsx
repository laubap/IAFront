import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    Box,
    Button,
    Chip,
    Typography,
} from "@mui/material";

import Grid from "@mui/material/Grid";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import StatusCard from "../../components/StatusCard/StatusCard";
import InfoCard from "../../components/InfoCard/InfoCard";
import HealthChart from "../../components/Charts/HealthChart";
import TagStatusChart from "../../components/Charts/TagStatusChart";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import { api } from "../../services/api";

interface Processo {
    processoId: number;
    nome: string;
    papelNoProcesso: string | null;
    observacao: string | null;
}

interface TagCritica {
    tagName: string;
    descricao: string | null;
    papelDaTag: string | null;
    criticidade: string | null;
    status: string;
    score: number;
    mensagem: string;
}

interface DashboardEquipamentoResponse {
    equipamentoId: number;
    equipamento: string;
    descricao: string | null;
    area: string | null;
    tipoEquipamento: string | null;
    criticidade: string | null;
    fabricante: string | null;
    modelo: string | null;
    dataUltimaManutencao: string | null;
    saude: number;
    status: string;
    mensagemSaude: string;
    totalTags: number;
    tagsNormais: number;
    tagsAnomalas: number;
    tagsSemPerfil: number;
    tagsSemValorAtual: number;
    processos: Processo[];
    probabilidadeFalha: {
        percentual: number;
        classificacao: string;
        mensagem: string;
    };
    interpretacao: string;
    tagsCriticas: TagCritica[];
}

function DashboardEquipamento() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [dados, setDados] = useState<DashboardEquipamentoResponse | null>(null);

    useEffect(() => {
        if (!id) return;

        api.get(`/equipamentos-dashboard/${id}`)
            .then((response) => setDados(response.data))
            .catch((error) =>
                console.error("Erro ao buscar dashboard do equipamento:", error)
            );
    }, [id]);

    function formatarData(data: string | null) {
        if (!data) return "-";
        return new Date(data).toLocaleDateString("pt-BR");
    }

    function corStatus(status: string) {
        const valor = status?.toLowerCase();

        if (valor === "saudavel" || valor === "saudável" || valor === "normal") {
            return "success";
        }

        if (valor === "atenção" || valor === "degradado") {
            return "warning";
        }

        return "error";
    }

    if (!dados) {
        return <Typography>Carregando dashboard do equipamento...</Typography>;
    }

    return (
        <Box>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/equipamentos")}
                sx={{ mb: 3 }}
            >
                Voltar para equipamentos
            </Button>

        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 4,
            }}
        >
            <SectionTitle
                titulo={dados.equipamento}
                subtitulo={
                    dados.descricao ??
                    "Dashboard inteligente do equipamento."
                }
                icon={<PrecisionManufacturingIcon />}
            />

            <Chip
                label={dados.status}
                color={corStatus(dados.status)}
                sx={{
                    fontWeight: 700,
                    px: 1,
                    mt: 1,
                }}
            />
        </Box>

            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, md: 3 }}>
                    <StatusCard titulo="Saúde" valor={`${dados.saude}%`} cor="#22C55E" />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                    <StatusCard
                        titulo="Falha"
                        valor={`${dados.probabilidadeFalha.percentual}%`}
                        cor="#EF4444"
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                    <StatusCard titulo="Tags" valor={dados.totalTags} cor="#3B82F6" />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                    <StatusCard titulo="Anômalas" valor={dados.tagsAnomalas} cor="#F59E0B" />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <InfoCard titulo="Saúde do Equipamento">
                        <HealthChart saude={dados.saude} />
                    </InfoCard>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <InfoCard titulo="Distribuição das Tags">
                        <TagStatusChart
                            normais={dados.tagsNormais}
                            anomalas={dados.tagsAnomalas}
                            semPerfil={dados.tagsSemPerfil}
                            semValorAtual={dados.tagsSemValorAtual}
                        />
                    </InfoCard>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <InfoCard titulo="Informações do Equipamento">
                        <Typography>Área: {dados.area ?? "-"}</Typography>
                        <Typography>Tipo: {dados.tipoEquipamento ?? "-"}</Typography>
                        <Typography>Criticidade: {dados.criticidade ?? "-"}</Typography>
                        <Typography>
                            Fabricante: {dados.fabricante ?? "-"} {dados.modelo ?? ""}
                        </Typography>
                        <Typography>
                            Última manutenção: {formatarData(dados.dataUltimaManutencao)}
                        </Typography>
                        <Typography>
                            Mensagem de saúde: {dados.mensagemSaude}
                        </Typography>
                    </InfoCard>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <InfoCard titulo="Probabilidade de Falha">
                        <Typography>
                            Classificação: {dados.probabilidadeFalha.classificacao}
                        </Typography>

                        <Typography color="text.secondary" sx={{ mt: 1 }}>
                            {dados.probabilidadeFalha.mensagem}
                        </Typography>
                    </InfoCard>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <InfoCard titulo="Processos Relacionados">
                        {dados.processos.length === 0 ? (
                            <Typography color="text.secondary">
                                Nenhum processo vinculado.
                            </Typography>
                        ) : (
                            dados.processos.map((processo) => (
                                <Box key={processo.processoId} sx={{ mb: 2 }}>
                                    <Typography sx={{ fontWeight: 600 }}>
                                        {processo.nome}
                                    </Typography>

                                    <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                                        {processo.papelNoProcesso ?? "Sem papel informado."}
                                    </Typography>

                                    {processo.observacao && (
                                        <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                                            {processo.observacao}
                                        </Typography>
                                    )}
                                </Box>
                            ))
                        )}
                    </InfoCard>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <InfoCard titulo="Resumo das Tags">
                        <Typography>Normais: {dados.tagsNormais}</Typography>
                        <Typography>Anômalas: {dados.tagsAnomalas}</Typography>
                        <Typography>Sem perfil: {dados.tagsSemPerfil}</Typography>
                        <Typography>Sem valor atual: {dados.tagsSemValorAtual}</Typography>
                    </InfoCard>
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <InfoCard titulo="Interpretação da IA">
                        <Typography color="text.secondary">
                            {dados.interpretacao}
                        </Typography>
                    </InfoCard>
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <InfoCard titulo="Tags Críticas">
                        {dados.tagsCriticas.length === 0 ? (
                            <Typography color="text.secondary">
                                Nenhuma tag crítica encontrada.
                            </Typography>
                        ) : (
                            dados.tagsCriticas.map((tag) => (
                                <Box key={tag.tagName} sx={{ mb: 2 }}>
                                    <Chip label={tag.status} color="warning" size="small" />

                                    <Typography sx={{ mt: 1, fontWeight: 600 }}>
                                        {tag.tagName} - {tag.papelDaTag ?? "Sem papel informado"}
                                    </Typography>

                                    <Typography color="text.secondary">
                                        {tag.mensagem}
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

export default DashboardEquipamento;