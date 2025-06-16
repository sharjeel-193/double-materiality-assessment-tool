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
import { ResponsiveScatterPlot, ScatterPlotTooltipProps } from '@nivo/scatterplot';
import { FinancialEffect } from '@/types';

interface FinancialEffectsHeatmapDialogProps {
    open: boolean;
    onClose: () => void;
    financialEffects: FinancialEffect[];
}

// Define the data point type for proper TypeScript support
interface ScatterDataPoint {
    x: number;
    y: number;
    id: string;
    title: string;
}

export function FinancialEffectsHeatmapDialog({
    open,
    onClose,
    financialEffects
}: FinancialEffectsHeatmapDialogProps) {
    const theme = useTheme();

    // Prepare risk data for left scatter plot
    const riskData = useMemo(() => {
        const risks = financialEffects.filter(effect => effect.type === 'RISK');
        return [{
            id: 'risks',
            data: risks.map(risk => ({
                x: risk.magnitude,
                y: risk.likelihood,
                id: risk.id,
                title: risk.title
            }))
        }];
    }, [financialEffects]);

    // Prepare opportunity data for right scatter plot
    const opportunityData = useMemo(() => {
        const opportunities = financialEffects.filter(effect => effect.type === 'OPPORTUNITY');
        return [{
            id: 'opportunities',
            data: opportunities.map(opportunity => ({
                x: opportunity.magnitude,
                y: opportunity.likelihood,
                id: opportunity.id,
                title: opportunity.title
            }))
        }];
    }, [financialEffects]);

    // Properly typed custom tooltip using Nivo's ScatterPlotTooltipProps
    const CustomTooltip = ({ node }: ScatterPlotTooltipProps<ScatterDataPoint>) => (
        <Box
            sx={{
                background: theme.palette.background.paper,
                color: theme.palette.text.primary,
                padding: '12px 16px',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '8px',
                boxShadow: theme.shadows[4],
                fontSize: '14px',
                zIndex: 1000,
                minWidth: 200
            }}
        >
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                {node.data.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Magnitude: <strong>{node.data.x}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Likelihood: <strong>{node.data.y}</strong>
            </Typography>
        </Box>
    );

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
                                Risk & Opportunity Analysis
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Financial effects plotted by likelihood and magnitude
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

                {/* Joined Scatter Plots Container with minimal gap */}
                <Box sx={{ 
                    height: 500, 
                    width: '100%',
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    overflow: 'hidden',
                    display: 'flex'
                }}>
                    {/* Risk Scatter Plot - Left Side */}
                    <Box sx={{ 
                        width: '50%',
                        height: '100%',
                        borderRight: `1px solid ${theme.palette.divider}`
                    }}>
                        <ResponsiveScatterPlot<ScatterDataPoint>
                            data={riskData}
                            margin={{ top: 40, right: 0, bottom: 60, left: 60 }}
                            xScale={{ type: 'linear', min: 0, max: 5 }}
                            yScale={{ type: 'linear', min: 0, max: 5 }}
                            colors={[theme.palette.error.main]}
                            nodeSize={12}
                            useMesh={false} // Changed to false - tooltips only on points
                            axisTop={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
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
                                tickValues: [1, 2, 3, 4, 5]
                            }}
                            tooltip={CustomTooltip}
                            enableGridX={true}
                            enableGridY={true}
                            gridXValues={[1, 2, 3, 4, 5]}
                            gridYValues={[1, 2, 3, 4, 5]}
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
                                },
                                grid: {
                                    line: {
                                        stroke: theme.palette.divider,
                                        strokeWidth: 1,
                                        strokeOpacity: 0.5
                                    }
                                }
                            }}
                        />
                    </Box>

                    {/* Opportunity Scatter Plot - Right Side (Reversed X-axis) */}
                    <Box sx={{ 
                        width: '50%',
                        height: '100%'
                    }}>
                        <ResponsiveScatterPlot<ScatterDataPoint>
                            data={opportunityData}
                            margin={{ top: 40, right: 60, bottom: 60, left: 0 }}
                            xScale={{ type: 'linear', min: 5, max: 0 }}
                            yScale={{ type: 'linear', min: 0, max: 5 }}
                            colors={[theme.palette.success.main]}
                            nodeSize={12}
                            useMesh={false} // Changed to false - tooltips only on points
                            axisTop={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
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
                                tickValues: [1, 2, 3, 4, 5]
                            }}
                            tooltip={CustomTooltip}
                            enableGridX={true}
                            enableGridY={true}
                            gridXValues={[5, 4, 3, 2, 1]}
                            gridYValues={[1, 2, 3, 4, 5]}
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
                                },
                                grid: {
                                    line: {
                                        stroke: theme.palette.divider,
                                        strokeWidth: 1,
                                        strokeOpacity: 0.5
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
                        📊 How to Read These Joined Charts
                    </Typography>
                    <Typography variant="caption" color="text.secondary" component="div">
                        • <strong>Left Chart (Risks):</strong> Higher and more to the right = Greater risk impact<br/>
                        • <strong>Right Chart (Opportunities):</strong> Higher and more to the left = Greater opportunity potential<br/>
                        • <strong>Note:</strong> Opportunity chart has reversed X-axis (5→0) for visual contrast<br/>
                        • <strong>Hover over points</strong> to see detailed information about each financial effect
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
