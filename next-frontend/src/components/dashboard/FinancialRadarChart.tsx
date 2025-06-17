// components/charts/FinancialRadarChart.tsx
import React, { useMemo } from 'react';
import { ResponsiveRadar } from '@nivo/radar';
import {
    Box,
    Typography,
    Paper,
    useTheme
} from '@mui/material';

interface FinancialEffectData {
    id: string;
    topic: string;
    type: 'RISK' | 'OPPORTUNITY';
}

interface FinancialRadarChartProps {
    data: string; // JSON string from backend
    title?: string;
    height?: number;
}

export function FinancialRadarChart({ 
    data, 
    title = 'Financial Effects Radar Analysis',
    height = 500 
}: FinancialRadarChartProps) {
    const theme = useTheme();

    // Parse and transform data for radar chart
    const { radarData, seriesKeys } = useMemo(() => {
        try {
            if (!data || data.trim() === '' || data === '{}') {
                return { radarData: [], seriesKeys: [] };
            }

            const parsedData: Record<string, FinancialEffectData[]> = JSON.parse(data);
            
            // Validate parsed data structure
            if (!parsedData || typeof parsedData !== 'object') {
                return { radarData: [], seriesKeys: [] };
            }

            // Check if there are any dimensions with data
            const hasData = Object.keys(parsedData).some(key => 
                Array.isArray(parsedData[key]) && parsedData[key].length > 0
            );

            if (!hasData) {
                return { radarData: [], seriesKeys: [] };
            }

            // Transform data by Type (Risk vs Opportunity)
            const transformByType = (parsedData: Record<string, FinancialEffectData[]>) => {
                const dimensions = Object.keys(parsedData);
                const types = ['RISK', 'OPPORTUNITY'];
                
                const radarData = dimensions.map(dimension => {
                    const dimensionData: Record<string, string | number> = { 
                        dimension: dimension // Required for indexBy
                    };
                    
                    types.forEach(type => {
                        const effects = parsedData[dimension].filter(
                            effect => effect.type === type
                        );
                        
                        // Count of financial effects for this type in this dimension
                        const count = effects.length;
                        dimensionData[type] = count;
                    });
                    
                    return dimensionData;
                });

                return { radarData, seriesKeys: types };
            };

            return transformByType(parsedData);
        } catch (error) {
            console.error('Failed to parse financial radar data:', error);
            return { radarData: [], seriesKeys: [] };
        }
    }, [data]);

    // Get colors for Risk and Opportunity
    const getSeriesColors = () => [
        theme.palette.error.main,     // RISK - Red
        theme.palette.success.main    // OPPORTUNITY - Green
    ];

    return (
        <Paper 
            sx={{ 
                p: 3, 
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                height: 'fit-content'
            }}
        >
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Distribution of financial effects across sustainability dimensions
                </Typography>
            </Box>

            {/* Radar Chart */}
            <Box sx={{ height: height }}>
                {radarData.length > 0 ? (
                    <ResponsiveRadar
                        data={radarData}
                        keys={seriesKeys}
                        indexBy="dimension"
                        valueFormat=">-.0f"
                        margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
                        borderColor={{ from: 'color' }}
                        gridLevels={5}
                        gridShape="circular"
                        gridLabelOffset={36}
                        enableDots={true}
                        dotSize={8}
                        dotColor={{ theme: 'background' }}
                        dotBorderWidth={2}
                        colors={getSeriesColors()}
                        blendMode="multiply"
                        motionConfig="wobbly"
                        legends={[
                            {
                                anchor: 'top-left',
                                direction: 'column',
                                translateX: -50,
                                translateY: -40,
                                itemWidth: 80,
                                itemHeight: 20,
                                itemTextColor: theme.palette.text.primary,
                                symbolSize: 12,
                                symbolShape: 'circle',
                                effects: [
                                    {
                                        on: 'hover',
                                        style: {
                                            itemTextColor: theme.palette.primary.main
                                        }
                                    }
                                ]
                            }
                        ]}
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
                                ticks: {
                                    line: {
                                        stroke: theme.palette.divider,
                                        strokeWidth: 1
                                    },
                                    text: {
                                        fontSize: 11,
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
                ) : (
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            height: '100%',
                            color: 'text.secondary'
                        }}
                    >
                        <Typography variant="body1">
                            No financial effects data available for visualization
                        </Typography>
                    </Box>
                )}
            </Box>
        </Paper>
    );
}
