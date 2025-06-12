'use client';

import React from 'react';
import {
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Alert,
    Chip,
    Fade,
} from '@mui/material';
import { MdUpload as UploadIcon, MdCheckCircle as CheckIcon } from 'react-icons/md';

interface FileUploadMapperProps {
    
    // Content props
    title: string;
    description: string;
    label: string;
    submissionMap: Record<string, string>
    uploaders: { id: string; name: string }[];
    
    // State props
    selectedUploader: string;
    uploadError: string;
    successMessage: string;
    allSuccessMessage: string;
    
    // Handler props
    onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSelectedUploaderChange: (uploader: string) => void;

    // Optional props
    acceptedFileTypes?: string;
    disabled?: boolean;
    maxWidth?: number | string;
}

export function FileUploadMapper({
    submissionMap,
    uploaders,
    label,
    selectedUploader,
    uploadError,
    successMessage,
    allSuccessMessage,
    onFileUpload,
    onSelectedUploaderChange,
    maxWidth = 700,
    acceptedFileTypes = '.csv',
}: FileUploadMapperProps) {

    // Check if all uploaders have submitted
    const allUploaded = Object.keys(submissionMap).length === uploaders.length;
    const pendingUploaders = uploaders.filter(user => !(user.id in submissionMap))
    const submittedUploaders = uploaders.filter(user => (user.id in submissionMap));
    // Check if there are any alerts to show
    const hasActiveAlert = uploadError || successMessage || (pendingUploaders.length > 0) || allUploaded;

    return (
        <Box sx={{ maxWidth, width: '100%' }}>
            {/* Header Section
            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {description}
                </Typography>
            </Box> */}

            {/* Upload Controls */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Uploader Selection */}
                <FormControl fullWidth>
                    <InputLabel>{label}</InputLabel>
                    <Select
                        value={selectedUploader}
                        onChange={(e) => onSelectedUploaderChange(e.target.value)}
                        label={label}
                        sx={{ borderRadius: 2 }}
                    >
                        {/* Pending uploaders */}
                        {pendingUploaders.map(person => (
                        <MenuItem key={person.id} value={person.id}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                                <Typography>{person.name}</Typography>
                            </Box>
                        </MenuItem>
                        ))}
                        
                        {/* No options available */}
                        {pendingUploaders.length === 0 && submittedUploaders.length === 0 && (
                            <MenuItem disabled>
                                <Typography color="text.secondary">No uploaders available</Typography>
                            </MenuItem>
                        )}
                    </Select>
                </FormControl>
                
                {/* Upload Button */}
                <Button
                    variant="contained"
                    component="label"
                    startIcon={<UploadIcon />}
                    disabled={!selectedUploader}
                    sx={{ 
                        borderRadius: 2, 
                        alignSelf: 'flex-start',
                        px: 3,
                        py: 1.5,
                        fontWeight: 600,
                    }}
                >
                    Upload CSV
                    <input
                        type="file"
                        accept={acceptedFileTypes}
                        hidden
                        onChange={onFileUpload}
                    />
                </Button>

                {/* Alert Messages */}
                <Box sx={{ minHeight: hasActiveAlert ? 'auto' : 0 }}>
                    {/* Error Alert */}
                    <Fade in={!!uploadError}>
                        <Box>
                        {uploadError && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                            {uploadError}
                            </Alert>
                        )}
                        </Box>
                    </Fade>

                    {/* Success Alert */}
                    <Fade in={!!successMessage}>
                        <Box>
                        {successMessage && (
                            <Alert severity="success" sx={{ mb: 2 }}>
                            {successMessage}
                            </Alert>
                        )}
                        </Box>
                    </Fade>

                    {/* Pending Info Alert */}
                    {pendingUploaders.length > 0 && !uploadError && !successMessage && (
                        <Alert severity="info" sx={{ mb: 2 }}>
                            <Typography variant="body2">
                                <strong>Pending submissions from:</strong> {pendingUploaders.map(uploader => uploader.name).join(', ')}
                            </Typography>
                        </Alert>
                    )}

                    {/* All Complete Alert */}
                    {allUploaded && !uploadError && !successMessage && (
                        <Alert severity="success" icon={<CheckIcon />}>
                            {allSuccessMessage}
                        </Alert>
                    )}
                </Box>

                {/* Progress Indicator */}
                {(pendingUploaders.length > 0 || submittedUploaders.length > 0) && (
                    <Box sx={{ 
                        p: 2, 
                        bgcolor: 'action.hover', 
                        borderRadius: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <Typography variant="body2" color="text.secondary">
                            Progress: {submittedUploaders.length} / {pendingUploaders.length + submittedUploaders.length} completed
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Chip 
                                label={`${submittedUploaders.length} Submitted`} 
                                color="success" 
                                size="small" 
                                variant="outlined" 
                            />
                            <Chip 
                                label={`${pendingUploaders.length} Pending`} 
                                color="warning" 
                                size="small" 
                                variant="outlined" 
                            />
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
}
