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

import { api } from "../../services/api";

interface Props {
    open: boolean;
    onClose: () => void;
    anomaliaId: number;
    tagName: string;
}

function FeedbackAnomaliaDialog({ open, onClose, anomaliaId, tagName }: Props) {
    const [motivo, setMotivo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [acaoTomada, setAcaoTomada] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [salvando, setSalvando] = useState(false);

    async function salvarFeedback() {
        try {
            setSalvando(true);

            await api.post(`/anomalias/${anomaliaId}/feedback`, {
                motivo,
                descricao,
                acaoTomada,
            });

            setMensagem("Feedback registrado com sucesso.");
            setMotivo("");
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

                <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Motivo</InputLabel>
                    <Select
                        value={motivo}
                        label="Motivo"
                        onChange={(e) => setMotivo(e.target.value)}
                    >
                        <MenuItem value="falha_mecanica">Falha mecânica</MenuItem>
                        <MenuItem value="falha_sensor">Falha de sensor</MenuItem>
                        <MenuItem value="operacao_normal">Operação normal</MenuItem>
                        <MenuItem value="manutencao">Manutenção</MenuItem>
                        <MenuItem value="sobrecarga">Sobrecarga</MenuItem>
                        <MenuItem value="desconhecido">Desconhecido</MenuItem>
                    </Select>
                </FormControl>

                <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    label="Descrição"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    sx={{ mb: 3 }}
                />

                <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    label="Ação tomada"
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
                    disabled={!motivo || salvando}
                >
                    {salvando ? "Salvando..." : "Salvar feedback"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default FeedbackAnomaliaDialog;