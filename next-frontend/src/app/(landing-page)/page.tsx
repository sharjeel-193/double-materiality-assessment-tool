import {
    Container,
    Box,
    Typography
} from '@mui/material';


export default function LandingPage() {
    return (
        <Container maxWidth="lg">
            <Box
                sx={{
                    py: { xs: 8, md: 12 },
                    textAlign: 'center',
                }}
            >
                <Typography>
                    THIS IS THE LANDING PAGE
                </Typography>
            </Box>
        </Container>
    );
}
