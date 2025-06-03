import { Loader } from "@/components";
import { Box } from "@mui/material";

export default function Loading() {
    return (
        <Box
            sx={{
                display: 'flex',
                height: '100vh',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Loader />
        </Box>
    );
}