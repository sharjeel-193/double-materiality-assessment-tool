'use client';

import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { Loader, RatingsTableView, UploaderSubmissions } from '@/components';
import { CreateStakeholderRatingInput, CreateUserSubmissionInput, UserSubmissionGroupedData } from '@/types';
import { CSVColumn } from '@/lib/types';


interface StakeholderRatingsProps {
    users: { id: string; name: string }[];
    userSubmissionsGrouped: UserSubmissionGroupedData; // ✅ CORRECT TYPE
    loading: boolean;
    report: string;
    createUserSubmission: (input: CreateUserSubmissionInput) => Promise<void>;
    deleteUserSubmission: (id: string) => Promise<void>;
}

const csvStructure: CSVColumn[] = [
    { label: 'id', dataType: 'string' },
    { label: 'Name', dataType: 'string' },
    { label: 'Influence', dataType: 'float' },
    { label: 'Impact', dataType: 'float' }
];

export function StakeholderRatings({
    users,
    userSubmissionsGrouped, // ✅ USING GROUPED DATA
    loading,
    report,
    createUserSubmission,
    deleteUserSubmission,
}: StakeholderRatingsProps) {
    const [submissions, setSubmissions] = useState<Record<string, Record<string, string | number>[]>>({});
    const [submissionMap, setSubmissionMap] = useState<Record<string, string>>({});

    // Process the grouped data structure
    useEffect(() => {
        console.log({GroupedSubmissions: userSubmissionsGrouped});
        const mapped: Record<string, Record<string, string | number>[]> = {};
        const userSubmissionMap: Record<string, string> = {};
        
        Object.entries(userSubmissionsGrouped).forEach(([submissionId, submissionData]) => {
            const name = submissionData.userName;
            const userId = submissionData.userId;
            
            // Map by name for display (including averages if present)
            mapped[name] = Array.isArray(submissionData.stakeholderRatings)
                ? submissionData.stakeholderRatings.map(r => ({
                    Name: r.stakeholder?.name || '',
                    Influence: r.influence,
                    Impact: r.impact,
                }))
                : [];
            
            // Create userId to submissionId mapping (skip 'Average')
            if (submissionId !== 'Average' && userId) {
                userSubmissionMap[userId] = submissionId;
            }
        }); 

        setSubmissions(mapped);
        setSubmissionMap(userSubmissionMap);
        console.log({'New Map': userSubmissionMap})
    }, [userSubmissionsGrouped]); // ✅ DEPENDENCY ON GROUPED DATA

    const handleUploadRatings = async (userId: string, newRatings: Record<string, string | number>[]) => {

        const stakeholderRatings: CreateStakeholderRatingInput[] = newRatings.map(row => ({
            stakeholderId: String(row['id']),
            influence: Number(row['Influence']),
            impact: Number(row['Impact']),
        }));

        const submissionInput: CreateUserSubmissionInput = {
            userId: userId,
            reportId: report,
            type: 'INTERNAL',
            stakeholderRatings,
        };

        await createUserSubmission(submissionInput);
    };

    const handleRemoveAnalystData = async (userId: string) => {
        const submissionId = submissionMap[userId];
        if (submissionId) {
            await deleteUserSubmission(submissionId);
        }
    };

    const getTableDataWithoutDescription = (): Record<string, Record<string, string | number>[]> => {
        const result: Record<string, Record<string, string | number>[]> = {};
        
        Object.entries(submissions).forEach(([uploader, rows]) => {
            result[uploader] = rows.map(row => ({
                Name: row['Name'],
                Influence: row['Influence'],
                Impact: row['Impact']
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
                        teamUploaders={users}
                        submissions={submissions}
                        submissionMap={submissionMap}
                        onUploadData={handleUploadRatings}
                        onRemoveUploaderData={handleRemoveAnalystData}
                        title="Stakeholder Ratings Submissions"
                        description="Select an analyst and upload their CSV file with stakeholder ratings."
                        allSuccessMessage="🎉 All team analysts have submitted their ratings!"
                    />
                    <RatingsTableView
                        data={getTableDataWithoutDescription()}
                        uploaderLabel='Analyst'
                        showAverage={true}
                        title="Stakeholder Ratings Table"
                    />
                </>
            )}
        </Box>
    );
}
