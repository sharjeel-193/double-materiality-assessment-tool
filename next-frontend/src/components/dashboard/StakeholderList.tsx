'use client';

import React, { useEffect } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
} from '@mui/material';
import { MdEdit as EditIcon, MdDelete as DeleteIcon } from 'react-icons/md';
import { Stakeholder } from '@/types';

export interface StakeholderListProps {
    stakeholders: Stakeholder[];
    onEdit: (stakeholder: Stakeholder) => void;
    onDelete: (id: string) => void;
}

export function StakeholderList({ stakeholders, onEdit, onDelete }: StakeholderListProps) {
    useEffect(() => {
        console.log({'In List': stakeholders})
    }, [stakeholders])
    if (stakeholders.length === 0) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 8,
                    textAlign: 'center',
                }}
            >
                <Typography variant="h6" sx={{ mb: 1, opacity: 0.6 }}>
                    👥
                </Typography>
                <Typography variant="h6" sx={{ mb: 1 }}>
                    No Stakeholders Added
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Click Add Stakeholder to start building your stakeholder list
                </Typography>
            </Box>
        );
    }

    return (
        <TableContainer 
            component={Paper} 
            sx={{ 
                borderRadius: 2,
                boxShadow: 'none',
                border: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow sx={{ bgcolor: 'action.hover' }}>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                            Name
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                            Activity
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                            Description
                        </TableCell>
                        <TableCell 
                            align="center" 
                            sx={{ fontWeight: 600, fontSize: '0.875rem', width: 120 }}
                        >
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {stakeholders.map((stakeholder) => (
                        <TableRow
                            key={stakeholder.id}
                            sx={{
                                '&:hover': {
                                    bgcolor: 'action.hover',
                                },
                                '&:last-child td, &:last-child th': {
                                    border: 0,
                                },
                            }}
                        >
                            <TableCell>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                    {stakeholder.name}
                                </Typography>
                            </TableCell>
                            
                            <TableCell>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        {stakeholder.activity?.name}
                                    </Typography>
                                    <Chip 
                                        size='small'  
                                        label={stakeholder.activity?.type} 
                                        color={stakeholder.activity?.type === 'DOWNSTREAM' ? 'primary' : 'secondary'}
                                    />
                                </Box>
                            </TableCell>
                            
                            <TableCell sx={{ maxWidth: 300 }}>
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        lineHeight: 1.4,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                    }}
                                >
                                    {stakeholder.description}
                                </Typography>
                            </TableCell>
                            
                            
                            <TableCell align="center">
                                <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                                    <IconButton
                                        size="small"
                                        onClick={() => onEdit(stakeholder)}
                                        sx={{
                                            bgcolor: 'action.hover',
                                            '&:hover': { 
                                                bgcolor: 'primary.light', 
                                                color: 'text.primary' 
                                            },
                                        }}
                                    >
                                        <EditIcon size={16} />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={() => onDelete(stakeholder.id)}
                                        sx={{
                                            bgcolor: 'action.hover',
                                            '&:hover': { 
                                                bgcolor: 'error.light', 
                                                color: 'text.primary' 
                                            },
                                        }}
                                    >
                                        <DeleteIcon size={16} />
                                    </IconButton>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
