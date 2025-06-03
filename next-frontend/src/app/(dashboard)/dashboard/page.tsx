// app/dashboard/page.tsx
"use client";

import { Suspense, lazy, useState } from 'react';
import { useCompanyContext } from '@/providers/CompanyContextProvider';
import { useReportContext } from '@/providers';
import {
    Container,
    Box,
    Typography,
    Fab
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Loader } from '@/components/ui/Loader';

// Lazy load components
// ✅ Lazy load components at parent level with named imports
const CreateFirstReport = lazy(() => 
    import('@/components').then(module => ({ default: module.CreateFirstReport }))
);

const ReportSelector = lazy(() => 
    import('@/components').then(module => ({ default: module.ReportSelector }))
);

const CreateReportDialog = lazy(() => 
    import('@/components').then(module => ({ default: module.CreateReportDialog }))
);

export default function DashboardPage() {
    const { company, loading: companyLoading } = useCompanyContext();
    const { hasReports, availableYears, loading: reportLoading, currentReport } = useReportContext();
    
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const loading = companyLoading || reportLoading;

    if (loading) return <Loader variant="inline" message="Loading dashboard..." />;
    if (!company) return <div>No company data available.</div>;

    return (
        <Container maxWidth="lg">
            <Box sx={{ py: 3 }}>
                {!hasReports ? (
                    // No reports - Show create first report
                    <Suspense fallback={<Loader variant="page" message="Loading..." />}>
                        <Box sx={{ py: { xs: 4, md: 8 }, textAlign: 'center' }}>
                            <Typography variant="h4" gutterBottom>
                                Welcome to {company.name}
                            </Typography>
                            <CreateFirstReport />
                        </Box>
                    </Suspense>
                ) : (
                    // Has reports - Show dashboard
                    <Suspense fallback={<Loader variant="inline" message="Loading dashboard..." />}>
                        <ReportSelector />
                        <Typography>
                            Report for {currentReport?.year}
                        </Typography>
                        
                        
                        {/* Floating Action Button for Create Report */}
                        <Fab
                            color="primary"
                            aria-label="create report"
                            onClick={() => setCreateDialogOpen(true)}
                            sx={{
                                position: 'fixed',
                                bottom: 24,
                                right: 24,
                            }}
                        >
                            <AddIcon />
                        </Fab>
                    </Suspense>
                )}

                {/* Create Report Dialog - Only load when needed */}
                {createDialogOpen && (
                    <Suspense fallback={null}>
                        <CreateReportDialog
                            open={createDialogOpen}
                            onClose={() => setCreateDialogOpen(false)}
                            availableYears={availableYears}
                        />
                    </Suspense>
                )}
            </Box>
        </Container>
    );
}
