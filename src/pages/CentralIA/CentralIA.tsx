import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    Slider,
    TextField,
    Typography,
} from "@mui/material";

import TuneIcon from "@mui/icons-material/Tune";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import { api } from "../../services/api";

interface ConfiguracaoIA {
    horasHistorico: number;
    sensibilidade: number;
    confiancaMinima: number;
    aprendizadoAtivo: boolean;
    notificacaoPopup: boolean;
    notificacaoEmail: boolean;
    notificacaoTeams: boolean;
}

interface CategoriaIA {
    id: number;
    nome: string;
    descricao: string | null;
    totalMotivos: number;
}

interface MotivoIA {
    id: number;
    nome: string;
    descricao: string | null;
    categoriaFalhaIAId?: number | null;
    acoesRecomendadas: AcaoIA[];
}

interface AcaoIA {
    id: number;
    descricao: string;
}

function CentralIA() {
    const clienteId = "PK2";

    const [config, setConfig] = useState<ConfiguracaoIA>({
        horasHistorico: 24,
        sensibilidade: 70,
        confiancaMinima: 80,
        aprendizadoAtivo: true,
        notificacaoPopup: true,
        notificacaoEmail: false,
        notificacaoTeams: false,
    });

    const [categorias, setCategorias] = useState<CategoriaIA[]>([]);
    const [motivos, setMotivos] = useState<MotivoIA[]>([]);

    const [novaCategoria, setNovaCategoria] = useState("");
    const [descricaoCategoria, setDescricaoCategoria] = useState("");

    const [categoriaSelecionada, setCategoriaSelecionada] = useState<number | "">("");
    const [novoMotivo, setNovoMotivo] = useState("");
    const [descricaoMotivo, setDescricaoMotivo] = useState("");

    const [mensagem, setMensagem] = useState("");

    useEffect(() => {
        carregarDados();
    }, []);

    function carregarDados() {
        api.get(`/configuracao-ia/${clienteId}`)
            .then((response) => setConfig(response.data))
            .catch((error) => console.error("Erro ao buscar configuração:", error));

        api.get(`/categorias-falha-ia/${clienteId}`)
            .then((response) => setCategorias(response.data))
            .catch((error) => console.error("Erro ao buscar categorias:", error));

        api.get(`/motivos-ia/${clienteId}`)
            .then((response) => setMotivos(response.data))
            .catch((error) => console.error("Erro ao buscar motivos:", error));
    }

    async function salvarConfiguracao() {
        try {
            await api.put(`/configuracao-ia/${clienteId}`, config);
            setMensagem("Configurações da IA salvas com sucesso.");
        } catch (error) {
            console.error(error);
            setMensagem("Erro ao salvar configurações.");
        }
    }

    async function criarCategoria() {
        if (!novaCategoria.trim()) return;

        try {
            await api.post("/categorias-falha-ia", {
                clienteId,
                nome: novaCategoria,
                descricao: descricaoCategoria,
            });

            setNovaCategoria("");
            setDescricaoCategoria("");
            setMensagem("Categoria cadastrada com sucesso.");
            carregarDados();
        } catch (error) {
            console.error(error);
            setMensagem("Erro ao cadastrar categoria.");
        }
    }

    async function criarMotivo() {
        if (!novoMotivo.trim()) return;

        try {
            await api.post("/motivos-ia", {
                clienteId,
                nome: novoMotivo,
                descricao: descricaoMotivo,
                categoriaFalhaIAId: categoriaSelecionada || null,
            });

            setNovoMotivo("");
            setDescricaoMotivo("");
            setCategoriaSelecionada("");
            setMensagem("Motivo cadastrado com sucesso.");
            carregarDados();
        } catch (error) {
            console.error(error);
            setMensagem("Erro ao cadastrar motivo.");
        }
    }

    async function desativarCategoria(id: number) {
        try {
            await api.delete(`/categorias-falha-ia/${id}`);
            setMensagem("Categoria desativada com sucesso.");
            carregarDados();
        } catch (error) {
            console.error(error);
            setMensagem("Erro ao desativar categoria.");
        }
    }

    async function desativarMotivo(id: number) {
        try {
            await api.delete(`/motivos-ia/${id}`);
            setMensagem("Motivo desativado com sucesso.");
            carregarDados();
        } catch (error) {
            console.error(error);
            setMensagem("Erro ao desativar motivo.");
        }
    }

    return (
        <Box>
            <SectionTitle
                titulo="Central da IA"
                subtitulo="Configure como a IA Marrari analisa, aprende e notifica o cliente."
                icon={<TuneIcon />}
            />

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
                    gap: 3,
                }}
            >
                <Card sx={{ backgroundColor: "#1F2937", borderRadius: 3 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
                            Configuração Geral
                        </Typography>

                        <TextField
                            fullWidth
                            type="number"
                            label="Horas de histórico"
                            value={config.horasHistorico}
                            onChange={(e) =>
                                setConfig({ ...config, horasHistorico: Number(e.target.value) })
                            }
                            sx={{ mb: 3 }}
                        />

                        <Typography sx={{ mb: 1 }}>
                            Sensibilidade da IA: {config.sensibilidade}%
                        </Typography>

                        <Slider
                            value={config.sensibilidade}
                            min={0}
                            max={100}
                            onChange={(_, value) =>
                                setConfig({ ...config, sensibilidade: value as number })
                            }
                            sx={{ mb: 3 }}
                        />

                        <Typography sx={{ mb: 1 }}>
                            Confiança mínima: {config.confiancaMinima}%
                        </Typography>

                        <Slider
                            value={config.confiancaMinima}
                            min={0}
                            max={100}
                            onChange={(_, value) =>
                                setConfig({ ...config, confiancaMinima: value as number })
                            }
                            sx={{ mb: 3 }}
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={config.aprendizadoAtivo}
                                    onChange={(e) =>
                                        setConfig({ ...config, aprendizadoAtivo: e.target.checked })
                                    }
                                />
                            }
                            label="Aprendizado contínuo ativo"
                        />

                        <Typography variant="h6" sx={{ fontWeight: 800, mt: 3, mb: 1 }}>
                            Notificações
                        </Typography>

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={config.notificacaoPopup}
                                    onChange={(e) =>
                                        setConfig({ ...config, notificacaoPopup: e.target.checked })
                                    }
                                />
                            }
                            label="Popup no sistema"
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={config.notificacaoEmail}
                                    onChange={(e) =>
                                        setConfig({ ...config, notificacaoEmail: e.target.checked })
                                    }
                                />
                            }
                            label="E-mail"
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={config.notificacaoTeams}
                                    onChange={(e) =>
                                        setConfig({ ...config, notificacaoTeams: e.target.checked })
                                    }
                                />
                            }
                            label="Microsoft Teams"
                        />

                        <Box sx={{ mt: 3 }}>
                            <Button variant="contained" onClick={salvarConfiguracao}>
                                Salvar configurações
                            </Button>
                        </Box>
                    </CardContent>
                </Card>

                <Card sx={{ backgroundColor: "#1F2937", borderRadius: 3 }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
                            Categorias de Falha
                        </Typography>

                        <TextField
                            fullWidth
                            label="Nome da categoria"
                            placeholder="Ex: Mecânica, Elétrica, Instrumentação"
                            value={novaCategoria}
                            onChange={(e) => setNovaCategoria(e.target.value)}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            fullWidth
                            multiline
                            minRows={2}
                            label="Descrição"
                            value={descricaoCategoria}
                            onChange={(e) => setDescricaoCategoria(e.target.value)}
                            sx={{ mb: 2 }}
                        />

                        <Button variant="contained" onClick={criarCategoria}>
                            Cadastrar categoria
                        </Button>

                        <Box sx={{ mt: 4 }}>
                            {categorias.map((categoria) => (
                                <Box
                                    key={categoria.id}
                                    sx={{
                                        p: 2,
                                        mb: 2,
                                        borderRadius: 2,
                                        backgroundColor: "#111827",
                                        border: "1px solid #374151",
                                    }}
                                >
                                    <Typography sx={{ fontWeight: 800 }}>
                                        {categoria.nome}
                                    </Typography>

                                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                                        {categoria.descricao ?? "Sem descrição."}
                                    </Typography>

                                    <Typography color="text.secondary" sx={{ mt: 1, fontSize: 13 }}>
                                        Motivos vinculados: {categoria.totalMotivos ?? 0}
                                    </Typography>

                                    <Button
                                        color="error"
                                        size="small"
                                        sx={{ mt: 1 }}
                                        onClick={() => desativarCategoria(categoria.id)}
                                    >
                                        Desativar
                                    </Button>
                                </Box>
                            ))}
                        </Box>
                    </CardContent>
                </Card>

                <Card sx={{ backgroundColor: "#1F2937", borderRadius: 3, gridColumn: { lg: "1 / span 2" } }}>
                    <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
                            Motivos de Anomalia
                        </Typography>

                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Categoria</InputLabel>

                            <Select
                                label="Categoria"
                                value={categoriaSelecionada}
                                onChange={(e) => setCategoriaSelecionada(e.target.value as number)}
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
                            label="Nome do motivo"
                            placeholder="Ex: Rolamento desgastado"
                            value={novoMotivo}
                            onChange={(e) => setNovoMotivo(e.target.value)}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            fullWidth
                            multiline
                            minRows={2}
                            label="Descrição"
                            value={descricaoMotivo}
                            onChange={(e) => setDescricaoMotivo(e.target.value)}
                            sx={{ mb: 2 }}
                        />

                        <Button variant="contained" onClick={criarMotivo}>
                            Cadastrar motivo
                        </Button>

                        <Box sx={{ mt: 4 }}>
                            {motivos.length === 0 ? (
                                <Typography color="text.secondary">
                                    Nenhum motivo cadastrado ainda.
                                </Typography>
                            ) : (
                                motivos.map((motivo) => (
                                    <Box
                                        key={motivo.id}
                                        sx={{
                                            p: 2,
                                            mb: 2,
                                            borderRadius: 2,
                                            backgroundColor: "#111827",
                                            border: "1px solid #374151",
                                        }}
                                    >
                                        <Typography sx={{ fontWeight: 800 }}>
                                            {motivo.nome}
                                        </Typography>

                                        <Typography color="text.secondary" sx={{ mt: 1 }}>
                                            {motivo.descricao ?? "Sem descrição."}
                                        </Typography>

                                        <Button
                                            color="error"
                                            size="small"
                                            sx={{ mt: 1 }}
                                            onClick={() => desativarMotivo(motivo.id)}
                                        >
                                            Desativar
                                        </Button>
                                    </Box>
                                ))
                            )}
                        </Box>
                    </CardContent>
                </Card>
            </Box>

            {mensagem && (
                <Typography color="text.secondary" sx={{ mt: 3 }}>
                    {mensagem}
                </Typography>
            )}
        </Box>
    );
}

export default CentralIA;