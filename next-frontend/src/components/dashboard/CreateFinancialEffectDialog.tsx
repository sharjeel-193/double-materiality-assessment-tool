"use client"

import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Stack,
    Grid,
    Typography,
    Box,
    Chip,
    IconButton,
    InputAdornment
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Close } from '@mui/icons-material';
import { FinancialType, CreateFinancialEffectInput } from '@/types';
import { Loader } from '../ui/Loader';

interface CreateFinancialEffectDialogProps {
    open: boolean;
    onClose: () => void;
    onCreate: (input: CreateFinancialEffectInput) => Promise<void>;
    reportId: string;
}

const financialTypeMenu: { value: FinancialType; label: string; color: 'error' | 'success'; description: string }[] = [
    { 
        value: 'RISK', 
        label: 'Risk', 
        color: 'error',
        description: 'Potential negative financial impact'
    },
    { 
        value: 'OPPORTUNITY', 
        label: 'Opportunity', 
        color: 'success',
        description: 'Potential positive financial impact'
    }
];

// Enhanced Zod schema with better validation
const createFinancialEffectSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters').trim(),
    description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters').trim(),
    likelihood: z.number()
        .min(0.1, 'Likelihood must be greater than 0')
        .max(5, 'Likelihood must be 5 or less')
        .refine(val => Number(val.toFixed(1)) === val, 'Only one decimal place allowed'),
    magnitude: z.number()
        .min(0.1, 'Magnitude must be greater than 0')
        .max(5, 'Magnitude must be 5 or less')
        .refine(val => Number(val.toFixed(1)) === val, 'Only one decimal place allowed'),
    type: z.enum(['RISK', 'OPPORTUNITY'] as const),
    topicId: z.string().min(1, 'Topic ID is required').trim()
});

type CreateFinancialEffectFormData = z.infer<typeof createFinancialEffectSchema>;

export function CreateFinancialEffectDialog({ open, onClose, onCreate, reportId }: CreateFinancialEffectDialogProps) {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting, isValid }
    } = useForm<CreateFinancialEffectFormData>({
        resolver: zodResolver(createFinancialEffectSchema),
        defaultValues: {
            title: '',
            description: '',
            likelihood: 0, // Start with empty string to avoid the 0 issue
            magnitude: 0,  // Start with empty string to avoid the 0 issue
            type: 'RISK',
            topicId: ''
        },
        mode: 'onChange' // Enable real-time validation
    });


    const onSubmit = async (data: CreateFinancialEffectFormData) => {
        try {
            await onCreate({
                ...data,
                reportId
            });
            
            reset();
            onClose();
        } catch (error) {
            console.error('Error creating financial effect:', error);
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    // Custom number input handler that prevents the 0 default issue
    const handleNumberChange = (onChange: (value: number) => void) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
            onChange(numValue);
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={handleClose} 
            maxWidth="md" 
            fullWidth
            slotProps={{
                paper:{
                    sx: {
                        borderRadius: 3,
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                    }
                }
            }}
        >
            {/* Enhanced Header */}
            <DialogTitle sx={{ 
                pb: 1, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                borderBottom: '1px solid',
                borderColor: 'divider'
            }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }} color='primary'>
                        Create Financial Effect
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Define potential financial risks and opportunities
                    </Typography>
                </Box>
                <IconButton onClick={handleClose} size="small">
                    <Close />
                </IconButton>
            </DialogTitle>

            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent sx={{ pt: 3 }}>
                    <Stack spacing={3}>
                        {/* Title Field */}
                        <Controller
                            name="title"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Title"
                                    placeholder="e.g., Revenue decline from climate regulations"
                                    error={!!errors.title}
                                    helperText={errors.title?.message || `${field.value.length}/100 characters`}
                                    fullWidth
                                    variant="outlined"
                                />
                            )}
                        />
                        
                        {/* Description Field */}
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Description"
                                    placeholder="Provide detailed explanation of the financial effect..."
                                    error={!!errors.description}
                                    helperText={errors.description?.message || `${field.value.length}/500 characters`}
                                    multiline
                                    rows={3}
                                    fullWidth
                                    variant="outlined"
                                />
                            )}
                        />

                        {/* Type Selection with Visual Enhancement */}
                        <Controller
                            name="type"
                            control={control}
                            render={({ field }) => (
                                <Box>
                                    <TextField
                                        {...field}
                                        select
                                        label="Financial Effect Type"
                                        error={!!errors.type}
                                        helperText={errors.type?.message}
                                        fullWidth
                                        variant="outlined"
                                    >
                                        {financialTypeMenu.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Chip 
                                                        label={option.label} 
                                                        color={option.color}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {option.description}
                                                    </Typography>
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Box>
                            )}
                        />

                        {/* Enhanced Number Inputs */}
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Controller
                                    name="likelihood"
                                    control={control}
                                    render={({ field: { onChange, value, ...field } }) => (
                                        <TextField
                                            {...field}
                                            label="Likelihood"
                                            type="number"
                                            placeholder="1.0"
                                            value={value}
                                            onChange={handleNumberChange(onChange)}
                                            onFocus={(e) => e.target.select()} // Select all on focus for easy replacement
                                            slotProps={{
                                                htmlInput: {
                                                    max: 5,
                                                    min: 0.1,
                                                    step: 0.1
                                                },
                                                input: {
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <Typography variant="caption" color="text.secondary">
                                                                /5.0
                                                            </Typography>
                                                        </InputAdornment>
                                                    )
                                                }
                                            }}
                                            error={!!errors.likelihood}
                                            helperText={errors.likelihood?.message || "How likely is this to occur? (0.1 - 5.0)"}
                                            fullWidth
                                            variant="outlined"
                                        />
                                    )}
                                />
                            </Grid>
                            
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Controller
                                    name="magnitude"
                                    control={control}
                                    render={({ field: { onChange, value, ...field } }) => (
                                        <TextField
                                            {...field}
                                            label="Magnitude"
                                            type="number"
                                            placeholder="1.0"
                                            value={value}
                                            onChange={handleNumberChange(onChange)}
                                            onFocus={(e) => e.target.select()} // Select all on focus for easy replacement
                                            slotProps={{
                                                htmlInput: {
                                                    max: 5,
                                                    min: 0.1,
                                                    step: 0.1
                                                },
                                                input: {
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <Typography variant="caption" color="text.secondary">
                                                                /5.0
                                                            </Typography>
                                                        </InputAdornment>
                                                    )
                                                }
                                            }}
                                            error={!!errors.magnitude}
                                            helperText={errors.magnitude?.message || "What's the financial impact? (0.1 - 5.0)"}
                                            fullWidth
                                            variant="outlined"
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>

                        {/* Topic ID Field */}
                        <Controller
                            name="topicId"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Topic ID"
                                    placeholder="Enter the topic identifier"
                                    error={!!errors.topicId}
                                    helperText={errors.topicId?.message || "The topic this financial effect relates to"}
                                    fullWidth
                                    variant="outlined"
                                />
                            )}
                        />
                    </Stack>
                </DialogContent>

                {/* Enhanced Actions */}
                <DialogActions sx={{ 
                    p: 3, 
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    gap: 2
                }}>
                    <Button 
                        onClick={handleClose} 
                        disabled={isSubmitting}
                        variant="outlined"
                        size="large"
                    >
                        Cancel
                    </Button>
                    <Button 
                        type="submit"
                        variant="contained" 
                        disabled={isSubmitting || !isValid}
                        size="large"
                        sx={{ minWidth: 120 }}
                    >
                        {isSubmitting ? <Loader variant="button" message="Creating Financial Effect ..." /> : 'Create Effect'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
