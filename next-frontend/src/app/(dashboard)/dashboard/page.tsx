"use client";

import { useCompanyContext } from '@/providers/CompanyContextProvider';
import {
    Container,
    Box,
    Typography
} from '@mui/material';


export default function DashboardPage() {
    const { company, loading } = useCompanyContext();

    if (loading) return <div>Loading company data...</div>;
    if (!company) return <div>No company data available.</div>;
    return (
        <Container maxWidth="lg">
            <Box
                sx={{
                    py: { xs: 8, md: 12 },
                    textAlign: 'center',
                }}
            >
                <Typography>
                    {company.name}
                </Typography>
            </Box>
        </Container>
    );
}
