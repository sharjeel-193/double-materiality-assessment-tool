// app/dashboard/page.tsx
"use client";

import { Suspense, useState } from 'react';
import { useCompanyContext } from '@/providers/CompanyContextProvider';
import { useReportContext } from '@/providers';
import {
    Container,
    Box,
    Typography,
    Fab,
    Grid,
    Paper,
    Stack,
    Chip,
} from '@mui/material';
import { 
    Add as AddIcon,
    People as PeopleIcon,
    Topic as TopicIcon,
    Assessment as ImpactIcon,
    AttachMoney as FinanceIcon
} from '@mui/icons-material';
import { CreateFirstReport, CreateReportDialog, Loader, ReportSelector, ReportStatusTimeline, StatisticCard } from '@/components';
import { ImpactRadarChart } from '@/components/dashboard/ImpactRadarChart';
import { FinancialRadarChart } from '@/components/dashboard/FinancialRadarChart';


export default function DashboardPage() {
    const { company } = useCompanyContext();
    const { availableYears, reportLoading, currentReport, updateReportStatus } = useReportContext();
    
    const [createDialogOpen, setCreateDialogOpen] = useState(false);


    if (reportLoading) return <Loader variant="inline" message="Loading dashboard..." />;
    if (!company) return <div>No company data available.</div>;


    return (
        <Container maxWidth="xl">
            <Box sx={{ py: 3 }}>
                {company.reportYears.length < 1?
                (
                    <Box sx={{ py: { xs: 4, md: 8 }, textAlign: 'center' }}>
                        <Typography variant="h4" gutterBottom>
                            Welcome to {company.name}
                        </Typography>
                        <CreateFirstReport />
                    </Box>
                ):
                (
                     <Suspense fallback={<Loader variant="inline" message="Loading dashboard..." />}>
                        {/* Header Section */}
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                                Sustainability Dashboard
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Overview of your sustainability reporting progress
                            </Typography>
                        </Box>

                        {/* Report Selector Section */}
                        <Paper 
                            sx={{ 
                                p: 3, 
                                mb: 4, 
                                borderRadius: 3,
                                border: '1px solid',
                                borderColor: 'divider'
                            }}
                        >
                            <Stack 
                                direction={{ xs: 'column', md: 'row' }} 
                                justifyContent="space-between" 
                                alignItems={{ xs: 'flex-start', md: 'center' }}
                                spacing={2}
                            >
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                        Current Report
                                    </Typography>
                                    <Stack direction="row" alignItems="center" spacing={2}>
                                        <Chip 
                                            label={`Year: ${currentReport?.year || 'N/A'}`}
                                            color="primary" 
                                            variant="outlined"
                                        />
                                        <Chip 
                                            label={`Standard: ${currentReport?.standard.name || 'Not Set'}`}
                                            color="secondary" 
                                            variant="outlined"
                                        />
                                        <Chip 
                                            label={`Status: ${currentReport?.status || 1}/8`}
                                            color="info" 
                                            variant="outlined"
                                        />
                                    </Stack>
                                </Box>
                                <ReportSelector />
                            </Stack>
                        </Paper>

                        {/* Statistics Grid */}
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            <Grid size={{xs: 12, sm: 6, md: 3}}>
                                <StatisticCard
                                    title="Important Stakeholders"
                                    value={currentReport?.importantStakeholders || 0}
                                    helperText={`out of ${currentReport?.totalStakeholders || 0} potential stakeholders`}
                                    color="primary"
                                    icon={<PeopleIcon />}
                                />
                            </Grid>
                            
                            <Grid size={{xs: 12, sm: 6, md: 3}}>
                                <StatisticCard
                                    title="Material Topics"
                                    value={currentReport?.materialTopics || 0}
                                    helperText={`out of ${currentReport?.totalTopics || 0} total topics`}
                                    color="secondary"
                                    icon={<TopicIcon />}
                                />
                            </Grid>
                            
                            <Grid size={{xs: 12, sm: 6, md: 3}}>
                                <StatisticCard
                                    title="Total Impacts"
                                    value={currentReport?.totalImpacts || 0}
                                    helperText="assessed impacts"
                                    color="success"
                                    icon={<ImpactIcon />}
                                />
                            </Grid>
                            
                            <Grid size={{xs: 12, sm: 6, md: 3}}>
                                <StatisticCard
                                    title="Financial Effects"
                                    value={currentReport?.totalFinancialEffects || 0}
                                    helperText="identified financial effects"
                                    color="warning"
                                    icon={<FinanceIcon />}
                                />
                            </Grid>

                            <Grid size={{xs: 12, sm: 6}}>
                                <ImpactRadarChart data={currentReport?.impactRadar || '{}'} />
                            </Grid>
                            <Grid size={{xs: 12, sm: 6}}>
                                <FinancialRadarChart data={currentReport?.financialRadar || '{}'} />
                            </Grid>

                            

                            <Grid size={{xs: 12, sm: 6, md: 4}}>
                                <ReportStatusTimeline status={currentReport?.status || 0} updateReportStatus={updateReportStatus}  />
                            </Grid>
                        </Grid>

                        

                        {/* Floating Action Button for Create Report */}
                        <Fab
                            color="primary"
                            aria-label="create report"
                            onClick={() => setCreateDialogOpen(true)}
                            sx={{
                                position: 'fixed',
                                bottom: 24,
                                right: 24,
                                boxShadow: 4,
                                '&:hover': {
                                    transform: 'scale(1.1)',
                                }
                            }}
                        >
                            <AddIcon />
                        </Fab>
                    </Suspense>
                )
                }

                <CreateReportDialog
                    open={createDialogOpen}
                    onClose={() => setCreateDialogOpen(false)}
                    availableYears={availableYears}
                />
            </Box>
        </Container>
    );
}
