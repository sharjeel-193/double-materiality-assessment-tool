import { PaletteOptions } from '@mui/material/styles';

export const darkPalette: PaletteOptions = {
    mode: 'dark',
    primary: {
        main: '#83c7aa',
        light: '#a3d6bf',
        dark: '#5a8f6f',
        contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    secondary: {
        main: '#2f8ef4',
        light: '#5a9ef9',
        dark: '#1f5ec9',
        contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    error: {
        main: '#f44336',
        light: '#e57373',
        dark: '#d32f2f',
    },
    warning: {
        main: '#ffa726',
        light: '#ffb74d',
        dark: '#f57c00',
    },
    info: {
        main: '#29b6f6',
        light: '#4fc3f7',
        dark: '#0288d1',
    },
    success: {
        main: '#66bb6a',
        light: '#81c784',
        dark: '#388e3c',
    },
    grey: {
        50: '#fafafa',
        100: '#f5f5f5',
        200: '#eeeeee',
        300: '#e0e0e0',
        400: '#bdbdbd',
        500: '#9e9e9e',
        600: '#757575',
        700: '#616161',
        800: '#424242',
        900: '#212121',
    },
    background: {
        default: '#121212',
        paper: '#1e1e1e',
    },
    text: {
        primary: '#ffffff',
        secondary: 'rgba(255, 255, 255, 0.7)',
        disabled: 'rgba(255, 255, 255, 0.5)',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
};
