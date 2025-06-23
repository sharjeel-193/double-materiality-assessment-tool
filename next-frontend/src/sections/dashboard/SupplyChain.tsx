"use client"
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Stack,
  useTheme,

} from '@mui/material';
import { MdAdd as AddIcon, MdArrowForward as ArrowIcon } from 'react-icons/md';
import { ActivityList, ActivityDialog } from '@/components';
import { Activity, CreateActivityInput, UpdateActivityInput } from '@/types';
import { useCompanyContext } from '@/providers';

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
    const theme = useTheme();
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { company } = useCompanyContext()

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
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleDialogSave = async (activityData: Activity) => {
        try {
            if (currentActivity?.id === 'new') {
                const createInput: CreateActivityInput = {
                    name: activityData.name,
                    description: activityData.description || undefined,
                    type: activityData.type,
                    contextId: currentContextId
                };
                const result = await createActivity(createInput);
                if (!result) {
                    setError('Failed to Create Activity ... Please Try Again Later')
                    return;
                }
            } else if (currentActivity?.id) {
                const updateInput: UpdateActivityInput = {
                    name: activityData.name,
                    description: activityData.description || undefined,
                    type: activityData.type
                };
                const result = await updateActivity(currentActivity.id, updateInput);
                if (!result) {
                    setError('Failed to Update Activity ... Please Try Again Later')
                    return;
                }
            }
            handleDialogClose();
        } catch (error) {
            console.log("Error: ", error)
            setError('Error saving activity');
        }
    };

    const upstreamActivities = activities.filter(a => a.type === 'UPSTREAM');
    const downstreamActivities = activities.filter(a => a.type === 'DOWNSTREAM');

    return (
        <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, bgcolor: 'background.paper' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        Supply Chain Activities
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage your upstream and downstream supply chain processes.
                    </Typography>
                </Box>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />} 
                    onClick={handleAddActivity}
                    sx={{ borderRadius: 2, fontWeight: 600 }}
                >
                    Add Activity
                </Button>
            </Stack>

            {/* Supply Chain Flow Visualization */}
            <Stack
                direction={{ xs: 'column', lg: 'row' }}
                alignItems="center"
                justifyContent="center"
                spacing={3}
                mb={4}
            >
                {/* Upstream Activities */}
                <Box sx={{ flex: 1, minWidth: 250 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center', fontWeight: 600, color: 'primary.main' }}>
                        Upstream
                    </Typography>
                    <ActivityList
                        activities={upstreamActivities}
                        type="Upstream"
                        onEdit={handleEditActivity}
                        onDelete={handleDeleteActivity}
                    />
                </Box>

                {/* Flow Arrow */}
                <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', mx: 2 }}>
                    <ArrowIcon size={36} color={theme.palette.info.main} />
                </Box>

                {/* Company Node */}
                <Box sx={{ flex: '0 0 auto', textAlign: 'center', my: { xs: 2, lg: 0 } }}>
                    <Paper
                        elevation={4}
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
                            border: '3px solid',
                            borderColor: 'secondary.dark',
                            boxShadow: 3,
                        }}
                    >
                        {company?.name || 'Activities'}
                    </Paper>
                </Box>

                {/* Flow Arrow */}
                <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', mx: 2 }}>
                    <ArrowIcon size={36} color={theme.palette.info.main} />
                </Box>

                {/* Downstream Activities */}
                <Box sx={{ flex: 1, minWidth: 250 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center', fontWeight: 600, color: 'secondary.main' }}>
                        Downstream
                    </Typography>
                    <ActivityList
                        activities={downstreamActivities}
                        type="Downstream"
                        onEdit={handleEditActivity}
                        onDelete={handleDeleteActivity}
                    />
                </Box>
            </Stack>

            {/* Activity Summary */}
            <Stack direction="row" gap={2} justifyContent="center" flexWrap="wrap" mt={2}>
                <Chip 
                    label={`${upstreamActivities.length} Upstream`}
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                />
                <Chip 
                    label={`${downstreamActivities.length} Downstream`}
                    color="secondary"
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                />
            </Stack>

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
