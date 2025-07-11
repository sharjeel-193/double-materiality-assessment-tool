"use client"

import { useState } from 'react';
import { DashboardNavbar, DashboardSidebar } from '@/components';
import { Box } from '@mui/material';
import { CompanyContextProvider } from '@/providers/CompanyContextProvider';
import withProtectedRoute from '@/auth/withProtectedRoute'
import { ReportContextProvider } from '@/providers';

function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleMobileMenuToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <CompanyContextProvider>
                <ReportContextProvider>
                    <DashboardSidebar 
                        mobileOpen={mobileOpen}
                        onMobileClose={() => setMobileOpen(false)}
                    />
                    <DashboardNavbar onMobileMenuToggle={handleMobileMenuToggle} />
                    <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', ml: { lg: '280px' } }}>
                        <Box component="main" sx={{ flexGrow: 1, m: 2 }}>
                            {children}
                        </Box>
                    </Box>
                </ReportContextProvider>
            </CompanyContextProvider>
            {/* <Footer /> */}
        </Box>
    );
}

export default withProtectedRoute(DashboardLayout)
