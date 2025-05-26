'use client';

import React, { useState, useEffect } from 'react';
import { IconButton, Box } from '@mui/material';
import { useThemeContext } from '@/providers';

export function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false);
    const { mode, toggleColorMode } = useThemeContext();

    // Only render after hydration to avoid mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    // Show a placeholder during SSR/hydration
    if (!mounted) {
        return (
            <IconButton
                sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                bgcolor: 'grey.300',
                border: '2px solid',
                borderColor: 'grey.400',
                }}
            >
                <Box
                    sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        bgcolor: 'grey.500',
                    }}
                />
            </IconButton>
        );
    }

    return (
        <IconButton
            onClick={toggleColorMode}
            sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease-in-out',
                bgcolor: mode === 'dark' ? 'grey.800' : 'grey.100',
                border: '2px solid',
                borderColor: mode === 'dark' ? 'grey.600' : 'grey.300',
                '&:hover': {
                bgcolor: mode === 'dark' ? 'grey.700' : 'grey.200',
                transform: 'scale(1.1)',
                borderColor: 'primary.main',
                },
            }}
        >
            {/* Moon Icon for Dark Mode */}
            <Box
                sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                transition: 'all 0.4s ease-in-out',
                opacity: mode === 'dark' ? 1 : 0,
                rotate: mode === 'dark' ? '0deg' : '180deg',
                scale: mode === 'dark' ? 1 : 0.5,
                fontSize: '20px',
                }}
            >
                🌙
            </Box>
            
            {/* Sun Icon for Light Mode */}
            <Box
                sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                transition: 'all 0.4s ease-in-out',
                opacity: mode === 'light' ? 1 : 0,
                rotate: mode === 'light' ? '0deg' : '-180deg',
                scale: mode === 'light' ? 1 : 0.5,
                fontSize: '20px',
                }}
            >
                ☀️
            </Box>
        </IconButton>
    );
}
