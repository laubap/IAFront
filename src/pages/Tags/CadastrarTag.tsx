import { useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
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

import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import { api } from "../../services/api";
import { useCliente } from "../../contexts/ClienteContext";
import TagContextoDialog from "../../components/TagContextoDialog/TagContextoDialog";

function CadastrarTag() {
    const { clienteId, tags, carregandoTags } = useCliente();
    console.log("Tags do contexto:", tags);
console.log("Carregando:", carregandoTags);

    const [tagName, setTagName] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [processando, setProcessando] = useState(false);

    const [dialogSucesso, setDialogSucesso] = useState(false);
    const [dialogContexto, setDialogContexto] = useState(false);
    const [tagRecemCadastrada, setTagRecemCadastrada] = useState("");
    const [dialogContextoSalvo, setDialogContextoSalvo] = useState(false);

    async function cadastrarETreinarTag() {
        try {
            setProcessando(true);
            setMensagem("Configurando tag para IA...");

            await api.post("/tags/configurar", {
                clienteId,
                tagName,
                iaAtiva: true,
            });

            setMensagem("Tag configurada. Treinando perfil...");

            await api.post("/tags/treinar-perfil", {
                clienteId,
                tagName,
            });

            setMensagem("Perfil treinado. Executando análise inicial...");

            await api.post("/anomalias/tag/valor-atual", {
                clienteId,
                tagName,
            });

            setTagRecemCadastrada(tagName);
            setMensagem("");
            setDialogSucesso(true);
            setTagName("");
        } catch (error: any) {
            console.error(error);

            const erroApi =
                error?.response?.data?.erro ||
                error?.response?.data?.detalhe ||
                error?.response?.data?.title ||
                error?.response?.data ||
                error?.message ||
                "Erro ao cadastrar, treinar ou analisar a tag.";

            const erroTexto = String(erroApi);

            if (erroTexto.includes("Histórico insuficiente")) {
                setMensagem(
                    "Tag cadastrada para monitoramento, mas ainda não há histórico suficiente para treinar a IA. Isso pode acontecer quando a tag não possui leituras suficientes no histórico ou quando os dados disponíveis foram removidos na limpeza de outliers."
                );
            } else {
                setMensagem(erroTexto);
            }
        } finally {
            setProcessando(false);
        }
    }

    return (
        <Box>
            <SectionTitle
                titulo="Cadastrar Tag IA"
                subtitulo="Cadastre uma tag para ser monitorada e treinada pela IA Marrari."
                icon={<LocalOfferIcon />}
            />

            <Card sx={{ backgroundColor: "#1F2937", borderRadius: 3, maxWidth: 700 }}>
                <CardContent>
                    <TextField fullWidth label="Cliente" value={clienteId} disabled sx={{ mb: 3 }} />

                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel>Tag</InputLabel>

                        <Select
                            value={tagName}
                            label="Tag"
                            disabled={carregandoTags || processando}
                            onChange={(e) => setTagName(e.target.value)}
                        >
                            {carregandoTags ? (
                                <MenuItem value="">Carregando tags...</MenuItem>
                            ) : (
                                tags.map((tag) => (
                                    <MenuItem key={tag.fullName} value={tag.fullName}>
                                        {tag.descricao
                                            ? `${tag.fullName} — ${tag.descricao}`
                                            : tag.fullName}
                                    </MenuItem>
                                ))
                            )}
                        </Select>
                    </FormControl>

                    <Button
                        variant="contained"
                        onClick={cadastrarETreinarTag}
                        disabled={!tagName || processando}
                    >
                        {processando ? "Processando..." : "Cadastrar e Treinar Tag"}
                    </Button>

                    {mensagem && (
                        <Typography color="text.secondary" sx={{ mt: 3 }}>
                            {mensagem}
                        </Typography>
                    )}
                </CardContent>
            </Card>

            <Dialog open={dialogSucesso} onClose={() => setDialogSucesso(false)}>
                <DialogTitle>🎉 Tag cadastrada com sucesso!</DialogTitle>

                <DialogContent>
                    <Typography color="text.secondary">
                        A IA já está monitorando esta tag. Quanto mais informações você fornecer,
                        mais precisos serão os diagnósticos.
                    </Typography>
                </DialogContent>

                <DialogActions>
                    <Button variant="outlined" onClick={() => setDialogSucesso(false)}>
                        Fazer depois
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => {
                            setDialogSucesso(false);
                            setDialogContexto(true);
                        }}
                    >
                        Adicionar contexto
                    </Button>
                </DialogActions>
            </Dialog>

<TagContextoDialog
    open={dialogContexto}
    onClose={() => setDialogContexto(false)}
    clienteId={clienteId}
    tagName={tagRecemCadastrada}
    onSuccess={() => {
        setDialogContexto(false);
        setDialogContextoSalvo(true);
    }}
/>

<Dialog
    open={dialogContextoSalvo}
    onClose={() => setDialogContextoSalvo(false)}
>
    <DialogTitle>✅ Contexto salvo com sucesso!</DialogTitle>

    <DialogContent>
        <Typography color="text.secondary">
            A tag foi treinada, analisada e agora possui contexto operacional.
            Os próximos diagnósticos da IA Marrari serão mais completos.
        </Typography>
    </DialogContent>

    <DialogActions>
        <Button
            variant="contained"
            onClick={() => setDialogContextoSalvo(false)}
        >
            Entendi
        </Button>
    </DialogActions>
</Dialog>
        </Box>
    );
}

export default CadastrarTag;