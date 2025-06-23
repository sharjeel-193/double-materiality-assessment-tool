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
import { StakeholderList, StakeholderDialog, Loader } from '@/components';
import { createCSV } from '@/lib/csvHandlers'; // Make sure this is imported
import { useReportContext } from '@/providers';
import { ActivityLabel } from '@/types'
import { useActivity } from '@/hooks';

interface PotentialStakeholdersProps {
    stakeholdersList: Stakeholder[],
    loading: boolean,
    createStakeholder: (input: CreateStakeholderInput) => Promise<Stakeholder | null>;
    updateStakeholder: (id: string, input: UpdateStakeholderInput) => Promise<Stakeholder | null>;
    deleteStakeholder: (id: string) => Promise<boolean>;
}

export function PotentialStakeholders({stakeholdersList, createStakeholder, updateStakeholder, deleteStakeholder, loading}: PotentialStakeholdersProps) {
    const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentStakeholder, setCurrentStakeholder] = useState<Stakeholder | null>(null);
    const { currentReport } = useReportContext()

    const { getActivitiesByContext, activities } = useActivity();
    const [activityLabels, setActivityLabels] = useState<ActivityLabel[]>([]);

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
        const headers = ['id', 'name', 'description', 'influence', 'impact'];
        const csvRows = stakeholders.map(s => [
            s.id,
            s.name,
            s.description || '',
            '', // influence (empty)
            '', // impact (empty)
        ]);
        const csvContent = [
            headers.join(','),
            ...csvRows.map(row =>
                row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(',')
            )
        ].join('\n');

        createCSV(csvContent, 'stakeholder-mapping-survey.csv');
    };


    useEffect(() => {
        setStakeholders(stakeholdersList)
        
    }, [stakeholdersList])

    useEffect(() => {
        if (currentReport?.context?.id) {
            console.log("Calling Activity LAbels")
            getActivitiesByContext(currentReport.context.id);
        }
    }, [currentReport?.context?.id, getActivitiesByContext]);

    useEffect(() => {
        if (activities) {
            const activityLabelsList = activities.map(activity => ({
                id: activity.id,
                name: activity.name,
                type: activity.type,
            }));
            console.log("Activity Labels Benig Formed")
            setActivityLabels(activityLabelsList);
        }
    }, [activities]);

    return (
        <Box>
            {loading?
            <Loader message='Loading Stakeholders Data ...' />:
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
                    activityLabels={activityLabels}
                />
            </Paper>}
        </Box>
    );
}
