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
import { useThemeContext } from '@/providers';
import Image from 'next/image';
import { dashboardNavItems as navigationItems } from '@/data';

const DRAWER_WIDTH = 280;


interface DashboardSidebarProps {
    mobileOpen?: boolean;
    onMobileClose?: () => void;
}

export function DashboardSidebar({ mobileOpen = false, onMobileClose }: DashboardSidebarProps) {

    const router = useRouter();
    const pathname = usePathname();
    const { mode } = useThemeContext();

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
                        objectPosition: 'left center', // Align logo to left
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

            {/* Progress Indicator */}
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
                <Box
                    sx={{
                        width: '100%',
                        height: 6,
                        bgcolor: 'background.paper',
                        borderRadius: 3,
                        overflow: 'hidden',
                        mb: 1,
                    }}
                >
                    <Box
                        sx={{
                            width: '35%',
                            height: '100%',
                            bgcolor: 'primary.main',
                            borderRadius: 3,
                        }}
                    />
                </Box>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    2 of 5 phases completed
                </Typography>
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

            {/* Mobile Drawer - Fixed */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={onMobileClose}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile
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
