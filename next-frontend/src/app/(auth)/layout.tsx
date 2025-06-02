'use client';

import React from 'react';
import { Box } from '@mui/material';
import Image from 'next/image';
import { useThemeContext } from '@/providers';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';

export default function AuthLayout({ 
    children 
}: { children: React.ReactNode }) {
    const { mode } = useThemeContext();

    return (
        <Box 
        sx={{ 
            minHeight: '100vh', 
            position: 'relative', 
            bgcolor: 'background.default', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            p: 2 
        }}
        >
        {/* ThemeSwitcher at top right */}
        <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
            <ThemeSwitcher />
        </Box>

        {/* Centered logo */}
        <Box sx={{ mb: 3 }}>
            <Image
                src={`/logos/logo-${mode === 'light' ? 'dark' : 'light'}.png`}
                alt="Double Materiality Tool"
                width={180}
                height={60}
                style={{ objectFit: 'contain' }}
                priority
            />
        </Box>

        {/* Page content below logo */}
        <Box sx={{ width: '100%', maxWidth: 400 }}>
            {children}
        </Box>
        </Box>
    );
}
