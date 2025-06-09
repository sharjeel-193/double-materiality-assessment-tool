'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
} from '@mui/material';
import { MdAdd as AddIcon, MdDownload as DownloadIcon } from 'react-icons/md';
import { CreateStakeholderInput, Stakeholder, UpdateStakeholderInput } from '@/types';
import { StakeholderList, StakeholderDialog } from '@/components';
import { downloadStakeholderMappingCSV } from '@/lib/csvHandlers';

interface PotentialStakeholdersProps {
    stakeholdersList: Stakeholder[],
    createStakeholder: (input: CreateStakeholderInput) => Promise<Stakeholder | null>;
    updateStakeholder: (id: string, input: UpdateStakeholderInput) => Promise<Stakeholder | null>;
    deleteStakeholder: (id: string) => Promise<boolean>;
}

export function PotentialStakeholders({stakeholdersList, createStakeholder, updateStakeholder, deleteStakeholder}: PotentialStakeholdersProps) {
    const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
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

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this stakeholder?')) {
            deleteStakeholder(id)
        }
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setCurrentStakeholder(null);
    };

    const handleSave = async (stakeholderData: Stakeholder) => {
        let result;
        if (currentStakeholder) {
           const updateInput: UpdateStakeholderInput = {
                name: stakeholderData.name,
                description: stakeholderData.description || '',
                activityId: stakeholderData.activityId
            };
            result = await updateStakeholder(
                currentStakeholder.id,
                updateInput
            )
        } else {
            const createInput: CreateStakeholderInput = {
                name: stakeholderData.name,
                description: stakeholderData.description || '',
                activityId: stakeholderData.activityId
            };
            result = await createStakeholder(createInput);
        }
        if(result){
            handleDialogClose()
        }
    };

    const downloadCSV = () => {
        // downloadStakeholderMappingCSV(stakeholders)
    }

    useEffect(() => {
        setStakeholders(stakeholdersList)
        
    }, [stakeholdersList])
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
