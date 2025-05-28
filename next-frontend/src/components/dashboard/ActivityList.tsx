'use client';

import React from 'react';
import {
  Paper,
  Box,
  IconButton,
  Typography,
  Divider,
  alpha,
  useTheme,
} from '@mui/material';
import { MdEdit as EditIcon, MdDelete as DeleteIcon } from 'react-icons/md';
import { Activity } from '@/lib/types';

interface ActivityListProps {
    activities: Activity[];
    type: 'Upstream' | 'Downstream';
    onEdit: (activity: Activity) => void;
    onDelete: (id: number) => void;
    isEditMode: boolean;
}

export function ActivityList({ activities, type, onEdit, onDelete, isEditMode }: ActivityListProps) {
    const isUpstream = type === 'Upstream';
    const theme = useTheme()
    
    return (
        <Paper 
            variant="outlined" 
            sx={{ 
                p: 3, 
                minHeight: 200,
                borderRadius: 3,
                bgcolor: isUpstream ? 'primary.light' : 'secondary.light',
                color: isUpstream ? 'primary.contrastText' : 'secondary.contrastText',
                border: '2px solid',
                borderColor: isUpstream ? 'primary.main' : 'secondary.main',
            }}
        >
            {activities.length === 0 ? (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: 120,
                        opacity: 0.7,
                    }}
                >
                    <Typography 
                        variant="h6" 
                        sx={{
                            mb: 1,
                            opacity: 0.3,
                        }}
                    >
                        {isUpstream ? '⬅️' : '➡️'}
                    </Typography>
                    <Typography 
                        variant="body2" 
                        sx={{ 
                            textAlign: 'center',
                            fontWeight: 500,
                        }}
                    >
                        No {type.toLowerCase()} activities added
                    </Typography>
                    {isEditMode && (
                        <Typography 
                            variant="caption" 
                            sx={{ 
                                textAlign: 'center',
                                mt: 0.5,
                                opacity: 0.8,
                            }}
                        >
                            Click Add Activity to get started
                        </Typography>
                    )}
                </Box>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {activities.map((activity, index) => (
                        <Box key={activity.id}>
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: alpha(theme.palette.background.default, 0.2),
                                    border: 'text.secondary',
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        justifyContent: 'space-between',
                                        mb: 1,
                                    }}
                                >
                                    <Box sx={{ flex: 1, mr: 2 }}>
                                        <Typography 
                                            variant="subtitle2" 
                                            sx={{ 
                                                fontWeight: 700,
                                                fontSize: '1rem',
                                                lineHeight: 1.3,
                                                mb: 0.5,
                                            }}
                                        >
                                            {activity.name}
                                        </Typography>
                                        <Typography 
                                            variant="caption" 
                                            sx={{ 
                                                opacity: 0.9,
                                                lineHeight: 1.4,
                                                display: 'block',
                                            }}
                                        >
                                            {activity.description}
                                        </Typography>
                                    </Box>

                                    {isEditMode && (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 0.5,
                                                flexShrink: 0,
                                            }}
                                        >
                                            <IconButton 
                                                size="small" 
                                                onClick={() => onEdit(activity)}
                                                sx={{ 
                                                    color: 'inherit',
                                                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                                                }}
                                            >
                                                <EditIcon size={16} />
                                            </IconButton>
                                            <IconButton 
                                                size="small" 
                                                onClick={() => onDelete(activity.id)}
                                                sx={{ 
                                                    color: 'inherit',
                                                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                                                }}
                                            >
                                                <DeleteIcon size={16} />
                                            </IconButton>
                                        </Box>
                                    )}
                                </Box>
                            </Box>

                            {/* Divider between activities (except last one) */}
                            {index < activities.length - 1 && (
                                <Divider 
                                    sx={{ 
                                        my: 1,
                                        borderColor: 'rgba(255, 255, 255, 0.2)',
                                    }} 
                                />
                            )}
                        </Box>
                    ))}
                </Box>
            )}
        </Paper>
    );
}
