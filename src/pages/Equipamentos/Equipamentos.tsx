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
import SectionTitle from "../../components/SectionTitle/SectionTitle";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";

import { api } from "../../services/api";


interface Equipamento {
    id: number;
    clienteId: string;
    nome: string;
    area: string | null;
    tipoEquipamento: string | null;
    criticidade: string | null;
    fabricante: string | null;
    modelo: string | null;
}

function Equipamentos() {
    const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/equipamentos")
            .then((response) => {
                setEquipamentos(response.data);
            })
            .catch((error) => {
                console.error("Erro ao buscar equipamentos:", error);
            });
    }, []);

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
            titulo="Equipamentos"
            subtitulo="Lista de equipamentos monitorados pela IA Marrari."
            icon={<PrecisionManufacturingIcon />}
/>

            <Card sx={{ backgroundColor: "#1F2937", borderRadius: 3 }}>
                <CardContent>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nome</TableCell>
                                <TableCell>Área</TableCell>
                                <TableCell>Tipo</TableCell>
                                <TableCell>Fabricante</TableCell>
                                <TableCell>Criticidade</TableCell>
                                <TableCell align="right">Ações</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {equipamentos.map((equipamento) => (
                                <TableRow key={equipamento.id} hover>
                                    <TableCell>{equipamento.nome}</TableCell>
                                    <TableCell>{equipamento.area ?? "-"}</TableCell>
                                    <TableCell>{equipamento.tipoEquipamento ?? "-"}</TableCell>
                                    <TableCell>
                                        {equipamento.fabricante ?? "-"} {equipamento.modelo ?? ""}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={equipamento.criticidade ?? "não informada"}
                                            color={corCriticidade(equipamento.criticidade)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button
                                            variant="contained"
                                            size="small"
                                            startIcon={<VisibilityIcon />}
                                            onClick={() =>
                                                navigate(`/equipamentos/${equipamento.id}`)
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

export default Equipamentos;