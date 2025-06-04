'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
} from '@mui/material';
import { MdAdd as AddIcon, MdArrowForward as ArrowIcon } from 'react-icons/md';
import { ActivityList, ActivityDialog } from '@/components';
import { Activity, CreateActivityInput, UpdateActivityInput } from '@/types';



interface supplyChainProps {
    activities: Activity[];
    createActivity: (input: CreateActivityInput) => Promise<Activity | null>;
    updateActivity: (id: string, input: UpdateActivityInput) => Promise<Activity | null>
    deleteActivity: (id: string) => Promise<boolean>;
    currentContextId: string;
}

export function SupplyChain({
    activities,
    createActivity,
    updateActivity,
    deleteActivity,
    currentContextId
}: supplyChainProps) {
    // const [activities, setActivities] = useState<Activity[]>(getDummyActivities);

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
    const [error, setError] = useState<string | null>(null)

    const handleAddActivity = () => {
        setCurrentActivity({ id: 'new', type: 'UPSTREAM', name: '', description: '', contextId: currentContextId });
        setEditDialogOpen(true);
    };

    const handleEditActivity = (activity: Activity) => {
        setCurrentActivity({ ...activity });
        setEditDialogOpen(true);
    };

    const handleDeleteActivity = (id: string) => {
        deleteActivity(id)
    };

    const handleDialogClose = () => {
        setEditDialogOpen(false);
        setCurrentActivity(null);
    };

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(null);
            }, 3000);

            // Cleanup function to clear timeout if component unmounts or error changes
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleDialogSave = async (activityData: Activity) => {
    try {
        if (currentActivity?.id === 'new') {
            // Create new activity
            const createInput: CreateActivityInput = {
                name: activityData.name,
                description: activityData.description || undefined,
                type: activityData.type,
                contextId: currentContextId
            };
            
            const result = await createActivity(createInput);
            if (!result) {
                setError('Failed to Create Activity ... Please Try Again Later')
                console.error('Failed to create activity');
                return;
            }
        } else if (currentActivity?.id) {
            // Update existing activity
            const updateInput: UpdateActivityInput = {
                name: activityData.name,
                description: activityData.description || undefined,
                type: activityData.type
            };
            
            const result = await updateActivity(currentActivity.id, updateInput);
            if (!result) {
                setError('Failed to Update Activity ... Please Try Again Later')
                console.error('Failed to update activity');
                return;
            }
        }
        
        handleDialogClose();
    } catch (error) {
        console.error('Error saving activity:', error);
        // Optionally show error message to user
    }
};


    const upstreamActivities = activities.filter(a => a.type === 'UPSTREAM');
    const downstreamActivities = activities.filter(a => a.type === 'DOWNSTREAM');

    return (
        <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Supply Chain
            </Typography>
            <Button 
                variant="outlined" 
                startIcon={<AddIcon />} 
                onClick={handleAddActivity}
                sx={{ borderRadius: 2 }}
            >
                Add Activity
            </Button>
        </Box>

        {/* Supply Chain Flow Visualization */}
        <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: 3,
            flexWrap: { xs: 'wrap', lg: 'nowrap' },
            mb: 4 
        }}>
            {/* Upstream Activities */}
            <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 30%' }, minWidth: 250 }}>
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', fontWeight: 600 }}>
                Upstream Activities
            </Typography>
            <ActivityList
                activities={upstreamActivities}
                type="Upstream"
                onEdit={handleEditActivity}
                onDelete={handleDeleteActivity}
            />
            </Box>

            {/* Flow Arrow */}
            <Box sx={{ 
                display: { xs: 'none', lg: 'flex' }, 
                alignItems: 'center',
                color: 'text.secondary' 
            }}>
                <ArrowIcon size={32} />
            </Box>

            {/* Company Node */}
            <Box sx={{ 
                    flex: '0 0 auto', 
                    textAlign: 'center',
                    order: { xs: -1, lg: 0 }
                }}
            >
                <Paper
                    sx={{
                        width: 120,
                        height: 120,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'secondary.main',
                        color: 'secondary.contrastText',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        mx: 'auto',
                        mb: { xs: 2, lg: 0 },
                        border: '3px solid',
                        borderColor: 'secondary.dark',
                        boxShadow: 3,
                    }}
                >
                    Your Company
                </Paper>
            </Box>

            {/* Flow Arrow */}
            <Box sx={{ 
                    display: { xs: 'none', lg: 'flex' }, 
                    alignItems: 'center',
                    color: 'text.secondary' 
                }}
            >
                <ArrowIcon size={32} />
            </Box>

            {/* Downstream Activities */}
            <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 30%' }, minWidth: 250 }}>
            <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', fontWeight: 600 }}>
                Downstream Activities
            </Typography>
            <ActivityList
                activities={downstreamActivities}
                type="Downstream"
                onEdit={handleEditActivity}
                onDelete={handleDeleteActivity}
            />
            </Box>
        </Box>

        {/* Activity Summary */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Chip 
                label={`${upstreamActivities.length} Upstream Activities`}
                color="primary"
                variant="outlined"
            />
            <Chip 
                label={`${downstreamActivities.length} Downstream Activities`}
                color="secondary"
                variant="outlined"
            />
        </Box>

        {/* Activity Dialog */}
        <ActivityDialog
            open={editDialogOpen}
            activity={currentActivity}
            onClose={handleDialogClose}
            onSave={handleDialogSave}
            error={error}
            loading={false}
        />
        </Paper>
    );
}
