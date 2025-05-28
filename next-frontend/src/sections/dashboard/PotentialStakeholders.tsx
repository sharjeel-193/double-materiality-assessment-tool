'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
} from '@mui/material';
import { MdAdd as AddIcon, MdDownload as DownloadIcon } from 'react-icons/md';
import { Stakeholder } from '@/lib/types';
import { StakeholderList, StakeholderDialog } from '@/components';
import { getDummyStakeholders } from '@/lib/dummyData';
import { downloadStakeholderMappingCSV } from '@/lib/csvHandlers';

export function PotentialStakeholders() {
    const [stakeholders, setStakeholders] = useState<Stakeholder[]>(getDummyStakeholders);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentStakeholder, setCurrentStakeholder] = useState<Stakeholder | null>(null);

    const handleAdd = () => {
        setCurrentStakeholder(null);
        setDialogOpen(true);
    };

    const handleEdit = (stakeholder: Stakeholder) => {
        setCurrentStakeholder(stakeholder);
        setDialogOpen(true);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this stakeholder?')) {
            setStakeholders(prev => prev.filter(s => s.id !== id));
        }
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setCurrentStakeholder(null);
    };

    const handleSave = (stakeholderData: Omit<Stakeholder, 'id'>) => {
        if (currentStakeholder) {
            // Edit existing
            setStakeholders(prev => 
                prev.map(s => s.id === currentStakeholder.id 
                    ? { ...stakeholderData, id: currentStakeholder.id }
                    : s
                )
            );
        } else {
            // Add new
            const newId = stakeholders.length ? Math.max(...stakeholders.map(s => s.id)) + 1 : 1;
            setStakeholders(prev => [...prev, { ...stakeholderData, id: newId }]);
        }
        handleDialogClose();
    };

    const downloadCSV = () => {
        downloadStakeholderMappingCSV(stakeholders)
    }
    return (
        <Box>
            <Paper sx={{ p: 4, borderRadius: 3 }}>
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 4 
                }}>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                            Potential Stakeholders
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Manage stakeholders who may be affected by or can influence your sustainability initiatives
                        </Typography>
                    </Box>
                    
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAdd}
                        sx={{ borderRadius: 2 }}
                    >
                        Add Stakeholder
                    </Button>
                </Box>

                <StakeholderList
                    stakeholders={stakeholders}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

                {/* CSV Download Button */}
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    mt: 4,
                    pt: 3,
                    borderTop: '1px solid',
                    borderColor: 'divider'
                }}>
                    <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={downloadCSV}
                        disabled={stakeholders.length === 0}
                        sx={{ 
                            borderRadius: 2,
                            px: 4,
                            py: 1.5,
                            fontWeight: 600
                        }}
                    >
                        Download Survey for Stakeholder Mapping
                    </Button>
                </Box>

                <StakeholderDialog
                    stakeholder={currentStakeholder}
                    open={dialogOpen}
                    onClose={handleDialogClose}
                    onSave={handleSave}
                />
            </Paper>
        </Box>
    );
}
