import {
    Card,
    CardContent,
    Typography,
    Button,
    Stack,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import RefreshIcon from "@mui/icons-material/Refresh";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

function QuickActions() {
    const navigate = useNavigate();

    return (
        <Card
            sx={{
                backgroundColor: "#1F2937",
                borderRadius: 3,
                height: "100%",
            }}
        >
            <CardContent>

                <Typography
                    variant="h6"
                    sx={{ mb: 3 }}
                >
                    Ações rápidas
                </Typography>

                <Stack spacing={2}>

                    <Button
                        fullWidth
                        variant="contained"
                        startIcon={<RefreshIcon />}
                        onClick={() => window.location.reload()}
                    >
                        Atualizar Dashboard
                    </Button>

                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<PrecisionManufacturingIcon />}
                        onClick={() => navigate("/equipamentos")}
                    >
                        Equipamentos
                    </Button>

                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<AccountTreeIcon />}
                        onClick={() => navigate("/processos")}
                    >
                        Processos
                    </Button>

                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<WarningAmberRoundedIcon />}
                        onClick={() => navigate("/anomalias")}
                    >
                        Ver Anomalias
                    </Button>

                </Stack>

            </CardContent>
        </Card>
    );
}

export default QuickActions;