import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface SectionTitleProps {
    titulo: string;
    subtitulo?: string;
    icon?: ReactNode;
}

function SectionTitle({ titulo, subtitulo, icon }: SectionTitleProps) {
    return (
        <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                {icon && (
                    <Box sx={{ color: "#60A5FA", display: "flex" }}>
                        {icon}
                    </Box>
                )}

                <Typography 
                variant="h4" sx={{
                     fontWeight: 800,
                      color: "#F9FAFB",}}>
                    {titulo}
                </Typography>
            </Box>

            {subtitulo && (
                <Typography  sx={{ 
                    mt: 0.5,
                    color: "#F9FAFB",}}>
                    {subtitulo}
                </Typography>
            )}
        </Box>
    );
}

export default SectionTitle;