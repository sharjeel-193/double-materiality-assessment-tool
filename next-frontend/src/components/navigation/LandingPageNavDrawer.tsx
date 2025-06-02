'use client';

import {
    Button,
    Box,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    useTheme,
} from '@mui/material';
import {
    MdClose as CloseIcon,
    MdDashboard as DashboardIcon
} from 'react-icons/md';
import Image from 'next/image';

import { useAuthContext, useThemeContext } from '@/providers';
import { ThemeSwitcher } from '../ui/ThemeSwitcher';
import { landingPageNavItems as navItems } from '@/data';
import Link from 'next/link';

interface LandingPageNavDrawerProps {
    isOpen: boolean;
    handleDrawerToggle: () => void;
    activeSection: string;
    scrollToSection: (sectionId: string) => void;
}

export function LandingPageNavDrawer({ 
    isOpen, 
    handleDrawerToggle, 
    activeSection, 
    scrollToSection 
}: LandingPageNavDrawerProps) {
    const { mode } = useThemeContext();
    const theme = useTheme();
    const { isAuthenticated } = useAuthContext()

    const handleSectionClick = (sectionId: string) => {
        scrollToSection(sectionId);
        handleDrawerToggle(); // Close drawer after scrolling
    };

    return (
        <Drawer
            variant="temporary"
            anchor="right"
            open={isOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
                keepMounted: true, // Better open performance on mobile
            }}
            sx={{
                display: { xs: 'block', md: 'none' },
                '& .MuiDrawer-paper': {
                    boxSizing: 'border-box',
                    width: 280,
                    bgcolor: 'background.paper',
                },
            }}
        >
            <Box sx={{ width: 280, height: '100%' }}>
                {/* Header */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                    }}
                >
                    <Image
                        src={`/logos/logo-${mode === 'light' ? 'dark' : 'light'}.png`}
                        alt="Double Materiality Tool"
                        width={120}
                        height={40}
                        style={{ objectFit: 'contain' }}
                    />
                    <IconButton 
                        onClick={handleDrawerToggle}
                        sx={{
                            transition: theme.transitions.create('transform', {
                                duration: theme.transitions.duration.shorter,
                            }),
                            '&:hover': {
                                transform: 'rotate(90deg)',
                            },
                        }}
                    >
                        <CloseIcon size={24} />
                    </IconButton>
                </Box>
                
                {/* Navigation Items */}
                <List sx={{ px: 2, py: 3, flexGrow: 1 }}>
                    {navItems.map((item) => (
                        <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                onClick={() => handleSectionClick(item.sectionId)}
                                selected={activeSection === item.sectionId}
                                sx={{
                                    borderRadius: 2,
                                    transition: theme.transitions.create(['background-color', 'transform'], {
                                        duration: theme.transitions.duration.shorter,
                                    }),
                                    '&:hover': {
                                        transform: 'translateX(4px)',
                                    },
                                    '&.Mui-selected': {
                                        bgcolor: 'primary.main',
                                        color: 'primary.contrastText',
                                        '&:hover': {
                                            bgcolor: 'primary.dark',
                                            transform: 'translateX(4px)',
                                        },
                                    },
                                }}
                            >
                                <ListItemText 
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        fontWeight: activeSection === item.sectionId ? 600 : 400,
                                        fontSize: '1rem',
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                
                {/* Bottom Actions */}
                <Box 
                    sx={{ 
                        p: 2, 
                        borderTop: '1px solid', 
                        borderColor: 'divider',
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: 2,
                        bgcolor: 'background.paper',
                    }}
                >
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        py: 1,
                    }}>
                        <ThemeSwitcher />
                    </Box>
                
                    <Link href={isAuthenticated? '/dashboard' : '/login'}>
                        <Button
                            variant="contained"
                            fullWidth
                            startIcon={<DashboardIcon size={20} />}
                            sx={{
                                py: 1.5,
                                borderRadius: 2,
                                fontWeight: 600,
                                textTransform: 'none',
                                transition: theme.transitions.create(['transform', 'box-shadow'], {
                                    duration: theme.transitions.duration.shorter,
                                }),
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: theme.shadows[4],
                                },
                            }}
                        >
                            Go To Dashboard
                        </Button>
                    </Link>
                </Box>
            </Box>
        </Drawer>
    );
}
