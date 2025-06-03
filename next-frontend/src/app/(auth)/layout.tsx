'use client';

import React, { Suspense } from 'react';
import { Box } from '@mui/material';
import Image from 'next/image';
import { useThemeContext } from '@/providers';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import { Loader } from '@/components';
import Link from 'next/link';

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
            <Suspense fallback={<Loader variant='overlay' />}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    {/* ThemeSwitcher at top right */}
                    <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                        <ThemeSwitcher />
                    </Box>

                    {/* Centered logo */}
                    <Link href={'/'}>
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
                    </Link>

                    {/* Page content below logo */}
                    <Box sx={{ width: '100%', maxWidth: 400 }}>
                        {children}
                    </Box>
                </Box>
            </Suspense>
        </Box>
    );
}
