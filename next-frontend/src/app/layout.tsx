
import { ThemeContextProvider, AuthContextProvider } from '@/providers';
// import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import React from 'react';
import './global.css'
import { ApolloWrapper } from '@/graphql/ApolloWrapper';
// import { RouteLoader } from '@/sections';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <ThemeContextProvider>
                    {/* <RouteLoader /> */}
                    <ApolloWrapper>
                        <AuthContextProvider>
                            {children}
                        </AuthContextProvider>
                    </ApolloWrapper>
                </ThemeContextProvider>
            </body>
        </html>
    );
}
