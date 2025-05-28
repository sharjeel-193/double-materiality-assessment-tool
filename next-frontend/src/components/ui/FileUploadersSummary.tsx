'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Paper,
} from '@mui/material';
import {
  MdDelete as DeleteIcon,
  MdCheckCircle as CheckIcon,
} from 'react-icons/md';

interface FileUploadersSummaryProps {
    // Data props
    uploaders: string[];
    submittedUploaders: string[];
    pendingUploaders: string[];
    
    // Content props
    title: string;
    getUploadCount?: (uploader: string) => number;
    
    // Handler props
    onRemoveUploader?: (uploader: string) => void;
    
    // Optional props
    showDeleteOnHover?: boolean;
    minWidth?: number | string;
    maxWidth?: number | string;
    showCounts?: boolean;
}

export function FileUploadersSummary({
    uploaders,
    submittedUploaders,
    title,
    onRemoveUploader,
    showDeleteOnHover = true,
    minWidth = 300,
    maxWidth = 300,
}: FileUploadersSummaryProps) {
    const [hoveredUploader, setHoveredUploader] = useState<string>('');

    const handleRemove = (uploader: string) => {
        if (onRemoveUploader) {
        onRemoveUploader(uploader);
        }
    };

    return (
        <Box sx={{ minWidth, maxWidth, width: '100%' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            {title}
        </Typography>
        
        <Paper
            variant="outlined"
            sx={{ 
                borderRadius: 2,
                overflow: 'hidden'
            }}
        >
            <List sx={{ p: 0 }}>
            {uploaders.map((uploader, index) => {
                const hasSubmitted = submittedUploaders.includes(uploader);
                
                return (
                <ListItem
                    key={uploader}
                    onMouseEnter={() => setHoveredUploader(uploader)}
                    onMouseLeave={() => setHoveredUploader('')}
                    sx={{
                        borderBottom: index < uploaders.length - 1 ? '1px solid' : 'none',
                        borderColor: 'divider',
                        transition: 'background-color 0.2s ease',
                        '&:hover': {
                            bgcolor: 'action.hover',
                        },
                        py: 0,
                        px: 1,
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                        {hasSubmitted && (
                            <CheckIcon style={{ color: 'success.main' }} />
                        )}
                    </ListItemIcon>
                    
                    <ListItemText
                        primary={
                            <Typography 
                            variant="subtitle2" 
                            sx={{ 
                                fontWeight: 600,
                                color: hasSubmitted ? 'success.main' : 'text.disabled',
                            }}
                            >
                            {uploader}
                            </Typography>
                        }
                    />
                    
                    {/* Delete button on hover */}
                    {hasSubmitted && 
                    showDeleteOnHover && 
                    hoveredUploader === uploader && 
                    onRemoveUploader && (
                        <IconButton
                            size="small"
                            onClick={() => handleRemove(uploader)}
                            sx={{ 
                            color: 'error.main',
                            opacity: 0.8,
                            '&:hover': {
                                opacity: 1,
                                bgcolor: 'error.light',
                            },
                            }}
                        >
                            <DeleteIcon size={16} />
                        </IconButton>
                    )}
                </ListItem>
                );
            })}
            
            {/* Empty state */}
            {uploaders.length === 0 && (
                <ListItem sx={{ py: 4, justifyContent: 'center' }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            No uploaders available
                        </Typography>
                    </Box>
                </ListItem>
            )}
            </List>
        </Paper>
        </Box>
    );
}
