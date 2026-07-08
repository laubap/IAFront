import { Box, Typography } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";

interface Props {
    nome: string;
    totalMotivos?: number;
    onClick?: () => void;
}

function CategoriaNode({ nome, totalMotivos = 0, onClick }: Props) {
    return (
        <Box onClick={onClick} sx={{ display: "flex", gap: 1.5, cursor: "pointer" }}>
            <FolderIcon sx={{ color: "#60A5FA" }} />
            <Box>
                <Typography sx={{ fontWeight: 800 }}>{nome}</Typography>
                <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                    {totalMotivos} tipo(s) de falha
                </Typography>
            </Box>
        </Box>
    );
}

export default CategoriaNode;