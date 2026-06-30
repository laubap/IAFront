import { Card, CardContent, Typography } from "@mui/material";

interface Props {
    titulo: string;
    valor: string | number;
    cor?: string;
}

function StatusCard({ titulo, valor, cor = "#2F80ED" }: Props) {
    return (
        <Card
            sx={{
                backgroundColor: "#1F2937",
                borderLeft: `6px solid ${cor}`,
                borderRadius: 3,
                height: 130
            }}
        >
            <CardContent>

                <Typography
                    color="text.secondary"
                    sx={{ fontSize: 15 }}
                >
                    {titulo}
                </Typography>

                <Typography
                    variant="h3"
                    sx={{
                        mt: 2,
                        fontWeight: "bold"
                    }}
                >
                    {valor}
                </Typography>

            </CardContent>
        </Card>
    );
}

export default StatusCard;