'use client';

import React, { useState } from 'react';
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
  Chip,
  IconButton,
} from '@mui/material';
import { MdClear as ClearIcon } from 'react-icons/md';
import { StakeholderRating, AnalystSubmission } from '@/lib/types';

interface StakeholderRatingsViewProps {
  ratings: AnalystSubmission;
}

type SortField = 'name' | 'influence' | 'impact';
type SortDirection = 'asc' | 'desc';

export function StakeholderRatingsView({ ratings }: StakeholderRatingsViewProps) {
  const [filterAnalyst, setFilterAnalyst] = useState<string>('Average');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Get list of analysts from ratings keys (excluding Average)
  const analysts = Object.keys(ratings).filter(name => name !== 'Average');

  // Get data to display based on filter
  const getDataToDisplay = (): StakeholderRating[] => {
    if (filterAnalyst === 'Average') {
      return ratings['Average'] || [];
    } else {
      return ratings[filterAnalyst] || [];
    }
  };

  // Handle sorting
  const handleSort = (field: SortField) => {
    const isAsc = sortField === field && sortDirection === 'asc';
    setSortField(field);
    setSortDirection(isAsc ? 'desc' : 'asc');
  };

  // Sort data
  const sortedData = [...getDataToDisplay()].sort((a, b) => {
    let aValue: string | number = '';
    let bValue: string | number = '';

    switch (sortField) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'influence':
        aValue = a.influence;
        bValue = b.influence;
        break;
      case 'impact':
        aValue = a.impact;
        bValue = b.impact;
        break;
    }

    if (aValue < bValue) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Get color for rating values
  const getRatingColor = (value: number) => {
    if (value >= 4) return 'error';
    if (value >= 3) return 'warning';
    return 'success';
  };

  return (
    <Paper sx={{ p: 4, borderRadius: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
        Stakeholder Ratings Analysis
      </Typography>

      {/* Filter and Sort Controls */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Analyst</InputLabel>
          <Select
            value={filterAnalyst}
            onChange={(e) => setFilterAnalyst(e.target.value)}
            label="Filter by Analyst"
          >
            <MenuItem value="Average">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip label="AVG" size="small" color="primary" />
                Average
              </Box>
            </MenuItem>
            {analysts.map(analyst => (
              <MenuItem key={analyst} value={analyst}>
                {analyst}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {filterAnalyst !== 'Average' && (
          <IconButton
            size="small"
            onClick={() => setFilterAnalyst('Average')}
            sx={{ bgcolor: 'action.hover' }}
          >
            <ClearIcon />
          </IconButton>
        )}

        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Showing {sortedData.length} stakeholders
          </Typography>
          {filterAnalyst !== 'Average' && (
            <Chip 
              label={`${filterAnalyst} Data`} 
              size="small" 
              variant="outlined" 
            />
          )}
        </Box>
      </Box>

      {/* Data Table */}
      {sortedData.length === 0 ? (
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
              {filterAnalyst === 'Average' 
                ? 'No analyst submissions found to calculate averages'
                : `No data found for ${filterAnalyst}`
              }
            </Typography>
          </Box>
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'action.hover' }}>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'name'}
                    direction={sortField === 'name' ? sortDirection : 'asc'}
                    onClick={() => handleSort('name')}
                    sx={{ fontWeight: 600 }}
                  >
                    Stakeholder Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'influence'}
                    direction={sortField === 'influence' ? sortDirection : 'asc'}
                    onClick={() => handleSort('influence')}
                    sx={{ fontWeight: 600 }}
                  >
                    Influence
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'impact'}
                    direction={sortField === 'impact' ? sortDirection : 'asc'}
                    onClick={() => handleSort('impact')}
                    sx={{ fontWeight: 600 }}
                  >
                    Impact
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData.map(row => (
                <TableRow 
                  key={`${row.id}-${filterAnalyst}`} 
                  sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                >
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {row.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.influence.toFixed(1)}
                      color={getRatingColor(row.influence)}
                      size="small"
                      sx={{ fontWeight: 600, minWidth: 50 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.impact.toFixed(1)}
                      color={getRatingColor(row.impact)}
                      size="small"
                      sx={{ fontWeight: 600, minWidth: 50 }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Summary Information */}
      {sortedData.length > 0 && (
        <Box sx={{ 
          mt: 3, 
          pt: 2, 
          borderTop: '1px solid', 
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography variant="body2" color="text.secondary">
            {filterAnalyst === 'Average' 
              ? `Average ratings calculated from ${analysts.length} analysts`
              : `Individual ratings from ${filterAnalyst}`
            }
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Rating Scale:
            </Typography>
            <Chip label="High (4-5)" color="error" size="small" variant="outlined" />
            <Chip label="Medium (3-4)" color="warning" size="small" variant="outlined" />
            <Chip label="Low (1-3)" color="success" size="small" variant="outlined" />
          </Box>
        </Box>
      )}
    </Paper>
  );
}
