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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    IconButton,
    TextField,
    Chip,
} from '@mui/material';
import { MdClear as ClearIcon } from 'react-icons/md';

type TableData = Record<string, string | number>;

interface RatingsTableViewProps {
    data: Record<string, TableData[]>;
    uploaderLabel?: string;
    showAverage?: boolean;
    title?: string;
}

type SortDirection = 'asc' | 'desc';

export function RatingsTableView({
    data,
    uploaderLabel = 'Uploader',
    showAverage = true,
    title = 'Data Table',
}: RatingsTableViewProps) {
    const allUploaders = useMemo(
        () => Object.keys(data).filter(name => showAverage || name !== 'Average'),
        [data, showAverage]
    );

    // Always default to "Average"
    const [filterUploader, setFilterUploader] = useState<string>('Average');
    const [sortField, setSortField] = useState<string>('');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [search, setSearch] = useState<string>('');

    // Get all columns from the first available data row
    const allColumns: string[] = useMemo(() => {
        const firstRow =
            (data['Average'] && data['Average'][0]) ||
            (allUploaders.length > 0 && data[allUploaders[0]] && data[allUploaders[0]][0]);
        return firstRow ? Object.keys(firstRow).filter(k => k !== 'uploader') : [];
    }, [data, allUploaders]);

    // Set default sort field if not set and columns exist
    React.useEffect(() => {
        if (!sortField && allColumns.length > 0) {
            setSortField(allColumns[0]);
        }
    }, [allColumns, sortField]);

    // Data to display (filtered, searched, sorted)
    const filteredRows = useMemo(() => {
        let rows = (data[filterUploader] || []) as TableData[];
        if (search.trim()) {
            const lower = search.trim().toLowerCase();
            rows = rows.filter(row =>
                allColumns.some(col => String(row[col]).toLowerCase().includes(lower))
            );
        }
        if (sortField) {
            rows = [...rows].sort((a, b) => {
                const aVal = a[sortField];
                const bVal = b[sortField];
                if (typeof aVal === 'number' && typeof bVal === 'number') {
                    return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
                }
                return sortDirection === 'asc'
                    ? String(aVal).localeCompare(String(bVal))
                    : String(bVal).localeCompare(String(aVal));
            });
        }
        return rows;
    }, [data, filterUploader, search, sortField, sortDirection, allColumns]);

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection(dir => (dir === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const getRatingColor = (value: number) => {
        if (value >= 4) return 'error';
        if (value >= 3) return 'warning';
        return 'success';
    };

    return (
        <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                {title}
            </Typography>

            {/* Controls */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Filter by {uploaderLabel}</InputLabel>
                    <Select
                        value={filterUploader}
                        onChange={e => setFilterUploader(e.target.value)}
                        label={`Filter by ${uploaderLabel}`}
                    >
                        <MenuItem value="Average">
                            <Chip label="AVG" size="small" color="primary" /> Average
                        </MenuItem>
                        {allUploaders
                            .filter(name => name !== 'Average')
                            .map(uploader => (
                                <MenuItem key={uploader} value={uploader}>
                                    {uploader}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>
                <TextField
                    label="Search"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    size="small"
                    sx={{ minWidth: 200 }}
                />
                {filterUploader !== 'Average' && (
                    <IconButton
                        size="small"
                        onClick={() => setFilterUploader('Average')}
                        sx={{ bgcolor: 'action.hover' }}
                    >
                        <ClearIcon />
                    </IconButton>
                )}
                <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        Showing {filteredRows.length} rows
                    </Typography>
                </Box>
            </Box>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'action.hover' }}>
                            {allColumns.map(col => (
                                <TableCell key={col}>
                                    <TableSortLabel
                                        active={sortField === col}
                                        direction={sortField === col ? sortDirection : 'asc'}
                                        onClick={() => handleSort(col)}
                                        sx={{ fontWeight: 600 }}
                                    >
                                        {col}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredRows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={allColumns.length} align="center">
                                    <Box sx={{ py: 6 }}>
                                        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                                            {filterUploader === 'Average'
                                                ? "No data uploaded yet. Once submissions are received, the average will appear here."
                                                : "No data for this uploader yet."}
                                        </Typography>
                                        {filterUploader === 'Average' && (
                                            <Typography variant="body2" color="text.secondary">
                                                Please upload at least one submission to see the average.
                                            </Typography>
                                        )}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredRows.map((row, idx) => (
                                <TableRow key={idx} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                                    {allColumns.map(col => (
                                        <TableCell key={col}>
                                            {typeof row[col] === 'number' ?
                                                (
                                                    <Chip
                                                        label={row[col].toFixed(1)}
                                                        color={getRatingColor(row[col])}
                                                        size="small"
                                                        sx={{ fontWeight: 600, minWidth: 50 }}
                                                    />
                                                ) :
                                                (row[col])
                                            }
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}
