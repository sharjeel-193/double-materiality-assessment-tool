"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { 
    Box, 
    Typography, 
    TextField, 
    MenuItem, 
    Button, 
    Stack, 
    Slider, 
    Grid,
    Paper,
    Divider,
    Collapse,
    useMediaQuery,
    useTheme,
    Badge
} from '@mui/material';
import { 
    FilterListOff, 
    ExpandMore, 
    ExpandLess,
    Tune
} from '@mui/icons-material';
import { useFinancialEffect } from '@/hooks';
import { FinancialEffectCard, CreateFinancialEffectDialog, FinancialEffectsHeatmapDialog, Loader } from '../../components';
import { ConfirmationDialog } from '../../components'; // Added confirmation dialog
import { CreateFinancialEffectInput, FinancialType, FinancialEffect } from '@/types';

interface FinancialEffectListProps {
    reportId: string;
}

const financialTypeMenu: { value: FinancialType; label: string }[] = [
    { value: 'RISK', label: 'Risk' },
    { value: 'OPPORTUNITY', label: 'Opportunity' }
];

export function FinancialEffectList({ reportId }: FinancialEffectListProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [heatmapDialogOpen, setHeatmapDialogOpen] = useState(false);
    
    const { 
        financialEffects, 
        fetchFinancialEffectsByReport, 
        createFinancialEffect, 
        deleteFinancialEffect,
        financialEffectLoading 
    } = useFinancialEffect();

    const [searchText, setSearchText] = useState('');
    const [typeFilter, setTypeFilter] = useState<FinancialType | 'ALL'>('ALL');
    const [topicFilter, setTopicFilter] = useState<string>('ALL');
    const [likelihoodRange, setLikelihoodRange] = useState<number[]>([0, 5]);
    const [magnitudeRange, setMagnitudeRange] = useState<number[]>([0, 5]);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [filtersExpanded, setFiltersExpanded] = useState(!isMobile);

    // Added confirmation dialog states
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [financialEffectToDelete, setFinancialEffectToDelete] = useState<FinancialEffect | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (reportId) {
            fetchFinancialEffectsByReport(reportId);
        }
    }, [reportId, fetchFinancialEffectsByReport]);

    // Update filters expanded state when screen size changes
    useEffect(() => {
        setFiltersExpanded(!isMobile);
    }, [isMobile]);

    // Extract unique topics from financial effects
    const availableTopics = useMemo(() => {
        const topicsMap = new Map();
        financialEffects.forEach(effect => {
            if (effect.topic) {
                topicsMap.set(effect.topicId, {
                    id: effect.topicId,
                    name: effect.topic.name
                });
            }
        });
        return Array.from(topicsMap.values());
    }, [financialEffects]);

    // Count active filters
    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (searchText.trim() !== '') count++;
        if (typeFilter !== 'ALL') count++;
        if (topicFilter !== 'ALL') count++;
        if (likelihoodRange[0] !== 0 || likelihoodRange[1] !== 5) count++;
        if (magnitudeRange[0] !== 0 || magnitudeRange[1] !== 5) count++;
        return count;
    }, [searchText, typeFilter, topicFilter, likelihoodRange, magnitudeRange]);

    // Filtering logic
    const filteredFinancialEffects = useMemo(() => {
        return financialEffects.filter(effect => {
            const matchesSearch =
                effect.title.toLowerCase().includes(searchText.toLowerCase()) ||
                effect.description.toLowerCase().includes(searchText.toLowerCase());

            const matchesType = typeFilter === 'ALL' || effect.type === typeFilter;
            const matchesTopic = topicFilter === 'ALL' || effect.topicId === topicFilter;
            const matchesLikelihood = effect.likelihood >= likelihoodRange[0] && effect.likelihood <= likelihoodRange[1];
            const matchesMagnitude = effect.magnitude >= magnitudeRange[0] && effect.magnitude <= magnitudeRange[1];

            return matchesSearch && matchesType && matchesTopic && matchesLikelihood && matchesMagnitude;
        });
    }, [financialEffects, searchText, typeFilter, topicFilter, likelihoodRange, magnitudeRange]);

    const handleCreateOpen = () => setCreateDialogOpen(true);
    const handleCreateClose = () => setCreateDialogOpen(false);

    const handleCreateFinancialEffect = async (input: CreateFinancialEffectInput) => {
        await createFinancialEffect(input);
    };

    // Modified delete handler to show confirmation dialog first
    const handleDeleteFinancialEffect = (id: string) => {
        const effect = financialEffects.find(effect => effect.id === id);
        if (effect) {
            setFinancialEffectToDelete(effect);
            setConfirmDeleteOpen(true);
        }
    };

    // Actual delete function called after confirmation
    const confirmDeleteFinancialEffect = async () => {
        if (!financialEffectToDelete) return;
        
        setIsDeleting(true);
        try {
            await deleteFinancialEffect(financialEffectToDelete.id);
            setConfirmDeleteOpen(false);
            setFinancialEffectToDelete(null);
        } catch (error) {
            console.error('Error deleting financial effect:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    // Cancel delete confirmation
    const handleCancelDelete = () => {
        setConfirmDeleteOpen(false);
        setFinancialEffectToDelete(null);
        setIsDeleting(false);
    };

    const handleClearFilters = () => {
        setSearchText('');
        setTypeFilter('ALL');
        setTopicFilter('ALL');
        setLikelihoodRange([0, 5]);
        setMagnitudeRange([0, 5]);
    };

    const toggleFilters = () => {
        setFiltersExpanded(!filtersExpanded);
    };

    

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Stack 
                direction="row" 
                justifyContent="space-between" 
                alignItems="center" 
                sx={{ mb: 3 }}
                flexWrap="wrap"
                gap={2}
            >
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Financial Effects ({filteredFinancialEffects.length})
                </Typography>
                <Box sx={{display: 'flex',gap: 2}}>
                    <Button variant="contained" onClick={handleCreateOpen}>
                        Create Financial Effect
                    </Button>
                    <Button 
                        variant="outlined" 
                        onClick={() => setHeatmapDialogOpen(true)}
                    >
                        Risk Matrix
                    </Button>
                </Box>
            </Stack>

            {/* Mobile Filter Toggle Button */}
            {isMobile && (
                <Paper sx={{ p: 2, mb: 2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Button
                            variant="outlined"
                            startIcon={<Tune />}
                            endIcon={filtersExpanded ? <ExpandLess /> : <ExpandMore />}
                            onClick={toggleFilters}
                            sx={{ flex: 1 }}
                        >
                            <Badge badgeContent={activeFiltersCount} color="primary" sx={{ mr: 1 }}>
                                <Typography variant="body2">
                                    Filters
                                </Typography>
                            </Badge>
                        </Button>
                        
                        {activeFiltersCount > 0 && (
                            <Button
                                size="small"
                                startIcon={<FilterListOff />}
                                onClick={handleClearFilters}
                                sx={{ ml: 2 }}
                            >
                                Clear
                            </Button>
                        )}
                    </Stack>
                </Paper>
            )}

            {/* Filters Panel */}
            <Paper sx={{ mb: 3, overflow: 'hidden' }}>
                {/* Desktop Filter Header */}
                {!isMobile && (
                    <Box sx={{ p: 3, pb: 0 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6">Filters</Typography>
                            {activeFiltersCount > 0 && (
                                <Button
                                    size="small"
                                    startIcon={<FilterListOff />}
                                    onClick={handleClearFilters}
                                >
                                    Clear Filters ({activeFiltersCount})
                                </Button>
                            )}
                        </Stack>
                    </Box>
                )}

                {/* Collapsible Filter Content */}
                <Collapse in={filtersExpanded} timeout="auto">
                    <Box sx={{ p: 3 }}>
                        <Stack spacing={3}>
                            <TextField
                                label="Search financial effects..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                fullWidth
                                size="small"
                                variant="outlined"
                            />

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                                    <TextField
                                        select
                                        label="Type"
                                        value={typeFilter}
                                        onChange={(e) => setTypeFilter(e.target.value as FinancialType | 'ALL')}
                                        fullWidth
                                        size="small"
                                    >
                                        <MenuItem value="ALL">All Types</MenuItem>
                                        {financialTypeMenu.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                                    <TextField
                                        select
                                        label="Topic"
                                        value={topicFilter}
                                        onChange={(e) => setTopicFilter(e.target.value)}
                                        fullWidth
                                        size="small"
                                    >
                                        <MenuItem value="ALL">All Topics</MenuItem>
                                        {availableTopics.map((topic) => (
                                            <MenuItem key={topic.id} value={topic.id}>
                                                {topic.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                                    <Typography variant="body2" gutterBottom>
                                        Likelihood: {likelihoodRange[0]} - {likelihoodRange[1]}
                                    </Typography>
                                    <Slider
                                        value={likelihoodRange}
                                        onChange={(e, newValue) => setLikelihoodRange(newValue as number[])}
                                        valueLabelDisplay="auto"
                                        min={0}
                                        max={5}
                                        step={0.1}
                                        size="small"
                                        sx={{ mt: 1 }}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                                    <Typography variant="body2" gutterBottom>
                                        Magnitude: {magnitudeRange[0]} - {magnitudeRange[1]}
                                    </Typography>
                                    <Slider
                                        value={magnitudeRange}
                                        onChange={(e, newValue) => setMagnitudeRange(newValue as number[])}
                                        valueLabelDisplay="auto"
                                        min={0}
                                        max={5}
                                        step={0.1}
                                        size="small"
                                        sx={{ mt: 1 }}
                                    />
                                </Grid>
                            </Grid>

                            {/* Mobile Quick Actions */}
                            {isMobile && (
                                <Stack direction="row" spacing={1} sx={{ pt: 2 }}>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={toggleFilters}
                                        sx={{ flex: 1 }}
                                    >
                                        Apply Filters
                                    </Button>
                                </Stack>
                            )}
                        </Stack>
                    </Box>
                </Collapse>
            </Paper>

            <Divider sx={{ mb: 3 }} />

            {/* Content */}
            {financialEffectLoading ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Loader message='Loading Financial Effects' />
                </Box>
            ) : filteredFinancialEffects.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                        {financialEffects.length === 0 ? 'No financial effects found for this report' : 'No financial effects match your filters'}
                    </Typography>
                    {activeFiltersCount > 0 && (
                        <Button variant="outlined" onClick={handleClearFilters}>
                            Clear All Filters
                        </Button>
                    )}
                </Box>
            ) : (
                <Grid container spacing={2}>
                    {filteredFinancialEffects.map((effect) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={effect.id}>
                            <FinancialEffectCard 
                                financialEffect={effect} 
                                onDelete={handleDeleteFinancialEffect}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Create Dialog */}
            <CreateFinancialEffectDialog
                open={createDialogOpen}
                onClose={handleCreateClose}
                onCreate={handleCreateFinancialEffect}
                reportId={reportId}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmationDialog
                open={confirmDeleteOpen}
                onClose={handleCancelDelete}
                onConfirm={confirmDeleteFinancialEffect}
                variant="danger"
                title="Delete Financial Effect"
                message={`Are you sure you want to delete financial effect '${financialEffectToDelete?.title}'?`}
                details="This action cannot be undone. All data associated with this financial effect will be permanently removed."
                confirmText="Delete Effect"
                cancelText="Cancel"
                loading={isDeleting}
            />

            <FinancialEffectsHeatmapDialog
                open={heatmapDialogOpen}
                onClose={() => setHeatmapDialogOpen(false)}
                financialEffects={financialEffects}
            />
        </Box>
    );
}
