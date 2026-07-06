import { Box, Chip, Divider, Typography } from "@mui/material";

import PsychologyIcon from "@mui/icons-material/Psychology";

interface Props {
    mensagem: string;
    classificacao: string | null;
    tipoTag: string;
    data: string;
}

function AnaliseInteligenteCard({
    mensagem,
    classificacao,
    tipoTag,
    data,
}: Props) {

    function corStatus(status: string | null) {

        const valor = status?.toLowerCase();

        if (valor === "alto" || valor === "crítico" || valor === "critico")
            return "error";

        if (valor === "médio" || valor === "medio")
            return "warning";

        return "success";
    }

    return (
        <Box
            sx={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: 3,
                p: 3,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                }}
            >
                <Box>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 1,
                        }}
                    >
                        <PsychologyIcon color="primary" />

                        <Typography
                            variant="h6"
                            sx={{ fontWeight: 800 }}
                        >
                            Análise Inteligente
                        </Typography>

                    </Box>

                    <Typography
                        color="text.secondary"
                    >
                        Interpretação automática realizada pela IA Marrari.
                    </Typography>

                </Box>

                <Chip
                    label={classificacao ?? "Normal"}
                    color={corStatus(classificacao)}
                />

            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography
                sx={{
                    lineHeight: 1.8,
                    fontSize: 15,
                }}
            >
                {mensagem}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Box
                sx={{
                    display: "flex",
                    gap: 6,
                    flexWrap: "wrap",
                }}
            >
                <Box>

                    <Typography
                        color="text.secondary"
                        sx={{ fontSize: 13 }}
                    >
                        Tipo da Tag
                    </Typography>

                    <Typography
                        sx={{ fontWeight: 700 }}
                    >
                        {tipoTag}
                    </Typography>

                </Box>

                <Box>

                    <Typography
                        color="text.secondary"
                        sx={{ fontSize: 13 }}
                    >
                        Última análise
                    </Typography>

                    <Typography
                        sx={{ fontWeight: 700 }}
                    >
                        {new Date(data).toLocaleString("pt-BR")}
                    </Typography>

                </Box>

            </Box>

        </Box>
    );
}

export default AnaliseInteligenteCard;