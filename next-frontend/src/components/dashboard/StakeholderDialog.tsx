'use client';

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
} from '@mui/material';
import { Stakeholder } from '@/lib/types';

export interface StakeholderFormProps {
    stakeholder: Stakeholder | null;
    open: boolean;
    onClose: () => void;
    onSave: (stakeholder: Omit<Stakeholder, 'id'>) => void;
}

export function StakeholderDialog({ stakeholder, open, onClose, onSave }: StakeholderFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        description: '',
    });

    useEffect(() => {
        if (stakeholder) {
        setFormData({
            name: stakeholder.name,
            contact: stakeholder.contact,
            description: stakeholder.description,
        });
        } else {
        setFormData({
            name: '',
            contact: '',
            description: '',
        });
        }
    }, [stakeholder, open]);

    const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [field]: event.target.value }));
    };

    const handleSubmit = () => {
        if (!formData.name.trim() || !formData.contact.trim()) {
            alert('Name and contact are required fields');
        return;
        }
        onSave(formData);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
            {stakeholder ? 'Edit Stakeholder' : 'Add New Stakeholder'}
        </DialogTitle>
        
        <DialogContent>
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                    label="Stakeholder Name"
                    value={formData.name}
                    onChange={handleChange('name')}
                    fullWidth
                    required
                    placeholder="e.g., Environmental Protection Agency"
                />

                <TextField
                    label="Contact Information"
                    value={formData.contact}
                    onChange={handleChange('contact')}
                    fullWidth
                    required
                    placeholder="e.g., contact@organization.com or +1-234-567-8900"
                />

                <TextField
                    label="Description"
                    value={formData.description}
                    onChange={handleChange('description')}
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Describe the stakeholder's role, interests, and relationship to your organization..."
                />

            
            </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
            <Button onClick={onClose}>
                Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
                {stakeholder ? 'Update' : 'Add'} Stakeholder
            </Button>
        </DialogActions>
        </Dialog>
    );
}
