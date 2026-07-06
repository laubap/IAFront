import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    AppBar,
    Badge,
    Box,
    Chip,
    IconButton,
    Menu,
    MenuItem,
    Snackbar,
    Toolbar,
    Typography,
} from "@mui/material";

import Alert from "@mui/material/Alert";

import SmartToyIcon from "@mui/icons-material/SmartToy";
import CircleIcon from "@mui/icons-material/Circle";
import NotificationsIcon from "@mui/icons-material/Notifications";

import { api } from "../../services/api";

interface Notificacao {
    id: number;
    titulo: string;
    mensagem: string;
    tagName: string;
    valor: number;
    score: number;
    risco: string | null;
    data: string;
}

function Header() {
    const [dataHora, setDataHora] = useState(new Date());
    const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [notificacaoPopup, setNotificacaoPopup] = useState<Notificacao | null>(null);

    const idsNotificadosRef = useRef<number[]>([]);
    const primeiraBuscaRef = useRef(true);

    const navigate = useNavigate();

    useEffect(() => {
        const timer = setInterval(() => {
            setDataHora(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        buscarNotificacoes();

        const timer = setInterval(() => {
            buscarNotificacoes();
        }, 30000);

        return () => clearInterval(timer);
    }, []);

    function buscarNotificacoes() {
        api.get("/notificacoes")
            .then((response) => {
                const novasNotificacoes: Notificacao[] = response.data;

                const nova = novasNotificacoes.find(
                    (notificacao) =>
                        !idsNotificadosRef.current.includes(notificacao.id)
                );

                if (nova && !primeiraBuscaRef.current) {
                    setNotificacaoPopup(nova);
                }

                idsNotificadosRef.current = novasNotificacoes.map((n) => n.id);
                primeiraBuscaRef.current = false;

                setNotificacoes(novasNotificacoes);
            })
            .catch((error) => console.error("Erro ao buscar notificações:", error));
    }

    function formatarData(data: string) {
        return new Date(data).toLocaleString("pt-BR");
    }

    function corRisco(risco: string | null) {
        const valor = risco?.toLowerCase();

        if (valor === "critico" || valor === "crítico" || valor === "alto") {
            return "error";
        }

        return "warning";
    }

    function resumoMensagem(mensagem: string) {
        if (!mensagem) return "Anomalia detectada pela IA.";

        return mensagem.length > 120
            ? mensagem.substring(0, 120) + "..."
            : mensagem;
    }

    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    zIndex: 1201,
                    backgroundColor: "#111827",
                    borderBottom: "1px solid #374151",
                    boxShadow: "none",
                }}
            >
                <Toolbar
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        minHeight: 72,
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box
                            sx={{
                                width: 44,
                                height: 44,
                                borderRadius: 2,
                                backgroundColor: "#2563EB",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <SmartToyIcon />
                        </Box>

                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                MARRARI
                            </Typography>

                            <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                                Inteligência Industrial
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <IconButton
                            color="inherit"
                            onClick={(event) => setAnchorEl(event.currentTarget)}
                        >
                            <Badge badgeContent={notificacoes.length} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>

                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={() => setAnchorEl(null)}
                            slotProps={{
                                paper: {
                                    sx: {
                                        width: 460,
                                        maxHeight: 520,
                                        backgroundColor: "#1F2937",
                                        color: "#E5E7EB",
                                        border: "1px solid #374151",
                                        borderRadius: 3,
                                    },
                                },
                            }}
                        >
                            <Box sx={{ px: 2, py: 1.5 }}>
                                <Typography sx={{ fontWeight: 800 }}>
                                    Notificações
                                </Typography>

                                <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                                    Anomalias recentes detectadas pela IA
                                </Typography>
                            </Box>

                            {notificacoes.length === 0 ? (
                                <MenuItem>
                                    <Typography color="text.secondary">
                                        Nenhuma anomalia recente.
                                    </Typography>
                                </MenuItem>
                            ) : (
                                notificacoes.map((notificacao) => (
                                    <MenuItem
                                        key={notificacao.id}
                                        onClick={() => {
                                            setAnchorEl(null);
                                            navigate("/anomalias");
                                        }}
                                        sx={{
                                            display: "block",
                                            whiteSpace: "normal",
                                            borderTop: "1px solid #374151",
                                            py: 1.5,
                                            px: 2,
                                            "&:hover": {
                                                backgroundColor: "#111827",
                                            },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                mb: 1,
                                                gap: 2,
                                            }}
                                        >
                                            <Chip
                                                label={notificacao.risco ?? "risco"}
                                                color={corRisco(notificacao.risco)}
                                                size="small"
                                            />

                                            <Typography color="text.secondary" sx={{ fontSize: 12 }}>
                                                {formatarData(notificacao.data)}
                                            </Typography>
                                        </Box>

                                        <Typography sx={{ fontWeight: 800 }}>
                                            {notificacao.tagName}
                                        </Typography>

                                        <Typography sx={{ fontSize: 14, mb: 1 }}>
                                            Valor detectado: <strong>{notificacao.valor}</strong>
                                        </Typography>

                                        <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                                            {resumoMensagem(notificacao.mensagem)}
                                        </Typography>

                                        <Typography
                                            sx={{
                                                mt: 1,
                                                fontSize: 13,
                                                color: "#60A5FA",
                                                fontWeight: 700,
                                            }}
                                        >
                                            Ver detalhes →
                                        </Typography>
                                    </MenuItem>
                                ))
                            )}
                        </Menu>

                        <Chip
                            label="Cliente: PK2"
                            sx={{
                                backgroundColor: "#1F2937",
                                color: "#E5E7EB",
                            }}
                        />

                        <Chip
                            icon={<CircleIcon sx={{ fontSize: 12 }} />}
                            label="Sistema Online"
                            color="success"
                            variant="outlined"
                        />

                        <Box sx={{ textAlign: "right" }}>
                            <Typography sx={{ fontWeight: 600 }}>
                                {dataHora.toLocaleDateString("pt-BR")}
                            </Typography>

                            <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                                {dataHora.toLocaleTimeString("pt-BR")}
                            </Typography>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>

            <Snackbar
                open={Boolean(notificacaoPopup)}
                autoHideDuration={6000}
                onClose={() => setNotificacaoPopup(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert
                    severity="error"
                    variant="filled"
                    onClose={() => setNotificacaoPopup(null)}
                    sx={{ width: "100%" }}
                >
                    Anomalia detectada: {notificacaoPopup?.tagName}
                </Alert>
            </Snackbar>
        </>
    );
}

export default Header;