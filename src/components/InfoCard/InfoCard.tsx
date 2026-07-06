import { Card, CardContent, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface InfoCardProps {
    titulo: string;
    children: ReactNode;
}

function InfoCard({ titulo, children }: InfoCardProps) {
    return (
        <Card sx={{ backgroundColor: "#1F2937", borderRadius: 3, height: "100%" }}>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    {titulo}
                </Typography>

                {children}
            </CardContent>
        </Card>
    );
}

export default InfoCard;