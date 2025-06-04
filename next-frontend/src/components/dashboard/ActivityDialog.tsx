'use client';

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Box,
    Alert,
    CircularProgress
} from '@mui/material';
import { Activity, ActivityType } from '@/types';

interface ActivityDialogProps {
    open: boolean;
    activity: Activity | null;
    onClose: () => void;
    onSave: (activity: Activity) => Promise<void>;
    error: string | null,
    loading: boolean
}

const activityTypes: { value: ActivityType; label: string }[] = [
    { value: 'UPSTREAM', label: 'Upstream' },
    { value: 'DOWNSTREAM', label: 'Downstream' }
];

export function ActivityDialog({ open, activity, onClose, onSave, error, loading = false }: ActivityDialogProps) {
    const [formData, setFormData] = useState({
        type: 'UPSTREAM' as ActivityType,
        name: '',
        description: '',
    });
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (activity && activity.id !== 'new') {
            setFormData({
                type: activity.type,
                name: activity.name,
                description: activity.description || '',
            });
        } else {
            setFormData({
                type: 'UPSTREAM',
                name: '',
                description: '',
            });
        }
    }, [activity, open]);

    const handleSave = async () => {
        try {
            await onSave({
                ...formData,
                id: activity?.id || 'undefined',
                contextId: activity?.contextId || 'undefined'
            });
        } catch (err) {
            console.error('Error saving activity:', err);
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        // Clear validation error for this field when user starts typing
        if (validationErrors[field]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleClose = () => {
        if (!loading) {
            setValidationErrors({});
            onClose();
        }
    };

    const isNewActivity = !activity || activity.id === 'new';

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 600 }}>
                {isNewActivity ? 'Add New Activity' : 'Edit Activity'}
            </DialogTitle>
            
            <DialogContent>
                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <FormControl fullWidth error={!!validationErrors.type}>
                        <InputLabel>Activity Type</InputLabel>
                        <Select
                            value={formData.type}
                            onChange={e => handleChange('type', e.target.value)}
                            label="Activity Type"
                            disabled={loading}
                        >
                            {activityTypes.map(type => (
                                <MenuItem key={type.value} value={type.value}>
                                    {type.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Activity Name"
                        value={formData.name}
                        onChange={e => handleChange('name', e.target.value)}
                        fullWidth
                        required
                        error={!!validationErrors.name}
                        helperText={validationErrors.name}
                        disabled={loading}
                        placeholder="Enter activity name..."
                    />

                    <TextField
                        label="Description"
                        value={formData.description}
                        onChange={e => handleChange('description', e.target.value)}
                        fullWidth
                        multiline
                        rows={3}
                        error={!!validationErrors.description}
                        helperText={validationErrors.description || 'Describe the activity and its role in your supply chain...'}
                        disabled={loading}
                        placeholder="Optional description..."
                    />
                </Box>

                {/* Error Alert */}
                {error && (
                    <Alert 
                        severity="error" 
                        sx={{ mt: 2 }}
                    >
                        {error}
                    </Alert>
                )}
            </DialogContent>
            
            <DialogActions sx={{ p: 3 }}>
                <Button 
                    onClick={handleClose}
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button 
                    variant="contained" 
                    onClick={handleSave}
                    disabled={loading || !formData.name.trim()}
                    startIcon={loading ? <CircularProgress size={16} /> : null}
                >
                    {loading 
                        ? 'Saving...' 
                        : `${isNewActivity ? 'Add' : 'Update'} Activity`
                    }
                </Button>
            </DialogActions>
        </Dialog>
    );
}
