'use client';

import React, { useMemo } from 'react';
import { Box, Typography, Paper, useTheme } from '@mui/material';
import { ResponsiveScatterPlot, ScatterPlotTooltipProps } from '@nivo/scatterplot';
import { MaterialityMatrixItem } from '@/types';

// Define the data structure for scatter plot points
export interface MaterialityMatrixDatum {
    x: number; // impact score
    y: number; // financial score
    topic: string;
    topicId: string;
    impactRatingsCount: number;
    financialRatingsCount: number;
}

// Custom tooltip for the scatter plot
const CustomTooltip = ({ node }: ScatterPlotTooltipProps<MaterialityMatrixDatum>) => {
    const theme = useTheme();
    
    return (
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
                minWidth: 250
            }}
        >
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                {node.data.topic}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Impact Score: <strong>{node.data.x}</strong> ({node.data.impactRatingsCount} ratings)
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Financial Score: <strong>{node.data.y}</strong> ({node.data.financialRatingsCount} ratings)
            </Typography>
        </Box>
    );
};

interface MaterialityMatrixProps {
    materialityMatrixData: MaterialityMatrixItem[];
    fetchMaterialityMatrixData: (reportId: string) => Promise<MaterialityMatrixItem[]>;
    reportId: string;
    loading?: boolean;
}

export function MaterialityMatrix({
    materialityMatrixData,
    fetchMaterialityMatrixData,
    reportId,
    loading = false
}: MaterialityMatrixProps) {
    const theme = useTheme();

    // Transform data for Nivo scatter plot
    const scatterData = useMemo(() => {
        if (!materialityMatrixData || materialityMatrixData.length === 0) return [];

        // Group topics by quadrant for different colors/series
        const highImpactHighFinancial = materialityMatrixData.filter(item => item.impactScore >= 3 && item.financialScore >= 3);
        const highImpactLowFinancial = materialityMatrixData.filter(item => item.impactScore >= 3 && item.financialScore < 3);
        const lowImpactHighFinancial = materialityMatrixData.filter(item => item.impactScore < 3 && item.financialScore >= 3);
        const lowImpactLowFinancial = materialityMatrixData.filter(item => item.impactScore < 3 && item.financialScore < 3);

        const series: Array<{
            id: string;
            data: MaterialityMatrixDatum[];
        }> = [];

        if (highImpactHighFinancial.length > 0) {
            series.push({
                id: 'High Impact, High Financial',
                data: highImpactHighFinancial.map(item => ({
                    x: item.impactScore,
                    y: item.financialScore,
                    topic: item.topicName,
                    topicId: item.topicId,
                    impactRatingsCount: item.impactRatingsCount,
                    financialRatingsCount: item.financialRatingsCount,
                }))
            });
        }

        if (highImpactLowFinancial.length > 0) {
            series.push({
                id: 'High Impact, Low Financial',
                data: highImpactLowFinancial.map(item => ({
                    x: item.impactScore,
                    y: item.financialScore,
                    topic: item.topicName,
                    topicId: item.topicId,
                    impactRatingsCount: item.impactRatingsCount,
                    financialRatingsCount: item.financialRatingsCount,
                }))
            });
        }

        if (lowImpactHighFinancial.length > 0) {
            series.push({
                id: 'Low Impact, High Financial',
                data: lowImpactHighFinancial.map(item => ({
                    x: item.impactScore,
                    y: item.financialScore,
                    topic: item.topicName,
                    topicId: item.topicId,
                    impactRatingsCount: item.impactRatingsCount,
                    financialRatingsCount: item.financialRatingsCount,
                }))
            });
        }

        if (lowImpactLowFinancial.length > 0) {
            series.push({
                id: 'Low Impact, Low Financial',
                data: lowImpactLowFinancial.map(item => ({
                    x: item.impactScore,
                    y: item.financialScore,
                    topic: item.topicName,
                    topicId: item.topicId,
                    impactRatingsCount: item.impactRatingsCount,
                    financialRatingsCount: item.financialRatingsCount,
                }))
            });
        }

        return series;
    }, [materialityMatrixData]);

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

    const customColors = ["#e74c3c", "#f39c12", "#3498db", "#27ae60"];

    // Handle refresh
    const handleRefresh = () => {
        if (reportId) {
            fetchMaterialityMatrixData(reportId);
        }
    };

    return (
        <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Materiality Matrix
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        {materialityMatrixData.length} topics plotted
                    </Typography>
                    <button 
                        onClick={handleRefresh} 
                        disabled={loading}
                        style={{
                            padding: '6px 12px',
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: '4px',
                            background: theme.palette.background.paper,
                            color: theme.palette.text.primary,
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? 'Refreshing...' : 'Refresh'}
                    </button>
                </Box>
            </Box>

            {materialityMatrixData.length === 0 ? (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    py: 8,
                    textAlign: 'center'
                }}>
                    <Box>
                        <Typography variant="h6" sx={{ mb: 1, opacity: 0.6 }}>
                            📊
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                            No Data Available
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            No stakeholder submissions found to generate materiality matrix
                        </Typography>
                    </Box>
                </Box>
            ) : (
                <Box sx={{ height: 500, width: '100%' }}>
                    <ResponsiveScatterPlot<MaterialityMatrixDatum>
                        data={scatterData}
                        theme={nivoTheme}
                        margin={{ top: 60, right: 220, bottom: 70, left: 90 }}
                        xScale={{ type: 'linear', min: 0, max: 5 }}
                        yScale={{ type: 'linear', min: 0, max: 5 }}
                        axisTop={null}
                        axisRight={null}
                        axisBottom={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: 'Impact Score →',
                            legendPosition: 'middle',
                            legendOffset: 46,
                            tickValues: [1, 2, 3, 4, 5]
                        }}
                        axisLeft={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: '← Financial Score',
                            legendPosition: 'middle',
                            legendOffset: -60,
                            tickValues: [1, 2, 3, 4, 5]
                        }}
                        colors={customColors}
                        nodeSize={12}
                        useMesh={true}
                        gridXValues={[1, 2, 3, 4, 5]}
                        gridYValues={[1, 2, 3, 4, 5]}
                        enableGridX={true}
                        enableGridY={true}
                        legends={[
                            {
                                anchor: 'bottom-right',
                                direction: 'column',
                                translateX: 200,
                                translateY: 0,
                                itemWidth: 180,
                                itemHeight: 18,
                                itemsSpacing: 5,
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
            )}

            {/* Quadrant Labels */}
            {materialityMatrixData.length > 0 && (
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <Box sx={{ display: 'flex', gap: 4 }}>
                        <Typography variant="caption" color="text.secondary">
                            Bottom-Left: Low Impact, Low Financial
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Bottom-Right: High Impact, Low Financial
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 4 }}>
                        <Typography variant="caption" color="text.secondary">
                            Top-Left: Low Impact, High Financial
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Top-Right: High Impact, High Financial
                        </Typography>
                    </Box>
                </Box>
            )}
        </Paper>
    );
}
