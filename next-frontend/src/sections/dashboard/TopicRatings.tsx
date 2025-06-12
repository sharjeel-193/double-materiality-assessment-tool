'use client';

import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { Loader, RatingsTableView, UploaderSubmissions } from '@/components';
import { CSVColumn } from '@/lib/types';
import { CreateStakeholderSubmissionInput, StakeholderSubmissionGroupedData, TopicRatingType } from '@/types';
import { CreateTopicRatingInput } from '@/types/submission';

interface TopicRatingsProps {
    stakeholders: { id: string; name: string }[];
    stakeholderSubmissionsGrouped: StakeholderSubmissionGroupedData;
    loading: boolean;
    report: string;
    createStakeholderSubmission: (input: CreateStakeholderSubmissionInput) => Promise<void>;
    deleteStakeholderSubmission: (id: string) => Promise<void>;
    ratingsType: TopicRatingType;
}

const csvStructure: CSVColumn[] = [
    { label: 'id', dataType: 'string' },
    { label: 'Topic', dataType: 'string' },
    { label: 'Dimension', dataType: 'string' },
    { label: 'Relevance', dataType: 'float' },
    { label: 'Magnitude', dataType: 'float' }
];

export function TopicRatings({
    stakeholders,
    stakeholderSubmissionsGrouped,
    loading,
    createStakeholderSubmission,
    deleteStakeholderSubmission,
    report,
    ratingsType
}: TopicRatingsProps) {
    const [submissions, setSubmissions] = useState<Record<string, Record<string, string | number>[]>>({});
    const [submissionMap, setSubmissionMap] = useState<Record<string, string>>({});

    // Process the grouped data structure
    useEffect(() => {
        const mapped: Record<string, Record<string, string | number>[]> = {};
        const stakeholderSubmissionMap: Record<string, string> = {};

        Object.entries(stakeholderSubmissionsGrouped).forEach(([submissionId, submissionData]) => {
            const name = submissionData.stakeholderName;
            const stakeholderId = submissionData.stakeholderId;

            mapped[name] = Array.isArray(submissionData.topicRatings)
                ? submissionData.topicRatings.map(r => ({
                    name: r.topic?.name || '',
                    dimension: r.topic?.dimension?.name || '',
                    magnitude: r.magnitude,
                    relevance: r.relevance ,
                    score: r.score || (r.magnitude + r.relevance) / 2
                }))
                : [];

            if (submissionId !== 'Average' && stakeholderId) {
                stakeholderSubmissionMap[stakeholderId] = submissionId;
            }
        });

        setSubmissions(mapped);
        setSubmissionMap(stakeholderSubmissionMap);
    }, [stakeholderSubmissionsGrouped]);

    // Upload handler
    const handleUploadRatings = async (stakeholderId: string, newRatings: Record<string, string | number>[]) => {
        // Map CSV row to TopicRating[]
        const topicRatings: CreateTopicRatingInput[] = newRatings.map(row => ({
            topicId: String(row['id']),
            magnitude: Number(row['Magnitude']),
            relevance: Number(row['Relevance']),
            ratingType: ratingsType
        }));

        // Prepare input for backend (adjust as needed for your API)
        const submissionInput: CreateStakeholderSubmissionInput = {
            stakeholderId,
            reportId: report,
            topicRatings,
            type: 'STAKEHOLDER',
        };

        await createStakeholderSubmission(submissionInput);
    };

    // Remove handler
    const handleRemoveStakeholderData = async (stakeholderId: string) => {
        const submissionId = submissionMap[stakeholderId];
        if (submissionId) {
            await deleteStakeholderSubmission(submissionId);
        }
    };

    // Prepare table data (no Description)
    const getTableDataWithoutDescription = (): Record<string, Record<string, string | number>[]> => {
        const result: Record<string, Record<string, string | number>[]> = {};
        Object.entries(submissions).forEach(([uploader, rows]) => {
            result[uploader] = rows.map(row => ({
                Topic: row['name'],
                Magnitude: row['magnitude'],
                Relevance: row['relevance'],
                Score: row['score']
            }));
        });
        return result;
    };

    return (
        <Box>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <UploaderSubmissions
                        csvStructure={csvStructure}
                        teamUploaders={stakeholders}
                        submissions={submissions}
                        submissionMap={submissionMap}
                        onUploadData={handleUploadRatings}
                        onRemoveUploaderData={handleRemoveStakeholderData}
                        title={`${ratingsType} Topic Ratings Submissions`}
                        description="Select a stakeholder and upload their CSV file with topic ratings."
                        allSuccessMessage="🎉 All stakeholders have submitted their topic ratings!"
                    />
                    <RatingsTableView
                        data={getTableDataWithoutDescription()}
                        uploaderLabel='Stakeholder'
                        showAverage={true}
                        title="Topic Ratings Table"
                    />
                </>
            )}
        </Box>
    );
}
