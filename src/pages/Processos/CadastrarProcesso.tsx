import { useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    FormControl,
    InputLabel,
    ListItemText,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";

import AccountTreeIcon from "@mui/icons-material/AccountTree";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import { api } from "../../services/api";
import { useCliente } from "../../contexts/ClienteContext";

function CadastrarProcesso() {
    const { clienteId, tags, carregandoTags } = useCliente();

    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [area, setArea] = useState("");
    const [criticidade, setCriticidade] = useState("");
    const [objetivo, setObjetivo] = useState("");
    const [tagsSelecionadas, setTagsSelecionadas] = useState<string[]>([]);
    const [mensagem, setMensagem] = useState("");
    const [salvando, setSalvando] = useState(false);

    async function salvarProcesso() {
        try {
            setSalvando(true);
            setMensagem("Salvando processo...");

            await api.post("/processos", {
                clienteId,
                nome,
                descricao,
                area,
                criticidade,
                objetivo,
                tags: tagsSelecionadas.map((tagName) => ({
                    tagName,
                    papelDaTag: "Tag monitorada no processo",
                })),
            });

            setMensagem("Processo criado e tags vinculadas com sucesso.");
            setNome("");
            setDescricao("");
            setArea("");
            setCriticidade("");
            setObjetivo("");
            setTagsSelecionadas([]);
        } catch (error: any) {
            console.error(error);

            const erro =
                error?.response?.data?.erro ||
                error?.response?.data?.message ||
                error?.message ||
                "Erro ao salvar processo.";

            setMensagem(String(erro));
        } finally {
            setSalvando(false);
        }
    }

    return (
        <Box>
            <SectionTitle
                titulo="Cadastrar Processo"
                subtitulo="Crie um processo industrial e vincule as tags monitoradas pela IA."
                icon={<AccountTreeIcon />}
            />

            <Card sx={{ backgroundColor: "#1F2937", borderRadius: 3, maxWidth: 800 }}>
                <CardContent>
                    <TextField fullWidth label="Cliente" value={clienteId} disabled sx={{ mb: 3 }} />

                    <TextField
                        fullWidth
                        label="Nome do processo"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        sx={{ mb: 3 }}
                    />

                    <TextField
                        fullWidth
                        label="Descrição"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        sx={{ mb: 3 }}
                    />

                    <TextField
                        fullWidth
                        label="Área"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
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
                        label="Objetivo do processo"
                        value={objetivo}
                        onChange={(e) => setObjetivo(e.target.value)}
                        sx={{ mb: 3 }}
                    />

                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel>Tags vinculadas</InputLabel>
                        <Select
                            multiple
                            value={tagsSelecionadas}
                            label="Tags vinculadas"
                            disabled={carregandoTags}
                            onChange={(e) => setTagsSelecionadas(e.target.value as string[])}
                            renderValue={(selected) => selected.join(", ")}
                        >
                            {tags.map((tag) => (
                                <MenuItem key={tag.fullName} value={tag.fullName}>
                                    <Checkbox checked={tagsSelecionadas.includes(tag.fullName)} />
                                    <ListItemText
                                        primary={
                                            tag.descricao
                                                ? `${tag.fullName} — ${tag.descricao}`
                                                : tag.fullName
                                        }
                                    />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button
                        variant="contained"
                        onClick={salvarProcesso}
                        disabled={!nome || salvando}
                    >
                        {salvando ? "Salvando..." : "Cadastrar Processo"}
                    </Button>

                    {mensagem && (
                        <Typography color="text.secondary" sx={{ mt: 3 }}>
                            {mensagem}
                        </Typography>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}

export default CadastrarProcesso;