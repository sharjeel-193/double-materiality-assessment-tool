"use client"
import React, { useState } from 'react';
import {
    Box,
    Typography,
    Stack,
    useTheme,
    Chip
} from '@mui/material';
import {
    Create as CreateIcon,
    Settings as ContextIcon,
    Business as ActivityIcon,
    People as StakeholderIcon,
    Score as ScoreIcon,
    Topic as TopicIcon,
    Assessment as ImpactIcon,
    AttachMoney as FinanceIcon
} from '@mui/icons-material';
import { Report } from '@/types';
import { ConfirmationDialog } from '../ui/ConfirmationDialog';

interface ReportStatusTimelineProps {
    status: number; // 1-8
    updateReportStatus: (status: number) => Promise<Report | null>;
}

const statusSteps = [
    { id: 1, label: 'Report Created', icon: <CreateIcon />, description: 'Initial report setup completed' },
    { id: 2, label: 'Context Finalized', icon: <ContextIcon />, description: 'Report context and scope defined' },
    { id: 3, label: 'Activities Recognized', icon: <ActivityIcon />, description: 'Business activities identified' },
    { id: 4, label: 'Potential Stakeholders Identified', icon: <StakeholderIcon />, description: 'Stakeholder mapping completed' },
    { id: 5, label: 'Stakeholders Scored', icon: <ScoreIcon />, description: 'Stakeholder prioritization finished' },
    { id: 6, label: 'Material Topics Identified', icon: <TopicIcon />, description: 'Material topics assessment done' },
    { id: 7, label: 'Impacts Identified', icon: <ImpactIcon />, description: 'Impact assessment completed' },
    { id: 8, label: 'Financial Effects Identified', icon: <FinanceIcon />, description: 'Financial impact analysis finished' },
];

export function ReportStatusTimeline({ status, updateReportStatus }: ReportStatusTimelineProps) {
    const theme = useTheme();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [currentStatus, setCurrentStatus] = useState<number | null>(status)
    const [isResetting, setIsResetting] = useState(false)
    

    const getStepStatus = (stepId: number) => {
        if (stepId <= status) return 'completed';
        if (stepId === status + 1) return 'current';
        return 'pending';
    };

    // Fixed: Return proper color objects with consistent structure
    const getStepColors = (stepStatus: string) => {
        switch (stepStatus) {
            case 'completed':
                return {
                    main: theme.palette.success.main,
                    contrastText: theme.palette.success.contrastText,
                };
            case 'current':
                return {
                    main: theme.palette.primary.main,
                    contrastText: theme.palette.primary.contrastText,
                };
            case 'pending':
                return {
                    main: theme.palette.text.disabled, // Use disabled text color
                    contrastText: theme.palette.text.disabled,
                };
            default:
                return {
                    main: theme.palette.text.disabled,
                    contrastText: theme.palette.text.disabled,
                };
        }
    };

    const handleUpdateStatus = (statusValue: number) => {
        // if(statusValue < status){
        //     setCurrentStatus(statusValue)
        //     setConfirmOpen(true)
        // } else {
        //     return
        // }
        setCurrentStatus(statusValue)
        setConfirmOpen(true)
        
    }

    // Actual delete function called after confirmation
    const confirmResetStatus= async () => {
        setIsResetting(true)
        console.log('Updateing ....', currentStatus)
        await updateReportStatus(currentStatus || status)
        setIsResetting(false)
    };

    // Cancel delete confirmation
    const handleCancelReset = () => {
        setConfirmOpen(false)
        setCurrentStatus(null)
        setIsResetting(false)
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 400 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                Report Progress
            </Typography>
            
            <Stack spacing={2}>
                {statusSteps.map((step, index) => {
                    const stepStatus = getStepStatus(step.id);
                    const stepColors = getStepColors(stepStatus);
                    const isLast = index === statusSteps.length - 1;

                    return (
                        <Box key={step.id} sx={{ position: 'relative' }}>
                            <Stack direction="row" spacing={2} alignItems="flex-start">
                                {/* Icon Circle */}
                                <Box
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: stepStatus === 'completed' || stepStatus === 'current' 
                                            ? stepColors.main 
                                            : 'transparent',
                                        border: `2px solid ${stepColors.main}`,
                                        color: stepStatus === 'completed' || stepStatus === 'current'
                                            ? stepColors.contrastText
                                            : stepColors.main,
                                        opacity: stepStatus === 'pending' ? 0.4 : 1,
                                        transition: 'all 0.3s ease',
                                        position: 'relative',
                                        zIndex: 2,
                                        flexShrink: 0
                                    }}
                                >
                                    {step.icon}
                                </Box>

                                {/* Content */}
                                <Box sx={{ flex: 1, pb: 2 }}>
                                    <Typography 
                                        variant="body1" 
                                        sx={{ 
                                            fontWeight: stepStatus === 'completed' || stepStatus === 'current' ? 600 : 400,
                                            color: stepStatus === 'pending' 
                                                ? theme.palette.text.disabled 
                                                : theme.palette.text.primary,
                                            mb: 0.5
                                        }}
                                    >
                                        {step.label}
                                    </Typography>
                                    
                                    <Typography 
                                        variant="body2" 
                                        sx={{ 
                                            color: stepStatus === 'pending' 
                                                ? theme.palette.text.disabled 
                                                : theme.palette.text.secondary,
                                            fontSize: '0.8rem',
                                            mb: 0.5
                                        }}
                                    >
                                        {step.description}
                                    </Typography>
                                    <Chip label={stepStatus.toUpperCase()} sx={{color: stepColors.main}} size='small' onClick={() => handleUpdateStatus(step.id)}/>
                                </Box>
                            </Stack>

                            {/* Connector Line */}
                            {!isLast && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        left: 23,
                                        top: 48,
                                        width: 2,
                                        height: 40,
                                        backgroundColor: stepStatus === 'completed' 
                                            ? theme.palette.success.main 
                                            : theme.palette.divider,
                                        opacity: stepStatus === 'pending' ? 0.3 : 1,
                                        zIndex: 1
                                    }}
                                />
                            )}
                        </Box>
                    );
                })}
            </Stack>
            <ConfirmationDialog
                open={confirmOpen}
                onClose={handleCancelReset}
                onConfirm={confirmResetStatus}
                variant="potential"
                title="Reset Report Status"
                message={`Are you sure you want to reset to Status ${currentStatus}?`}
                details="you would have to finish all the subsequence steps again"
                confirmText="Reset"
                cancelText="Cancel"
                loading={isResetting}
            />
        </Box>
    );
}
