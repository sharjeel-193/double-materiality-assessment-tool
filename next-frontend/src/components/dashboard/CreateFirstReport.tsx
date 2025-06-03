// components/reports/CreateFirstReport.tsx
'use client';

import { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Alert,
} from '@mui/material';
import { CalendarToday as CalendarIcon } from '@mui/icons-material';
import { useReportContext } from '@/providers';

export function CreateFirstReport() {
    const [year, setYear] = useState(new Date().getFullYear());
    const [error, setError] = useState('');
    const { createReport, loading } = useReportContext();

    const handleCreateReport = async () => {
        if (year < 2020 || year > new Date().getFullYear() + 1) {
            setError('Please enter a valid year');
            return;
        }

        setError('');
        const report = await createReport(year);
        
        if (!report) {
            setError('Failed to create report. Please try again.');
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '60vh',
            }}
        >
            <Card sx={{ maxWidth: 500, width: '100%' }}>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <CalendarIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                    
                    <Typography variant="h5" gutterBottom>
                        Create Your First Report
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Get started with your sustainability reporting journey by creating your first report.
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <TextField
                        fullWidth
                        label="Report Year"
                        type="number"
                        value={year}
                        onChange={(e) => setYear(parseInt(e.target.value) || new Date().getFullYear())}
                        sx={{ mb: 3 }}
                        inputProps={{
                            min: 2020,
                            max: new Date().getFullYear() + 1,
                        }}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        onClick={handleCreateReport}
                        disabled={loading}
                        sx={{ py: 1.5 }}
                    >
                        {loading ? 'Creating Report...' : 'Create Report'}
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
}
