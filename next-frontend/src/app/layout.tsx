
import { ThemeContextProvider } from '@/providers';
// import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import React from 'react';
import './global.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <ThemeContextProvider>
                    {children}
                </ThemeContextProvider>
            </body>
        </html>
    );
}
