import { Box, Typography } from "@mui/material";
import BuildIcon from "@mui/icons-material/Build";

interface Props {
    descricao: string;
    onClick?: () => void;
}

function AcaoNode({ descricao, onClick }: Props) {
    return (
        <Box
            onClick={onClick}
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                borderRadius: 2,
                px: 2,
                py: 1,
                mb: 0.5,
                "&:hover": { backgroundColor: "#111827" },
            }}
        >
            <BuildIcon sx={{ color: "#22C55E", fontSize: 20 }} />
            <Typography sx={{ fontSize: 14 }}>{descricao}</Typography>
        </Box>
    );
}

export default AcaoNode;