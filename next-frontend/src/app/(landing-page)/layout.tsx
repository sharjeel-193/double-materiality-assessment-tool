import { LandingPageNavbar, Footer, Loader } from '@/components';
import { Box } from '@mui/material';
import { Suspense } from 'react';

export default function LandingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Box component="main" sx={{ flexGrow: 1 }}>
                <LandingPageNavbar />
                <Suspense fallback={<Loader variant='inline' />}>
                    {children}
                </Suspense>
                <Footer />
            </Box>
        </Box>
    );
}
