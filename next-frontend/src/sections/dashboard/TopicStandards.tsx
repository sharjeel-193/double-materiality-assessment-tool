'use client';

import React, { useState, useMemo, useEffect } from "react";
import {
    Paper,
    Typography,
    Box,
    FormControl,
    Select,
    InputLabel,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Checkbox,
    ListItemText
} from "@mui/material";
import { createCSV } from "@/lib/csvHandlers";
import { Topic } from '@/types';
import { Loader } from "@/components";

export interface TopicStandardsProps {
    topics: Topic[]; // Each topic has {id, name, description, dimension: {id, name}}
    standards: { id: string; name: string }[]; // List of standards
    loading: boolean,
    error: string | null
}

export function TopicStandards({ topics, standards, loading, error }: TopicStandardsProps) {
    // Assuming each topic.dimension.name is the dimension name,
    // and each topic.dimension.standardId or similar is the standard id.
    // If not, adjust accordingly.

    // Build a map of standardId to standardName for dropdown
    const standardMap = useMemo(
        () => Object.fromEntries(standards.map(s => [s.id, s.name])),
        [standards]
    );

    useEffect(() => {
        console.log({'Topics': topics})
    }, [topics])

    const [selectedStandard, setSelectedStandard] = useState<string>(standards[0]?.id || '');
    const [filterDimension, setFilterDimension] = useState<string | 'All'>('All');
    const [selectedDimensions, setSelectedDimensions] = useState<string[]>([]);

    // Filter topics by selected standard

    // Get unique dimensions for the selected standard
    const dimensions = useMemo(
        () => Array.from(new Set(topics.map(t => t.dimension.name))),
        [topics]
    );

    // Filtered topics for table and CSV
    const filteredTopics = useMemo(() => {
        if (!selectedDimensions.length) return topics;
        return topics.filter(t => selectedDimensions.includes(t.dimension.name));
    }, [topics, selectedDimensions]);

    const groupedTopics = useMemo(() => {
        const groups: Record<string, Topic[]> = {};
        filteredTopics.forEach(topic => {
            const dim = topic.dimension.name;
            if (!groups[dim]) groups[dim] = [];
            groups[dim].push(topic);
        });
        return groups;
    }, [filteredTopics]);

    // Download CSV
    const handleDownloadCSV = () => {
        const headers = ['id', 'Dimension', 'Topic',  'Relevance', 'Magnitude'];
        const csvRows = filteredTopics.map((row) => [
            row.id,
            row.dimension.name,
            row.name,
            '',
            ''

        ]);
        const csvContent = [
            headers.join(','),
            ...csvRows.map(row =>
                row.map(val =>
                    `"${String(val).replace(/"/g, '""')}"`
                ).join(',')
            )
        ].join('\n');

        createCSV(csvContent, 'topics-rating-survey.csv');
    };

    if(loading){
        return (
            <Box>
                <Loader variant='page' message='Loading Topics ...' />
            </Box>
        )
    }
    if(error){
        return (
            <Box>
                <Typography color='error'>Sorry, we ran into some error, plaease try again ...</Typography>
            </Box>
        )
    }

    return (
        <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Topic Standards
            </Typography>
            <Box sx={{ mb: 3, display: 'flex', gap: 3 }}>
                <FormControl sx={{ minWidth: 180 }}>
                    <InputLabel>Select Standard</InputLabel>
                    <Select
                        value={selectedStandard}
                        label="Select Standard"
                        onChange={e => {
                            const std = e.target.value as string;
                            setSelectedStandard(std);
                            setFilterDimension('All');
                        }}
                    >
                        {standards.map(standard => (
                            <MenuItem key={standard.id} value={standard.id}>
                                {standard.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 180 }}>
                    <InputLabel>Filter by Dimension</InputLabel>
                    <Select
                        multiple
                        value={selectedDimensions}
                        onChange={e => setSelectedDimensions(typeof e.target.value === 'string'
                            ? e.target.value.split(',')
                            : e.target.value)}
                        renderValue={(selected) => (selected as string[]).join(', ') || 'All'}
                        label="Filter by Dimension"
                    >
                        {dimensions.map(dim => (
                            <MenuItem key={dim} value={dim}>
                                <Checkbox checked={selectedDimensions.indexOf(dim) > -1} />
                                <ListItemText primary={dim} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Topics in <b>{standardMap[selectedStandard]}</b>
                {filterDimension !== 'All' && <> / <b>{filterDimension}</b></>}
            </Typography>
            <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead >
                        <TableRow sx={{ bgcolor: 'action.hover' }}>
                            <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Dimension</TableCell>
                            <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Topic</TableCell>
                            <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Description</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredTopics.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} align="center">
                                    <Typography variant="body2" color="text.secondary">
                                        No topics found for this selection.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            Object.entries(groupedTopics).map(([dimensionName, topicsInDim]) =>
                                topicsInDim.map((topic, idx) => (
                                    <TableRow key={topic.id}>
                                        {idx === 0 && (
                                            <TableCell rowSpan={topicsInDim.length}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                    {dimensionName}
                                                </Typography>
                                            </TableCell>
                                        )}
                                        <TableCell>{topic.name}</TableCell>
                                        <TableCell>{topic.description}</TableCell>
                                    </TableRow>
                                ))
                            )
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleDownloadCSV}
                >
                    Download Topic Survey CSV
                </Button>
            </Box>
        </Paper>
    );
}
