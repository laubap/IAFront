import { Box, Typography } from "@mui/material";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface TagStatusChartProps {
    normais: number;
    anomalas: number;
    semPerfil: number;
    semValorAtual: number;
}

function TagStatusChart({
    normais,
    anomalas,
    semPerfil,
    semValorAtual,
}: TagStatusChartProps) {
    const data = [
        { name: "Normais", value: normais, color: "#22C55E" },
        { name: "Anômalas", value: anomalas, color: "#EF4444" },
        { name: "Sem perfil", value: semPerfil, color: "#F59E0B" },
        { name: "Sem valor", value: semValorAtual, color: "#6B7280" },
    ].filter((item) => item.value > 0);

    return (
        <Box sx={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={65}
                        outerRadius={95}
                        paddingAngle={4}
                    >
                        {data.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                        ))}
                    </Pie>

                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#111827",
                            border: "1px solid #374151",
                            borderRadius: 8,
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>

            <Typography color="text.secondary" align="center">
                Distribuição das tags monitoradas
            </Typography>
        </Box>
    );
}

export default TagStatusChart;