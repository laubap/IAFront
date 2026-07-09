import { useEffect, useState } from "react";
import { Box } from "@mui/material";

import BibliotecaHeader from "../../components/AI/BibliotecaConhecimento/BibliotecaHeader";
import BibliotecaExplicacao from "../../components/AI/BibliotecaConhecimento/BibliotecaExplicacao";
import BibliotecaStats from "../../components/AI/BibliotecaConhecimento/BibliotecaStats";
import BibliotecaTree from "../../components/AI/BibliotecaConhecimento/BibliotecaTree";
import BibliotecaDetalhes from "../../components/AI/BibliotecaConhecimento/BibliotecaDetalhes";
import NovoConhecimentoDialog from "../../components/AI/BibliotecaConhecimento/NovoConhecimentoDialog";
import { api } from "../../services/api";

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

function BibliotecaConhecimento() {
    const clienteId = "PK7";

    const [dialogOpen, setDialogOpen] = useState(false);
    const [categoriaAberta, setCategoriaAberta] = useState<number | null>(null);
    const [motivoAberto, setMotivoAberto] = useState<number | null>(null);
    const [itemSelecionado, setItemSelecionado] = useState<ItemSelecionado>(null);

    const [categorias, setCategorias] = useState<CategoriaIA[]>([]);
    const [motivos, setMotivos] = useState<MotivoIA[]>([]);

    useEffect(() => {
        carregarDados();
    }, []);

    function carregarDados() {
        api.get(`/categorias-falha-ia/${clienteId}`)
            .then((response) => setCategorias(response.data))
            .catch((error) => console.error("Erro ao buscar categorias:", error));

        api.get(`/motivos-ia/${clienteId}`)
            .then((response) => setMotivos(response.data))
            .catch((error) => console.error("Erro ao buscar tipos de falha:", error));
    }

    async function criarCategoria(nome: string, descricao: string) {
        await api.post("/categorias-falha-ia", {
            clienteId,
            nome,
            descricao,
        });

        carregarDados();
    }

    async function criarMotivo(
        categoriaId: number | null,
        nome: string,
        descricao: string
    ) {
        await api.post("/motivos-ia", {
            clienteId,
            nome,
            descricao,
            categoriaFalhaIAId: categoriaId,
        });

        carregarDados();
    }

    async function criarAcao(motivoId: number, descricao: string) {
        await api.post("/acoes-ia", {
            clienteId,
            motivoAnomaliaIAId: motivoId,
            descricao,
        });

        carregarDados();
    }

    const totalAcoes = motivos.reduce(
        (total, motivo) => total + (motivo.acoesRecomendadas?.length ?? 0),
        0
    );

    return (
        <Box>
            <BibliotecaHeader onAdicionar={() => setDialogOpen(true)} />

            <BibliotecaExplicacao />

            <BibliotecaStats
                totalCategorias={categorias.length}
                totalMotivos={motivos.length}
                totalAcoes={totalAcoes}
                totalFeedbacks={0}
            />

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        lg: "430px 1fr",
                    },
                    gap: 3,
                }}
            >
                <BibliotecaTree
                    categorias={categorias}
                    motivos={motivos}
                    categoriaAberta={categoriaAberta}
                    motivoAberto={motivoAberto}
                    onToggleCategoria={(id) =>
                        setCategoriaAberta(categoriaAberta === id ? null : id)
                    }
                    onToggleMotivo={(id) =>
                        setMotivoAberto(motivoAberto === id ? null : id)
                    }
                    onSelecionar={setItemSelecionado}
                />

                <BibliotecaDetalhes itemSelecionado={itemSelecionado}
                motivos={motivos} />
            </Box>

            <NovoConhecimentoDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                categorias={categorias}
                motivos={motivos}
                onCriarCategoria={criarCategoria}
                onCriarMotivo={criarMotivo}
                onCriarAcao={criarAcao}
            />
        </Box>
    );
}

export default BibliotecaConhecimento;