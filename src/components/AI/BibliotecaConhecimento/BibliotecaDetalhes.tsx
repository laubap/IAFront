import { Box, Card, CardContent, Chip, Typography } from "@mui/material";

import FolderIcon from "@mui/icons-material/Folder";
import SearchIcon from "@mui/icons-material/Search";
import BuildIcon from "@mui/icons-material/Build";
import InfoIcon from "@mui/icons-material/Info";

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
    | { tipo: "acao"; item: AcaoIA }
    | null;

interface BibliotecaDetalhesProps {
    itemSelecionado: ItemSelecionado;
    motivos: MotivoIA[];
}

function BibliotecaDetalhes({ itemSelecionado, motivos }: BibliotecaDetalhesProps) {
    if (!itemSelecionado) {
        return (
            <Card sx={{ backgroundColor: "#1F2937", borderRadius: 3 }}>
                <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                        <InfoIcon sx={{ color: "#60A5FA" }} />

                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                            Detalhes do conhecimento
                        </Typography>
                    </Box>

                    <Typography color="text.secondary">
                        Selecione uma categoria, tipo de falha ou ação recomendada na biblioteca para visualizar os detalhes.
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    if (itemSelecionado.tipo === "categoria") {
        const categoria = itemSelecionado.item;

        const motivosDaCategoria = motivos.filter(
            (motivo) => Number(motivo.categoriaFalhaIAId) === Number(categoria.id)
        );

        return (
            <Card sx={{ backgroundColor: "#1F2937", borderRadius: 3 }}>
                <CardContent>
                    <Header
                        icon={<FolderIcon sx={{ color: "#60A5FA" }} />}
                        titulo={categoria.nome}
                        chip="Categoria de Falha"
                    />

                    <InfoBlock
                        titulo="O que representa?"
                        texto={
                            categoria.descricao ??
                            "Esta categoria agrupa tipos de falha semelhantes para organizar o conhecimento da IA."
                        }
                    />

                    <Typography sx={{ fontWeight: 800, mt: 3, mb: 1 }}>
                        Tipos de falha vinculados
                    </Typography>

                    {motivosDaCategoria.length > 0 ? (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            {motivosDaCategoria.map((motivo) => (
                                <Box
                                    key={motivo.id}
                                    sx={{
                                        p: 1.5,
                                        borderRadius: 2,
                                        backgroundColor: "#111827",
                                        border: "1px solid #374151",
                                    }}
                                >
                                    <Typography sx={{ fontWeight: 700 }}>
                                        🔎 {motivo.nome}
                                    </Typography>

                                    <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                                        {motivo.descricao ?? "Sem descrição."}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <Typography color="text.secondary">
                            Nenhum tipo de falha cadastrado nesta categoria.
                        </Typography>
                    )}
                </CardContent>
            </Card>
        );
    }

    if (itemSelecionado.tipo === "motivo") {
        const motivo = itemSelecionado.item;

        return (
            <Card sx={{ backgroundColor: "#1F2937", borderRadius: 3 }}>
                <CardContent>
                    <Header
                        icon={<SearchIcon sx={{ color: "#FBBF24" }} />}
                        titulo={motivo.nome}
                        chip="Tipo de Falha"
                    />

                    <InfoBlock
                        titulo="Causa específica"
                        texto={
                            motivo.descricao ??
                            "Este tipo de falha representa uma causa específica que pode explicar uma anomalia detectada pela IA."
                        }
                    />

                    <Typography sx={{ fontWeight: 800, mt: 3, mb: 1 }}>
                        Ações recomendadas
                    </Typography>

                    {motivo.acoesRecomendadas?.length ? (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            {motivo.acoesRecomendadas.map((acao) => (
                                <Box
                                    key={acao.id}
                                    sx={{
                                        p: 1.5,
                                        borderRadius: 2,
                                        backgroundColor: "#111827",
                                        border: "1px solid #374151",
                                    }}
                                >
                                    <Typography color="text.secondary">
                                        🛠 {acao.descricao}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <Typography color="text.secondary">
                            Nenhuma ação recomendada cadastrada para este tipo de falha.
                        </Typography>
                    )}
                </CardContent>
            </Card>
        );
    }

    const acao = itemSelecionado.item;

    return (
        <Card sx={{ backgroundColor: "#1F2937", borderRadius: 3 }}>
            <CardContent>
                <Header
                    icon={<BuildIcon sx={{ color: "#22C55E" }} />}
                    titulo="Ação Recomendada"
                    chip="Procedimento"
                />

                <InfoBlock titulo="Descrição da ação" texto={acao.descricao} />
            </CardContent>
        </Card>
    );
}

function Header({
    icon,
    titulo,
    chip,
}: {
    icon: React.ReactNode;
    titulo: string;
    chip: string;
}) {
    return (
        <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                {icon}

                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    {titulo}
                </Typography>
            </Box>

            <Chip
                label={chip}
                size="small"
                sx={{
                    backgroundColor: "#111827",
                    color: "#E5E7EB",
                    border: "1px solid #374151",
                }}
            />
        </Box>
    );
}

function InfoBlock({ titulo, texto }: { titulo: string; texto: string }) {
    return (
        <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontWeight: 800, mb: 0.5 }}>{titulo}</Typography>

            <Typography color="text.secondary">{texto}</Typography>
        </Box>
    );
}

export default BibliotecaDetalhes;