import { LandingPageNavbar, Footer } from '@/components';
import { Box } from '@mui/material';

export default function LandingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Box component="main" sx={{ flexGrow: 1 }}>
                <LandingPageNavbar />
                {children}
                <Footer />
            </Box>
        </Box>
    );
}
