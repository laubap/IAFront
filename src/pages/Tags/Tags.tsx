import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Collapse,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import MemoryIcon from "@mui/icons-material/Memory";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import PsychologyIcon from "@mui/icons-material/Psychology";
import BuildIcon from "@mui/icons-material/Build";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AddIcon from "@mui/icons-material/Add";
import EditNoteIcon from "@mui/icons-material/EditNote";

import { useNavigate } from "react-router-dom";

import SectionTitle from "../../components/SectionTitle/SectionTitle";
import TagContextoDialog from "../../components/TagContextoDialog/TagContextoDialog";
import TagTrendChart from "../../components/TagTrendChart/TagTrendChart";
import { api } from "../../services/api";

interface TagCliente {
    id: number;
    clienteId: string;
    tagName: string;
    descricao: string | null;
    criticidade: string | null;
    equipamento: string | null;
    processo: string | null;
    status: string;
    ultimoValor: number | null;
    mensagemIA: string;
    ultimaAnalise: string | null;
    perfilTreinado: boolean;
    monitoramentoIa: boolean;
    impactos: string[] | string | null;
    acoesRecomendadas: string[] | string | null;
}

interface TendenciaTag {
    tagName: string;
    horas: number;
    valorAtual: number;
    valorInicial: number;
    variacaoPercentual: number;
    tendencia: string;
    faixaEsperadaMin: number | null;
    faixaEsperadaMax: number | null;
    interpretacao: string;
    historico: {
        dataHora: string;
        valor: number;
    }[];
}

