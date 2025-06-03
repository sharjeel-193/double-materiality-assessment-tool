'use client';

import React from 'react';
import {
    Dialog,
    DialogContent,
    Button,
    Typography,
    Box,
    Stack,
    IconButton,
    useTheme,
    alpha,
    Fade,
    Slide
} from '@mui/material';
import {
    Warning as WarningIcon,
    CheckCircle as CheckCircleIcon,
    Info as InfoIcon,
    Close as CloseIcon,
    Delete as DeleteIcon,
    Check as ConfirmIcon
} from '@mui/icons-material';
import { Loader } from '@/components';

type ConfirmationVariant = 'danger' | 'normal' | 'potential';

interface ConfirmationDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    variant?: ConfirmationVariant;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
    details?: string;
}

const variantConfig = {
    danger: {
        icon: WarningIcon,
        colorKey: 'error',
        defaultTitle: 'Delete Item',
        defaultConfirmText: 'Delete',
    },
    normal: {
        icon: CheckCircleIcon,
        colorKey: 'success',
        defaultTitle: 'Confirm Action',
        defaultConfirmText: 'Confirm',
    },
    potential: {
        icon: InfoIcon,
        colorKey: 'info',
        defaultTitle: 'Information',
        defaultConfirmText: 'Continue',
    }
} as const;


export function ConfirmationDialog({
    open,
    onClose,
    onConfirm,
    variant = 'normal',
    title,
    message,
    confirmText,
    cancelText = 'Cancel',
    loading = false,
    details
}: ConfirmationDialogProps) {
    const theme = useTheme();
    
    const config = variantConfig[variant];
    
    const IconComponent = config.icon;
    const colorKey = config.colorKey as 'error' | 'success' | 'info';

    const handleConfirm = () => {
        if (!loading) onConfirm();
    };

    const handleClose = () => {
        if (!loading) onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="xs"
            fullWidth
            slotProps={{
                paper:{
                    sx: {
                        borderRadius: 4,
                        boxShadow: theme.shadows[24] || '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        border: 'none',
                        overflow: 'hidden',
                        backgroundColor: theme.palette.background.paper
                    }
                },
                transition: {
                    dir:'up',
                    timeout: 300
                }
            }}
            slots={{
                transition: Slide,
            }}
        >
            <DialogContent sx={{ p: 0, position: 'relative' }}>
                {/* Close Button */}
                <IconButton
                    onClick={handleClose}
                    disabled={loading}
                    sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        zIndex: 1,
                        backgroundColor: alpha(theme.palette.action.hover, 0.5),
                        '&:hover': {
                            backgroundColor: theme.palette.action.hover
                        }
                    }}
                    size="small"
                >
                    <CloseIcon fontSize="small" />
                </IconButton>

                {/* Main Content */}
                <Box sx={{ px: 4, py: 5, textAlign: 'center' }}>
                    {/* Icon */}
                    <Fade in={open} timeout={600}>
                        <Box
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                backgroundColor: alpha(theme.palette[colorKey].main, 0.1),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 24px auto',
                                border: `3px solid ${alpha(theme.palette[colorKey].main, 0.2)}`
                            }}
                        >
                            <IconComponent 
                                sx={{ 
                                    fontSize: 40, 
                                    color: theme.palette[colorKey].main
                                }} 
                            />
                        </Box>
                    </Fade>

                    {/* Title */}
                    <Typography 
                        variant="h5" 
                        sx={{ 
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            mb: 2,
                            fontSize: '1.5rem'
                        }}
                    >
                        {title || config.defaultTitle}
                    </Typography>

                    {/* Message */}
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            color: theme.palette.text.secondary,
                            mb: details ? 2 : 4,
                            lineHeight: 1.6,
                            fontSize: '1rem'
                        }}
                    >
                        {message}
                    </Typography>


                    {/* Warning for danger variant */}
                    {variant === 'danger' && (
                        <Box 
                            sx={{ 
                                p: 2,
                                backgroundColor: alpha(theme.palette.error.main, 0.1),
                                borderRadius: 2,
                                mb: 4,
                                border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`
                            }}
                        >
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    color: theme.palette.error.main,
                                    fontSize: '0.8rem',
                                    fontWeight: 500
                                }}
                            >
                                {details ? details : 'This Action cannot be undone!'}
                            </Typography>
                        </Box>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <Box sx={{ mb: 4 }}>
                            <Loader variant="button" message="Processing..." size={16} />
                        </Box>
                    )}

                    {/* Action Buttons */}
                    <Stack direction="row" spacing={3} sx={{ justifyContent: 'center' }}>
                        <Button
                            onClick={handleClose}
                            disabled={loading}
                            variant="outlined"
                            sx={{
                                minWidth: 100,
                                height: 48,
                                borderRadius: 3,
                                fontWeight: 500,
                                fontSize: '0.95rem',
                                borderColor: theme.palette.divider,
                                color: theme.palette.text.secondary,
                                textTransform: 'none',
                                '&:hover': {
                                    borderColor: theme.palette.action.active,
                                    backgroundColor: alpha(theme.palette.action.hover, 0.5)
                                }
                            }}
                        >
                            {cancelText}
                        </Button>

                        <Button
                            onClick={handleConfirm}
                            disabled={loading}
                            variant="contained"
                            color={colorKey}
                            startIcon={loading ? null : (variant === 'danger' ? <DeleteIcon /> : <ConfirmIcon />)}
                            sx={{
                                minWidth: 120,
                                height: 48,
                                borderRadius: 3,
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                textTransform: 'none',
                                boxShadow: `0 4px 14px 0 ${alpha(theme.palette[colorKey].main, 0.3)}`,
                                '&:hover': {
                                    boxShadow: `0 6px 20px 0 ${alpha(theme.palette[colorKey].main, 0.4)}`,
                                    transform: 'translateY(-1px)'
                                },
                                '&:active': {
                                    transform: 'translateY(0)'
                                },
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {loading ? 'Processing...' : (confirmText || config.defaultConfirmText)}
                        </Button>
                    </Stack>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
