import React from 'react';
import { 
    Card, 
    CardContent, 
    Typography, 
    Chip, 
    Box, 
    Stack, 
    LinearProgress,
    IconButton,
    Divider,
    alpha
} from '@mui/material';
import { DeleteOutline, TrendingUp, TrendingDown } from '@mui/icons-material';
import { Impact } from '@/types';

interface ImpactCardProps {
    impact: Impact;
    onDelete?: (id: string) => void;
}

export function ImpactCard({ impact, onDelete }: ImpactCardProps) {
    const severity = (impact.scope + impact.irremediability + impact.scale) / 3;
    
    const getTypeColor = (type: string) => {
        return type === 'POSITIVE' ? 'success' : 'error';
    };

    const getTypeIcon = (type: string) => {
        return type === 'POSITIVE' ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />;
    };

    const getSeverityColor = (severity: number) => {
        if (severity >= 4) return 'error';
        if (severity >= 3) return 'warning';
        if (severity >= 2) return 'info';
        return 'success';
    };

    const getOrderLabel = (order: string) => {
        const orderMap = {
            'IMMEDIATE': 'Immediate',
            'ENABLING': 'Enabling', 
            'STRUCTURAL': 'Structural'
        };
        return orderMap[order as keyof typeof orderMap] || order;
    };

    const typeColor = getTypeColor(impact.type);
    const severityColor = getSeverityColor(severity);

    return (
        <Card 
            variant="outlined" 
            sx={{ 
                position: 'relative',
                height: '100%',
                transition: 'all 0.3s ease-in-out',
                '&:hover': { 
                    transform: 'translateY(-4px)',
                    boxShadow: (theme) => `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
                    '& .delete-button': {
                        opacity: 1
                    }
                },
                border: (theme) => `2px solid ${alpha(theme.palette[typeColor].main, 0.1)}`,
                background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette[typeColor].main, 0.02)} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`
            }}
        >
            {/* Type indicator bar */}
            <Box 
                sx={{ 
                    height: 4, 
                    background: (theme) => `linear-gradient(90deg, ${theme.palette[typeColor].main}, ${theme.palette[typeColor].light})` 
                }} 
            />
            
            <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Header Section */}
                <Box sx={{ mb: 2 }}>
                    {/* Topic Chip */}
                    <Box sx={{ mb: 1.5 }}>
                        <Chip 
                            label={impact.topic?.name || 'No Topic'} 
                            color="primary" 
                            size="small" 
                            variant="filled"
                            sx={{ 
                                fontSize: '0.75rem',
                                fontWeight: 500,
                                borderRadius: '8px'
                            }}
                        />
                    </Box>
                    
                    {/* Title */}
                    <Typography 
                        variant="h6" 
                        component="div" 
                        sx={{ 
                            fontWeight: 600,
                            fontSize: '1.1rem',
                            lineHeight: 1.3,
                            mb: 1,
                            pr: onDelete ? 5 : 0
                        }}
                    >
                        {impact.title}
                    </Typography>
                    
                    {/* Description */}
                    <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                            fontSize: '0.875rem',
                            lineHeight: 1.5,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                        }}
                    >
                        {impact.description}
                    </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Metrics Section */}
                <Box sx={{ flex: 1 }}>
                    {/* Likelihood Bar */}
                    <Box sx={{ mb: 2 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                                Likelihood
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                {impact.likelihood.toFixed(1)}/5
                            </Typography>
                        </Stack>
                        <LinearProgress 
                            variant="determinate" 
                            value={(impact.likelihood / 5) * 100} 
                            sx={{ 
                                height: 8, 
                                borderRadius: 4,
                                backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
                                '& .MuiLinearProgress-bar': {
                                    borderRadius: 4
                                }
                            }} 
                        />
                    </Box>

                    {/* Severity Bar */}
                    <Box sx={{ mb: 2 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                                Severity
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: `${severityColor}.main` }}>
                                {severity.toFixed(1)}/5
                            </Typography>
                        </Stack>
                        <LinearProgress 
                            variant="determinate" 
                            value={(severity / 5) * 100} 
                            color={severityColor}
                            sx={{ 
                                height: 8, 
                                borderRadius: 4,
                                backgroundColor: (theme) => alpha(theme.palette[severityColor].main, 0.1),
                                '& .MuiLinearProgress-bar': {
                                    borderRadius: 4
                                }
                            }} 
                        />
                    </Box>

                    {/* Bottom Tags */}
                    <Stack 
                        direction="row" 
                        spacing={1} 
                        sx={{ 
                            flexWrap: 'wrap', 
                            gap: 1,
                            mt: 'auto'
                        }}
                    >
                        <Chip 
                            icon={getTypeIcon(impact.type)}
                            label={impact.type === 'POSITIVE' ? 'Positive' : 'Negative'} 
                            color={typeColor}
                            size="small"
                            variant="filled"
                            sx={{ 
                                fontWeight: 500,
                                fontSize: '0.75rem'
                            }}
                        />
                        
                        <Chip 
                            label={getOrderLabel(impact.orderOfEffect)}
                            variant="outlined"
                            size="small"
                            sx={{ 
                                fontWeight: 500,
                                fontSize: '0.75rem',
                                borderWidth: 1.5
                            }}
                        />
                    </Stack>
                </Box>

                {/* Delete Button */}
                {onDelete && (
                    <IconButton
                        className="delete-button"
                        onClick={() => onDelete(impact.id)}
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            opacity: 0,
                            transition: 'all 0.2s ease-in-out',
                            backgroundColor: (theme) => alpha(theme.palette.error.main, 0.1),
                            color: 'error.main',
                            '&:hover': {
                                backgroundColor: 'error.main',
                                color: 'white',
                                transform: 'scale(1.1)'
                            }
                        }}
                    >
                        <DeleteOutline fontSize="small" />
                    </IconButton>
                )}
            </CardContent>
        </Card>
    );
}
