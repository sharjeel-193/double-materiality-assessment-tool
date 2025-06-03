// components/reports/CreateReportDialog.tsx
'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Alert,
    Box,
    Typography,
    CircularProgress
} from '@mui/material';
import { CalendarToday as CalendarIcon } from '@mui/icons-material';
import { useReportContext } from '@/providers';

interface CreateReportDialogProps {
    open: boolean;
    onClose: () => void;
    availableYears: number[];
}

export function CreateReportDialog({ open, onClose, availableYears }: CreateReportDialogProps) {
    const [year, setYear] = useState(new Date().getFullYear());
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); // ✅ Local loading state
    const { createReport, loading } = useReportContext();

    const handleClose = () => {
        setError('');
        setYear(new Date().getFullYear());
        onClose();
    };

    const handleCreateReport = async () => {
        // Clear previous errors
        setError('');
        
        // Validation
        if (year < 2020 || year > new Date().getFullYear() + 1) {
            setError('Please enter a valid year between 2020 and ' + (new Date().getFullYear() + 1));
            return;
        }

        if (availableYears.includes(year)) {
            setError('A report for this year already exists');
            return;
        }

        try {
            setIsSubmitting(true); // ✅ Set loading state
            
            const report = await createReport(year);
            
            if (report) {
                // ✅ Only close on successful creation
                handleClose();
            } else {
                // ✅ Show error and keep dialog open
                setError('Failed to create report. Please try again.');
                setIsSubmitting(false);
            }
            
        } catch (err) {
            console.error('Error creating report:', err);
            setError('An unexpected error occurred. Please try again.');
            setIsSubmitting(false); // ✅ Reset loading on error
        }
    };

    const isLoading = loading || isSubmitting; // ✅ Combined loading state

    return (
        <Dialog 
            open={open} 
            onClose={isLoading ? undefined : handleClose} // ✅ Prevent closing during loading
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarIcon color="primary" />
                    Create New Report
                </Box>
            </DialogTitle>
            
            <DialogContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Create a new sustainability report for your company.
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
                    sx={{ mt: 1 }}
                    disabled={isLoading} // ✅ Disable during loading
                    // inputProps={{
                    //     min: 2000,
                    //     max: new Date().getFullYear() + 1,
                    // }}
                    slotProps={{
                        htmlInput: {
                            min: 2000,
                            max: new Date().getFullYear() + 1
                        }
                    }}
                    
                />
            </DialogContent>
            
            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button 
                    onClick={handleClose} 
                    disabled={isLoading} // ✅ Disable cancel during loading
                >
                    Cancel
                </Button>
                <Button 
                    onClick={handleCreateReport} 
                    variant="contained"
                    disabled={isLoading} // ✅ Use combined loading state
                    startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : null}
                >
                    {isLoading ? 'Creating...' : 'Create Report'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
