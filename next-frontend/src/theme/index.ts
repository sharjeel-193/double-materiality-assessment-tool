import { createTheme } from '@mui/material/styles';
import { lightPalette, darkPalette } from './palettes';

export const createAppTheme = (mode: 'light' | 'dark') => {
    const palette = mode === 'light' ? lightPalette : darkPalette;
    
    return createTheme({
        palette,
        spacing: 8,
        shape: {
            borderRadius: 8,
        },
    });
};

// Default dark theme
export const theme = createAppTheme('dark');

export type AppTheme = typeof theme;
