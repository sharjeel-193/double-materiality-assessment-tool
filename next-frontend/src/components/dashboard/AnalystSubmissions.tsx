'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
} from '@mui/material';
import { StakeholderRating, AnalystSubmission, CSVColumn } from '@/lib/types';
import { FileUploadMapper, FileUploadersSummary } from '@/components'
import { handleCSVFileUpload } from '@/lib/csvHandlers';

interface AnalystSubmissionsProps {
    ratings: AnalystSubmission;
    teamAnalysts: string[];
    submittedAnalysts: string[];
    pendingAnalysts: string[];
    onUploadRatings: (analystName: string, newRatings: StakeholderRating[]) => void;
    onRemoveAnalystData: (analystName: string) => void;
}

export function AnalystSubmissions({ 
    ratings,
    teamAnalysts,
    submittedAnalysts,
    pendingAnalysts,
    onUploadRatings, 
    onRemoveAnalystData 
}: AnalystSubmissionsProps) {
    const [uploadError, setUploadError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [selectedAnalyst, setSelectedAnalyst] = useState<string>('');

    // Auto-hide alerts after 3 seconds
    useEffect(() => {
        if (uploadError) {
            const timer = setTimeout(() => {
                setUploadError('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [uploadError]);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const csvStructure: CSVColumn[] = [
        { label: 'id', dataType: 'integer' },
        { label: 'Name', dataType: 'string' },
        { label: 'Description', dataType: 'string' },
        { label: 'Influence', dataType: 'float' },
        { label: 'Impact', dataType: 'float' }
    ];

    // File upload handler using the csvHandlers utility
    const handleAnalystFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!selectedAnalyst) {
            setUploadError('Please select an analyst before uploading the file.');
            return;
        }
        handleCSVFileUpload(
            file,
            selectedAnalyst,
            csvStructure,
            (uploader, data) => {
                // Map the parsed data to StakeholderRating[]
                const newRatings: StakeholderRating[] = data.map(row => ({
                    id: Number(row['id']),
                    name: String(row['Name']),
                    influence: Number(row['Influence']),
                    impact: Number(row['Impact'])
                }));
                onUploadRatings(uploader, newRatings);
            },
            setUploadError,
            setSuccessMessage,
            setSelectedAnalyst
        );
        event.target.value = '';
    };



    // Get rating count for an analyst
    const getRatingCount = (analyst: string): number => {
        return ratings[analyst]?.length || 0;
    };

    return (
        <Paper sx={{ p: 4, mb: 4, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 4 }}>
                Analyst Submissions
            </Typography>

            <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
                {/* Left Side - Upload Section using FileUploadMapper */}
                <FileUploadMapper 
                    pendingUploaders={pendingAnalysts}
                    submittedUploaders={submittedAnalysts}
                    title="Upload Stakeholder Ratings"
                    description="Select an analyst and upload their CSV file with stakeholder ratings"
                    label="Select Analyst"
                    onFileUpload={handleAnalystFileUpload}
                    uploadError={uploadError}
                    successMessage={successMessage}
                    allSuccessMessage="🎉 All team analysts have submitted their ratings!"
                    selectedUploader={selectedAnalyst}
                    onSelectedUploaderChange={setSelectedAnalyst}
                    acceptedFileTypes=".csv"
                    maxWidth={600}
                />

                {/* Right Side - Analysts Summary using FileUploadersSummary */}
                <FileUploadersSummary
                    uploaders={teamAnalysts}
                    submittedUploaders={submittedAnalysts}
                    pendingUploaders={pendingAnalysts}
                    title="Team Analysts Status"
                    getUploadCount={getRatingCount}
                    onRemoveUploader={onRemoveAnalystData}
                    showDeleteOnHover={true}
                />
            </Box>
        </Paper>
    );
}
