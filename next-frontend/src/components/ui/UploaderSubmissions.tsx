'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { handleCSVFileUpload } from '@/lib/csvHandlers';
import { FileUploadMapper, FileUploadersSummary } from '@/components';
import { CSVColumn } from '@/lib/types';

interface UploaderSubmissionsProps<T> {
    csvStructure: CSVColumn[];
    teamUploaders: { id: string; name: string }[];
    submissionMap: Record<string, string>,
    submissions: Record<string, T[]>;
    onUploadData: (uploader: string, data: T[]) => void;
    onRemoveUploaderData: (uploader: string) => void;
    title: string;
    description: string;
    allSuccessMessage?: string;
}

export function UploaderSubmissions<T>({
    csvStructure,
    teamUploaders,
    submissions,
    submissionMap,
    onUploadData,
    onRemoveUploaderData,
    title,
    description,
    allSuccessMessage = "🎉 All team uploaders have submitted their data!"
}: UploaderSubmissionsProps<T>) {
    const [uploadError, setUploadError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [selectedUploader, setSelectedUploader] = useState<string>('');

    // Auto-hide alerts after 3 seconds
    useEffect(() => {
        if (uploadError) {
            const timer = setTimeout(() => setUploadError(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [uploadError]);
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    // File upload handler using the universal CSV handler
    const handleUniversalFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!selectedUploader) {
            setUploadError('Please select an uploader before uploading the file.');
            return;
        }
        handleCSVFileUpload(
            file,
            selectedUploader,
            csvStructure,
            (uploader, data) => {
                console.log(uploader, data)
                onUploadData(uploader, data as T[]);
            },
            setUploadError,
            setSuccessMessage,
            setSelectedUploader
        );
        event.target.value = '';
    };

    // Get count of uploaded items for a given uploader
    const getUploadCount = (uploader: string): number => {
        return submissions[uploader]?.length || 0;
    };

    return (
        <Paper sx={{ p: 4, mb: 4, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 4 }}>
                {title}
            </Typography>
            <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                    {description}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
                <FileUploadMapper
                    submissionMap={submissionMap}
                    uploaders={teamUploaders}
                    title={title}
                    description={description}
                    label="Select Uploader"
                    onFileUpload={handleUniversalFileUpload}
                    uploadError={uploadError}
                    successMessage={successMessage}
                    allSuccessMessage={allSuccessMessage}
                    selectedUploader={selectedUploader}
                    onSelectedUploaderChange={setSelectedUploader}
                    acceptedFileTypes=".csv"
                    maxWidth={600}
                />
                <FileUploadersSummary
                    uploaders={teamUploaders}
                    submissionMap={submissionMap}
                    title="Team Uploaders Status"
                    getUploadCount={getUploadCount}
                    onRemoveUploader={onRemoveUploaderData}
                    showDeleteOnHover={true}
                />
            </Box>
        </Paper>
    );
}
