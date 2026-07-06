import { Box, Typography } from "@mui/material";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";

interface HealthChartProps {
    saude: number;
}

function HealthChart({ saude }: HealthChartProps) {
    const data = [
        {
            name: "Saúde",
            value: saude,
            fill: saude >= 85 ? "#22C55E" : saude >= 60 ? "#F59E0B" : "#EF4444",
        },
    ];

    return (
        <Box sx={{ height: 260, position: "relative" }}>
            <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                    innerRadius="70%"
                    outerRadius="100%"
                    data={data}
                    startAngle={90}
                    endAngle={-270}
                >
                    <RadialBar dataKey="value" cornerRadius={10} />
                </RadialBarChart>
            </ResponsiveContainer>

            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                }}
            >
                <Typography variant="h3" sx={{ fontWeight: 800 }}>
                    {saude}%
                </Typography>
                <Typography color="text.secondary">Saúde Geral</Typography>
            </Box>
        </Box>
    );
}

export default HealthChart;