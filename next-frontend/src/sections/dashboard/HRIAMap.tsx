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
import { StakeholderRating, AnalystSubmission } from '@/lib/types';
import { MatrixMap } from '@/components';
import { MatrixMapDatum } from '@/components/dashboard/MatrixMap';

interface HRIAMapProps {
    ratings: AnalystSubmission;
}

export function HRIAMap({ ratings }: HRIAMapProps) {

    const [selectedAnalyst, setSelectedAnalyst] = useState<string>('Average');
    const analysts = Object.keys(ratings).filter(name => name !== 'Average');

    const getDataToDisplay = (): StakeholderRating[] => {
        if (selectedAnalyst === 'Average') {
            return ratings['Average'] || [];
        } else {
            return ratings[selectedAnalyst] || [];
        }
    };

    const stakeholderData = getDataToDisplay();

    // Transform data for MatrixMap (group by quadrant, or just one group)
    const scatterData = useMemo(() => {
        if (stakeholderData.length === 0) return [];

        // Group stakeholders by quadrant for different series
        const highInfluenceHighImpact = stakeholderData.filter(s => s.influence >= 3 && s.impact >= 3);
        const highInfluenceLowImpact = stakeholderData.filter(s => s.influence >= 3 && s.impact < 3);
        const lowInfluenceHighImpact = stakeholderData.filter(s => s.influence < 3 && s.impact >= 3);
        const lowInfluenceLowImpact = stakeholderData.filter(s => s.influence < 3 && s.impact < 3);

        const series: Array<{
            id: string;
            data: MatrixMapDatum[];
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
