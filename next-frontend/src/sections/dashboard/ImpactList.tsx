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
import { useImpact } from '@/hooks/useImpact';
import { ImpactCard, ImpactMatrixDialog, CreateImpactDialog, ConfirmationDialog } from '../../components';
import { CreateImpactInput, ImpactType, OrderOfImpact, Impact } from '@/types';

interface ImpactListProps {
    reportId: string;
}

const impactTypeMenu: { value: ImpactType; label: string }[] = [
    { value: 'NEGATIVE', label: 'Negative' },
    { value: 'POSITIVE', label: 'Positive' }
];

const orderOfImpactMenu: { value: OrderOfImpact; label: string }[] = [
    { value: 'IMMEDIATE', label: 'Immediate' },
    { value: 'ENABLING', label: 'Enabling' },
    { value: 'STRUCTURAL', label: 'Structural' }
];

export function ImpactList({ reportId }: ImpactListProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [matrixDialogOpen, setMatrixDialogOpen] = useState(false);
    
    const { 
        impacts, 
        fetchImpactsByReport, 
        createImpact, 
        deleteImpact,
        impactLoading 
    } = useImpact();

    const [searchText, setSearchText] = useState('');
    const [typeFilter, setTypeFilter] = useState<ImpactType | 'ALL'>('ALL');
    const [orderFilter, setOrderFilter] = useState<OrderOfImpact | 'ALL'>('ALL');
    const [topicFilter, setTopicFilter] = useState<string>('ALL');
    const [likelihoodRange, setLikelihoodRange] = useState<number[]>([0, 5]);
    const [severityRange, setSeverityRange] = useState<number[]>([0, 5]);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [filtersExpanded, setFiltersExpanded] = useState(!isMobile);
    
    // Added confirmation dialog states
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [impactToDelete, setImpactToDelete] = useState<Impact | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (reportId) {
            fetchImpactsByReport(reportId);
        }
    }, [reportId, fetchImpactsByReport]);

    // Update filters expanded state when screen size changes
    useEffect(() => {
        setFiltersExpanded(!isMobile);
    }, [isMobile]);

    // Extract unique topics from impacts
    const availableTopics = useMemo(() => {
        const topicsMap = new Map();
        impacts.forEach(impact => {
            if (impact.topic) {
                topicsMap.set(impact.topicId, {
                    id: impact.topicId,
                    name: impact.topic.name
                });
            }
        });
        return Array.from(topicsMap.values());
    }, [impacts]);

    // Calculate severity for filtering
    const impactsWithSeverity = useMemo(() => {
        return impacts.map(impact => ({
            ...impact,
            severity: (impact.scope + impact.irremediability + impact.scale) / 3
        }));
    }, [impacts]);

    // Count active filters
    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (searchText.trim() !== '') count++;
        if (typeFilter !== 'ALL') count++;
        if (orderFilter !== 'ALL') count++;
        if (topicFilter !== 'ALL') count++;
        if (likelihoodRange[0] !== 0 || likelihoodRange[1] !== 5) count++;
        if (severityRange[0] !== 0 || severityRange[1] !== 5) count++;
        return count;
    }, [searchText, typeFilter, orderFilter, topicFilter, likelihoodRange, severityRange]);

    // Filtering logic
    const filteredImpacts = useMemo(() => {
        return impactsWithSeverity.filter(impact => {
            const matchesSearch =
                impact.title.toLowerCase().includes(searchText.toLowerCase()) ||
                impact.description.toLowerCase().includes(searchText.toLowerCase());

            const matchesType = typeFilter === 'ALL' || impact.type === typeFilter;
            const matchesOrder = orderFilter === 'ALL' || impact.orderOfEffect === orderFilter;
            const matchesTopic = topicFilter === 'ALL' || impact.topicId === topicFilter;
            const matchesLikelihood = impact.likelihood >= likelihoodRange[0] && impact.likelihood <= likelihoodRange[1];
            const matchesSeverity = impact.severity >= severityRange[0] && impact.severity <= severityRange[1];

            return matchesSearch && matchesType && matchesOrder && matchesTopic && matchesLikelihood && matchesSeverity;
        });
    }, [impactsWithSeverity, searchText, typeFilter, orderFilter, topicFilter, likelihoodRange, severityRange]);

    const handleCreateOpen = () => setCreateDialogOpen(true);
    const handleCreateClose = () => setCreateDialogOpen(false);

    const handleCreateImpact = async (input: CreateImpactInput) => {
        await createImpact(input);
    };

    // Modified delete handler to show confirmation dialog first
    const handleDeleteImpact = (id: string) => {
        const impact = impacts.find(impact => impact.id === id);
        if (impact) {
            setImpactToDelete(impact);
            setConfirmDeleteOpen(true);
        }
    };

    // Actual delete function called after confirmation
    const confirmDeleteImpact = async () => {
        if (!impactToDelete) return;
        
        setIsDeleting(true);
        try {
            await deleteImpact(impactToDelete.id);
            setConfirmDeleteOpen(false);
            setImpactToDelete(null);
        } catch (error) {
            console.error('Error deleting impact:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    // Cancel delete confirmation
    const handleCancelDelete = () => {
        setConfirmDeleteOpen(false);
        setImpactToDelete(null);
        setIsDeleting(false);
    };

    const handleClearFilters = () => {
        setSearchText('');
        setTypeFilter('ALL');
        setOrderFilter('ALL');
        setTopicFilter('ALL');
        setLikelihoodRange([0, 5]);
        setSeverityRange([0, 5]);
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
                    Impacts ({filteredImpacts.length})
                </Typography>
                <Stack direction="row" spacing={2}>
                    <Button variant="contained" onClick={handleCreateOpen}>
                        Create Impact
                    </Button>
                    <Button 
                        variant="outlined" 
                        onClick={() => setMatrixDialogOpen(true)}
                    >
                        Impact Matrix
                    </Button>
                </Stack>
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
                                label="Search impacts..."
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
                                        onChange={(e) => setTypeFilter(e.target.value as ImpactType | 'ALL')}
                                        fullWidth
                                        size="small"
                                    >
                                        <MenuItem value="ALL">All Types</MenuItem>
                                        {impactTypeMenu.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
                                    <TextField
                                        select
                                        label="Order of Impact"
                                        value={orderFilter}
                                        onChange={(e) => setOrderFilter(e.target.value as OrderOfImpact | 'ALL')}
                                        fullWidth
                                        size="small"
                                    >
                                        <MenuItem value="ALL">All Orders</MenuItem>
                                        {orderOfImpactMenu.map((option) => (
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
                                        Severity: {severityRange[0]} - {severityRange[1]}
                                    </Typography>
                                    <Slider
                                        value={severityRange}
                                        onChange={(e, newValue) => setSeverityRange(newValue as number[])}
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
            {impactLoading ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography>Loading impacts...</Typography>
                </Box>
            ) : filteredImpacts.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                        {impacts.length === 0 ? 'No impacts found for this report' : 'No impacts match your filters'}
                    </Typography>
                    {activeFiltersCount > 0 && (
                        <Button variant="outlined" onClick={handleClearFilters}>
                            Clear All Filters
                        </Button>
                    )}
                </Box>
            ) : (
                <Grid container spacing={2}>
                    {filteredImpacts.map((impact) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={impact.id}>
                            <ImpactCard 
                                impact={impact} 
                                onDelete={handleDeleteImpact}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Create Dialog */}
            <CreateImpactDialog
                open={createDialogOpen}
                onClose={handleCreateClose}
                onCreate={handleCreateImpact}
                reportId={reportId}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmationDialog
                open={confirmDeleteOpen}
                onClose={handleCancelDelete}
                onConfirm={confirmDeleteImpact}
                variant="danger"
                title="Delete Impact"
                message={`Are you sure you want to delete impact '${impactToDelete?.title}'?`}
                details="This action cannot be undone. All data associated with this impact will be permanently removed."
                confirmText="Delete Impact"
                cancelText="Cancel"
                loading={isDeleting}
            />

            <ImpactMatrixDialog
                open={matrixDialogOpen}
                onClose={() => setMatrixDialogOpen(false)}
                impacts={impacts}
            />
        </Box>
    );
}
