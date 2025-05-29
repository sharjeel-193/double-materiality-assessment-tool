'use client';

import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { ResponsiveScatterPlot, ScatterPlotTooltipProps } from '@nivo/scatterplot';

// Define the data structure for scatter plot points
export interface MatrixMapDatum {
    x: number;
    y: number;
    label?: string;
    group?: string;
}

// Custom tooltip for the scatter plot
const CustomTooltip = ({
    node,
    xLabel,
    yLabel,
}: ScatterPlotTooltipProps<MatrixMapDatum> & { xLabel?: string; yLabel?: string }) => {
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
                width: 220
            }}
        >
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {node.data.label}
            </Typography>
            <Typography variant="caption" color="text.secondary">
                {xLabel ?? 'X'}: {node.data.x} &nbsp;|&nbsp; {yLabel ?? 'Y'}: {node.data.y}
            </Typography>
        </Box>
    );
};


interface MatrixMapProps {
    data: {
        id: string;
        data: MatrixMapDatum[];
    }[];
    xLabel?: string;
    yLabel?: string;
    xRange?: [number, number];
    yRange?: [number, number];
    colorScheme?: string;
    height?: number;
    legendTitle?: string;
}

export function MatrixMap({
    data,
    xLabel = 'X',
    yLabel = 'Y',
    xRange = [0.5, 5.5],
    yRange = [0.5, 5.5],
    height = 500,
    legendTitle = '',
}: MatrixMapProps) {
    const theme = useTheme();

    // Nivo theme for dark/light mode
    const nivoTheme = {
        background: theme.palette.background.paper,
        text: { fontSize: 12, fill: theme.palette.text.primary },
        axis: {
            domain: { line: { stroke: theme.palette.divider, strokeWidth: 1 } },
            legend: { text: { fontSize: 14, fill: theme.palette.text.primary, fontWeight: 600 } },
            ticks: {
                line: { stroke: theme.palette.divider, strokeWidth: 1 },
                text: { fontSize: 12, fill: theme.palette.text.secondary }
            }
        },
        grid: { line: { stroke: theme.palette.divider, strokeWidth: 1 } },
        legends: { text: { fontSize: 12, fill: theme.palette.text.primary, fontWeight: 500 } }
    };

    const customColors = ["#e6194b", "#3cb44b", "#ffe119", "#4363d8", "#f58231"]

    return (
        <Box sx={{ height, width: '100%' }}>
            {legendTitle && (
                <Typography variant="subtitle2" sx={{ mb: 1, ml: 2 }}>
                    {legendTitle}
                </Typography>
            )}
            <ResponsiveScatterPlot<MatrixMapDatum>
                data={data}
                theme={nivoTheme}
                margin={{ top: 60, right: 200, bottom: 70, left: 90 }}
                xScale={{ type: 'linear', min: xRange[0], max: xRange[1] }}
                yScale={{ type: 'linear', min: yRange[0], max: yRange[1] }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: xLabel,
                    legendPosition: 'middle',
                    legendOffset: 46,
                    tickValues: [1, 2, 3, 4, 5]
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: yLabel,
                    legendPosition: 'middle',
                    legendOffset: -60,
                    tickValues: [1, 2, 3, 4, 5]
                }}
                colors={customColors}
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
    );
}
