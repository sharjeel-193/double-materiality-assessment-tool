'use client';

import React, { useMemo } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    IconButton,
    useTheme,
    alpha,
    Stack,
    Chip
} from '@mui/material';
import { Close as CloseIcon, Analytics as AnalyticsIcon } from '@mui/icons-material';
import { ResponsiveHeatMap } from '@nivo/heatmap';
import { FinancialEffect } from '@/types';

interface FinancialEffectsHeatmapDialogProps {
    open: boolean;
    onClose: () => void;
    financialEffects: FinancialEffect[];
}

// Define the exact data type as specified
interface HeatMapSerie {
    id: string;
    data: {
        x: string | number;
        y: number | null;
    }[];
}

export function FinancialEffectsHeatmapDialog({
    open,
    onClose,
    financialEffects
}: FinancialEffectsHeatmapDialogProps) {
    const theme = useTheme();

    // Create risk density heatmap data with proper type structure
    const riskHeatmapData = useMemo((): HeatMapSerie[] => {
        const risks = financialEffects.filter(effect => effect.type === 'RISK');
        const data: HeatMapSerie[] = [];
        
        // Create 5 series for likelihood levels (each series MUST have same length)
        for (let likelihood = 5; likelihood >= 1; likelihood--) {
            const serie: HeatMapSerie = {
                id: likelihood.toString(),
                data: []
            };
            
            // Each series must have exactly 5 data points (same length requirement)
            for (let magnitude = 1; magnitude <= 5; magnitude++) {
                // Count risks at this position
                const count = risks.filter(risk => 
                    Math.round(risk.likelihood) === likelihood && 
                    Math.round(risk.magnitude) === magnitude
                ).length;
                
                serie.data.push({
                    x: magnitude,
                    y: count || null
                });
            }
            data.push(serie);
        }
        
        return data;
    }, [financialEffects]);

    // Create opportunity density heatmap data with proper type structure
    const opportunityHeatmapData = useMemo((): HeatMapSerie[] => {
        const opportunities = financialEffects.filter(effect => effect.type === 'OPPORTUNITY');
        const data: HeatMapSerie[] = [];
        
        // Create 5 series for likelihood levels (each series MUST have same length)
        for (let likelihood = 5; likelihood >= 1; likelihood--) {
            const serie: HeatMapSerie = {
                id: likelihood.toString(),
                data: []
            };
            
            // Each series must have exactly 5 data points (same length requirement)
            // For opportunities, reverse the magnitude order for visual effect
            for (let magnitude = 5; magnitude >= 1; magnitude--) {
                // Count opportunities at this position
                const count = opportunities.filter(opportunity => 
                    Math.round(opportunity.likelihood) === likelihood && 
                    Math.round(opportunity.magnitude) === magnitude
                ).length;
                
                serie.data.push({
                    x: magnitude,
                    y: count || null
                });
            }
            data.push(serie);
        }
        
        return data;
    }, [financialEffects]);

    const riskCounts = useMemo(() => {
        const risks = financialEffects.filter(effect => effect.type === 'RISK').length;
        const opportunities = financialEffects.filter(effect => effect.type === 'OPPORTUNITY').length;
        return { risks, opportunities };
    }, [financialEffects]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xl"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    boxShadow: theme.shadows[24],
                    minHeight: '700px'
                }
            }}
        >
            <DialogTitle sx={{ 
                pb: 1,
                borderBottom: `1px solid ${theme.palette.divider}`
            }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Box
                            sx={{
                                p: 1,
                                borderRadius: 2,
                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <AnalyticsIcon sx={{ color: theme.palette.primary.main }} />
                        </Box>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Risk & Opportunity Density Matrix
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Heat density of financial effects by likelihood and magnitude
                            </Typography>
                        </Box>
                    </Stack>
                    
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Stack>
            </DialogTitle>

            <DialogContent sx={{ p: 3 }}>
                {/* Legend */}
                <Stack direction="row" spacing={2} sx={{ mb: 3, justifyContent: 'center' }}>
                    <Chip 
                        label={`${riskCounts.risks} Risks`}
                        color="error"
                        variant="outlined"
                        size="small"
                    />
                    <Chip 
                        label={`${riskCounts.opportunities} Opportunities`}
                        color="success"
                        variant="outlined"
                        size="small"
                    />
                </Stack>

                {/* Joined Heatmaps Container */}
                <Box sx={{ 
                    height: 500, 
                    width: '100%',
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    overflow: 'hidden',
                    display: 'flex'
                }}>
                    {/* Risk Heatmap - Left Side */}
                    <Box sx={{ 
                        width: '50%',
                        height: '100%',
                        borderRight: `1px solid ${theme.palette.divider}`
                    }}>
                        <ResponsiveHeatMap
                            data={riskHeatmapData}
                            margin={{ top: 40, right: 0, bottom: 60, left: 60 }}
                            valueFormat=">-.0f"
                            axisTop={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0
                            }}
                            axisRight={null}
                            axisBottom={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: 'Magnitude →',
                                legendPosition: 'middle',
                                legendOffset: 46,
                                tickValues: [1, 2, 3, 4, 5]
                            }}
                            axisLeft={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: 'Likelihood →',
                                legendPosition: 'middle',
                                legendOffset: -40,
                                tickValues: ['5', '4', '3', '2', '1']
                            }}
                            colors={{
                                type: 'sequential',
                                scheme: 'reds',
                                minValue: 0,
                                maxValue: 5
                            }}
                            enableLabels={true}
                            labelTextColor={{
                                from: 'color',
                                modifiers: [['darker', 1.8]]
                            }}
                            theme={{
                                background: theme.palette.background.paper,
                                text: {
                                    fontSize: 12,
                                    fill: theme.palette.text.primary,
                                    fontFamily: theme.typography.fontFamily
                                },
                                axis: {
                                    domain: {
                                        line: {
                                            stroke: theme.palette.divider,
                                            strokeWidth: 1
                                        }
                                    },
                                    legend: {
                                        text: {
                                            fontSize: 14,
                                            fill: theme.palette.text.primary,
                                            fontWeight: 600
                                        }
                                    },
                                    ticks: {
                                        line: {
                                            stroke: theme.palette.divider,
                                            strokeWidth: 1
                                        },
                                        text: {
                                            fontSize: 12,
                                            fill: theme.palette.text.secondary
                                        }
                                    }
                                }
                            }}
                        />
                    </Box>

                    {/* Opportunity Heatmap - Right Side (Reversed X-axis) */}
                    <Box sx={{ 
                        width: '50%',
                        height: '100%'
                    }}>
                        <ResponsiveHeatMap
                            data={opportunityHeatmapData}
                            margin={{ top: 40, right: 60, bottom: 60, left: 0 }}
                            valueFormat=">-.0f"
                            axisTop={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0
                            }}
                            axisLeft={null}
                            axisBottom={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: '← Magnitude',
                                legendPosition: 'middle',
                                legendOffset: 46,
                                tickValues: [5, 4, 3, 2, 1]
                            }}
                            axisRight={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: 'Likelihood →',
                                legendPosition: 'middle',
                                legendOffset: 40,
                                tickValues: ['5', '4', '3', '2', '1']
                            }}
                            colors={{
                                type: 'sequential',
                                scheme: 'greens',
                                minValue: 0,
                                maxValue: 5
                            }}
                            tooltip={undefined}
                            enableLabels={true}
                            labelTextColor={{
                                from: 'color',
                                modifiers: [['darker', 1.8]]
                            }}
                            theme={{
                                background: theme.palette.background.paper,
                                text: {
                                    fontSize: 12,
                                    fill: theme.palette.text.primary,
                                    fontFamily: theme.typography.fontFamily
                                },
                                axis: {
                                    domain: {
                                        line: {
                                            stroke: theme.palette.divider,
                                            strokeWidth: 1
                                        }
                                    },
                                    legend: {
                                        text: {
                                            fontSize: 14,
                                            fill: theme.palette.text.primary,
                                            fontWeight: 600
                                        }
                                    },
                                    ticks: {
                                        line: {
                                            stroke: theme.palette.divider,
                                            strokeWidth: 1
                                        },
                                        text: {
                                            fontSize: 12,
                                            fill: theme.palette.text.secondary
                                        }
                                    }
                                }
                            }}
                        />
                    </Box>
                </Box>

                {/* Instructions */}
                <Box sx={{ 
                    mt: 3, 
                    p: 2, 
                    backgroundColor: alpha(theme.palette.info.main, 0.1),
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
                }}>
                    <Typography variant="body2" color="info.main" sx={{ fontWeight: 500, mb: 1 }}>
                        📊 How to Read This Density Matrix
                    </Typography>
                    <Typography variant="caption" color="text.secondary" component="div">
                        • <strong>Left Heatmap (Risks):</strong> Darker red = more risks concentrated in that likelihood/magnitude area<br/>
                        • <strong>Right Heatmap (Opportunities):</strong> Darker green = more opportunities concentrated (reversed magnitude)<br/>
                        • <strong>Numbers in cells:</strong> Count of financial effects in each position<br/>
                        • <strong>Hover over cells:</strong> See detailed likelihood, magnitude, and count information
                    </Typography>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
                <Button onClick={onClose} variant="outlined" size="large">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}
