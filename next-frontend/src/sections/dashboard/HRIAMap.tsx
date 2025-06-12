"use client";
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
import { StakeholderRating, UserSubmissionGroupedData } from '@/types';
import { MatrixMap } from '@/components';
import { MatrixMapDatum } from '@/components/dashboard/MatrixMap';

interface HRIAMapProps {
    ratings: UserSubmissionGroupedData;
}

export function HRIAMap({ ratings }: HRIAMapProps) {
    // Get all analyst submission IDs (excluding 'Average')
    const analystSubmissionIds = Object.keys(ratings).filter(id => id !== 'Average');
    // Build a map of submissionId to userName for display
    const submissionIdToUserName: Record<string, string> = useMemo(() => {
        const map: Record<string, string> = {};
        analystSubmissionIds.forEach(id => {
            map[id] = ratings[id].userName;
        });
        return map;
    }, [ratings, analystSubmissionIds]);

    // Default to 'Average' if present, otherwise first analyst
    const [selectedAnalyst, setSelectedAnalyst] = useState<string>(
        ratings['Average'] ? 'Average' : analystSubmissionIds[0] || ''
    );

    // Data to display: average or selected analyst's ratings
    const getDataToDisplay = (): StakeholderRating[] => {
        if (selectedAnalyst === 'Average') {
            return ratings['Average']?.stakeholderRatings || [];
        } else {
            return ratings[selectedAnalyst]?.stakeholderRatings || [];
        }
    };

    const stakeholderData = getDataToDisplay();

    // Transform data for MatrixMap (group by quadrant, or just one group)
    const scatterData = useMemo(() => {
        if (stakeholderData.length === 0) return [];

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
                    label: s.stakeholder?.name || s.stakeholderId
                }))
            });
        }

        if (highInfluenceLowImpact.length > 0) {
            series.push({
                id: 'High Influence, Low Impact',
                data: highInfluenceLowImpact.map(s => ({
                    x: s.impact,
                    y: s.influence,
                    label: s.stakeholder?.name || s.stakeholderId
                }))
            });
        }

        if (lowInfluenceHighImpact.length > 0) {
            series.push({
                id: 'Low Influence, High Impact',
                data: lowInfluenceHighImpact.map(s => ({
                    x: s.impact,
                    y: s.influence,
                    label: s.stakeholder?.name || s.stakeholderId
                }))
            });
        }

        if (lowInfluenceLowImpact.length > 0) {
            series.push({
                id: 'Low Influence, Low Impact',
                data: lowInfluenceLowImpact.map(s => ({
                    x: s.impact,
                    y: s.influence,
                    label: s.stakeholder?.name || s.stakeholderId
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
                        {'Average' in ratings && (
                            <MenuItem value="Average">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Chip label="AVG" size="small" color="primary" />
                                    Average Ratings
                                </Box>
                            </MenuItem>
                        )}
                        {analystSubmissionIds.map(submissionId => (
                            <MenuItem key={submissionId} value={submissionId}>
                                {submissionIdToUserName[submissionId]}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {selectedAnalyst !== 'Average' && (
                    <IconButton
                        size="small"
                        onClick={() => setSelectedAnalyst('Average')}
                        sx={{ bgcolor: 'action.hover' }}
                        disabled={!('Average' in ratings)}
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
                                : `No data found for ${submissionIdToUserName[selectedAnalyst] || selectedAnalyst}`}
                        </Typography>
                    </Box>
                </Box>
            ) : (
                <MatrixMap
                    data={scatterData}
                    xLabel="Impact"
                    yLabel="Influence"
                    colorScheme="category10"
                    legendTitle="Stakeholders"
                    height={500}
                />
            )}
        </Paper>
    );
}
