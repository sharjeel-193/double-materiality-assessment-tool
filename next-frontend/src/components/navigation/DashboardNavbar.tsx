'use client';

import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    Box,
} from '@mui/material';
import {
    MdMenu as MenuIcon,
    MdAccountCircle as AccountCircleIcon,
    MdLogout as LogoutIcon,
    MdSettings as SettingsIcon,
    MdNotifications as NotificationsIcon,
} from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { useAuthContext, useThemeContext } from '@/providers';
import { ThemeSwitcher } from '../ui/ThemeSwitcher';
import Image from 'next/image';
import Link from 'next/link';

interface DashboardNavbarProps {
    onMobileMenuToggle?: () => void; // Add prop for mobile menu toggle
}

export function DashboardNavbar({ onMobileMenuToggle }: DashboardNavbarProps) {

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { isAuthenticated, logout, user }= useAuthContext()

    const { mode } = useThemeContext();
    const router = useRouter();

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout()
        router.push('/');
        handleClose();
    };

    const handleProfile = () => {
        router.push('/profile');
        handleClose();
    };

    const handleSettings = () => {
        router.push('/settings');
        handleClose();
    };

    return (
        <AppBar
            position="sticky"
            sx={{
                bgcolor: 'background.paper',
                color: 'text.primary',
                borderBottom: '1px solid',
                borderColor: 'divider',
                boxShadow: 'none',
                zIndex: 10
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {/* Mobile menu button - Fixed */}
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={onMobileMenuToggle} // Use the prop function
                        sx={{ 
                            display: { lg: 'none' },
                            transition: 'transform 0.2s ease-in-out',
                            '&:hover': {
                                transform: 'scale(1.1)',
                            },
                        }}
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* Logo for mobile */}
                    <Link href={'/'}>
                        <Box>
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
                    </Link>
                    
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {/* Notifications */}
                    <IconButton
                        size="large"
                        color="inherit"
                        sx={{ display: { xs: 'none', sm: 'block' } }}
                    >
                        <NotificationsIcon />
                    </IconButton>

                    {/* Theme Switcher */}
                    <ThemeSwitcher />
                    
                    {/* User Menu */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
                        <Typography
                            variant="body2"
                            sx={{
                                display: { xs: 'none', sm: 'block' },
                                fontWeight: 500,
                            }}
                        >
                            UN
                        </Typography>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <Avatar
                                sx={{
                                    width: 36,
                                    height: 36,
                                    bgcolor: 'primary.main',
                                    fontSize: '1rem',
                                }}
                            >
                                UN
                            </Avatar>
                        </IconButton>
                    </Box>

                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        sx={{ mt: 1 }}
                    >
                        <MenuItem>
                            {isAuthenticated ? user?.name: ''}
                        </MenuItem>
                        <MenuItem onClick={handleProfile}>
                            <AccountCircleIcon  />
                            Profile
                        </MenuItem>
                        <MenuItem onClick={handleSettings}>
                            <SettingsIcon  />
                            Settings
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                            <LogoutIcon  />
                            Logout
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
