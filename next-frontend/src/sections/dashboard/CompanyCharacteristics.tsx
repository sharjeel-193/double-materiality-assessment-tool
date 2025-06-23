'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Paper, Box, Button, Alert } from '@mui/material';
import { MdEdit as EditIcon, MdSave as SaveIcon, MdClose as CloseIcon, MdAdd as AddIcon } from 'react-icons/md';
import { CompanyInfoForm } from '@/components';
import { CompanyInfoDisplay } from '@/components/dashboard/CompanyInfoDisplay';
import { Context, CreateContextInput, UpdateContextInput } from '@/types';
import { useContextValidation } from '@/hooks';
import { useCompanyContext } from '@/providers';

interface CompanyCharacteristicsProps {
    contextData: Context | null;
    updateData: (input: UpdateContextInput) => Promise<Context | null>;
    createData: (input: CreateContextInput) => Promise<Context | null>;
    currentReportId?: string;
}

export function CompanyCharacteristics({ 
    contextData, 
    updateData, 
    createData, 
    currentReportId
}: CompanyCharacteristicsProps) {
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState<Partial<Context> | null>(contextData);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { validateContext } = useContextValidation();

    const { company } = useCompanyContext()

    useEffect(() => {
        setFormData(contextData);
        setIsEditMode(false);
        setError(null);
    }, [contextData]);

    const handleDataChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        setError(null); // Clear errors when user makes changes
    };

    const handleCreate = () => {
        setIsEditMode(true);
        setFormData({
            location: undefined,
            type: undefined,
            form: undefined,
            size_employees: undefined,
            size_revenue: undefined,
            customer_scope: undefined,
            supply_chain_scope: undefined,
            extra_details: undefined
        });
        setError(null);
    };

    const handleEdit = () => {
        setIsEditMode(true);
        setError(null);
    };

    const handleCancel = () => {
        setIsEditMode(false);
        setFormData(contextData);
        setError(null);
    };

    const handleSave = async () => {
        if (!formData) {
            setError('No data to save');
            return;
        }

        // Validate form data before saving
        const validationData = {
            ...formData,
            extra_details: formData.extra_details === null ? undefined : formData.extra_details
        };
        const validation = await validateContext(validationData);
        if (!validation.isValid) {
            setError('Please fix all validation errors before saving');
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            if (contextData) {
                // Update existing context
                const updateInput: UpdateContextInput = {
                    location: formData.location,
                    type: formData.type,
                    form: formData.form,
                    size_employees: formData.size_employees,
                    size_revenue: formData.size_revenue,
                    customer_scope: formData.customer_scope,
                    supply_chain_scope: formData.supply_chain_scope,
                    extra_details: formData.extra_details || undefined
                };
                await updateData(updateInput);
            } else {
                // Create new context
                if (!currentReportId) {
                    setError('No report selected');
                    return;
                }

                const createInput: CreateContextInput = {
                    location: formData.location!,
                    type: formData.type!,
                    form: formData.form!,
                    size_employees: formData.size_employees!,
                    size_revenue: formData.size_revenue!,
                    customer_scope: formData.customer_scope!,
                    supply_chain_scope: formData.supply_chain_scope!,
                    extra_details: formData.extra_details || undefined,
                    reportId: currentReportId
                };
                await createData(createInput);
            }
            setIsEditMode(false);
        } catch (error) {
            console.error('Save failed:', error);
            setError('Failed to save context. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Paper sx={{ p: 4, mb: 6, borderRadius: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Company Characteristics
                </Typography>
                
                {contextData && !isEditMode && (
                    <Button variant="outlined" startIcon={<EditIcon />} onClick={handleEdit}>
                        Edit
                    </Button>
                )}
                
                {isEditMode && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                            variant="outlined" 
                            startIcon={<CloseIcon />} 
                            onClick={handleCancel}
                            disabled={isSaving}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="contained" 
                            startIcon={<SaveIcon />} 
                            onClick={handleSave} 
                            disabled={isSaving}
                        >
                            {isSaving ? 'Saving...' : 'Save'}
                        </Button>
                    </Box>
                )}
            </Box>

            {/* Error Alert */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {/* Content */}
            {contextData === null && !isEditMode ? (
                // Create Context Component
                <Box sx={{ 
                    textAlign: 'center', 
                    py: 6,
                    bgcolor: 'primary.light',
                    borderRadius: 2,
                    border: '2px dashed',
                    borderColor: 'primary.main'
                }}>
                    <Typography variant="h6" color="secondary.main" gutterBottom>
                        Get Started with Your Company Context
                    </Typography>
                    <Typography variant="body1" color="text.primary" sx={{ mb: 3 }}>
                        Define your companys characteristics to begin your sustainability reporting journey.
                    </Typography>
                    <Button 
                        variant="contained" 
                        size="large" 
                        startIcon={<AddIcon />}
                        onClick={handleCreate}
                        sx={{ borderRadius: 3 }}
                    >
                        Create Company Context
                    </Button>
                </Box>
            ) : isEditMode ? (
                // Edit/Create Form
                <CompanyInfoForm 
                    data={formData}
                    onChange={handleDataChange}
                />
            ) : (
                // Display Mode
                <CompanyInfoDisplay data={contextData!} companyName={company?.name || ''} />
            )}
        </Paper>
    );
}
