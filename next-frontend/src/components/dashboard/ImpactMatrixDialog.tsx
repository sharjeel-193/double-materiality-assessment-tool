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
import { ResponsiveScatterPlot } from '@nivo/scatterplot';
import { Impact } from '@/types';

interface ImpactMatrixDialogProps {
    open: boolean;
    onClose: () => void;
    impacts: Impact[];
}

// Define proper TypeScript interfaces based on search results[1]
interface NodeData {
    x: number;
    y: number;
    id: string;
    title: string;
    type: string;
    orderOfEffect: string;
    scale: number;
    scope: number;
    irremediability: number;
}

interface CustomNodeProps {
    node: {
        x: number;
        y: number;
        data: NodeData;
    };
}

interface CustomTooltipProps {
    node: {
        data: NodeData;
    };
}

// Shape mapping function
const getShapeSymbol = (orderOfEffect: string): string => {
    switch (orderOfEffect) {
        case 'IMMEDIATE': return 'circle';
        case 'ENABLING': return 'triangle';
        case 'STRUCTURAL': return 'square';
        default: return 'circle';
    }
};

// Custom node component with proper typing (based on search results[1])
const CustomNodeComponent: React.FC<CustomNodeProps> = ({ node }) => {
    const theme = useTheme();
    const impact = node.data;
    const shape = getShapeSymbol(impact.orderOfEffect);
    const color = impact.type === 'POSITIVE' ? theme.palette.success.main : theme.palette.error.main;
    const size = 8;
    
    const renderShape = () => {
        const x = node.x;
        const y = node.y;
        
        switch (shape) {
            case 'circle':
                return (
                    <circle
                        cx={x}
                        cy={y}
                        r={size}
                        fill={color}
                        stroke="#fff"
                        strokeWidth={2}
                    />
                );
            case 'triangle':
                const height = size * 1.5;
                const width = size * 1.3;
                return (
                    <polygon
                        points={`${x},${y-height} ${x-width},${y+height/2} ${x+width},${y+height/2}`}
                        fill={color}
                        stroke="#fff"
                        strokeWidth={2}
                    />
                );
            case 'square':
                return (
                    <rect
                        x={x - size}
                        y={y - size}
                        width={size * 2}
                        height={size * 2}
                        fill={color}
                        stroke="#fff"
                        strokeWidth={2}
                    />
                );
            default:
                return (
                    <circle
                        cx={x}
                        cy={y}
                        r={size}
                        fill={color}
                        stroke="#fff"
                        strokeWidth={2}
                    />
                );
        }
    };
    
    return (
        <g>
            {renderShape()}
            <title>{impact.title} - {impact.type} ({impact.orderOfEffect})</title>
        </g>
    );
};

