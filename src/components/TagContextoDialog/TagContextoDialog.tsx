import { useState } from "react";
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

interface TagContextoDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    clienteId: string;
    tagName: string;
}

function TagContextoDialog({
    open,
    onClose,
    onSuccess,
    clienteId,
    tagName,
}: TagContextoDialogProps) {
    const [tipoRepresentacao, setTipoRepresentacao] = useState("");
    const [descricao, setDescricao] = useState("");
    const [criticidade, setCriticidade] = useState("");
    const [equipamento, setEquipamento] = useState("");
    const [area, setArea] = useState("");
    const [observacaoModoOperacao, setObservacaoModoOperacao] = useState("");

    const [impactoAtual, setImpactoAtual] = useState("");
    const [causaAtual, setCausaAtual] = useState("");
    const [acaoAtual, setAcaoAtual] = useState("");
    const [modoAtual, setModoAtual] = useState("");

    const [impactos, setImpactos] = useState<string[]>([]);
    const [causasProvaveis, setCausasProvaveis] = useState<string[]>([]);
    const [acoesRecomendadas, setAcoesRecomendadas] = useState<string[]>([]);
    const [modosOperacao, setModosOperacao] = useState<string[]>([]);

    const [mensagem, setMensagem] = useState("");
    const [salvando, setSalvando] = useState(false);

    function adicionarItem(
        valor: string,
        setValor: (valor: string) => void,
        lista: string[],
        setLista: (lista: string[]) => void
    ) {
        const texto = valor.trim();

        if (!texto) return;

        if (!lista.includes(texto)) {
            setLista([...lista, texto]);
        }

        setValor("");
    }

    function removerItem(
        item: string,
        lista: string[],
        setLista: (lista: string[]) => void
    ) {
        setLista(lista.filter((x) => x !== item));
    }

    async function salvarContexto() {
        try {
            setSalvando(true);
            setMensagem("Salvando contexto...");

await api.post("/tags/contexto", {
    clienteId,
    tagName,
    tipoRepresentacao,
    descricao,
    criticidade,
    impactos,
    modosOperacao,
    causasProvaveis,
    acoesRecomendadas,
    equipamento,
    area,
    observacaoModoOperacao,
});

setMensagem("");

onSuccess?.();
        } catch (error: any) {
            console.error(error);

            const erro =
                error?.response?.data?.erro ||
                error?.response?.data?.message ||
                error?.message ||
                "Erro ao salvar contexto.";

            setMensagem(String(erro));
        } finally {
            setSalvando(false);
        }
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Contexto da Tag</DialogTitle>

            <DialogContent>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                    {tagName}
                </Typography>

                <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Tipo da variável</InputLabel>
                    <Select
                        value={tipoRepresentacao}
                        label="Tipo da variável"
                        onChange={(e) => setTipoRepresentacao(e.target.value)}
                    >
                        <MenuItem value="temperatura">Temperatura</MenuItem>
                        <MenuItem value="pressao">Pressão</MenuItem>
                        <MenuItem value="vazao">Vazão</MenuItem>
                        <MenuItem value="nivel">Nível</MenuItem>
                        <MenuItem value="vibracao">Vibração</MenuItem>
                        <MenuItem value="digital">Digital</MenuItem>
                        <MenuItem value="perfil-comportamental">Perfil comportamental</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    fullWidth
                    label="Descrição"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    sx={{ mb: 3 }}
                />

                <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Criticidade</InputLabel>
                    <Select
                        value={criticidade}
                        label="Criticidade"
                        onChange={(e) => setCriticidade(e.target.value)}
                    >
                        <MenuItem value="baixa">Baixa</MenuItem>
                        <MenuItem value="media">Média</MenuItem>
                        <MenuItem value="alta">Alta</MenuItem>
                        <MenuItem value="critica">Crítica</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    fullWidth
                    label="Equipamento"
                    value={equipamento}
                    onChange={(e) => setEquipamento(e.target.value)}
                    sx={{ mb: 3 }}
                />

                <TextField
                    fullWidth
                    label="Área"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    sx={{ mb: 3 }}
                />

                <CampoLista
                    titulo="Impactos possíveis"
                    valor={impactoAtual}
                    setValor={setImpactoAtual}
                    lista={impactos}
                    adicionar={() =>
                        adicionarItem(impactoAtual, setImpactoAtual, impactos, setImpactos)
                    }
                    remover={(item) => removerItem(item, impactos, setImpactos)}
                />

                <CampoLista
                    titulo="Causas prováveis"
                    valor={causaAtual}
                    setValor={setCausaAtual}
                    lista={causasProvaveis}
                    adicionar={() =>
                        adicionarItem(causaAtual, setCausaAtual, causasProvaveis, setCausasProvaveis)
                    }
                    remover={(item) => removerItem(item, causasProvaveis, setCausasProvaveis)}
                />

                <CampoLista
                    titulo="Ações recomendadas"
                    valor={acaoAtual}
                    setValor={setAcaoAtual}
                    lista={acoesRecomendadas}
                    adicionar={() =>
                        adicionarItem(acaoAtual, setAcaoAtual, acoesRecomendadas, setAcoesRecomendadas)
                    }
                    remover={(item) => removerItem(item, acoesRecomendadas, setAcoesRecomendadas)}
                />

                <CampoLista
                    titulo="Modos de operação"
                    valor={modoAtual}
                    setValor={setModoAtual}
                    lista={modosOperacao}
                    adicionar={() =>
                        adicionarItem(modoAtual, setModoAtual, modosOperacao, setModosOperacao)
                    }
                    remover={(item) => removerItem(item, modosOperacao, setModosOperacao)}
                />

                <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    label="Observação operacional"
                    value={observacaoModoOperacao}
                    onChange={(e) => setObservacaoModoOperacao(e.target.value)}
                    sx={{ mt: 2 }}
                />

                {mensagem && (
                    <Typography color="text.secondary" sx={{ mt: 3 }}>
                        {mensagem}
                    </Typography>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>

                <Button
                    variant="contained"
                    onClick={salvarContexto}
                    disabled={salvando}
                >
                    {salvando ? "Salvando..." : "Salvar contexto"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

interface CampoListaProps {
    titulo: string;
    valor: string;
    setValor: (valor: string) => void;
    lista: string[];
    adicionar: () => void;
    remover: (item: string) => void;
}

function CampoLista({
    titulo,
    valor,
    setValor,
    lista,
    adicionar,
    remover,
}: CampoListaProps) {
    return (
        <Box sx={{ mb: 3 }}>
            <TextField
                fullWidth
                label={titulo}
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        adicionar();
                    }
                }}
                helperText="Digite e pressione Enter para adicionar"
            />

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                {lista.map((item) => (
                    <Chip
                        key={item}
                        label={item}
                        onDelete={() => remover(item)}
                    />
                ))}
            </Box>
        </Box>
    );
}

export default TagContextoDialog;