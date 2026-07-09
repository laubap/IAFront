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

function FeedbackAnomaliaDialog({ open, onClose, anomaliaId, tagName }: Props) {
    const clienteId = "PK7";

    const [categorias, setCategorias] = useState<CategoriaIA[]>([]);
    const [motivos, setMotivos] = useState<MotivoIA[]>([]);

    const [categoriaId, setCategoriaId] = useState<number | "">("");
    const [motivoAnomaliaIAId, setMotivoAnomaliaIAId] = useState<number | "">("");

    const [descricao, setDescricao] = useState("");
    const [acaoTomada, setAcaoTomada] = useState("");
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

async function salvarFeedback() {
    try {
        setSalvando(true);

        const motivoId =
            motivoAnomaliaIAId === "" ? null : Number(motivoAnomaliaIAId);

        if (motivoId && acaoTomada.trim()) {
            const acaoJaExiste = motivoSelecionado?.acoesRecomendadas?.some(
                (acao) =>
                    acao.descricao.trim().toLowerCase() ===
                    acaoTomada.trim().toLowerCase()
            );

            if (!acaoJaExiste) {
                await api.post("/acoes-ia", {
                    clienteId,
                    motivoAnomaliaIAId: motivoId,
                    descricao: acaoTomada.trim(),
                });

                carregarBiblioteca();
            }
        }

        await api.post(`/anomalias/${anomaliaId}/feedback`, {
            motivoAnomaliaIAId: motivoId,
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
        <>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle>Registrar causa da anomalia</DialogTitle>

                <DialogContent>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                        Tag: {tagName}
                    </Typography>

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
                            onClick={() => setDialogConhecimento(true)}
                        >
                            ⚙ Ensinar novo conhecimento
                        </Button>
                    </Box>

                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel>Categoria de falha</InputLabel>

                        <Select
                            value={categoriaId}
                            label="Categoria de falha"
                            onChange={(e) => {
                                setCategoriaId(e.target.value as number | "");
                                setMotivoAnomaliaIAId("");
                            }}
                        >
                            <MenuItem value="">Selecione uma categoria</MenuItem>

                            {categorias.map((categoria) => (
                                <MenuItem key={categoria.id} value={categoria.id}>
                                    {categoria.nome}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 3 }}>
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
                                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                    {motivoSelecionado.acoesRecomendadas.map((acao) => (
                                    <Chip
                                        key={acao.id}
                                        label={acao.descricao}
                                        variant="outlined"
                                        onClick={() => setAcaoTomada(acao.descricao)}
                                        sx={{
                                            color: "#E5E7EB",
                                            borderColor: "#374151",
                                            cursor: "pointer",
                                            "&:hover": {
                                                backgroundColor: "#1F2937",
                                            },
                                        }}
                                />
                                    ))}
                                </Box>
                            ) : (
                                <Typography color="text.secondary">
                                    Nenhuma ação recomendada cadastrada para este tipo de falha.
                                </Typography>
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
                        helperText="Clique em uma ação recomendada acima ou escreva uma nova ação. Novas ações serão adicionadas à Biblioteca da IA."
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

export default FeedbackAnomaliaDialog;