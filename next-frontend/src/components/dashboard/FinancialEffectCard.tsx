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
import { DeleteOutline, TrendingUp, Warning } from '@mui/icons-material';
import { FinancialEffect } from '@/types';

interface FinancialEffectCardProps {
    financialEffect: FinancialEffect;
    onDelete?: (id: string) => void;
}

export function FinancialEffectCard({ financialEffect, onDelete }: FinancialEffectCardProps) {
    const getTypeColor = (type: string) => {
        return type === 'OPPORTUNITY' ? 'success' : 'warning';
    };

    const getTypeIcon = (type: string) => {
        return type === 'OPPORTUNITY' ? <TrendingUp fontSize="small" /> : <Warning fontSize="small" />;
    };

    const getRiskColor = (magnitude: number, likelihood: number) => {
        const riskScore = (magnitude + likelihood) / 2;
        if (riskScore >= 4) return 'error';
        if (riskScore >= 3) return 'warning';
        if (riskScore >= 2) return 'info';
        return 'success';
    };

    const typeColor = getTypeColor(financialEffect.type);
    const riskColor = getRiskColor(financialEffect.magnitude, financialEffect.likelihood);

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
                            label={financialEffect.topic?.name || 'No Topic'} 
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
                        {financialEffect.title}
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
                        {financialEffect.description}
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
                                {financialEffect.likelihood.toFixed(1)}/5
                            </Typography>
                        </Stack>
                        <LinearProgress 
                            variant="determinate" 
                            value={(financialEffect.likelihood / 5) * 100} 
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

                    {/* Magnitude Bar */}
                    <Box sx={{ mb: 2 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                                Magnitude
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: `${riskColor}.main` }}>
                                {financialEffect.magnitude.toFixed(1)}/5
                            </Typography>
                        </Stack>
                        <LinearProgress 
                            variant="determinate" 
                            value={(financialEffect.magnitude / 5) * 100} 
                            color={riskColor}
                            sx={{ 
                                height: 8, 
                                borderRadius: 4,
                                backgroundColor: (theme) => alpha(theme.palette[riskColor].main, 0.1),
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
                            icon={getTypeIcon(financialEffect.type)}
                            label={financialEffect.type === 'OPPORTUNITY' ? 'Opportunity' : 'Risk'} 
                            color={typeColor}
                            size="small"
                            variant="filled"
                            sx={{ 
                                fontWeight: 500,
                                fontSize: '0.75rem'
                            }}
                        />
                    </Stack>
                </Box>

                {/* Delete Button */}
                {onDelete && (
                    <IconButton
                        className="delete-button"
                        onClick={() => onDelete(financialEffect.id)}
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
