import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";

import SectionTitle from "../../components/SectionTitle/SectionTitle";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import { api } from "../../services/api";
import { useCliente } from "../../contexts/ClienteContext";

interface Processo {
    id: number;
    clienteId: string;
    nome: string;
    descricao: string | null;
    area: string | null;
    criticidade: string | null;
    objetivo: string | null;
}

function Processos() {
    const [processos, setProcessos] = useState<Processo[]>([]);
    const navigate = useNavigate();

    const { clienteId } = useCliente();

    useEffect(() => {
        api.get(`/processos/${clienteId}`)
            .then((response) => {
                setProcessos(response.data);
            })
            .catch((error) => {
                console.error("Erro ao buscar processos:", error);
            });
    }, [clienteId]);

    function corCriticidade(criticidade?: string | null) {
        const valor = criticidade?.toLowerCase();

        if (valor === "alta" || valor === "critica" || valor === "crítica") {
            return "error";
        }

        if (valor === "media" || valor === "média") {
            return "warning";
        }

        return "success";
    }

    return (
        <Box>
            <SectionTitle
                titulo="Processos"
                subtitulo="Processos industriais cadastrados e monitorados."
                icon={<AccountTreeIcon />}
            />

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mb: 2,
                }}
            >
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate("/processos/cadastrar")}
                >
                    Novo Processo
                </Button>
            </Box>

            <Card sx={{ backgroundColor: "#1F2937", borderRadius: 3 }}>
                <CardContent>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nome</TableCell>
                                <TableCell>Área</TableCell>
                                <TableCell>Objetivo</TableCell>
                                <TableCell>Criticidade</TableCell>
                                <TableCell align="right">Ações</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {processos.map((processo) => (
                                <TableRow key={processo.id} hover>
                                    <TableCell>{processo.nome}</TableCell>

                                    <TableCell>
                                        {processo.area ?? "-"}
                                    </TableCell>

                                    <TableCell>
                                        {processo.objetivo ?? "-"}
                                    </TableCell>

                                    <TableCell>
                                        <Chip
                                            label={
                                                processo.criticidade ??
                                                "não informada"
                                            }
                                            color={corCriticidade(
                                                processo.criticidade
                                            )}
                                            size="small"
                                        />
                                    </TableCell>

                                    <TableCell align="right">
                                        <Button
                                            variant="contained"
                                            size="small"
                                            startIcon={<VisibilityIcon />}
                                            onClick={() =>
                                                navigate(
                                                    `/processos/${processo.id}`
                                                )
                                            }
                                        >
                                            Ver Dashboard
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </Box>
    );
}

export default Processos;