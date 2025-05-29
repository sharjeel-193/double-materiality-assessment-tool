"use client"
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
} from '@mui/material';
import { MdClear as ClearIcon } from 'react-icons/md';
import { TopicRating, StakeholderSubmission } from '@/lib/types';
import { MatrixMap } from '@/components';
import { MatrixMapDatum } from '@/components/dashboard/MatrixMap';

interface TopicsMatrixProps {
    ratings: StakeholderSubmission;
}

export function TopicsMatrix({ ratings }: TopicsMatrixProps) {

    const [selectedStakeholder, setselectedStakeholder] = useState<string>('Average');
    const analysts = Object.keys(ratings).filter(name => name !== 'Average');

    const getDataToDisplay = (): TopicRating[] => {
        if (selectedStakeholder === 'Average') {
            return ratings['Average'] || [];
        } else {
            return ratings[selectedStakeholder] || [];
        }
    };

    const topicData = getDataToDisplay();

    // Transform data for MatrixMap (group by quadrant, or just one group)
    const scatterData = useMemo(() => {
        if (topicData.length === 0) return [];

        // Group stakeholders by quadrant for different series
        const highImpactHighFinancial = topicData.filter(s => s.impact_score >= 3 && s.financial_score >= 3);
        const highImpactLowFinancial = topicData.filter(s => s.impact_score >= 3 && s.financial_score < 3);
        const lowImpactHighFinancial = topicData.filter(s => s.impact_score < 3 && s.financial_score >= 3);
        const lowImpactLowFinancial = topicData.filter(s => s.impact_score < 3 && s.financial_score < 3);

        const series: Array<{
            id: string;
            data: MatrixMapDatum[];
        }> = [];

        if (highImpactHighFinancial.length > 0) {
            series.push({
                id: 'High Influence, High Impact',
                data: highImpactHighFinancial.map(s => ({
                    x: s.financial_score,
                    y: s.impact_score,
                    topic: s.topic
                }))
            });
        }

        if (highImpactLowFinancial.length > 0) {
            series.push({
                id: 'High Influence, Low Impact',
                data: highImpactLowFinancial.map(s => ({
                    x: s.financial_score,
                    y: s.impact_score,
                    topic: s.topic
                }))
            });
        }

        if (lowImpactHighFinancial.length > 0) {
            series.push({
                id: 'Low Influence, High Impact',
                data: lowImpactHighFinancial.map(s => ({
                    x: s.financial_score,
                    y: s.impact_score,
                    topic: s.topic
                }))
            });
        }

        if (lowImpactLowFinancial.length > 0) {
            series.push({
                id: 'Low Influence, Low Impact',
                data: lowImpactLowFinancial.map(s => ({
                    x: s.financial_score,
                    y: s.impact_score,
                    topic: s.topic
                }))
            });
        }

        return series;
    }, [topicData]);

    return (
        <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Double Materiality Matrix Map
            </Typography>
            {/* Filter Controls */}
            <Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'center' }}>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Select Data Source</InputLabel>
                    <Select
                        value={selectedStakeholder}
                        onChange={(e) => setselectedStakeholder(e.target.value)}
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
                {selectedStakeholder !== 'Average' && (
                    <IconButton
                        size="small"
                        onClick={() => setselectedStakeholder('Average')}
                        sx={{ bgcolor: 'action.hover' }}
                    >
                        <ClearIcon />
                    </IconButton>
                )}
                <Box sx={{ ml: 'auto' }}>
                    <Typography variant="body2" color="text.secondary">
                        Showing {topicData.length} Topics
                    </Typography>
                </Box>
            </Box>
            {topicData.length === 0 ? (
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
                            {selectedStakeholder === 'Average'
                                ? 'No analyst submissions found to generate HRIA map'
                                : `No data found for ${selectedStakeholder}`
                            }
                        </Typography>
                    </Box>
                </Box>
            ) : (
                <MatrixMap
                    data={scatterData}
                    xLabel="Impact →"
                    yLabel="← Influence"
                    colorScheme="category10"
                    legendTitle="Stakeholders"
                    height={500}
                />
            )}
        </Paper>
    );
}
