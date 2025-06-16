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
    InputAdornment,
    Divider
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Close, TrendingUp, TrendingDown, Speed, Timeline, AccountTree } from '@mui/icons-material';
import { ImpactType, OrderOfImpact, CreateImpactInput } from '@/types';
import { Loader } from '@/components';

interface CreateImpactDialogProps {
    open: boolean;
    onClose: () => void;
    onCreate: (input: CreateImpactInput) => Promise<void>;
    reportId: string;
}

const impactTypeMenu: { 
    value: ImpactType; 
    label: string; 
    color: 'error' | 'success'; 
    description: string;
    icon: React.ReactNode;
}[] = [
    { 
        value: 'NEGATIVE', 
        label: 'Negative', 
        color: 'error',
        description: 'Harmful impact on environment or society',
        icon: <TrendingDown fontSize="small" />
    },
    { 
        value: 'POSITIVE', 
        label: 'Positive', 
        color: 'success',
        description: 'Beneficial impact on environment or society',
        icon: <TrendingUp fontSize="small" />
    }
];

const orderOfImpactMenu: { 
    value: OrderOfImpact; 
    label: string; 
    description: string;
    icon: React.ReactNode;
}[] = [
    { 
        value: 'IMMEDIATE', 
        label: 'Immediate', 
        description: 'Direct, first-order effects',
        icon: <Speed fontSize="small" />
    },
    { 
        value: 'ENABLING', 
        label: 'Enabling', 
        description: 'Indirect, second-order effects',
        icon: <Timeline fontSize="small" />
    },
    { 
        value: 'STRUCTURAL', 
        label: 'Structural', 
        description: 'System-wide, transformational effects',
        icon: <AccountTree fontSize="small" />
    }
];

// Enhanced Zod schema
const createImpactSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters').trim(),
    description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters').trim(),
    scale: z.number()
        .min(0.1, 'Scale must be greater than 0')
        .max(5, 'Scale must be 5 or less'),
    scope: z.number()
        .min(0.1, 'Scope must be greater than 0')
        .max(5, 'Scope must be 5 or less'),
    irremediability: z.number()
        .min(0.1, 'Irremediability must be greater than 0')
        .max(5, 'Irremediability must be 5 or less'),
    likelihood: z.number()
        .min(0.1, 'Likelihood must be greater than 0')
        .max(5, 'Likelihood must be 5 or less'),
    type: z.enum(['POSITIVE', 'NEGATIVE'] as const),
    orderOfEffect: z.enum(['IMMEDIATE', 'ENABLING', 'STRUCTURAL'] as const),
    topicId: z.string().min(1, 'Topic ID is required').trim()
});

type CreateImpactFormData = z.infer<typeof createImpactSchema>;

