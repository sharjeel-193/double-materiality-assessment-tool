import {
    Container,
    Box,
    Typography
} from '@mui/material';


export default function DashboardPage() {
    return (
        <Container maxWidth="lg">
            <Box
                sx={{
                    py: { xs: 8, md: 12 },
                    textAlign: 'center',
                }}
            >
                <Typography>
                    THIS IS THE DASHBOARD
                </Typography>
            </Box>
        </Container>
    );
}
