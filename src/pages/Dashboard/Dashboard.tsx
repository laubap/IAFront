import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import StatusCard from "../../components/StatusCard/StatusCard";
import { api } from "../../services/api";

interface DashboardGeral {
    saudeGeral: number;
    totalProcessos: number;
    totalEquipamentos: number;
    totalTagsConfiguradas: number;
    totalAnomalias: number;
}

function Dashboard() {
    const [dados, setDados] = useState<DashboardGeral | null>(null);

    useEffect(() => {
        api.get("/dashboard-geral")
            .then((response) => {
                setDados(response.data);
            })
            .catch((error) => {
                console.error("Erro ao buscar dashboard geral:", error);
            });
    }, []);

    return (
        <>
            <Typography variant="h4" sx={{ mb: 4 }}>
                Dashboard Geral
            </Typography>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 3 }}>
                    <StatusCard
                        titulo="Saúde Geral"
                        valor={dados ? `${dados.saudeGeral}%` : "-"}
                        cor="#22C55E"
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                    <StatusCard
                        titulo="Processos"
                        valor={dados?.totalProcessos ?? "-"}
                        cor="#3B82F6"
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                    <StatusCard
                        titulo="Equipamentos"
                        valor={dados?.totalEquipamentos ?? "-"}
                        cor="#F59E0B"
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                    <StatusCard
                        titulo="Anomalias"
                        valor={dados?.totalAnomalias ?? "-"}
                        cor="#EF4444"
                    />
                </Grid>
            </Grid>
        </>
    );
}

export default Dashboard;