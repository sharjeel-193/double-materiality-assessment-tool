'use client';

import React, { useState, useMemo } from 'react';
import {
    Box,
    Typography,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    IconButton,
    useTheme,
} from '@mui/material';
import { MdClear as ClearIcon } from 'react-icons/md';
import { ResponsiveScatterPlot, ScatterPlotTooltipProps } from '@nivo/scatterplot';
import { StakeholderRating, AnalystSubmission } from '@/lib/types';

interface HRIAMapProps {
    ratings: AnalystSubmission;
}

// Define the data structure for our scatter plot points
interface ScatterPlotDatum {
    x: number;
    y: number;
    stakeholder: string;
}

// Custom tooltip component with proper typing
const CustomTooltip = ({ node }: ScatterPlotTooltipProps<ScatterPlotDatum>) => {
    const theme = useTheme();
    
    return (
        <Box
            sx={{
                background: theme.palette.background.paper,
                color: theme.palette.text.primary,
                padding: '9px 12px',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '4px',
                boxShadow: theme.shadows[4],
                fontSize: '12px',
                zIndex: 1000,
                width: 200
            }}
        >
            <Typography 
                variant="subtitle2" 
                sx={{ 
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    fontSize: '13px'
                }}
            >
                {node.data.stakeholder}
            </Typography>
            <Typography 
                variant="caption" 
                sx={{ 
                    color: theme.palette.text.secondary,
                    fontSize: '11px'
                }}
            >
                Impact: {node.data.x} | Influence: {node.data.y}
            </Typography>
        </Box>
    );
};

