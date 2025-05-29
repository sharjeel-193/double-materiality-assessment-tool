'use client';

import React, { useState, useMemo } from "react";
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
    Button
} from "@mui/material";
import standardsData from '@/data/standards.json';
import { createCSV } from "@/lib/csvHandlers";

type Topic = { Topic: string; Description: string, id: string };
type DimensionName = string;
type StandardName = string;

export function TopicStandards() {
    // standardsData = { Standards: { susaf: { Environmental: [...], Social: [...], ... } } }
    const standards = standardsData.Standards as Record<StandardName, Record<DimensionName, Topic[]>>;
    const availableStandards = Object.keys(standards);

    const [selectedStandard, setSelectedStandard] = useState<StandardName>(availableStandards[0]);
    const dimensions = Object.keys(standards[selectedStandard] || {});
    const [filterDimension, setFilterDimension] = useState<DimensionName | 'All'>('All');

    // Flatten all topics for the selected standard into a single array with dimension info
    const allTopics: { Dimension: string; Topic: string; Description: string, id: string }[] = useMemo(
        () =>
            Object.entries(standards[selectedStandard] || {}).flatMap(([dimension, topics]) =>
                topics.map(topic => ({
                    id: topic.id,
                    Dimension: dimension,
                    Topic: topic.Topic,
                    Description: topic.Description,
                }))
            ),
        [standards, selectedStandard]
    );

    // Filtered topics for table and CSV
    const filteredTopics = filterDimension === 'All'
        ? allTopics
        : allTopics.filter(row => row.Dimension === filterDimension);

    // Download CSV
    const handleDownloadCSV = () => {
        const headers = ['id', 'Dimension', 'Topic', 'Description', 'Magnitude', 'Relevance'];
        const csvRows = filteredTopics.map((row) => [
            row.id,
            row.Dimension,
            row.Topic,
            row.Description,
            "",
            ""
        ])
        const csvContent = [
            headers.join(','),
            ...csvRows.map(row =>
                row.map(val =>
                    `"${String(val).replace(/"/g, '""')}"`
                ).join(',')
            )
        ].join('\n');

        createCSV(csvContent, 'topics-rating-survey.csv')
    };

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
                        const std = e.target.value as StandardName;
                        setSelectedStandard(std);
                        setFilterDimension('All');
                        }}
                    >
                        {availableStandards.map(standard => (
                        <MenuItem key={standard} value={standard}>
                            {standard}
                        </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 180 }}>
                    <InputLabel>Filter by Dimension</InputLabel>
                    <Select
                        value={filterDimension}
                        label="Filter by Dimension"
                        onChange={e => setFilterDimension(e.target.value as DimensionName | 'All')}
                    >
                        <MenuItem value="All">All</MenuItem>
                        {dimensions.map(dim => (
                            <MenuItem key={dim} value={dim}>
                                {dim}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Topics in <b>{selectedStandard}</b>
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
                            (() => {
                                const rowsWithRowSpan: Array<{ row: typeof filteredTopics[0]; rowSpan?: number; showDimension: boolean }> = [];
                                let lastDimension = '';
                                filteredTopics.forEach((row) => {
                                    if (row.Dimension !== lastDimension) {
                                        // Count how many rows have this dimension
                                        const rowSpan = filteredTopics.filter(r => r.Dimension === row.Dimension).length;
                                        rowsWithRowSpan.push({ row, rowSpan, showDimension: true });
                                        lastDimension = row.Dimension;
                                    } else {
                                        rowsWithRowSpan.push({ row, showDimension: false });
                                    }
                                })
                            return rowsWithRowSpan.map(({ row, rowSpan, showDimension }, idx) => (
                                <TableRow key={row.Dimension + row.Topic + idx}>
                                    {showDimension ? (
                                        <TableCell rowSpan={rowSpan}>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                {row.Dimension}
                                            </Typography>
                                        </TableCell>
                                    ) : null}
                                    <TableCell>{row.Topic}</TableCell>
                                    <TableCell>{row.Description}</TableCell>
                                </TableRow>
                            ));
                            })()
                            
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
