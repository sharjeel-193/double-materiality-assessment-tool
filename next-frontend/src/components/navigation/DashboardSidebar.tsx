'use client';

import React from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Drawer,
} from '@mui/material';

import { useRouter, usePathname } from 'next/navigation';
import { useThemeContext, useReportContext } from '@/providers';
import Image from 'next/image';
import { dashboardNavItems as navigationItems } from '@/data';

const DRAWER_WIDTH = 280;

// Assessment phases based on report status
const ASSESSMENT_PHASES = [
    { status: 1, label: 'Report Created', description: 'Initial setup' },
    { status: 2, label: 'Context Finalized', description: 'Scope defined' },
    { status: 3, label: 'Activities Recognized', description: 'Business activities mapped' },
    { status: 4, label: 'Stakeholders Identified', description: 'Key stakeholders mapped' },
    { status: 5, label: 'Stakeholders Scored', description: 'Stakeholder prioritization done' },
    { status: 6, label: 'Material Topics Identified', description: 'Topic materiality assessed' },
    { status: 7, label: 'Impacts Identified', description: 'Impact assessment completed' },
    { status: 8, label: 'Financial Effects Identified', description: 'Financial analysis completed' },
];

interface DashboardSidebarProps {
    mobileOpen?: boolean;
    onMobileClose?: () => void;
}

export function DashboardSidebar({ mobileOpen = false, onMobileClose }: DashboardSidebarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { mode } = useThemeContext();
    const { currentReport, reportLoading } = useReportContext();

    // Calculate progress based on current report status
    const getProgressData = () => {
        if (!currentReport || reportLoading) {
            return {
                percentage: 0,
                currentPhase: 'Loading...',
                phaseDescription: 'Fetching report data',
                completedPhases: 0,
                totalPhases: ASSESSMENT_PHASES.length
            };
        }

        const status = currentReport.status || 1;
        const percentage = Math.min((status / ASSESSMENT_PHASES.length) * 100, 100);
        const currentPhaseData = ASSESSMENT_PHASES.find(phase => phase.status === status) || ASSESSMENT_PHASES[0];
        
        return {
            percentage: Math.round(percentage),
            currentPhase: currentPhaseData.label,
            phaseDescription: currentPhaseData.description,
            completedPhases: Math.max(status - 1, 0), // Completed phases are status - 1
            totalPhases: ASSESSMENT_PHASES.length
        };
    };

    const progressData = getProgressData();

    // Get progress bar color based on completion
    const getProgressColor = () => {
        if (progressData.percentage === 100) return 'success.main';
        if (progressData.percentage >= 75) return 'info.main';
        if (progressData.percentage >= 50) return 'warning.main';
        if (progressData.percentage >= 25) return 'primary.main';
        return 'primary.main';
    };

    const handleNavigation = (path: string) => {
        router.push(path);
        // Close mobile drawer after navigation
        if (onMobileClose) {
            onMobileClose();
        }
    };

    const isActive = (path: string) => {
        if (path === '/dashboard') {
            return pathname === '/dashboard';
        }
        return pathname.startsWith(path);
    };

    const sidebarContent = (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.paper',
                width: DRAWER_WIDTH,
            }}
        >
            {/* Logo Section */}
            <Box
                sx={{
                    px: 3,
                    py: 2,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <Image
                    src={`/logos/logo-${mode === 'light' ? 'dark':'light'}.png`}
                    alt="MatriQ"
                    width={120}
                    height={30}
                    style={{ 
                        objectFit: 'contain',
                        objectPosition: 'left center',
                        display: 'block',
                    }}
                    priority
                />
            </Box>

            {/* Main Navigation */}
            <Box sx={{ flexGrow: 1, py: 2 }}>
                <List sx={{ px: 2 }}>
                    {navigationItems.map((item) => (
                        <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                onClick={() => handleNavigation(item.path)}
                                selected={isActive(item.path)}
                                sx={{
                                    borderRadius: 2,
                                    py: 1.5,
                                    '&.Mui-selected': {
                                        bgcolor: 'primary.main',
                                        color: 'primary.contrastText',
                                        '&:hover': {
                                            bgcolor: 'primary.dark',
                                        },
                                        '& .MuiListItemIcon-root': {
                                            color: 'primary.contrastText',
                                        },
                                    },
                                    '&:hover': {
                                        bgcolor: 'action.hover',
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    <item.icon size={24} />
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                {item.label}
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>

            {/* Dynamic Progress Indicator */}
            <Box
                sx={{
                    mx: 2,
                    mb: 2,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'action.hover',
                    border: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Typography variant="caption" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
                    Assessment Progress
                </Typography>
                
                {/* Progress Bar */}
                <Box
                    sx={{
                        width: '100%',
                        height: 8,
                        bgcolor: 'background.paper',
                        borderRadius: 4,
                        overflow: 'hidden',
                        mb: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Box
                        sx={{
                            width: `${progressData.percentage}%`,
                            height: '100%',
                            bgcolor: getProgressColor(),
                            borderRadius: 4,
                            transition: 'width 0.3s ease-in-out',
                        }}
                    />
                </Box>

                {/* Progress Info */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {progressData.completedPhases} of {progressData.totalPhases} phases completed
                    </Typography>
                    <Typography variant="caption" sx={{ color: getProgressColor(), fontWeight: 600 }}>
                        {progressData.percentage}%
                    </Typography>
                </Box>

                {/* Current Phase */}
                {!reportLoading && currentReport && (
                    <Box>
                        <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', color: 'text.primary' }}>
                            Current: {progressData.currentPhase}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                            {progressData.phaseDescription}
                        </Typography>
                    </Box>
                )}

                {/* Loading state */}
                {reportLoading && (
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Loading assessment data...
                    </Typography>
                )}

                {/* No report state */}
                {!reportLoading && !currentReport && (
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        No active report found
                    </Typography>
                )}
            </Box>
        </Box>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <Box
                component="nav"
                sx={{
                    width: DRAWER_WIDTH,
                    flexShrink: 0,
                    display: { xs: 'none', lg: 'block' },
                }}
            >
                <Box
                    sx={{
                        width: DRAWER_WIDTH,
                        height: '100vh',
                        position: 'fixed',
                        borderRight: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    {sidebarContent}
                </Box>
            </Box>

            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={onMobileClose}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: 'block', lg: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: DRAWER_WIDTH,
                    },
                }}
            >
                {sidebarContent}
            </Drawer>
        </>
    );
}
