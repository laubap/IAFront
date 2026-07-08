import { useEffect, useMemo, useState } from "react";
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";

import { api } from "../../services/api";

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

function FeedbackAnomaliaDialog({ open, onClose, anomaliaId, tagName }: Props) {
    const clienteId = "PK2";

    const [categorias, setCategorias] = useState<CategoriaIA[]>([]);
    const [motivos, setMotivos] = useState<MotivoIA[]>([]);

    const [categoriaId, setCategoriaId] = useState<number | "">("");
    const [motivoAnomaliaIAId, setMotivoAnomaliaIAId] = useState<number | "">("");

    const [novaCategoria, setNovaCategoria] = useState("");
    const [novoTipoFalha, setNovoTipoFalha] = useState("");
    const [novaAcao, setNovaAcao] = useState("");

    const [mostrarNovaCategoria, setMostrarNovaCategoria] = useState(false);
    const [mostrarNovoTipoFalha, setMostrarNovoTipoFalha] = useState(false);
    const [mostrarNovaAcao, setMostrarNovaAcao] = useState(false);

    const [descricao, setDescricao] = useState("");
    const [acaoTomada, setAcaoTomada] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        if (!open) return;
        carregarBiblioteca();
    }, [open]);

    function carregarBiblioteca() {
        api.get(`/categorias-falha-ia/${clienteId}`)
            .then((response) => setCategorias(response.data))
            .catch((error) => console.error("Erro ao buscar categorias:", error));

        api.get(`/motivos-ia/${clienteId}`)
            .then((response) => setMotivos(response.data))
            .catch((error) => console.error("Erro ao buscar tipos de falha:", error));
    }

    const motivosFiltrados = useMemo(() => {
        if (categoriaId === "") return motivos;

        return motivos.filter(
            (motivo) => Number(motivo.categoriaFalhaIAId) === Number(categoriaId)
        );
    }, [categoriaId, motivos]);

    const motivoSelecionado = useMemo(() => {
        if (motivoAnomaliaIAId === "") return null;

        return motivos.find((motivo) => motivo.id === Number(motivoAnomaliaIAId)) ?? null;
    }, [motivoAnomaliaIAId, motivos]);

    async function criarCategoriaRapida() {
        if (!novaCategoria.trim()) return;

        const response = await api.post("/categorias-falha-ia", {
            clienteId,
            nome: novaCategoria,
            descricao: "Categoria cadastrada durante o diagnóstico de uma anomalia.",
        });

        const categoriaCriada = response.data.categoria;

        setNovaCategoria("");
        setMostrarNovaCategoria(false);
        await carregarBiblioteca();

        if (categoriaCriada?.id) {
            setCategoriaId(categoriaCriada.id);
        }

        setMensagem("Categoria cadastrada com sucesso.");
    }

    async function criarTipoFalhaRapido() {
        if (!novoTipoFalha.trim()) return;

        const response = await api.post("/motivos-ia", {
            clienteId,
            nome: novoTipoFalha,
            descricao: "Tipo de falha cadastrado durante o diagnóstico de uma anomalia.",
            categoriaFalhaIAId: categoriaId === "" ? null : Number(categoriaId),
        });

        const motivoCriado = response.data.motivo;

        setNovoTipoFalha("");
        setMostrarNovoTipoFalha(false);
        await carregarBiblioteca();

        if (motivoCriado?.id) {
            setMotivoAnomaliaIAId(motivoCriado.id);
        }

        setMensagem("Tipo de falha cadastrado com sucesso.");
    }

    async function criarAcaoRapida() {
        if (!novaAcao.trim() || motivoAnomaliaIAId === "") return;

        await api.post("/acoes-ia", {
            clienteId,
            motivoAnomaliaIAId: Number(motivoAnomaliaIAId),
            descricao: novaAcao,
        });

        setNovaAcao("");
        setMostrarNovaAcao(false);
        await carregarBiblioteca();

        setMensagem("Ação recomendada cadastrada com sucesso.");
    }

    async function salvarFeedback() {
        try {
            setSalvando(true);

            await api.post(`/anomalias/${anomaliaId}/feedback`, {
                motivoAnomaliaIAId:
                    motivoAnomaliaIAId === "" ? null : Number(motivoAnomaliaIAId),
                descricao,
                acaoTomada,
            });

            setMensagem("Feedback registrado com sucesso.");
            setCategoriaId("");
            setMotivoAnomaliaIAId("");
            setDescricao("");
            setAcaoTomada("");
        } catch (error) {
            console.error(error);
            setMensagem("Erro ao registrar feedback.");
        } finally {
            setSalvando(false);
        }
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Registrar causa da anomalia</DialogTitle>

            <DialogContent>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                    Tag: {tagName}
                </Typography>

                <FormControl fullWidth sx={{ mb: 1 }}>
                    <InputLabel>Categoria de falha</InputLabel>

                    <Select
                        value={categoriaId}
                        label="Categoria de falha"
                        onChange={(e) => {
                            setCategoriaId(e.target.value as number | "");
                            setMotivoAnomaliaIAId("");
                        }}
                    >
                        <MenuItem value="">Todas as categorias</MenuItem>

                        {categorias.map((categoria) => (
                            <MenuItem key={categoria.id} value={categoria.id}>
                                {categoria.nome}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button
                    size="small"
                    onClick={() => setMostrarNovaCategoria(!mostrarNovaCategoria)}
                    sx={{ mb: 2 }}
                >
                    + Nova categoria de falha
                </Button>

                {mostrarNovaCategoria && (
                    <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Nova categoria"
                            value={novaCategoria}
                            onChange={(e) => setNovaCategoria(e.target.value)}
                        />

                        <Button variant="contained" onClick={criarCategoriaRapida}>
                            Criar
                        </Button>
                    </Box>
                )}

                <FormControl fullWidth sx={{ mb: 1 }}>
                    <InputLabel>Tipo de falha</InputLabel>

                    <Select
                        value={motivoAnomaliaIAId}
                        label="Tipo de falha"
                        onChange={(e) => setMotivoAnomaliaIAId(e.target.value as number)}
                    >
                        {motivosFiltrados.map((motivo) => (
                            <MenuItem key={motivo.id} value={motivo.id}>
                                {motivo.nome}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button
                    size="small"
                    onClick={() => setMostrarNovoTipoFalha(!mostrarNovoTipoFalha)}
                    sx={{ mb: 2 }}
                >
                    + Novo tipo de falha
                </Button>

                {mostrarNovoTipoFalha && (
                    <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Novo tipo de falha"
                            value={novoTipoFalha}
                            onChange={(e) => setNovoTipoFalha(e.target.value)}
                        />

                        <Button variant="contained" onClick={criarTipoFalhaRapido}>
                            Criar
                        </Button>
                    </Box>
                )}

                {motivoSelecionado && (
                    <Box
                        sx={{
                            mb: 3,
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: "#111827",
                            border: "1px solid #374151",
                        }}
                    >
                        <Typography sx={{ fontWeight: 800, mb: 1 }}>
                            Ações recomendadas pela IA
                        </Typography>

                        {motivoSelecionado.acoesRecomendadas?.length ? (
                            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                                {motivoSelecionado.acoesRecomendadas.map((acao) => (
                                    <Chip
                                        key={acao.id}
                                        label={acao.descricao}
                                        variant="outlined"
                                        sx={{ color: "#E5E7EB", borderColor: "#374151" }}
                                    />
                                ))}
                            </Box>
                        ) : (
                            <Typography color="text.secondary" sx={{ mb: 2 }}>
                                Nenhuma ação recomendada cadastrada para este tipo de falha.
                            </Typography>
                        )}

                        <Button
                            size="small"
                            onClick={() => setMostrarNovaAcao(!mostrarNovaAcao)}
                        >
                            + Nova ação recomendada
                        </Button>

                        {mostrarNovaAcao && (
                            <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Nova ação recomendada"
                                    value={novaAcao}
                                    onChange={(e) => setNovaAcao(e.target.value)}
                                />

                                <Button variant="contained" onClick={criarAcaoRapida}>
                                    Criar
                                </Button>
                            </Box>
                        )}
                    </Box>
                )}

                <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    label="Descrição do ocorrido"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    sx={{ mb: 3 }}
                />

                <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    label="Ação tomada pelo operador"
                    value={acaoTomada}
                    onChange={(e) => setAcaoTomada(e.target.value)}
                />

                {mensagem && (
                    <Typography color="text.secondary" sx={{ mt: 3 }}>
                        {mensagem}
                    </Typography>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Fechar</Button>

                <Button
                    variant="contained"
                    onClick={salvarFeedback}
                    disabled={!motivoAnomaliaIAId || salvando}
                >
                    {salvando ? "Salvando..." : "Salvar feedback"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default FeedbackAnomaliaDialog;