export function HRIAMap({ ratings }: HRIAMapProps) {
    const theme = useTheme();
    const [selectedAnalyst, setSelectedAnalyst] = useState<string>('Average');

    // Get list of analysts from ratings keys (excluding Average)
    const analysts = Object.keys(ratings).filter(name => name !== 'Average');

    // Get data to display based on selected analyst
    const getDataToDisplay = (): StakeholderRating[] => {
        if (selectedAnalyst === 'Average') {
            return ratings['Average'] || [];
        } else {
            return ratings[selectedAnalyst] || [];
        }
    };

    const stakeholderData = getDataToDisplay();

    // Transform data for Nivo ScatterPlot with proper typing
    const scatterData = useMemo(() => {
        if (stakeholderData.length === 0) return [];

        // Group stakeholders by quadrant for different series
        const highInfluenceHighImpact = stakeholderData.filter(s => s.influence >= 3 && s.impact >= 3);
        const highInfluenceLowImpact = stakeholderData.filter(s => s.influence >= 3 && s.impact < 3);
        const lowInfluenceHighImpact = stakeholderData.filter(s => s.influence < 3 && s.impact >= 3);
        const lowInfluenceLowImpact = stakeholderData.filter(s => s.influence < 3 && s.impact < 3);

        const series: Array<{
            id: string;
            data: ScatterPlotDatum[];
        }> = [];

        if (highInfluenceHighImpact.length > 0) {
            series.push({
                id: 'High Influence, High Impact',
                data: highInfluenceHighImpact.map(s => ({
                    x: s.impact,
                    y: s.influence,
                    stakeholder: s.name
                }))
            });
        }

        if (highInfluenceLowImpact.length > 0) {
            series.push({
                id: 'High Influence, Low Impact',
                data: highInfluenceLowImpact.map(s => ({
                    x: s.impact,
                    y: s.influence,
                    stakeholder: s.name
                }))
            });
        }

        if (lowInfluenceHighImpact.length > 0) {
            series.push({
                id: 'Low Influence, High Impact',
                data: lowInfluenceHighImpact.map(s => ({
                    x: s.impact,
                    y: s.influence,
                    stakeholder: s.name
                }))
            });
        }

        if (lowInfluenceLowImpact.length > 0) {
            series.push({
                id: 'Low Influence, Low Impact',
                data: lowInfluenceLowImpact.map(s => ({
                    x: s.impact,
                    y: s.influence,
                    stakeholder: s.name
                }))
            });
        }

        return series;
    }, [stakeholderData]);

    // Create theme-aware Nivo theme
    const nivoTheme = {
        background: theme.palette.background.paper,
        text: {
            fontSize: 12,
            fill: theme.palette.text.primary,
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
                strokeWidth: 1
            }
        },
        legends: {
            text: {
                fontSize: 12,
                fill: theme.palette.text.primary,
                fontWeight: 500
            }
        }
    };

    return (
        <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                HRIA (Human Rights Impact Assessment) Map
            </Typography>

            {/* Filter Controls */}
            <Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'center' }}>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Select Data Source</InputLabel>
                    <Select
                        value={selectedAnalyst}
                        onChange={(e) => setSelectedAnalyst(e.target.value)}
                        label="Select Data Source"
                    >
                        <MenuItem value="Average">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip label="AVG" size="small" color="primary" />
                                Average Ratings
                            </Box>
                        </MenuItem>
                        {analysts.map(analyst => (
                            <MenuItem key={analyst} value={analyst}>
                                {analyst}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {selectedAnalyst !== 'Average' && (
                    <IconButton
                        size="small"
                        onClick={() => setSelectedAnalyst('Average')}
                        sx={{ bgcolor: 'action.hover' }}
                    >
                        <ClearIcon />
                    </IconButton>
                )}

                <Box sx={{ ml: 'auto' }}>
                    <Typography variant="body2" color="text.secondary">
                        Showing {stakeholderData.length} stakeholders
                    </Typography>
                </Box>
            </Box>

            {stakeholderData.length === 0 ? (
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    py: 8,
                    textAlign: 'center' 
                }}>
                    <Box>
                        <Typography variant="h6" sx={{ mb: 1, opacity: 0.6 }}>
                            📈
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                            No Data Available
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {selectedAnalyst === 'Average' 
                                ? 'No analyst submissions found to generate HRIA map'
                                : `No data found for ${selectedAnalyst}`
                            }
                        </Typography>
                    </Box>
                </Box>
            ) : (
                <Box>
                    {/* Chart Container */}
                    <Box sx={{ height: 500, width: '100%' }}>
                        <ResponsiveScatterPlot<ScatterPlotDatum>
                            data={scatterData}
                            theme={nivoTheme}
                            margin={{ top: 60, right: 200, bottom: 70, left: 90 }}
                            xScale={{ type: 'linear', min: 0.5, max: 5.5 }}
                            yScale={{ type: 'linear', min: 0.5, max: 5.5 }}
                            blendMode="normal"
                            axisTop={null}
                            axisRight={null}
                            axisBottom={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: 'Impact →',
                                legendPosition: 'middle',
                                legendOffset: 46,
                                tickValues: [1, 2, 3, 4, 5]
                            }}
                            axisLeft={{
                                tickSize: 5,
                                tickPadding: 5,
                                tickRotation: 0,
                                legend: '← Influence',
                                legendPosition: 'middle',
                                legendOffset: -60,
                                tickValues: [1, 2, 3, 4, 5]
                            }}
                            colors={{ scheme: 'category10' }}
                            nodeSize={10}
                            useMesh={true}
                            gridXValues={[1, 2, 3, 4, 5]}
                            gridYValues={[1, 2, 3, 4, 5]}
                            enableGridX={true}
                            enableGridY={true}
                            legends={[
                                {
                                    anchor: 'bottom-right',
                                    direction: 'column',
                                    translateX: 180,
                                    translateY: 0,
                                    itemWidth: 160,
                                    itemHeight: 16,
                                    itemsSpacing: 3,
                                    symbolShape: 'circle',
                                    symbolSize: 12,
                                    itemTextColor: theme.palette.text.primary,
                                    effects: [
                                        {
                                            on: 'hover',
                                            style: {
                                                itemTextColor: theme.palette.text.primary,
                                                itemOpacity: 1
                                            }
                                        }
                                    ]
                                }
                            ]}
                            tooltip={CustomTooltip}
                        />
                    </Box>

                    {/* Summary */}
                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            {selectedAnalyst === 'Average' 
                                ? `HRIA map based on average ratings from ${analysts.length} analysts`
                                : `HRIA map based on ratings from ${selectedAnalyst}`
                            }
                        </Typography>
                    </Box>
                </Box>
            )}
        </Paper>
    );
}
