// components/charts/ImpactRadarChart.tsx
import React, { useState, useMemo } from 'react';
import { ResponsiveRadar } from '@nivo/radar';
import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Paper,
    useTheme
} from '@mui/material';

interface ImpactData {
    id: string;
    score: number;
    type: 'POSITIVE' | 'NEGATIVE';
    orderOfImpact: 'IMMEDIATE' | 'ENABLING' | 'STRUCTURAL';
}


interface ImpactRadarChartProps {
    data: string; // JSON string from backend
    title?: string;
    height?: number;
}

type GroupingField = 'orderOfImpact' | 'type';

const groupingOptions = [
    { value: 'orderOfImpact' as GroupingField, label: 'Order of Impact' },
    { value: 'type' as GroupingField, label: 'Impact Type' }
];

export function ImpactRadarChart({ 
    data,
    height = 500 
}: ImpactRadarChartProps) {
    const theme = useTheme();
    const [selectedGrouping, setSelectedGrouping] = useState<GroupingField>('orderOfImpact');

    // Parse and transform data based on selected grouping
    const { radarData, seriesKeys } = useMemo(() => {
        try {
            const parsedData: Record<string, ImpactData[]> = JSON.parse(data);
            
            // Transform data by Order of Impact (3 series) - MOVED INSIDE useMemo
            const transformByOrderOfImpact = (parsedData: Record<string, ImpactData[]>) => {
                const dimensions = Object.keys(parsedData);
                const orderTypes = ['IMMEDIATE', 'ENABLING', 'STRUCTURAL'];
                
                const radarData = dimensions.map(dimension => {
                    const dimensionData: Record<string, string | number> = { 
                        dimension: dimension // ✅ ADDED: Required for indexBy
                    };
                    
                    orderTypes.forEach(orderType => {
                        const impacts = parsedData[dimension].filter(
                            impact => impact.orderOfImpact === orderType
                        );
                        
                        // Calculate average score for this order type in this dimension
                        const avgScore = impacts.length > 0 
                            ? impacts.reduce((sum, impact) => sum + impact.score, 0) / impacts.length
                            : 0;
                            
                        dimensionData[orderType] = Number(avgScore.toFixed(2));
                    });
                    
                    return dimensionData;
                });

                return {
                    radarData,
                    seriesKeys: orderTypes
                };
            };

            // Transform data by Type (2 series) - MOVED INSIDE useMemo
            const transformByType = (parsedData: Record<string, ImpactData[]>) => {
                const dimensions = Object.keys(parsedData);
                const types = ['POSITIVE', 'NEGATIVE'];
                
                const radarData = dimensions.map(dimension => {
                    const dimensionData: Record<string, string | number> = { 
                        dimension: dimension // ✅ ADDED: Required for indexBy
                    };
                    
                    types.forEach(type => {
                        const impacts = parsedData[dimension].filter(
                            impact => impact.type === type
                        );
                        
                        // Calculate average score for this type in this dimension
                        const avgScore = impacts.length > 0 
                            ? impacts.reduce((sum, impact) => sum + impact.score, 0) / impacts.length
                            : 0;
                            
                        dimensionData[type] = Number(avgScore.toFixed(2));
                    });
                    
                    return dimensionData;
                });

                return {
                    radarData,
                    seriesKeys: types
                };
            };

            // Now call the functions after they're defined
            if (selectedGrouping === 'orderOfImpact') {
                return transformByOrderOfImpact(parsedData);
            } else {
                return transformByType(parsedData);
            }
        } catch (error) {
            console.error('Failed to parse impact data:', error);
            return { radarData: [], seriesKeys: [] };
        }
    }, [data, selectedGrouping]);

    // Get colors based on grouping type
    const getSeriesColors = () => {
        if (selectedGrouping === 'orderOfImpact') {
            return [
                theme.palette.error.main,     // IMMEDIATE - Red
                theme.palette.warning.main,   // ENABLING - Orange  
                theme.palette.info.main       // STRUCTURAL - Blue
            ];
        } else {
            return [
                theme.palette.success.main,   // POSITIVE - Green
                theme.palette.error.main      // NEGATIVE - Red
            ];
        }
    };

    return (
        <Paper 
            sx={{ 
                p: 3, 
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider'
            }}
        >
            {/* Header with title and dropdown */}
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 3
            }}>
                <Typography variant='h5'>Impact Assessment across Dimensions</Typography>
                
                <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel>Group By</InputLabel>
                    <Select
                        value={selectedGrouping}
                        label="Group By"
                        onChange={(e) => setSelectedGrouping(e.target.value as GroupingField)}
                    >
                        {groupingOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* Radar Chart */}
            <Box sx={{ height: height }}>
                {radarData.length > 0 ? (
                    <ResponsiveRadar
                        data={radarData}
                        keys={seriesKeys}
                        indexBy="dimension"
                        valueFormat=">-.2f"
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
                            No impact data available for visualization
                        </Typography>
                    </Box>
                )}
            </Box>
        </Paper>
    );
}
