// components/reports/ReportSelector.tsx
'use client';

import { useState } from 'react';
import {
    Box,
    ToggleButton,
    ToggleButtonGroup,
} from '@mui/material';
import { useReportContext } from '@/providers';
import { ConfirmationDialog } from '@/components';

export function ReportSelector() {
    const { 
        availableYears, 
        selectedYear, 
        setSelectedYear
    } = useReportContext();

    const [confirmDialog, setConfirmDialog] = useState(false);
    const [newYearSelection, setNewYearSelection] = useState<number | null>(null);

    if (availableYears.length === 0) return null;

    const sortedYears = [...availableYears].sort((a, b) => b - a);

    const handleYearChange = (year: number) => {
        if (year === selectedYear) return;
        
        setNewYearSelection(year);
        setConfirmDialog(true);
    };

    const handleConfirmChange = () => {
        if (newYearSelection) {
            setSelectedYear(newYearSelection);
        }
        setConfirmDialog(false);
        setNewYearSelection(null);
    };

    const handleCancelChange = () => {
        setConfirmDialog(false);
        setNewYearSelection(null);
    };

    return (
        <>
            <Box sx={{ mb: 2, textAlign:'right' }}>
                <ToggleButtonGroup
                    value={selectedYear}
                    exclusive
                    onChange={(_, value) => value && handleYearChange(value)}
                >
                    {sortedYears.map((year) => (
                        <ToggleButton key={year} value={year}>
                            {year}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
            </Box>

            {/* Confirmation Dialog */}
            <ConfirmationDialog 
                open={confirmDialog}
                onClose={handleCancelChange}
                onConfirm={handleConfirmChange}
                variant='normal'
                message='Are you sure you want to change the reporting year for whole dashboard?'
                title='Confirm'
            />
            {/* <Dialog open={confirmDialog} onClose={handleCancelChange}>
                <DialogTitle>Confirm Report Change</DialogTitle>
                <DialogContent>
                    <Typography>
                        Switch from <strong>{selectedYear}</strong> to <strong>{newYearSelection}</strong>?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelChange}>Cancel</Button>
                    <Button onClick={handleConfirmChange} variant="contained">
                        Switch to {newYearSelection}
                    </Button>
                </DialogActions>
            </Dialog> */}
        </>
    );
}