function Tags() {
    const [tags, setTags] = useState<TagCliente[]>([]);
    const [tagAberta, setTagAberta] = useState<number | null>(null);
    const [dialogAberto, setDialogAberto] = useState(false);
    const [tagSelecionada, setTagSelecionada] = useState<TagCliente | null>(null);
    const [tendencias, setTendencias] = useState<Record<string, TendenciaTag>>({});
    const [carregandoTendencia, setCarregandoTendencia] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        api.get("/tags/visao-cliente")
            .then((response) => setTags(response.data))
            .catch((error) => console.error("Erro ao buscar tags:", error));
    }, []);

    function formatarData(data: string | null) {
        if (!data) return "-";
        return new Date(data).toLocaleString("pt-BR");
    }

    function formatarNumero(valor: number | null | undefined) {
        if (valor === null || valor === undefined) return "-";
        return Number(valor).toFixed(2);
    }

    function alternarTag(tag: TagCliente) {
        setTagAberta((atual) => (atual === tag.id ? null : tag.id));

        if (!tendencias[tag.tagName]) {
            setCarregandoTendencia(tag.tagName);

            api.get(`/tags/tendencia/${encodeURIComponent(tag.tagName)}?horas=6`)
                .then((response) => {
                    setTendencias((atual) => ({
                        ...atual,
                        [tag.tagName]: response.data,
                    }));
                })
                .catch((error) => {
                    console.error("Erro ao buscar tendência da tag:", error);
                })
                .finally(() => {
                    setCarregandoTendencia(null);
                });
        }
    }

    function abrirContexto(tag: TagCliente) {
        setTagSelecionada(tag);
        setDialogAberto(true);
    }

    function corStatus(status: string) {
        const valor = status?.toLowerCase();

        if (valor === "normal") return "success";
        if (valor === "sem_analise") return "warning";
        if (valor === "anomala" || valor === "anômala") return "error";

        return "default";
    }

    function transformarEmLista(valor: string[] | string | null) {
        if (!valor) return [];

        if (Array.isArray(valor)) {
            return valor.map((item) => String(item).trim()).filter(Boolean);
        }

        try {
            const convertido = JSON.parse(valor);

            if (Array.isArray(convertido)) {
                return convertido.map((item) => String(item).trim()).filter(Boolean);
            }
        } catch {
            return valor
                .split(";")
                .map((item) => item.trim())
                .filter(Boolean);
        }

        return [];
    }

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                    flexWrap: "wrap",
                    gap: 2,
                }}
            >
                <SectionTitle
                    titulo="Tags"
                    subtitulo="Tags monitoradas pela IA Marrari. Clique em uma tag para visualizar o diagnóstico."
                    icon={<LocalOfferIcon />}
                />

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate("/tags/cadastrar")}
                    sx={{
                        height: 45,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                    }}
                >
                    Adicionar Tag ao Monitoramento
                </Button>
            </Box>

            <Card sx={{ backgroundColor: "#1F2937", borderRadius: 3 }}>
                <CardContent>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell>Tag</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Último valor</TableCell>
                                <TableCell>Equipamento</TableCell>
                                <TableCell>Processo</TableCell>
                                <TableCell>Última análise</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {tags.map((tag) => {
                                const impactos = transformarEmLista(tag.impactos);
                                const acoes = transformarEmLista(tag.acoesRecomendadas);
                                const tendencia = tendencias[tag.tagName];

                                return (
                                    <>
                                        <TableRow key={tag.id} hover>
                                            <TableCell width={48}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => alternarTag(tag)}
                                                >
                                                    {tagAberta === tag.id ? (
                                                        <KeyboardArrowUpIcon />
                                                    ) : (
                                                        <KeyboardArrowDownIcon />
                                                    )}
                                                </IconButton>
                                            </TableCell>

                                            <TableCell>
                                                <Typography sx={{ fontWeight: 700 }}>
                                                    {tag.tagName}
                                                </Typography>
                                                <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                                                    {tag.descricao ?? tag.clienteId}
                                                </Typography>
                                            </TableCell>

                                            <TableCell>
                                                <Chip
                                                    label={tag.status}
                                                    color={corStatus(tag.status)}
                                                    size="small"
                                                />
                                            </TableCell>

                                            <TableCell>{tag.ultimoValor ?? "-"}</TableCell>
                                            <TableCell>{tag.equipamento ?? "-"}</TableCell>
                                            <TableCell>{tag.processo ?? "-"}</TableCell>
                                            <TableCell>{formatarData(tag.ultimaAnalise)}</TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell colSpan={7} sx={{ py: 0, borderBottom: 0 }}>
                                                <Collapse
                                                    in={tagAberta === tag.id}
                                                    timeout="auto"
                                                    unmountOnExit
                                                >
                                                    <Box
                                                        sx={{
                                                            p: 3,
                                                            backgroundColor: "#111827",
                                                            borderRadius: 2,
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                display: "grid",
                                                                gridTemplateColumns: {
                                                                    xs: "1fr",
                                                                    md: "1fr 1fr",
                                                                },
                                                                gap: 2,
                                                            }}
                                                        >
                                                            <Box sx={detailBoxStyle}>
                                                                <Box sx={detailTitleStyle}>
                                                                    <MemoryIcon fontSize="small" />
                                                                    Status da Tag
                                                                </Box>

                                                                <Chip
                                                                    label={tag.status}
                                                                    color={corStatus(tag.status)}
                                                                    size="small"
                                                                    sx={{ mb: 1 }}
                                                                />

                                                                <Typography color="text.secondary">
                                                                    Último valor: {tag.ultimoValor ?? "-"}
                                                                </Typography>

                                                                <Typography color="text.secondary">
                                                                    Última análise: {formatarData(tag.ultimaAnalise)}
                                                                </Typography>
                                                            </Box>

                                                            <Box sx={detailBoxStyle}>
                                                                <Box sx={detailTitleStyle}>
                                                                    <PrecisionManufacturingIcon fontSize="small" />
                                                                    Equipamento
                                                                </Box>

                                                                <Typography color="text.secondary">
                                                                    {tag.equipamento ?? "Nenhum equipamento vinculado."}
                                                                </Typography>

                                                                <Box sx={detailTitleStyleWithMargin}>
                                                                    <AccountTreeIcon fontSize="small" />
                                                                    Processo
                                                                </Box>

                                                                <Typography color="text.secondary">
                                                                    {tag.processo ?? "Nenhum processo vinculado."}
                                                                </Typography>
                                                            </Box>

                                                            <Box sx={detailBoxStyle}>
                                                                <Box sx={detailTitleStyle}>
                                                                    <PsychologyIcon fontSize="small" />
                                                                    Diagnóstico da IA
                                                                </Box>

                                                                <Typography color="text.secondary">
                                                                    {tag.mensagemIA}
                                                                </Typography>
                                                            </Box>

                                                            <Box sx={detailBoxStyle}>
                                                                <Box sx={detailTitleStyle}>
                                                                    📈 Tendência recente
                                                                </Box>

                                                                {carregandoTendencia === tag.tagName ? (
                                                                    <Typography color="text.secondary">
                                                                        Carregando tendência da tag...
                                                                    </Typography>
                                                                ) : !tendencia ? (
                                                                    <Typography color="text.secondary">
                                                                        Nenhuma tendência disponível para esta tag.
                                                                    </Typography>
                                                                ) : (
                                                                    <>
                                                                        <TagTrendChart
                                                                            historico={tendencia.historico}
                                                                            faixaEsperadaMin={tendencia.faixaEsperadaMin}
                                                                            faixaEsperadaMax={tendencia.faixaEsperadaMax}
                                                                        />

                                                                        <Typography sx={{ mt: 2 }}>
                                                                            <strong>Valor atual:</strong>{" "}
                                                                            {formatarNumero(tendencia.valorAtual)}
                                                                        </Typography>

                                                                        <Typography>
                                                                            <strong>Tendência:</strong>{" "}
                                                                            {tendencia.tendencia}
                                                                        </Typography>

                                                                        <Typography>
                                                                            <strong>Variação:</strong>{" "}
                                                                            {formatarNumero(tendencia.variacaoPercentual)}%
                                                                        </Typography>

                                                                        <Typography color="text.secondary" sx={{ mt: 1 }}>
                                                                            {tendencia.interpretacao}
                                                                        </Typography>
                                                                    </>
                                                                )}
                                                            </Box>

                                                            <Box sx={detailBoxStyle}>
                                                                <Box sx={detailTitleStyle}>
                                                                    <WarningAmberIcon fontSize="small" />
                                                                    Impactos possíveis
                                                                </Box>

                                                                {impactos.length === 0 ? (
                                                                    <Typography color="text.secondary">
                                                                        Nenhum impacto cadastrado para esta tag.
                                                                    </Typography>
                                                                ) : (
                                                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                                                        {impactos.map((impacto) => (
                                                                            <Typography key={impacto} color="text.secondary">
                                                                                • {impacto}
                                                                            </Typography>
                                                                        ))}
                                                                    </Box>
                                                                )}
                                                            </Box>

                                                            <Box sx={detailBoxStyle}>
                                                                <Box sx={detailTitleStyle}>
                                                                    <BuildIcon fontSize="small" />
                                                                    Ações recomendadas
                                                                </Box>

                                                                {acoes.length === 0 ? (
                                                                    <Typography color="text.secondary">
                                                                        Nenhuma ação recomendada cadastrada.
                                                                    </Typography>
                                                                ) : (
                                                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                                                        {acoes.map((acao) => (
                                                                            <Typography key={acao} color="text.secondary">
                                                                                • {acao}
                                                                            </Typography>
                                                                        ))}
                                                                    </Box>
                                                                )}
                                                            </Box>

                                                            <Box sx={detailBoxStyle}>
                                                                <Box sx={detailTitleStyle}>
                                                                    <MemoryIcon fontSize="small" />
                                                                    Monitoramento IA
                                                                </Box>

                                                                <Typography color="text.secondary">
                                                                    Perfil treinado: {tag.perfilTreinado ? "Sim" : "Não"}
                                                                </Typography>

                                                                <Typography color="text.secondary">
                                                                    Monitoramento IA: {tag.monitoramentoIa ? "Ativo" : "Inativo"}
                                                                </Typography>

                                                                <Typography color="text.secondary">
                                                                    Criticidade: {tag.criticidade ?? "não informada"}
                                                                </Typography>

                                                                <Button
                                                                    variant="contained"
                                                                    startIcon={<EditNoteIcon />}
                                                                    sx={{ mt: 2 }}
                                                                    onClick={() => abrirContexto(tag)}
                                                                >
                                                                    Adicionar / Editar Contexto
                                                                </Button>
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    </>
                                );
                            })}
                        </TableBody>
                    </Table>

                    {tags.length === 0 && (
                        <Typography color="text.secondary" sx={{ mt: 3 }}>
                            Nenhuma tag encontrada.
                        </Typography>
                    )}
                </CardContent>
            </Card>

            {tagSelecionada && (
                <TagContextoDialog
                    open={dialogAberto}
                    onClose={() => setDialogAberto(false)}
                    clienteId={tagSelecionada.clienteId}
                    tagName={tagSelecionada.tagName}
                />
            )}
        </Box>
    );
}

const detailBoxStyle = {
    backgroundColor: "#1F2937",
    border: "1px solid #374151",
    borderRadius: 2,
    p: 2,
};

const detailTitleStyle = {
    display: "flex",
    alignItems: "center",
    gap: 1,
    fontWeight: 700,
    mb: 1,
    color: "#E5E7EB",
};

const detailTitleStyleWithMargin = {
    ...detailTitleStyle,
    mt: 2,
};

export default Tags;