export function CreateImpactDialog({ open, onClose, onCreate, reportId }: CreateImpactDialogProps) {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting, isValid }
    } = useForm<CreateImpactFormData>({
        resolver: zodResolver(createImpactSchema),
        defaultValues: {
            title: '',
            description: '',
            scale: 0,
            scope: 0,
            irremediability: 0,
            likelihood: 0,
            type: 'POSITIVE',
            orderOfEffect: 'IMMEDIATE',
            topicId: ''
        },
        mode: 'onChange'
    });

    const onSubmit = async (data: CreateImpactFormData) => {
        try {
            await onCreate({
                ...data,
                reportId
            });
            
            reset();
            onClose();
        } catch (error) {
            console.error('Error creating impact:', error);
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Dialog 
            open={open} 
            onClose={handleClose} 
            maxWidth="md" 
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
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
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                        Create Impact Assessment
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Define environmental and social impacts with detailed metrics
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
                                    label="Impact Title"
                                    placeholder="e.g., Water consumption reduction from efficient processes"
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
                                    label="Impact Description"
                                    placeholder="Provide detailed explanation of the environmental or social impact..."
                                    error={!!errors.description}
                                    helperText={errors.description?.message || `${field.value.length}/500 characters`}
                                    multiline
                                    rows={3}
                                    fullWidth
                                    variant="outlined"
                                />
                            )}
                        />

                        {/* Type Selection */}
                        <Controller
                            name="type"
                            control={control}
                            render={({ field }) => (
                                <Box>
                                    <TextField
                                        {...field}
                                        select
                                        label="Impact Type"
                                        error={!!errors.type}
                                        helperText={errors.type?.message}
                                        fullWidth
                                        variant="outlined"
                                    >
                                        {impactTypeMenu.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    {option.icon}
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

                        {/* Order of Effect Selection */}
                        <Controller
                            name="orderOfEffect"
                            control={control}
                            render={({ field }) => (
                                <Box>
                                    <TextField
                                        {...field}
                                        select
                                        label="Order of Impact"
                                        error={!!errors.orderOfEffect}
                                        helperText={errors.orderOfEffect?.message}
                                        fullWidth
                                        variant="outlined"
                                    >
                                        {orderOfImpactMenu.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    {option.icon}
                                                    <Chip 
                                                        label={option.label} 
                                                        color="primary"
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

                        <Divider sx={{ my: 2 }} />

                        {/* Impact Metrics */}
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            Impact Metrics
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Controller
                                    name="scale"
                                    control={control}
                                    render={({ field: { onChange, value, ...field } }) => (
                                        <TextField
                                            {...field}
                                            label="Scale"
                                            type="number"
                                            placeholder="1.0"
                                            slotProps={{
                                                htmlInput: {
                                                    max: 5,
                                                    min: 0,
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
                                            value={value}
                                            onChange={(e) => onChange(Number(e.target.value))}
                                            onFocus={(e) => e.target.select()}
                                            error={!!errors.scale}
                                            helperText={errors.scale?.message || "Size of the impact (0.1 - 5.0)"}
                                            fullWidth
                                            variant="outlined"
                                        />
                                    )}
                                />
                            </Grid>
                            
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Controller
                                    name="scope"
                                    control={control}
                                    render={({ field: { onChange, value, ...field } }) => (
                                        <TextField
                                            {...field}
                                            label="Scope"
                                            type="number"
                                            placeholder="1.0"
                                            slotProps={{
                                                htmlInput: {
                                                    max: 5,
                                                    min: 0,
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
                                            value={value}
                                            onChange={(e) => onChange(Number(e.target.value))}
                                            onFocus={(e) => e.target.select()}
                                            error={!!errors.scope}
                                            helperText={errors.scope?.message || "Breadth of impact (0.1 - 5.0)"}
                                            fullWidth
                                            variant="outlined"
                                        />
                                    )}
                                />
                            </Grid>
                            
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Controller
                                    name="irremediability"
                                    control={control}
                                    render={({ field: { onChange, value, ...field } }) => (
                                        <TextField
                                            {...field}
                                            label="Irremediability"
                                            type="number"
                                            placeholder="1.0"
                                            slotProps={{
                                                htmlInput: {
                                                    max: 5,
                                                    min: 0,
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
                                            value={value}
                                            onChange={(e) => onChange(Number(e.target.value))}
                                            onFocus={(e) => e.target.select()}
                                            error={!!errors.irremediability}
                                            helperText={errors.irremediability?.message || "How hard to reverse (0.1 - 5.0)"}
                                            fullWidth
                                            variant="outlined"
                                        />
                                    )}
                                />
                            </Grid>
                            
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
                                            slotProps={{
                                                htmlInput: {
                                                    max: 5,
                                                    min: 0,
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
                                            value={value}
                                            onChange={(e) => onChange(Number(e.target.value))}
                                            onFocus={(e) => e.target.select()}
                                            error={!!errors.likelihood}
                                            helperText={errors.likelihood?.message || "Probability of occurrence (0.1 - 5.0)"}
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
                                    helperText={errors.topicId?.message || "The topic this impact relates to"}
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
                        sx={{ minWidth: 140 }}
                    >
                        {isSubmitting ? (
                            <Loader variant="button" message="Creating Impact ..." size={16} />
                        ) : (
                            'Create Impact'
                        )}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
