import {
    Box,
    Card,
    CardContent,
    Collapse,
    IconButton,
    Typography,
} from "@mui/material";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import CategoriaNode from "./CategoriaNode";
import MotivoNode from "./MotivoNode";
import AcaoNode from "./AcaoNode";

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

interface CategoriaIA {
    id: number;
    nome: string;
    descricao: string | null;
    totalMotivos: number;
}

type ItemSelecionado =
    | { tipo: "categoria"; item: CategoriaIA }
    | { tipo: "motivo"; item: MotivoIA }
    | { tipo: "acao"; item: AcaoIA };

interface BibliotecaTreeProps {
    categorias: CategoriaIA[];
    motivos: MotivoIA[];
    categoriaAberta: number | null;
    motivoAberto: number | null;
    onToggleCategoria: (id: number) => void;
    onToggleMotivo: (id: number) => void;
    onSelecionar: (item: ItemSelecionado) => void;
}

function BibliotecaTree({
    categorias,
    motivos,
    categoriaAberta,
    motivoAberto,
    onToggleCategoria,
    onToggleMotivo,
    onSelecionar,
}: BibliotecaTreeProps) {
    function motivosDaCategoria(categoriaId: number) {
        return motivos.filter((motivo) => motivo.categoriaFalhaIAId === categoriaId);
    }

    return (
        <Card sx={{ backgroundColor: "#1F2937", borderRadius: 3 }}>
            <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                    Biblioteca
                </Typography>

                {categorias.length === 0 ? (
                    <Typography color="text.secondary">
                        Nenhuma categoria cadastrada ainda.
                    </Typography>
                ) : (
                    categorias.map((categoria) => {
                        const motivosCategoria = motivosDaCategoria(categoria.id);
                        const categoriaEstaAberta = categoriaAberta === categoria.id;

                        return (
                            <Box key={categoria.id} sx={{ mb: 1 }}>
                                <Box sx={nodeStyle}>
                                    <IconButton
                                        size="small"
                                        onClick={() => onToggleCategoria(categoria.id)}
                                    >
                                        {categoriaEstaAberta ? (
                                            <KeyboardArrowDownIcon />
                                        ) : (
                                            <KeyboardArrowRightIcon />
                                        )}
                                    </IconButton>

                                    <CategoriaNode
                                        nome={categoria.nome}
                                        totalMotivos={motivosCategoria.length}
                                        onClick={() =>
                                            onSelecionar({
                                                tipo: "categoria",
                                                item: categoria,
                                            })
                                        }
                                    />
                                </Box>

                                <Collapse in={categoriaEstaAberta} timeout="auto" unmountOnExit>
                                    <Box sx={{ ml: 4, mt: 1 }}>
                                        {motivosCategoria.length === 0 ? (
                                            <Typography
                                                color="text.secondary"
                                                sx={{ fontSize: 14, ml: 2, mb: 1 }}
                                            >
                                                Nenhum tipo de falha vinculado.
                                            </Typography>
                                        ) : (
                                            motivosCategoria.map((motivo) => {
                                                const motivoEstaAberto = motivoAberto === motivo.id;

                                                return (
                                                    <Box key={motivo.id} sx={{ mb: 1 }}>
                                                        <Box sx={nodeStyle}>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => onToggleMotivo(motivo.id)}
                                                            >
                                                                {motivoEstaAberto ? (
                                                                    <KeyboardArrowDownIcon />
                                                                ) : (
                                                                    <KeyboardArrowRightIcon />
                                                                )}
                                                            </IconButton>

                                                            <MotivoNode
                                                                nome={motivo.nome}
                                                                totalAcoes={
                                                                    motivo.acoesRecomendadas?.length ?? 0
                                                                }
                                                                onClick={() =>
                                                                    onSelecionar({
                                                                        tipo: "motivo",
                                                                        item: motivo,
                                                                    })
                                                                }
                                                            />
                                                        </Box>

                                                        <Collapse
                                                            in={motivoEstaAberto}
                                                            timeout="auto"
                                                            unmountOnExit
                                                        >
                                                            <Box sx={{ ml: 5, mt: 1 }}>
                                                                {motivo.acoesRecomendadas?.length === 0 ? (
                                                                    <Typography
                                                                        color="text.secondary"
                                                                        sx={{ fontSize: 14, mb: 1 }}
                                                                    >
                                                                        Nenhuma ação recomendada.
                                                                    </Typography>
                                                                ) : (
                                                                    motivo.acoesRecomendadas.map((acao) => (
                                                                        <AcaoNode
                                                                            key={acao.id}
                                                                            descricao={acao.descricao}
                                                                            onClick={() =>
                                                                                onSelecionar({
                                                                                    tipo: "acao",
                                                                                    item: acao,
                                                                                })
                                                                            }
                                                                        />
                                                                    ))
                                                                )}
                                                            </Box>
                                                        </Collapse>
                                                    </Box>
                                                );
                                            })
                                        )}
                                    </Box>
                                </Collapse>
                            </Box>
                        );
                    })
                )}
            </CardContent>
        </Card>
    );
}

const nodeStyle = {
    display: "flex",
    alignItems: "center",
    borderRadius: 2,
    px: 1,
    py: 0.5,
    "&:hover": {
        backgroundColor: "#111827",
    },
};

export default BibliotecaTree;