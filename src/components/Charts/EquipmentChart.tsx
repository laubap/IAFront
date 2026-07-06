import { Box } from "@mui/material";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

interface EquipamentoResumo {
    nome: string;
    criticidade: string | null;
}

interface EquipmentChartProps {
    equipamentos: EquipamentoResumo[];
}

function EquipmentChart({ equipamentos }: EquipmentChartProps) {
    const data = equipamentos.map((equipamento) => ({
        nome: equipamento.nome,
        criticidade:
            equipamento.criticidade?.toLowerCase() === "alta"
                ? 3
                : equipamento.criticidade?.toLowerCase() === "media" ||
                    equipamento.criticidade?.toLowerCase() === "média"
                  ? 2
                  : 1,
    }));

    return (
        <Box sx={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="nome" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#111827",
                            border: "1px solid #374151",
                            borderRadius: 8,
                        }}
                    />
                    <Bar dataKey="criticidade" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
}

export default EquipmentChart;