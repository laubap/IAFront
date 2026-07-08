import { Box, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface Props {
    nome: string;
    totalAcoes?: number;
    onClick?: () => void;
}

function MotivoNode({ nome, totalAcoes = 0, onClick }: Props) {
    return (
        <Box onClick={onClick} sx={{ display: "flex", gap: 1.5, cursor: "pointer" }}>
            <SearchIcon sx={{ color: "#FBBF24" }} />
            <Box>
                <Typography sx={{ fontWeight: 700 }}>{nome}</Typography>
                <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                    {totalAcoes} ação(ões)
                </Typography>
            </Box>
        </Box>
    );
}

export default MotivoNode;