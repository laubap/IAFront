import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    LinearProgress,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HelpIcon from "@mui/icons-material/Help";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PsychologyIcon from "@mui/icons-material/Psychology";

import { api } from "../../services/api";
import NovoConhecimentoRapidoDialog from "./NovoConhecimentoRapidoDialog";

interface Props {
    open: boolean;
    onClose: () => void;
    anomaliaId: number;
    tagName: string;
}

interface CategoriaIA {
    id: number;
    nome: string;
}

interface AcaoIA {
    id: number;
    descricao: string;
}

interface MotivoIA {
    id: number;
    nome: string;
    descricao: string | null;
    categoriaFalhaIAId?: number | null;
    acoesRecomendadas: AcaoIA[];
}

type ValorAvaliacao = 0 | 1 | 2 | 3;

function FeedbackAnomaliaDialog({
    open,
    onClose,
    anomaliaId,
    tagName,
}: Props) {
    const clienteId = "PK7";

    const [etapa, setEtapa] = useState<1 | 2>(1);

    const [categorias, setCategorias] = useState<CategoriaIA[]>([]);
    const [motivos, setMotivos] = useState<MotivoIA[]>([]);

    const [categoriaId, setCategoriaId] = useState<number | "">("");
    const [motivoAnomaliaIAId, setMotivoAnomaliaIAId] =
        useState<number | "">("");

    const [descricao, setDescricao] = useState("");
    const [acaoTomada, setAcaoTomada] = useState("");

    const [avaliacaoDeteccao, setAvaliacaoDeteccao] =
        useState<ValorAvaliacao>(0);

    const [avaliacaoCausa, setAvaliacaoCausa] =
        useState<ValorAvaliacao>(0);

    const [avaliacaoAcao, setAvaliacaoAcao] =
        useState<ValorAvaliacao>(0);

    const [mensagem, setMensagem] = useState("");
    const [salvando, setSalvando] = useState(false);
    const [dialogConhecimento, setDialogConhecimento] = useState(false);

    useEffect(() => {
        if (!open) return;

        carregarBiblioteca();
    }, [open]);

    function carregarBiblioteca() {
        api.get(`/categorias-falha-ia/${clienteId}`)
            .then((response) => setCategorias(response.data))
            .catch((error) =>
                console.error("Erro ao buscar categorias:", error)
            );

        api.get(`/motivos-ia/${clienteId}`)
            .then((response) => setMotivos(response.data))
            .catch((error) =>
                console.error("Erro ao buscar tipos de falha:", error)
            );
    }

    const motivosFiltrados = useMemo(() => {
        if (categoriaId === "") return motivos;

        return motivos.filter(
            (motivo) =>
                Number(motivo.categoriaFalhaIAId) === Number(categoriaId)
        );
    }, [categoriaId, motivos]);

    const motivoSelecionado = useMemo(() => {
        if (motivoAnomaliaIAId === "") return null;

        return (
            motivos.find(
                (motivo) => motivo.id === Number(motivoAnomaliaIAId)
            ) ?? null
        );
    }, [motivoAnomaliaIAId, motivos]);

    const todasAvaliacoesPreenchidas =
        avaliacaoDeteccao !== 0 &&
        avaliacaoCausa !== 0 &&
        avaliacaoAcao !== 0;

    function irParaAvaliacao() {
        setMensagem("");

        if (motivoAnomaliaIAId === "") {
            setMensagem("Selecione o tipo de falha antes de continuar.");
            return;
        }

        if (!descricao.trim()) {
            setMensagem("Descreva brevemente o que aconteceu.");
            return;
        }

        if (!acaoTomada.trim()) {
            setMensagem("Informe qual ação foi tomada.");
            return;
        }

        setEtapa(2);
    }

    async function salvarFeedback() {
        if (!todasAvaliacoesPreenchidas) {
            setMensagem("Responda às três avaliações da IA.");
            return;
        }

        try {
            setSalvando(true);
            setMensagem("");

            const motivoId = Number(motivoAnomaliaIAId);

            const acaoJaExiste =
                motivoSelecionado?.acoesRecomendadas?.some(
                    (acao) =>
                        acao.descricao.trim().toLowerCase() ===
                        acaoTomada.trim().toLowerCase()
                );

            if (acaoTomada.trim() && !acaoJaExiste) {
                await api.post("/acoes-ia", {
                    clienteId,
                    motivoAnomaliaIAId: motivoId,
                    descricao: acaoTomada.trim(),
                });
            }

            await api.post(`/anomalias/${anomaliaId}/feedback`, {
                motivoAnomaliaIAId: motivoId,
                descricao: descricao.trim(),
                acaoTomada: acaoTomada.trim(),
                avaliacaoDeteccao,
                avaliacaoCausa,
                avaliacaoAcao,
            });

            limparFormulario();
            onClose();
        } catch (error) {
            console.error(error);
            setMensagem("Erro ao registrar o feedback.");
        } finally {
            setSalvando(false);
        }
    }

    function limparFormulario() {
        setEtapa(1);
        setCategoriaId("");
        setMotivoAnomaliaIAId("");
        setDescricao("");
        setAcaoTomada("");
        setAvaliacaoDeteccao(0);
        setAvaliacaoCausa(0);
        setAvaliacaoAcao(0);
        setMensagem("");
    }

    function fecharDialog() {
        limparFormulario();
        onClose();
    }

    return (
        <>
        <Dialog
            open={open}
            onClose={fecharDialog}
            maxWidth="sm"
            fullWidth
            sx={{
                "& .MuiDialog-paper": {
                    borderRadius: 3,
                    maxHeight: "90vh",
                },
            }}
        >
                <DialogTitle sx={{ pb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {etapa === 1
                            ? "Contextualizar anomalia"
                            : "Avaliar desempenho da IA"}
                    </Typography>

                    <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                        Tag: {tagName}
                    </Typography>
                </DialogTitle>

                <Box sx={{ px: 3, pb: 2 }}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1,
                        }}
                    >
                        <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                            Passo {etapa} de 2
                        </Typography>

                        <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                            {etapa === 1
                                ? "Contexto operacional"
                                : "Feedback obrigatório"}
                        </Typography>
                    </Box>

                    <LinearProgress
                        variant="determinate"
                        value={etapa === 1 ? 50 : 100}
                        sx={{
                            height: 7,
                            borderRadius: 10,
                        }}
                    />
                </Box>

                <DialogContent dividers>
                    {etapa === 1 && (
                        <>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    mb: 2,
                                }}
                            >
                                <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() =>
                                        setDialogConhecimento(true)
                                    }
                                >
                                    Ensinar novo conhecimento
                                </Button>
                            </Box>

                            <FormControl fullWidth sx={{ mb: 2.5 }}>
                                <InputLabel>Categoria de falha</InputLabel>

                                <Select
                                    value={categoriaId}
                                    label="Categoria de falha"
                                    onChange={(event) => {
                                        setCategoriaId(
                                            event.target.value as number | ""
                                        );

                                        setMotivoAnomaliaIAId("");
                                    }}
                                >
                                    <MenuItem value="">
                                        Selecione uma categoria
                                    </MenuItem>

                                    {categorias.map((categoria) => (
                                        <MenuItem
                                            key={categoria.id}
                                            value={categoria.id}
                                        >
                                            {categoria.nome}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth sx={{ mb: 2.5 }}>
                                <InputLabel>Tipo de falha</InputLabel>

                                <Select
                                    value={motivoAnomaliaIAId}
                                    label="Tipo de falha"
                                    disabled={categoriaId === ""}
                                    onChange={(event) =>
                                        setMotivoAnomaliaIAId(
                                            event.target.value as number
                                        )
                                    }
                                >
                                    {motivosFiltrados.map((motivo) => (
                                        <MenuItem
                                            key={motivo.id}
                                            value={motivo.id}
                                        >
                                            {motivo.nome}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {motivoSelecionado && (
                                <Box
                                    sx={{
                                        mb: 2.5,
                                        p: 2,
                                        borderRadius: 2,
                                        backgroundColor: "#111827",
                                        border: "1px solid #374151",
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontWeight: 800,
                                            mb: 1.5,
                                        }}
                                    >
                                        Ações recomendadas
                                    </Typography>

                                    {motivoSelecionado.acoesRecomendadas
                                        ?.length ? (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexWrap: "wrap",
                                                gap: 1,
                                            }}
                                        >
                                            {motivoSelecionado
                                                .acoesRecomendadas
                                                .map((acao) => {
                                                    const selecionada =
                                                        acaoTomada ===
                                                        acao.descricao;

                                                    return (
                                                        <Chip
                                                            key={acao.id}
                                                            label={
                                                                selecionada
                                                                    ? `✓ ${acao.descricao}`
                                                                    : acao.descricao
                                                            }
                                                            clickable
                                                            onClick={() =>
                                                                setAcaoTomada(
                                                                    acao.descricao
                                                                )
                                                            }
                                                            sx={{
                                                                color: selecionada
                                                                    ? "#FFFFFF"
                                                                    : "#E5E7EB",
                                                                backgroundColor:
                                                                    selecionada
                                                                        ? "#2563EB"
                                                                        : "transparent",
                                                                border:
                                                                    "1px solid #4B5563",
                                                            }}
                                                        />
                                                    );
                                                })}
                                        </Box>
                                    ) : (
                                        <Typography color="text.secondary">
                                            Nenhuma ação recomendada cadastrada.
                                        </Typography>
                                    )}
                                </Box>
                            )}

                            <TextField
                                fullWidth
                                multiline
                                minRows={2}
                                label="O que aconteceu?"
                                placeholder="Descreva brevemente o ocorrido."
                                value={descricao}
                                onChange={(event) =>
                                    setDescricao(event.target.value)
                                }
                                sx={{ mb: 2.5 }}
                            />

                            <TextField
                                fullWidth
                                multiline
                                minRows={2}
                                label="Qual ação foi tomada?"
                                placeholder="Clique em uma recomendação ou escreva a ação realizada."
                                value={acaoTomada}
                                onChange={(event) =>
                                    setAcaoTomada(event.target.value)
                                }
                            />
                        </>
                    )}

                    {etapa === 2 && (
                        <>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    mb: 1,
                                }}
                            >
                                <PsychologyIcon sx={{ color: "#60A5FA" }} />

                                <Typography
                                    variant="h6"
                                    sx={{ fontWeight: 800 }}
                                >
                                    Como a IA se saiu?
                                </Typography>
                            </Box>

                            <Typography color="text.secondary" sx={{ mb: 3 }}>
                                Responda às três perguntas. Leva apenas alguns
                                segundos.
                            </Typography>

                            <AvaliacaoRapida
                                pergunta="A IA detectou corretamente a anomalia?"
                                valor={avaliacaoDeteccao}
                                onChange={setAvaliacaoDeteccao}
                            />

                            <AvaliacaoRapida
                                pergunta="A causa sugerida estava correta?"
                                valor={avaliacaoCausa}
                                onChange={setAvaliacaoCausa}
                            />

                            <AvaliacaoRapida
                                pergunta="A ação recomendada foi útil?"
                                valor={avaliacaoAcao}
                                onChange={setAvaliacaoAcao}
                            />

                            {todasAvaliacoesPreenchidas && (
                                <Alert severity="success" sx={{ mt: 1 }}>
                                    Avaliação concluída. O feedback está pronto
                                    para ser salvo.
                                </Alert>
                            )}
                        </>
                    )}

                    {mensagem && (
                        <Alert severity="warning" sx={{ mt: 3 }}>
                            {mensagem}
                        </Alert>
                    )}
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    {etapa === 1 ? (
                        <>
                            <Button onClick={fecharDialog}>
                                Cancelar
                            </Button>

                            <Button
                                variant="contained"
                                endIcon={<ArrowForwardIcon />}
                                onClick={irParaAvaliacao}
                            >
                                Continuar
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                startIcon={<ArrowBackIcon />}
                                onClick={() => {
                                    setMensagem("");
                                    setEtapa(1);
                                }}
                            >
                                Voltar
                            </Button>

                            <Button
                                variant="contained"
                                onClick={salvarFeedback}
                                disabled={
                                    !todasAvaliacoesPreenchidas || salvando
                                }
                            >
                                {salvando
                                    ? "Salvando..."
                                    : "Salvar feedback"}
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>

            <NovoConhecimentoRapidoDialog
                open={dialogConhecimento}
                onClose={() => setDialogConhecimento(false)}
                clienteId={clienteId}
                categorias={categorias}
                motivos={motivos}
                onAtualizarBiblioteca={carregarBiblioteca}
            />
        </>
    );
}

function AvaliacaoRapida({
    pergunta,
    valor,
    onChange,
}: {
    pergunta: string;
    valor: ValorAvaliacao;
    onChange: (valor: ValorAvaliacao) => void;
}) {
    const opcoes = [
        {
            valor: 3 as ValorAvaliacao,
            label: "Sim",
           icon: <CheckCircleIcon />,
        },
        {
            valor: 2 as ValorAvaliacao,
            label: "Parcial",
           icon: <HelpIcon />,
        },
        {
            valor: 1 as ValorAvaliacao,
            label: "Não",
            icon: <CancelOutlinedIcon />,
        },
    ];

    return (
        <Box
            sx={{
                p: 2,
                mb: 2,
                borderRadius: 2,
                border: "1px solid #374151",
                backgroundColor: "#111827",
            }}
        >
            <Typography sx={{ fontWeight: 700, mb: 1.5 }}>
                {pergunta}
            </Typography>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 1,
                }}
            >
                {opcoes.map((opcao) => {
                    const selecionada = valor === opcao.valor;

                    return (
                        <Button
                            key={opcao.valor}
                            variant={selecionada ? "contained" : "outlined"}
                            startIcon={opcao.icon}
                            onClick={() => onChange(opcao.valor)}
                            sx={{
                                py: 1.2,
                                textTransform: "none",
                                fontWeight: 700,
                            }}
                        >
                            {opcao.label}
                        </Button>
                    );
                })}
            </Box>
        </Box>
    );
}

export default FeedbackAnomaliaDialog;