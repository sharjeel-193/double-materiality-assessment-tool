'use client';

import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { Loader, RatingsTableView, UploaderSubmissions } from '@/components';
import { CreateStakeholderRatingInput, CreateUserSubmissionInput, UserSubmission } from '@/types';
import { CSVColumn } from '@/lib/types';

interface StakeholderRatingsProps {
    users: { id: string; name: string }[];
    userSubmissions: UserSubmission[];
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
    userSubmissions,
    loading,
    report,
    createUserSubmission,
    deleteUserSubmission,
}: StakeholderRatingsProps) {
    // Map user IDs to names for convenience
    // const userIdToName = useMemo(
    //     () => Object.fromEntries(users.map(u => [u.id, u.name])),
    //     [users]
    // );

    // Universal format: uploader name -> array of CSV row objects
    const [submissions, setSubmissions] = useState<Record<string, Record<string, string | number>[]>>({});
    // State for averages
    const [averages, setAverages] = useState<Record<string, string | number>[]>([]);

    // Initialize submissions from userSubmissions prop
    useEffect(() => {
        console.log({Submissions: userSubmissions})
        const mapped: Record<string, Record<string, string | number>[]> = {};
        userSubmissions.forEach((sub, i) => {
            const name = sub.user?.name;
            if (!Array.isArray(sub.stakeholderRatings)) {
                console.warn(`Submission at index ${i} (${name}) has undefined or invalid stakeholderRatings`);
            }
            mapped[name] = Array.isArray(sub.stakeholderRatings)
            ? sub.stakeholderRatings.map(r => ({
                    id: r.stakeholder?.id || '',
                    Name: r.stakeholder?.name || '',
                    Influence: r.influence,
                    Impact: r.impact,
                }))
            : [];
        }); 

        setSubmissions(mapped);
    }, [userSubmissions]);

    useEffect(() => {
        setAverages(calculateAverages(submissions));
    }, [submissions]);

    // Pending/submitted logic
    const submittedAnalysts = Object.keys(submissions);
    const pendingAnalysts = users
        .map(u => u.name)
        .filter(name => !submittedAnalysts.includes(name));

    // Calculate and update averages
    function calculateAverages(submissionsData: Record<string, Record<string, string | number>[]>): Record<string, string | number>[] {
        const analystData = Object.fromEntries(
            Object.entries(submissionsData).filter(([key]) => key !== 'Average')
        );
        if (Object.keys(analystData).length === 0) return [];
        const stakeholderMap = new Map<string, {
            id: string;
            name: string;
            influenceSum: number;
            impactSum: number;
            count: number;
        }>();
        Object.values(analystData).forEach(analystRatings => {
            analystRatings.forEach(rating => {
                const id = String(rating['id']);
                const name = String(rating['Name']);
                const influence = Number(rating['Influence']);
                const impact = Number(rating['Impact']);
                const existing = stakeholderMap.get(id);
                if (existing) {
                    existing.influenceSum += influence;
                    existing.impactSum += impact;
                    existing.count += 1;
                } else {
                    stakeholderMap.set(id, {
                        id,
                        name,
                        influenceSum: influence,
                        impactSum: impact,
                        count: 1,
                    });
                }
            });
        });
        return Array.from(stakeholderMap.values()).map(stakeholder => ({
            id: stakeholder.id,
            Name: stakeholder.name,
            Influence: Math.round((stakeholder.influenceSum / stakeholder.count) * 100) / 100,
            Impact: Math.round((stakeholder.impactSum / stakeholder.count) * 100) / 100,
        }));
    }

    // Handle upload: store as universal format and update averages
    const handleUploadRatings = async (analystName: string, newRatings: Record<string, string | number>[]) => {
        // Find the user for this analystName
        const user = users.find(u => u.name === analystName);
        if (!user) return;

        // Map CSV row to CreateStakeholderRatingInput[]
        const stakeholderRatings: CreateStakeholderRatingInput[] = newRatings.map(row => ({
            stakeholderId: String(row['id']),
            influence: Number(row['Influence']),
            impact: Number(row['Impact']),
        }));

        // Prepare CreateUserSubmissionInput
        const submissionInput: CreateUserSubmissionInput = {
            userId: user.id,
            reportId: report,
            type: 'INTERNAL', // or whatever type is appropriate
            stakeholderRatings,
        };

        // Call the provided API method
        await createUserSubmission(submissionInput);
    };

    // Handle removal and update averages
    const handleRemoveAnalystData = async (analystName: string) => {
        // Find the userId for this analystName
        console.log(analystName)
        const user = users.find(u => u.name === analystName);
        console.log(user)
        if (!user) return;

        // Find the submissionId for this user
        const submission = userSubmissions.find(sub => sub.user.id=== user.id)
        console.log(submission)
        if (submission) {
            await deleteUserSubmission(submission.id);
        }
    };

    //Prepare table data without Description for RatingsTableView
    const getTableDataWithoutDescription = (): Record<string, Record<string, string | number>[]> => {
        const result: Record<string, Record<string, string | number>[]> = {};
        const tableSubmissions = {
            ...submissions,
            Average: averages
        }
        Object.entries(tableSubmissions).forEach(([uploader, rows]) => {
            result[uploader] = rows.map(row => ({
                Name: row['Name'],
                Influence: row['Influence'],
                Impact: row['Impact']
            }));
        });
        return result;
    };

    // const getTableDataWithAverages = (): Record<string, Record<string, string | number>[]> => {
    //     return {
    //         ...submissions,
    //         Average: averages,
    //     };
    // };

    return (
        <Box>
            {loading?
            (
                <Loader />
            ):(
                <>
                    <UploaderSubmissions
                        csvStructure={csvStructure}
                        teamUploaders={users.map(u => u.name)}
                        submissions={submissions}
                        pendingUploaders={pendingAnalysts}
                        submittedUploaders={submittedAnalysts}
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
