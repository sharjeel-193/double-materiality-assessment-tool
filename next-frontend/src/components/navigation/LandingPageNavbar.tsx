'use client';

import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Button,
    Box,
    Container,
    IconButton,
    useScrollTrigger,
    Slide,
    useTheme,
    useMediaQuery,
    alpha
} from '@mui/material';
import {
    MdMenu as MenuIcon,
    MdDashboard as DashboardIcon
} from 'react-icons/md'
import Image from 'next/image';

import { useThemeContext } from '@/providers';
import { ThemeSwitcher } from '../ui/ThemeSwitcher';
import { LandingPageNavDrawer } from './LandingPageNavDrawer';
import { landingPageNavItems as navItems } from '@/data';

function HideOnScroll({ children }: { children: React.ReactElement }) {
    const trigger = useScrollTrigger({
        threshold: 100,
    });

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

export function LandingPageNavbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');
    const [isScrolled, setIsScrolled] = useState(false);
    
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const { mode } = useThemeContext();

    // Handle scroll effects
    useEffect(() => {
        const handleScroll = () => {
        const scrollPosition = window.scrollY;
        setIsScrolled(scrollPosition > 50);

        // Update active section based on scroll position
        const sections = navItems.map(item => item.sectionId);
        const currentSection = sections.find(section => {
            const element = document.getElementById(section);
            if (element) {
                const rect = element.getBoundingClientRect();
                return rect.top <= 100 && rect.bottom >= 100;
            }
            return false;
        });

        if (currentSection) {
            setActiveSection(currentSection);
        }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const headerOffset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
        setMobileOpen(false);
    };

    return (
        <>
        <HideOnScroll>
            <AppBar
                position="fixed"
                elevation={isScrolled ? 4 : 0}
                sx={{
                    bgcolor: isScrolled 
                    ? alpha(theme.palette.background.paper, 0.95)
                    : 'transparent',
                    backdropFilter: isScrolled ? 'blur(10px)' : 'none',
                    borderBottom: isScrolled ? '1px solid' : 'none',
                    borderColor: 'divider',
                    transition: theme.transitions.create(['background-color', 'backdrop-filter', 'border'], {
                        duration: theme.transitions.duration.standard,
                    }),
                }}
            >
            <Container maxWidth="xl">
                <Toolbar
                    sx={{
                        justifyContent: 'space-between',
                        py: { xs: 1, md: 1.5 },
                        minHeight: { xs: 64, md: 72 },
                    }}
                >
                {/* Logo */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            transition: 'transform 0.2s ease-in-out',
                            '&:hover': {
                                transform: 'scale(1.05)',
                            },
                        }}
                        onClick={() => scrollToSection('hero')}
                    >
                        <Image
                            src={`/logos/logo-${mode === 'light' ? 'dark' : 'light'}.png`}
                            alt="MatriQ - Double Materiality Tool"
                            width={isMobile ? 140 : 160}
                            height={isMobile ? 35 : 40}
                            style={{ 
                                objectFit: 'contain',
                                objectPosition: 'left center', // Align logo to left
                                display: 'block',
                            }}
                            priority
                        />
                    </Box>

                    {/* Desktop Navigation */}
                    <Box
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        {navItems.map((item) => (
                        <Button
                            key={item.label}
                            onClick={() => scrollToSection(item.sectionId)}
                            sx={{
                                color: activeSection === item.sectionId ? 'primary.main' : 'text.primary',
                                fontWeight: activeSection === item.sectionId ? 600 : 500,
                                px: 2.5,
                                py: 1,
                                borderRadius: 2,
                                position: 'relative',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    bgcolor: 'action.hover',
                                    transform: 'translateY(-1px)',
                                },
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: 0,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: activeSection === item.sectionId ? '80%' : '0%',
                                    height: 2,
                                    bgcolor: 'primary.main',
                                    borderRadius: 1,
                                    transition: 'width 0.3s ease-in-out',
                                },
                            }}
                        >
                            {item.label}
                        </Button>
                        ))}
                    </Box>

                    {/* Desktop Actions */}
                    <Box
                        sx={{
                        display: { xs: 'none', md: 'flex' },
                        alignItems: 'center',
                        gap: 2,
                        }}
                    >
                        <ThemeSwitcher />
                        
                        <Button
                        variant="contained"
                        startIcon={<DashboardIcon />}
                        sx={{
                            px: 3,
                            py: 1.2,
                            borderRadius: 2,
                            fontWeight: 600,
                            textTransform: 'none',
                            boxShadow: 2,
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: 4,
                            },
                        }}
                        >
                        Go To Dashboard
                        </Button>
                    </Box>

                    {/* Mobile Menu Button */}
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{
                            display: { md: 'none' },
                            transition: 'transform 0.2s ease-in-out',
                            '&:hover': {
                                transform: 'scale(1.1)',
                            },
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </Container>
            </AppBar>
        </HideOnScroll>

        <LandingPageNavDrawer isOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} activeSection={activeSection} scrollToSection={scrollToSection} />
        </>
    );
}
