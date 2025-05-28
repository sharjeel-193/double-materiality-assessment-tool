'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
} from '@mui/material';
import { MdAdd as AddIcon, MdArrowForward as ArrowIcon } from 'react-icons/md';
import { ActivityList, ActivityDialog } from '@/components';
import { Activity } from '@/lib/types'
import { getDummyActivities } from '@/lib/dummyData';



interface supplyChainProps {
    isEditMode: boolean;
}

export function SupplyChain({isEditMode}: supplyChainProps) {
    const [activities, setActivities] = useState<Activity[]>(getDummyActivities);

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);

    const handleAddActivity = () => {
        setCurrentActivity({ id: 0, type: 'Upstream', name: '', description: '' });
        setEditDialogOpen(true);
    };

    const handleEditActivity = (activity: Activity) => {
        setCurrentActivity({ ...activity });
        setEditDialogOpen(true);
    };

    const handleDeleteActivity = (id: number) => {
        setActivities(prev => prev.filter(act => act.id !== id));
    };

    const handleDialogClose = () => {
        setEditDialogOpen(false);
        setCurrentActivity(null);
    };

    const handleDialogSave = (activityData: Omit<Activity, 'id'>) => {
        if (currentActivity?.id === 0) {
            // Add new
            const newId = activities.length ? Math.max(...activities.map(a => a.id)) + 1 : 1;
            setActivities(prev => [...prev, { ...activityData, id: newId }]);
        } else if (currentActivity?.id) {
            // Update existing
            setActivities(prev => prev.map(a => a.id === currentActivity.id ? { ...activityData, id: currentActivity.id } : a));
        }
        handleDialogClose();
    };

    const upstreamActivities = activities.filter(a => a.type === 'Upstream');
    const downstreamActivities = activities.filter(a => a.type === 'Downstream');

    return (
        <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Supply Chain
            </Typography>
           {isEditMode &&  
           <Button 
                variant="outlined" 
                startIcon={<AddIcon />} 
                onClick={handleAddActivity}
                sx={{ borderRadius: 2 }}
            >
                Add Activity
            </Button>}
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
                isEditMode={isEditMode}
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
                isEditMode={isEditMode}
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
        />
        </Paper>
    );
}
