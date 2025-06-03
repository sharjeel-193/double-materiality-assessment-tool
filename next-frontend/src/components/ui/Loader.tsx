'use client';

import { Box, CircularProgress, Typography, Backdrop, useTheme, alpha } from '@mui/material';
import { styled } from '@mui/material/styles';

interface LoaderProps {
    message?: string;
    size?: number;
    variant?: 'page' | 'inline' | 'overlay' | 'button';
    open?: boolean;
}

const StyledBackdrop = styled(Backdrop)(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: alpha(theme.palette.background.default, 0.7),
    backdropFilter: 'blur(4px)',
}));

const LoaderContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(2),
}));

const ButtonLoaderContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(1),
}));

export function Loader({ 
    message = 'Loading...', 
    size = 40, 
    variant = 'inline',
    open = true 
}: LoaderProps) {
    
    const theme = useTheme();

    // Button variant - horizontal layout for use inside buttons
    if (variant === 'button') {
        const buttonSize = size > 24 ? 20 : size; // Smaller size for buttons
        
        return (
            <ButtonLoaderContainer>
                {/* SVG Gradient Definition */}
                <svg style={{ height: 0, position: 'absolute' }}>
                    <defs>
                        <linearGradient id="buttonProgressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={theme.palette.primary.contrastText || theme.palette.primary.main} />
                            <stop offset="100%" stopColor={alpha(theme.palette.primary.contrastText || theme.palette.secondary.main, 0.8)} />
                        </linearGradient>
                    </defs>
                </svg>
                
                {/* Compact CircularProgress for buttons */}
                <CircularProgress 
                    size={buttonSize} 
                    thickness={3}
                    sx={{ 
                        color: 'transparent',
                        '& .MuiCircularProgress-circle': {
                            stroke: 'url(#buttonProgressGradient)',
                            strokeLinecap: 'round',
                        }
                    }}
                />
                
                {/* Text on the right side */}
                <Typography 
                    variant="body2" 
                    sx={{ 
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        color: 'inherit', // Inherit button text color
                        lineHeight: 1,
                        whiteSpace: 'nowrap'
                    }}
                >
                    {message}
                </Typography>
            </ButtonLoaderContainer>
        );
    }

    const content = (
        <LoaderContainer>
            {/* SVG Gradient Definition */}
            <svg style={{ height: 0, position: 'absolute' }}>
                <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={theme.palette.primary.main} />
                        <stop offset="100%" stopColor={theme.palette.secondary.main} />
                    </linearGradient>
                </defs>
            </svg>
            
            {/* CircularProgress with Gradient */}
            <CircularProgress 
                size={size} 
                thickness={4}
                sx={{ 
                    color: 'transparent',
                    '& .MuiCircularProgress-circle': {
                        stroke: 'url(#progressGradient)',
                        strokeLinecap: 'round',
                    }
                }}
            />
            
            <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontWeight: 500 }}
            >
                {message}
            </Typography>
        </LoaderContainer>
    );

    if (variant === 'overlay') {
        return (
            <StyledBackdrop open={open}>
                {content}
            </StyledBackdrop>
        );
    }

    if (variant === 'page') {
        return (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    backgroundColor: 'background.default',
                }}
            >
                {content}
            </Box>
        );
    }

    // inline variant
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 3,
            }}  
        >
            {content}
        </Box>
    );
}
