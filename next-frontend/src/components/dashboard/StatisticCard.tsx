// components/dashboard/StatisticCard.tsx
import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    useTheme,
    alpha
} from '@mui/material';

interface StatisticCardProps {
    title: string;
    value: string | number;
    helperText?: string;
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
    icon?: React.ReactNode;
}

export function StatisticCard({ 
    title, 
    value, 
    helperText, 
    color = 'primary',
    icon 
}: StatisticCardProps) {
    const theme = useTheme();
    
    const colorConfig = {
        primary: theme.palette.primary,
        secondary: theme.palette.secondary,
        success: theme.palette.success,
        error: theme.palette.error,
        warning: theme.palette.warning,
        info: theme.palette.info,
    };

    const selectedColor = colorConfig[color];

    return (
        <Card
            sx={{
                height: '100%',
                borderRadius: 3,
                border: `1px solid ${alpha(selectedColor.main, 0.2)}`,
                boxShadow: `0 4px 12px ${alpha(selectedColor.main, 0.1)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 24px ${alpha(selectedColor.main, 0.15)}`,
                }
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {icon && (
                        <Box
                            sx={{
                                p: 1,
                                borderRadius: 2,
                                backgroundColor: alpha(selectedColor.main, 0.1),
                                color: selectedColor.main,
                                mr: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {icon}
                        </Box>
                    )}
                    <Typography 
                        variant="h6" 
                        color="text.secondary"
                        sx={{ fontWeight: 500, fontSize: '0.9rem' }}
                    >
                        {title}
                    </Typography>
                </Box>
                
                <Typography 
                    variant="h3" 
                    sx={{ 
                        fontWeight: 700,
                        color: selectedColor.main,
                        mb: helperText ? 1 : 0
                    }}
                >
                    {value}
                </Typography>
                
                {helperText && (
                    <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontSize: '0.8rem' }}
                    >
                        {helperText}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
}
