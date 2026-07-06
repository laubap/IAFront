import {
    CartesianGrid,
    Line,
    LineChart,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

interface HistoricoItem {
    dataHora: string;
    valor: number;
}

interface TagTrendChartProps {
    historico: HistoricoItem[];
    faixaEsperadaMin: number | null;
    faixaEsperadaMax: number | null;
}

function TagTrendChart({
    historico,
    faixaEsperadaMin,
    faixaEsperadaMax,
}: TagTrendChartProps) {
    const dados = historico.map((item) => ({
        hora: new Date(item.dataHora).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
        }),
        valor: item.valor,
    }));

    return (
        <ResponsiveContainer width="100%" height={240}>
            <LineChart data={dados}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="hora" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />

                <Tooltip
                    contentStyle={{
                        backgroundColor: "#111827",
                        border: "1px solid #374151",
                        color: "#E5E7EB",
                    }}
                />

                {faixaEsperadaMin !== null && (
                    <ReferenceLine y={faixaEsperadaMin} stroke="#22C55E" strokeDasharray="4 4" />
                )}

                {faixaEsperadaMax !== null && (
                    <ReferenceLine y={faixaEsperadaMax} stroke="#EF4444" strokeDasharray="4 4" />
                )}

                <Line
                    type="monotone"
                    dataKey="valor"
                    stroke="#60A5FA"
                    strokeWidth={3}
                    dot={false}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}

export default TagTrendChart;