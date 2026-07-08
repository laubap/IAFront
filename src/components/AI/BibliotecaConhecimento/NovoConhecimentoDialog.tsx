import { useState } from "react";
import {
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

interface CategoriaIA {
    id: number;
    nome: string;
}

interface MotivoIA {
    id: number;
    nome: string;
}

interface NovoConhecimentoDialogProps {
    open: boolean;
    onClose: () => void;
    categorias: CategoriaIA[];
    motivos: MotivoIA[];
    onCriarCategoria: (nome: string, descricao: string) => Promise<void>;
    onCriarMotivo: (
        categoriaId: number | null,
        nome: string,
        descricao: string
    ) => Promise<void>;
    onCriarAcao: (motivoId: number, descricao: string) => Promise<void>;
}

function NovoConhecimentoDialog({
    open,
    onClose,
    categorias,
    motivos,
    onCriarCategoria,
    onCriarMotivo,
    onCriarAcao,
}: NovoConhecimentoDialogProps) {
    const [tipo, setTipo] = useState<"categoria" | "motivo" | "acao">("categoria");

    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [categoriaId, setCategoriaId] = useState<number | "">("");
    const [motivoId, setMotivoId] = useState<number | "">("");

    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");

    function limparCampos() {
        setNome("");
        setDescricao("");
        setCategoriaId("");
        setMotivoId("");
        setErro("");
    }

    async function salvar() {
        try {
            setSalvando(true);
            setErro("");

            if (tipo === "categoria") {
                if (!nome.trim()) {
                    setErro("Informe o nome da categoria.");
                    return;
                }

                await onCriarCategoria(nome, descricao);
            }

            if (tipo === "motivo") {
                if (!nome.trim()) {
                    setErro("Informe o nome do tipo de falha.");
                    return;
                }

                await onCriarMotivo(
                    categoriaId === "" ? null : Number(categoriaId),
                    nome,
                    descricao
                );
            }

            if (tipo === "acao") {
                if (motivoId === "") {
                    setErro("Selecione um tipo de falha.");
                    return;
                }

                if (!descricao.trim()) {
                    setErro("Informe a descrição da ação recomendada.");
                    return;
                }

                await onCriarAcao(Number(motivoId), descricao);
            }

            limparCampos();
            onClose();
        } catch (error) {
            console.error(error);
            setErro("Erro ao salvar conhecimento.");
        } finally {
            setSalvando(false);
        }
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Adicionar conhecimento à IA</DialogTitle>

            <DialogContent>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                    Cadastre informações que ajudam a IA Marrari a interpretar anomalias
                    e sugerir ações operacionais.
                </Typography>

                <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Tipo de conhecimento</InputLabel>

                    <Select
                        value={tipo}
                        label="Tipo de conhecimento"
                        onChange={(e) => {
                            setTipo(e.target.value as "categoria" | "motivo" | "acao");
                            limparCampos();
                        }}
                    >
                        <MenuItem value="categoria">Categoria de Falha</MenuItem>
                        <MenuItem value="motivo">Tipo de Falha</MenuItem>
                        <MenuItem value="acao">Ação Recomendada</MenuItem>
                    </Select>
                </FormControl>

                {tipo === "categoria" && (
                    <>
                        <TextField
                            fullWidth
                            label="Nome da categoria"
                            placeholder="Ex: Mecânica, Elétrica, Instrumentação"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            fullWidth
                            multiline
                            minRows={3}
                            label="Descrição"
                            placeholder="Explique quais tipos de falha pertencem a esta categoria."
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                        />
                    </>
                )}

                {tipo === "motivo" && (
                    <>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Categoria de Falha</InputLabel>

                            <Select
                                value={categoriaId}
                                label="Categoria de Falha"
                                onChange={(e) => setCategoriaId(e.target.value as number)}
                            >
                                <MenuItem value="">Sem categoria</MenuItem>

                                {categorias.map((categoria) => (
                                    <MenuItem key={categoria.id} value={categoria.id}>
                                        {categoria.nome}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            label="Nome do tipo de falha"
                            placeholder="Ex: Rolamento desgastado"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            fullWidth
                            multiline
                            minRows={3}
                            label="Descrição"
                            placeholder="Explique a causa específica da falha."
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                        />
                    </>
                )}

                {tipo === "acao" && (
                    <>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Tipo de Falha</InputLabel>

                            <Select
                                value={motivoId}
                                label="Tipo de Falha"
                                onChange={(e) => setMotivoId(e.target.value as number)}
                            >
                                {motivos.map((motivo) => (
                                    <MenuItem key={motivo.id} value={motivo.id}>
                                        {motivo.nome}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            multiline
                            minRows={3}
                            label="Ação recomendada"
                            placeholder="Ex: Verificar vibração, lubrificação e temperatura do rolamento."
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                        />
                    </>
                )}

                {erro && (
                    <Typography color="error" sx={{ mt: 2 }}>
                        {erro}
                    </Typography>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>

                <Button variant="contained" onClick={salvar} disabled={salvando}>
                    {salvando ? "Salvando..." : "Salvar"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default NovoConhecimentoDialog;