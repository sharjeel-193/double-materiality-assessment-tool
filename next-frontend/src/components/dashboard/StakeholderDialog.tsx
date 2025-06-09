'use client';

import React, { useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    MenuItem,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ActivityLabel, Stakeholder } from '@/types';
import { useActivity } from '@/hooks';
import { useReportContext } from '@/providers';

export interface StakeholderFormProps {
    stakeholder: Stakeholder | null;
    open: boolean;
    onClose: () => void;
    onSave: (stakeholderData: Stakeholder) => void;
}

// 1. Define Zod schema
const stakeholderSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    activityId: z.string().min(1, 'Activity is required'),
});

type StakeholderFormValues = z.infer<typeof stakeholderSchema>;

export function StakeholderDialog({
    stakeholder,
    open,
    onClose,
    onSave,
}: StakeholderFormProps) {
    const { getActivitiesByContext, activities } = useActivity();
    const { currentReport } = useReportContext();
    const [activityLabels, setActivityLabels] = React.useState<ActivityLabel[]>([]);

    // 2. Set up react-hook-form with zod
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isValid, isSubmitting },
    } = useForm<StakeholderFormValues>({
        resolver: zodResolver(stakeholderSchema),
        mode: 'onChange',
        defaultValues: {
            name: '',
            description: '',
            activityId: '',
        },
    });

    // 3. Populate form on edit
    useEffect(() => {
        if (stakeholder) {
            reset({
                name: stakeholder.name,
                description: stakeholder.description || '',
                activityId: stakeholder.activity?.id || '',
            });
        } else {
            reset({
                name: '',
                description: '',
                activityId: '',
            });
        }
    }, [stakeholder, open, reset]);

    // 4. Fetch activity labels
    useEffect(() => {
        if (currentReport?.context?.id) {
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
            setActivityLabels(activityLabelsList);
        }
    }, [activities]);


    // 5. Submit handler
    const onSubmit = (data: StakeholderFormValues) => {
        const submitdata = {
            id: '',
            description: data?.description || '',
            activity: undefined,
            ...data
        }
        onSave(submitdata);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 600 }}>
                {stakeholder ? 'Edit Stakeholder' : 'Add New Stakeholder'}
            </DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <DialogContent>
                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <TextField
                            label="Stakeholder Name"
                            {...register('name')}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                            fullWidth
                            required
                            placeholder="e.g., Environmental Protection Agency"
                        />

                        <TextField
                            label="Activity"
                            select
                            {...register('activityId')}
                            error={!!errors.activityId}
                            helperText={errors.activityId?.message}
                            fullWidth
                            required
                            value={watch('activityId') || ''}
                        >
                            <MenuItem value="">Select an activity</MenuItem>
                            {activityLabels.map((activity) => (
                                <MenuItem key={activity.id} value={activity.id}>
                                    {activity.name}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Description"
                            {...register('description')}
                            error={!!errors.description}
                            helperText={errors.description?.message}
                            fullWidth
                            multiline
                            rows={3}
                            placeholder="Describe the stakeholder's role, interests, and relationship to your organization..."
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        type="submit"
                        disabled={!isValid || isSubmitting}
                    >
                        {stakeholder ? 'Update' : 'Add'} Stakeholder
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