// Custom tooltip component with proper typing (based on search results[3])
const CustomTooltip: React.FC<CustomTooltipProps> = ({ node }) => {
    const theme = useTheme();
    const impact = node.data;
    
    return (
        <Box
            sx={{
                background: theme.palette.background.paper,
                color: theme.palette.text.primary,
                padding: '12px 16px',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '8px',
                boxShadow: theme.shadows[4],
                fontSize: '12px',
                fontFamily: theme.typography.fontFamily,
                zIndex: 1000,
                minWidth: 200
            }}
        >
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                {impact.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Type: <strong>{impact.type}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Order: <strong>{impact.orderOfEffect}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Likelihood: <strong>{impact.y.toFixed(1)}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Severity: <strong>{impact.x.toFixed(1)}</strong>
            </Typography>
            <Typography variant="caption" color="text.secondary">
                (Scale: {impact.scale}, Scope: {impact.scope}, Irremediability: {impact.irremediability})
            </Typography>
        </Box>
    );
};

export function ImpactMatrixDialog({
    open,
    onClose,
    impacts
}: ImpactMatrixDialogProps) {
    const theme = useTheme();

    // Transform impacts data for scatter plot with proper typing
    const scatterData = useMemo(() => {
        const positiveImpacts = impacts
            .filter(impact => impact.type === 'POSITIVE')
            .map(impact => ({
                x: (impact.scale + impact.scope + impact.irremediability) / 3,
                y: impact.likelihood,
                id: impact.id,
                title: impact.title,
                type: impact.type,
                orderOfEffect: impact.orderOfEffect,
                scale: impact.scale,
                scope: impact.scope,
                irremediability: impact.irremediability
            }));

        const negativeImpacts = impacts
            .filter(impact => impact.type === 'NEGATIVE')
            .map(impact => ({
                x: (impact.scale + impact.scope + impact.irremediability) / 3,
                y: impact.likelihood,
                id: impact.id,
                title: impact.title,
                type: impact.type,
                orderOfEffect: impact.orderOfEffect,
                scale: impact.scale,
                scope: impact.scope,
                irremediability: impact.irremediability
            }));

        return [
            {
                id: 'Positive Impacts',
                data: positiveImpacts
            },
            {
                id: 'Negative Impacts', 
                data: negativeImpacts
            }
        ];
    }, [impacts]);

    const impactCounts = useMemo(() => {
        const positive = impacts.filter(impact => impact.type === 'POSITIVE').length;
        const negative = impacts.filter(impact => impact.type === 'NEGATIVE').length;
        const immediate = impacts.filter(impact => impact.orderOfEffect === 'IMMEDIATE').length;
        const enabling = impacts.filter(impact => impact.orderOfEffect === 'ENABLING').length;
        const structural = impacts.filter(impact => impact.orderOfEffect === 'STRUCTURAL').length;
        
        return { positive, negative, immediate, enabling, structural };
    }, [impacts]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
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
                                Impact Matrix
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Impacts plotted by likelihood and severity with order classification
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
                <Stack spacing={2} sx={{ mb: 3 }}>
                    {/* Type Legend */}
                    <Stack direction="row" spacing={2} justifyContent="center">
                        <Chip 
                            label={`${impactCounts.positive} Positive Impacts`}
                            color="success"
                            variant="outlined"
                            size="small"
                        />
                        <Chip 
                            label={`${impactCounts.negative} Negative Impacts`}
                            color="error"
                            variant="outlined"
                            size="small"
                        />
                    </Stack>
                    
                    {/* Shape Legend */}
                    <Stack direction="row" spacing={3} justifyContent="center" alignItems="center">
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Box sx={{ width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="16" height="16">
                                    <circle cx="8" cy="8" r="6" fill={theme.palette.primary.main} stroke="#fff" strokeWidth="1"/>
                                </svg>
                            </Box>
                            <Typography variant="caption">Immediate ({impactCounts.immediate})</Typography>
                        </Stack>
                        
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Box sx={{ width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="16" height="16">
                                    <polygon points="8,2 14,14 2,14" fill={theme.palette.primary.main} stroke="#fff" strokeWidth="1"/>
                                </svg>
                            </Box>
                            <Typography variant="caption">Enabling ({impactCounts.enabling})</Typography>
                        </Stack>
                        
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Box sx={{ width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="16" height="16">
                                    <rect x="2" y="2" width="12" height="12" fill={theme.palette.primary.main} stroke="#fff" strokeWidth="1"/>
                                </svg>
                            </Box>
                            <Typography variant="caption">Structural ({impactCounts.structural})</Typography>
                        </Stack>
                    </Stack>
                </Stack>

                {/* Scatter Plot */}
                <Box sx={{ 
                    height: 500, 
                    width: '100%',
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    overflow: 'hidden'
                }}>
                    <ResponsiveScatterPlot<NodeData>
                        data={scatterData}
                        margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
                        xScale={{ type: 'linear', min: 0, max: 5 }}
                        yScale={{ type: 'linear', min: 0, max: 5 }}
                        colors={[theme.palette.success.main, theme.palette.error.main]}
                        nodeSize={12}
                        useMesh={false}
                        nodeComponent={CustomNodeComponent} // Changed from renderNode to nodeComponent
                        axisTop={null}
                        axisBottom={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: 'Severity (Scale + Scope + Irremediability) / 3 →',
                            legendPosition: 'middle',
                            legendOffset: 46,
                            tickValues: [1, 2, 3, 4, 5]
                        }}
                        axisLeft={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: '← Likelihood',
                            legendPosition: 'middle',
                            legendOffset: -60,
                            tickValues: [1, 2, 3, 4, 5]
                        }}
                        axisRight={null}
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

                {/* Instructions */}
                <Box sx={{ 
                    mt: 3, 
                    p: 2, 
                    backgroundColor: alpha(theme.palette.info.main, 0.1),
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
                }}>
                    <Typography variant="body2" color="info.main" sx={{ fontWeight: 500, mb: 1 }}>
                        📊 How to Read This Impact Matrix
                    </Typography>
                    <Typography variant="caption" color="text.secondary" component="div">
                        • <strong>Colors:</strong> Green = Positive impacts, Red = Negative impacts<br/>
                        • <strong>Shapes:</strong> Circle = Immediate, Triangle = Enabling, Square = Structural<br/>
                        • <strong>Position:</strong> Higher = more likely, Further right = more severe<br/>
                        • <strong>Severity:</strong> Calculated as (Scale + Scope + Irremediability) ÷ 3<br/>
                        • <strong>Hover over points</strong> to see detailed impact information
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
