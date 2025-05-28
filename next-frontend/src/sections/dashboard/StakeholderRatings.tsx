'use client';

import React, { useState } from 'react';
import { Box } from '@mui/material';
import { RatingsTableView, UploaderSubmissions } from '@/components';
import { CSVColumn, StakeholderRating } from '@/lib/types';


// Predefined list of analysts in the team
const teamAnalysts = [
    'John Smith',
    'Sarah Johnson',
    'Michael Chen',
    'Emily Davis',
    'David Wilson'
];

// CSV structure for StakeholderRating
const csvStructure: CSVColumn[] = [
    { label: 'id', dataType: 'integer' },
    { label: 'Name', dataType: 'string' },
    { label: 'Description', dataType: 'string' },
    { label: 'Influence', dataType: 'float' },
    { label: 'Impact', dataType: 'float' }
];

export function StakeholderRatings() {
    // Universal format: uploader name -> array of CSV row objects
    const [submissions, setSubmissions] = useState<Record<string, Record<string, string | number>[]>>({});
    const [pendingAnalysts, setPendingAnalysts] = useState<string[]>(teamAnalysts);
    const [submittedAnalysts, setSubmittedAnalysts] = useState<string[]>([]);

    // Calculate and update averages
    const updateAverages = (submissionsData: Record<string, Record<string, string | number>[]>) => {
        // Filter out the 'Average' key to get only analyst data
        const analystData = Object.fromEntries(
            Object.entries(submissionsData).filter(([key]) => key !== 'Average')
        );

        if (Object.keys(analystData).length === 0) {
            setSubmissions(prev => {
                const newSubmissions = { ...prev };
                delete newSubmissions['Average'];
                return newSubmissions;
            });
            return;
        }

        const stakeholderMap = new Map<number, {
            id: number;
            name: string;
            influenceSum: number;
            impactSum: number;
            count: number;
        }>();

        // Aggregate all ratings for each stakeholder
        Object.values(analystData).forEach(analystRatings => {
            analystRatings.forEach(rating => {
                const id = Number(rating['id']);
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

        // Calculate averages
        const averages: StakeholderRating[] = Array.from(stakeholderMap.values()).map(stakeholder => ({
            id: stakeholder.id,
            name: stakeholder.name,
            influence: Math.round((stakeholder.influenceSum / stakeholder.count) * 100) / 100,
            impact: Math.round((stakeholder.impactSum / stakeholder.count) * 100) / 100,
        }));

        setSubmissions(prev => ({
            ...prev,
            'Average': averages.map(avg => ({
                id: avg.id,
                Name: avg.name,
                Influence: avg.influence,
                Impact: avg.impact,
            }))
        }));
    };

    // Handle upload: store as universal format and update averages
    const handleUploadRatings = (analystName: string, newRatings: Record<string, string | number>[]) => {
        const updatedSubmissions = {
            ...submissions,
            [analystName]: newRatings
        };
        setSubmissions(updatedSubmissions);
        updateAverages(updatedSubmissions);

        if (pendingAnalysts.includes(analystName)) {
            setPendingAnalysts(prev => prev.filter(name => name !== analystName));
            setSubmittedAnalysts(prev => [...prev, analystName]);
        }
    };

    // Handle removal and update averages
    const handleRemoveAnalystData = (analystName: string) => {
        const updatedSubmissions = { ...submissions };
        delete updatedSubmissions[analystName];
        delete updatedSubmissions['Average'];
        setSubmissions(updatedSubmissions);
        updateAverages(updatedSubmissions);
        setSubmittedAnalysts(prev => prev.filter(name => name !== analystName));
        setPendingAnalysts(prev => [...prev, analystName]);
    };

    // Filter out Description field from each row before passing to RatingsTableView
    const getTableDataWithoutDescription = (): Record<string, Record<string, string | number>[]> => {
        const result: Record<string, Record<string, string | number>[]> = {};
        Object.entries(submissions).forEach(([uploader, rows]) => {
            result[uploader] = rows.map(row => {
                // const { Description, ...rest } = row;
                const newRow = {
                    Name: row['Name'],
                    Influence: row['Influence'],
                    Impact: row['Impact']

                }
                return newRow;
            });
        });
        return result;
    };

    return (
        <Box>
            <UploaderSubmissions
                csvStructure={csvStructure}
                teamUploaders={teamAnalysts}
                submissions={submissions}
                pendingUploaders={pendingAnalysts}
                submittedUploaders={submittedAnalysts}
                onUploadData={handleUploadRatings}
                onRemoveUploaderData={handleRemoveAnalystData}
                title="Stakeholder Ratings Submissions"
                description="Select an analyst and upload their CSV file with stakeholder ratings."
                allSuccessMessage="🎉 All team analysts have submitted their ratings!"
            />
            <RatingsTableView data={getTableDataWithoutDescription()} uploaderLabel='Analyst' showAverage={true} title="Stakeholder Ratings Table" />
            {/* <StakeholderRatingsView ratings={getRatingsForView()} /> */}
        </Box>
    );
}
