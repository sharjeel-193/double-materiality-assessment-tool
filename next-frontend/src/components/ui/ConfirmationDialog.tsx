// components/ui/ConfirmationDialog.tsx
'use client';

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Alert
} from '@mui/material';
import {
    Warning as WarningIcon,
    CheckCircle as CheckCircleIcon,
    Info as InfoIcon,
    Close as CloseIcon
} from '@mui/icons-material';

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
        iconColor: 'error.main',
        alertSeverity: 'error' as const,
        confirmButtonColor: 'error' as const,
        confirmButtonVariant: 'contained' as const,
        defaultTitle: 'Confirm Deletion',
        defaultConfirmText: 'Delete',
        backgroundColor: 'background.default',
        borderColor: 'error.main'
    },
    normal: {
        icon: CheckCircleIcon,
        iconColor: 'success.main',
        alertSeverity: 'success' as const,
        confirmButtonColor: 'success' as const,
        confirmButtonVariant: 'contained' as const,
        defaultTitle: 'Confirm Action',
        defaultConfirmText: 'Confirm',
        backgroundColor: 'background.default',
        borderColor: 'success.main'
    },
    potential: {
        icon: InfoIcon,
        iconColor: 'secondary.main',
        alertSeverity: 'info' as const,
        confirmButtonColor: 'secondary' as const,
        confirmButtonVariant: 'contained' as const,
        defaultTitle: 'Confirm Changes',
        defaultConfirmText: 'Continue',
        backgroundColor: 'background.default',
        borderColor: 'secondary.main'
    }
};

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
    const config = variantConfig[variant];
    const IconComponent = config.icon;

    const handleConfirm = () => {
        onConfirm();
    };

    const handleClose = () => {
        if (!loading) {
            onClose();
        }
    };

   

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                        sx={{
                            p: 1,
                            borderRadius: '50%',
                            backgroundColor: config.backgroundColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <IconComponent 
                            sx={{ 
                                fontSize: 28, 
                                color: config.iconColor 
                            }} 
                        />
                    </Box>
                    <Typography variant="h6" component="div" fontWeight="bold">
                        {title || config.defaultTitle}
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ pt: 1 }}>
                <Alert 
                    severity={config.alertSeverity} 
                    variant="outlined"
                    sx={{ mb: 2 }}
                >
                    <Typography variant="body1">
                        {message}
                    </Typography>
                </Alert>

                {details && (
                    <Box sx={{ 
                        mt: 2, 
                        p: 2, 
                        bgcolor: 'grey.50', 
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'grey.300'
                    }}>
                        <Typography variant="body2" color="text.secondary">
                            <strong>Details:</strong> {details}
                        </Typography>
                    </Box>
                )}

                {variant === 'danger' && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="error.main" fontWeight="medium">
                            ⚠️ This action cannot be undone.
                        </Typography>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                <Button
                    onClick={handleClose}
                    disabled={loading}
                    variant="outlined"
                    color="inherit"
                    startIcon={<CloseIcon />}
                    sx={{ minWidth: 100 }}
                >
                    {cancelText}
                </Button>
                
                <Button
                    onClick={handleConfirm}
                    disabled={loading}
                    variant={config.confirmButtonVariant}
                    color={config.confirmButtonColor}
                    startIcon={loading ? null : <IconComponent />}
                    sx={{ 
                        minWidth: 120,
                        fontWeight: 'bold'
                    }}
                >
                    {loading ? 'Processing...' : (confirmText || config.defaultConfirmText)}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
