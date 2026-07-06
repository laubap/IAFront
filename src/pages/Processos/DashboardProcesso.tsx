import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Box, Button, Chip, Collapse, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";

import StatusCard from "../../components/StatusCard/StatusCard";
import InfoCard from "../../components/InfoCard/InfoCard";
import HealthChart from "../../components/Charts/HealthChart";
import TagStatusChart from "../../components/Charts/TagStatusChart";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import { api } from "../../services/api";

interface TagProcesso {
    tagName: string;
    papelDaTag: string | null;
    descricao: string | null;
    criticidade: string | null;
    status: string;
    score: number;
    mensagem: string;
    ehAnomalia: boolean;
}

interface DashboardProcessoResponse {
    processoId: number;
    processo: string;
    area: string | null;
    criticidade: string | null;
    saude: number;
    status: string;
    mensagemSaude: string;
    totalTags: number;
    tagsNormais: number;
    tagsAnomalas: number;
    tagsSemPerfil: number;
    tagsSemValorAtual: number;
    tags: TagProcesso[];
    probabilidadeFalha: {
        percentual: number;
        classificacao: string;
        mensagem: string;
    };
    resumo: string;
    interpretacao: string;
    tagsCriticas: TagProcesso[];
}

function DashboardProcesso() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [dados, setDados] = useState<DashboardProcessoResponse | null>(null);
    const [tagAberta, setTagAberta] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        api.get(`/processos-dashboard/${id}`)
            .then((response) => setDados(response.data))
            .catch((error) =>
                console.error("Erro ao buscar dashboard do processo:", error)
            );
    }, [id]);

    function corStatus(status: string) {
        const valor = status?.toLowerCase();

        if (valor === "saudavel" || valor === "saudável" || valor === "normal") {
            return "success";
        }

        if (valor === "atenção" || valor === "degradado" || valor === "sem_perfil") {
            return "warning";
        }

        return "error";
    }

    function alternarTag(tagName: string) {
        setTagAberta((atual) => (atual === tagName ? null : tagName));
    }

    if (!dados) {
        return <Typography>Carregando dashboard do processo...</Typography>;
    }

    return (
        <Box>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/processos")}
                sx={{ mb: 3 }}
            >
                Voltar para processos
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
                    titulo={dados.processo}
                    subtitulo={dados.resumo}
                    icon={<AccountTreeIcon />}
                />

                <Chip
                    label={dados.status}
                    color={corStatus(dados.status)}
                    sx={{ fontWeight: 700, px: 1, mt: 1 }}
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
                    <InfoCard titulo="Saúde do Processo">
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

                <Grid size={{ xs: 12 }}>
                    <InfoCard titulo="Tags vinculadas ao processo">
                        {dados.tags.length === 0 ? (
                            <Typography color="text.secondary">
                                Nenhuma tag vinculada a este processo.
                            </Typography>
                        ) : (
                            dados.tags.map((tag) => (
                                <Box
                                    key={tag.tagName}
                                    sx={{
                                        border: "1px solid #374151",
                                        borderRadius: 2,
                                        p: 2,
                                        mb: 2,
                                        backgroundColor: "#111827",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            gap: 2,
                                        }}
                                    >
                                        <Box>
                                            <Typography sx={{ fontWeight: 700 }}>
                                                {tag.tagName}
                                            </Typography>

                                            <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                                                {tag.descricao ?? "Sem descrição cadastrada."}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Chip
                                                label={tag.status}
                                                color={corStatus(tag.status)}
                                                size="small"
                                            />

                                            <Button
                                                size="small"
                                                variant="outlined"
                                                startIcon={<VisibilityIcon />}
                                                onClick={() => alternarTag(tag.tagName)}
                                            >
                                                Ver detalhes
                                            </Button>
                                        </Box>
                                    </Box>

                                    <Collapse
                                        in={tagAberta === tag.tagName}
                                        timeout="auto"
                                        unmountOnExit
                                    >
                                        <Box
                                            sx={{
                                                mt: 2,
                                                p: 2,
                                                borderRadius: 2,
                                                backgroundColor: "#1F2937",
                                            }}
                                        >
                                            <Typography>
                                                <strong>Papel da tag:</strong>{" "}
                                                {tag.papelDaTag ?? "Sem papel informado."}
                                            </Typography>

                                            <Typography>
                                                <strong>Criticidade:</strong>{" "}
                                                {tag.criticidade ?? "Não informada"}
                                            </Typography>

                                            <Typography>
                                                <strong>Score:</strong>{" "}
                                                {tag.score?.toFixed ? tag.score.toFixed(2) : tag.score}
                                            </Typography>

                                            <Typography>
                                                <strong>Anomalia:</strong>{" "}
                                                {tag.ehAnomalia ? "Sim" : "Não"}
                                            </Typography>

                                            <Typography color="text.secondary" sx={{ mt: 1 }}>
                                                {tag.mensagem}
                                            </Typography>
                                        </Box>
                                    </Collapse>
                                </Box>
                            ))
                        )}
                    </InfoCard>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <InfoCard titulo="Informações do Processo">
                        <Typography>Área: {dados.area ?? "-"}</Typography>
                        <Typography>Criticidade: {dados.criticidade ?? "-"}</Typography>
                        <Typography>Status: {dados.status}</Typography>
                        <Typography>Mensagem: {dados.mensagemSaude}</Typography>
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

export default DashboardProcesso;