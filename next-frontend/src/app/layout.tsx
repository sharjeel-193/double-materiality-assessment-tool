
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import React from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <AppRouterCacheProvider options={{ enableCssLayer: true }}>
                    {children}
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
