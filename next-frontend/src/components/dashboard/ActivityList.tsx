import React from 'react';
import {
  Paper,
  Box,
  IconButton,
  Typography,
  Divider,
  alpha,
  useTheme,
  Stack,
  Tooltip,
} from '@mui/material';
import { MdEdit as EditIcon, MdDelete as DeleteIcon } from 'react-icons/md';
import { Activity } from '@/types';

interface ActivityListProps {
    activities: Activity[];
    type: 'Upstream' | 'Downstream';
    onEdit: (activity: Activity) => void;
    onDelete: (id: string) => void;
}

export function ActivityList({ activities, type, onEdit, onDelete }: ActivityListProps) {
    const isUpstream = type === 'Upstream';
    const theme = useTheme();

    return (
        <Paper 
            variant="outlined" 
            sx={{ 
                p: 2, 
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
                </Box>
            ) : (
                <Stack spacing={2}>
                    {activities.map((activity, index) => (
                        <Box key={activity.id}>
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: alpha(theme.palette.background.default, 0.3),
                                    border: `1px solid ${theme.palette.divider}`,
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    justifyContent: 'space-between',
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

                                <Stack direction="row" spacing={1}>
                                    <Tooltip title="Edit">
                                        <IconButton 
                                            size="small" 
                                            onClick={() => onEdit(activity)}
                                            sx={{ color: 'inherit' }}
                                        >
                                            <EditIcon size={16} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton 
                                            size="small" 
                                            onClick={() => onDelete(activity.id)}
                                            sx={{ color: 'inherit' }}
                                        >
                                            <DeleteIcon size={16} />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                            </Box>
                            {/* Divider between activities (except last one) */}
                            {index < activities.length - 1 && (
                                <Divider sx={{ my: 1, borderColor: theme.palette.divider }} />
                            )}
                        </Box>
                    ))}
                </Stack>
            )}
        </Paper>
    );
}
