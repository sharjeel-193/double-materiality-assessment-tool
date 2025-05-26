'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
    ThemeProvider as MuiThemeProvider,
    CssBaseline 
} from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { createAppTheme } from '../theme';

interface ThemeContextType {
    toggleColorMode: () => void;
    mode: 'light' | 'dark';
    setMode: (mode: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeContext must be used within a ThemeProvider');
    }
    return context;
};

interface ThemeContextProviderProps {
    children: ReactNode;
}

export function ThemeContextProvider({ children }: ThemeContextProviderProps) {
    // Default to dark mode
    const [mode, setModeState] = useState<'light' | 'dark'>('dark');
    const [mounted, setMounted] = useState(false);

    // Persist theme preference in localStorage
    useEffect(() => {
        setMounted(true);
        const savedMode = localStorage.getItem('themeMode') as 'light' | 'dark' | null;
        if (savedMode && (savedMode === 'light' || savedMode === 'dark')) {
            setModeState(savedMode);
        }
    }, []);

    const setMode = (newMode: 'light' | 'dark') => {
        setModeState(newMode);
        if (mounted) {
            localStorage.setItem('themeMode', newMode);
        }
    };

    const toggleColorMode = () => {
        const newMode = mode === 'light' ? 'dark' : 'light';
        setMode(newMode);
    };

    const theme = React.useMemo(() => createAppTheme(mode), [mode]);

    return (
        <ThemeContext.Provider value={{ toggleColorMode, mode, setMode }}>
            <AppRouterCacheProvider options={{ enableCssLayer: true }}>
                <MuiThemeProvider theme={theme}>
                    <CssBaseline />
                    {children}
                </MuiThemeProvider>
            </AppRouterCacheProvider>
        </ThemeContext.Provider>
    );
}
