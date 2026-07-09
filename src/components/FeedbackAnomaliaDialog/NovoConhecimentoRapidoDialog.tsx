import { useMemo, useState } from "react";
import {
    Box,
    Button,
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

interface CategoriaIA {
    id: number;
    nome: string;
}

interface MotivoIA {
    id: number;
    nome: string;
    categoriaFalhaIAId?: number | null;
}

interface Props {
    open: boolean;
    onClose: () => void;
    clienteId: string;
    categorias: CategoriaIA[];
    motivos: MotivoIA[];
    onAtualizarBiblioteca: () => void;
}

function NovoConhecimentoRapidoDialog({
    open,
    onClose,
    clienteId,
    categorias,
    motivos,
    onAtualizarBiblioteca,
}: Props) {
    const [categoriaId, setCategoriaId] = useState<number | "">("");
    const [novaCategoria, setNovaCategoria] = useState("");

    const [motivoId, setMotivoId] = useState<number | "">("");
    const [novoTipoFalha, setNovoTipoFalha] = useState("");

    const [novaAcao, setNovaAcao] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [salvando, setSalvando] = useState(false);

    const motivosDaCategoria = useMemo(() => {
        if (categoriaId === "") return motivos;

        return motivos.filter(
            (motivo) => Number(motivo.categoriaFalhaIAId) === Number(categoriaId)
        );
    }, [categoriaId, motivos]);

    function limparCampos() {
        setCategoriaId("");
        setNovaCategoria("");
        setMotivoId("");
        setNovoTipoFalha("");
        setNovaAcao("");
        setMensagem("");
    }

    async function salvarConhecimento() {
        try {
            setSalvando(true);
            setMensagem("");

            let categoriaFinalId: number | null =
                categoriaId === "" ? null : Number(categoriaId);

            if (novaCategoria.trim()) {
                const response = await api.post("/categorias-falha-ia", {
                    clienteId,
                    nome: novaCategoria,
                    descricao: "Categoria cadastrada durante o diagnóstico de uma anomalia.",
                });

                categoriaFinalId = response.data.categoria.id;
            }

            let motivoFinalId: number | null =
                motivoId === "" ? null : Number(motivoId);

            if (novoTipoFalha.trim()) {
                const response = await api.post("/motivos-ia", {
                    clienteId,
                    nome: novoTipoFalha,
                    descricao: "Tipo de falha cadastrado durante o diagnóstico de uma anomalia.",
                    categoriaFalhaIAId: categoriaFinalId,
                });

                motivoFinalId = response.data.motivo.id;
            }

            if (!motivoFinalId) {
                setMensagem("Selecione um tipo de falha existente ou cadastre um novo.");
                return;
            }

            if (novaAcao.trim()) {
                await api.post("/acoes-ia", {
                    clienteId,
                    motivoAnomaliaIAId: motivoFinalId,
                    descricao: novaAcao,
                });
            }

            limparCampos();
            await onAtualizarBiblioteca();
            onClose();
        } catch (error) {
            console.error(error);
            setMensagem("Erro ao cadastrar conhecimento.");
        } finally {
            setSalvando(false);
        }
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Ensinar novo conhecimento à IA</DialogTitle>

            <DialogContent>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                    Cadastre ou selecione uma categoria, um tipo de falha e uma ação recomendada.
                </Typography>

                <Typography sx={{ fontWeight: 800, mb: 1 }}>
                    1. Categoria de falha
                </Typography>

                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Selecionar categoria existente</InputLabel>

                    <Select
                        value={categoriaId}
                        label="Selecionar categoria existente"
                        onChange={(e) => {
                            setCategoriaId(e.target.value as number | "");
                            setMotivoId("");
                        }}
                    >
                        <MenuItem value="">Nenhuma / criar nova</MenuItem>

                        {categorias.map((categoria) => (
                            <MenuItem key={categoria.id} value={categoria.id}>
                                {categoria.nome}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    fullWidth
                    label="Ou criar nova categoria"
                    placeholder="Ex: Mecânica"
                    value={novaCategoria}
                    onChange={(e) => setNovaCategoria(e.target.value)}
                    sx={{ mb: 3 }}
                />

                <Typography sx={{ fontWeight: 800, mb: 1 }}>
                    2. Tipo de falha
                </Typography>

                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Selecionar tipo existente</InputLabel>

                    <Select
                        value={motivoId}
                        label="Selecionar tipo existente"
                        onChange={(e) => setMotivoId(e.target.value as number | "")}
                    >
                        <MenuItem value="">Nenhum / criar novo</MenuItem>

                        {motivosDaCategoria.map((motivo) => (
                            <MenuItem key={motivo.id} value={motivo.id}>
                                {motivo.nome}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    fullWidth
                    label="Ou criar novo tipo de falha"
                    placeholder="Ex: Rolamento desgastado"
                    value={novoTipoFalha}
                    onChange={(e) => setNovoTipoFalha(e.target.value)}
                    sx={{ mb: 3 }}
                />

                <Typography sx={{ fontWeight: 800, mb: 1 }}>
                    3. Ação recomendada
                </Typography>

                <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    label="Nova ação recomendada"
                    placeholder="Ex: Verificar vibração e lubrificação."
                    value={novaAcao}
                    onChange={(e) => setNovaAcao(e.target.value)}
                />

                {mensagem && (
                    <Typography color="error" sx={{ mt: 2 }}>
                        {mensagem}
                    </Typography>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>

                <Button
                    variant="contained"
                    onClick={salvarConhecimento}
                    disabled={salvando}
                >
                    {salvando ? "Salvando..." : "Salvar conhecimento"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default NovoConhecimentoRapidoDialog;