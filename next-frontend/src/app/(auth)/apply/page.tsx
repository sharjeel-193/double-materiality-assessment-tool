import {
    Container,
    Box,
    Typography
} from '@mui/material';



export default function ApplyPage() {
    return (
        <Container maxWidth="lg">
            <Box
                sx={{
                    py: { xs: 8, md: 12 },
                    textAlign: 'center',
                }}
            >
                <Typography>
                    APPLY FOR THE TOOL HERE
                </Typography>
            </Box>
        </Container>
    );
}
