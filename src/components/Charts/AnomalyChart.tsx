import { Box, Typography } from "@mui/material";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface AnomalyChartProps {
    totalAnomalias: number;
    totalTags: number;
}

function AnomalyChart({ totalAnomalias, totalTags }: AnomalyChartProps) {
    const normais = Math.max(totalTags - totalAnomalias, 0);

    const data = [
        { name: "Normais", value: normais, color: "#22C55E" },
        { name: "Anomalias", value: totalAnomalias, color: "#EF4444" },
    ];

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
                Distribuição entre tags normais e anômalas
            </Typography>
        </Box>
    );
}

export default AnomalyChart;