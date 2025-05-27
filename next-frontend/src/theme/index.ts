import { createTheme } from '@mui/material/styles';
import { lightPalette, darkPalette } from './palettes';
import { typography } from './typography';

export const createAppTheme = (mode: 'light' | 'dark') => {
    const palette = mode === 'light' ? lightPalette : darkPalette;
    
    return createTheme({
        cssVariables: true,
        palette: palette,
        typography: typography,
        spacing: 8,
        shape: {
            borderRadius: 8,
        },
    });
};

// Default dark theme
export const theme = createAppTheme('dark');

export type AppTheme = typeof theme;
