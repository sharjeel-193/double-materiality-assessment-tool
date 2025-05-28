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
} from '@mui/material';
import { Activity } from '@/lib/types';


interface ActivityDialogProps {
    open: boolean;
    activity: Activity | null;
    onClose: () => void;
    onSave: (activity: Omit<Activity, 'id'>) => void;
}

const activityTypes = ['Upstream', 'Downstream'];

export function ActivityDialog({ open, activity, onClose, onSave }: ActivityDialogProps) {
    const [formData, setFormData] = useState({
        type: '',
        name: '',
        description: '',
    });

    useEffect(() => {
        if (activity) {
            setFormData({
                type: activity.type,
                name: activity.name,
                description: activity.description,
            });
        } else {
            setFormData({
                type: 'Upstream',
                name: '',
                description: '',
            });
        }
    }, [activity, open]);

    const handleSave = () => {
        if (!formData.name.trim()) {
            alert('Activity name is required');
            return;
        }
        onSave(formData);
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 600 }}>
                {activity?.id ? 'Edit Activity' : 'Add New Activity'}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <FormControl fullWidth>
                    <InputLabel>Activity Type</InputLabel>
                    <Select
                        value={formData.type}
                        onChange={e => handleChange('type', e.target.value)}
                        label="Activity Type"
                    >
                    {activityTypes.map(type => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                    </Select>
                </FormControl>

                <TextField
                    label="Activity Name"
                    value={formData.name}
                    onChange={e => handleChange('name', e.target.value)}
                    fullWidth
                    required
                />

                <TextField
                    label="Description"
                    value={formData.description}
                    onChange={e => handleChange('description', e.target.value)}
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Describe the activity and its role in your supply chain..."
                />
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSave}>
                    {activity?.id ? 'Update' : 'Add'} Activity
                </Button>
            </DialogActions>
        </Dialog>
    );
}
