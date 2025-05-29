'use client';

import React, { useState } from 'react';
import { Box } from '@mui/material';
import { RatingsTableView, UploaderSubmissions } from '@/components';
import { CSVColumn, TopicRating } from '@/lib/types';

const teamStakeholders = [
    'John Smith',
    'Sarah Johnson',
    'Michael Chen',
    'Emily Davis',
    'David Wilson'
];

// CSV structure for StakeholderRating
const csvStructure: CSVColumn[] = [
    { label: 'id', dataType: 'string' },
    { label: 'Topic', dataType: 'string' },
    { label: 'Description', dataType: 'string' },
    { label: 'Dimension', dataType: 'string' },
    { label: 'Relevance', dataType: 'float' },
    { label: 'Magnitude', dataType: 'float' }
];

interface TopicRatingsProps {
    stakeholders: string[],
    ratingsType: string
}

export function TopicRatings({stakeholders, ratingsType}: TopicRatingsProps) {
    // Universal format: uploader name -> array of CSV row objects
    const [submissions, setSubmissions] = useState<Record<string, Record<string, string | number>[]>>({});
    const [pendingStakeholders, setPendingStakeholders] = useState<string[]>(stakeholders);
    const [submittedStakeholders, setSubmittedStakeholders] = useState<string[]>([]);

    const updateAverages = (submissionsData: Record<string, Record<string, string | number>[]>) => {
    // Filter out the 'Average' key to get only Stakeholder data
    const topicData = Object.fromEntries(
        Object.entries(submissionsData).filter(([key]) => key !== 'Average')
    );

    if (Object.keys(topicData).length === 0) {
        setSubmissions(prev => {
            const newSubmissions = { ...prev };
            delete newSubmissions['Average'];
            return newSubmissions;
        });
        return;
    }

    // Use topic id as the key (string)
    const topicMap = new Map<string, {
        id: string;
        topic: string;
        dimension: string;
        magnitudeSum: number;
        relevanceSum: number;
        count: number;
    }>();

    Object.values(topicData).forEach(topicRatings => {
        topicRatings.forEach(rating => {
            const id = String(rating['id']);
            const topic = String(rating['Topic']);
            const dimension = String(rating['Dimension']);
            const magnitude = Number(rating['Magnitude']);
            const relevance = Number(rating['Relevance']);
            const existing = topicMap.get(id);
            if (existing) {
                existing.magnitudeSum += magnitude;
                existing.relevanceSum += relevance;
                existing.count += 1;
            } else {
                topicMap.set(id, {
                    id,
                    topic,
                    dimension,
                    magnitudeSum: magnitude,
                    relevanceSum: relevance,
                    count: 1,
                });
            }
        });
    });

    // Calculate averages as TopicRating[]
    const averages: TopicRating[] = Array.from(topicMap.values()).map(topic => {
        const avgMagnitude = Math.round((topic.magnitudeSum / topic.count) * 100) / 100;
        const avgRelevance = Math.round((topic.relevanceSum / topic.count) * 100) / 100;
        const avgScore = Math.round(((avgMagnitude + avgRelevance) / 2) * 100) / 100;
        return {
            id: topic.id,
            topic: topic.topic,
            dimension: topic.dimension,
            magnitude: avgMagnitude,
            relevance: avgRelevance,
            score: avgScore
        };
    });

    setSubmissions(prev => ({
        ...prev,
        'Average': averages.map(avg => ({
            id: avg.id,
            Topic: avg.topic,
            Dimension: avg.dimension,
            Magnitude: avg.magnitude,
            Relevance: avg.relevance,
            Score: avg.score
        }))
    }));
};



    // Handle upload: store as universal format and update averages
    const handleUploadRatings = (StakeholderName: string, newRatings: Record<string, string | number>[]) => {
        const ratingsWithScore = newRatings.map(row => {
            const magnitude = Number(row['Magnitude']);
            const relevance = Number(row['Relevance']);
            return {
                ...row,
                Score: Math.round(((magnitude + relevance) / 2) * 100) / 100
            };
        });

        const updatedSubmissions = {
            ...submissions,
            [StakeholderName]: ratingsWithScore
        };
        setSubmissions(updatedSubmissions);
        // console.log(updatedSubmissions)
        updateAverages(updatedSubmissions);

        if (pendingStakeholders.includes(StakeholderName)) {
            setPendingStakeholders(prev => prev.filter(name => name !== StakeholderName));
            setSubmittedStakeholders(prev => [...prev, StakeholderName]);
        }
    };

    // Handle removal and update averages
    const handleRemoveStakeholderData = (StakeholderName: string) => {
        const updatedSubmissions = { ...submissions };
        delete updatedSubmissions[StakeholderName];
        delete updatedSubmissions['Average'];
        setSubmissions(updatedSubmissions);
        updateAverages(updatedSubmissions);
        setSubmittedStakeholders(prev => prev.filter(name => name !== StakeholderName));
        setPendingStakeholders(prev => [...prev, StakeholderName]);
    };

    const getTableDataWithoutDescription = (): Record<string, Record<string, string | number>[]> => {
        const result: Record<string, Record<string, string | number>[]> = {};
        Object.entries(submissions).forEach(([uploader, rows]) => {
            result[uploader] = rows.map(row => {
                // const { Description, ...rest } = row;
                const newRow = {

                    Dimension: row['Dimension'],
                    Topic: row['Topic'],
                    Magnitude: row['Magnitude'],
                    Relevance: row['Relevance'],
                    Score: row['Score']
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
                teamUploaders={teamStakeholders}
                submissions={submissions}
                pendingUploaders={pendingStakeholders}
                submittedUploaders={submittedStakeholders}
                onUploadData={handleUploadRatings}
                onRemoveUploaderData={handleRemoveStakeholderData}
                title={`${ratingsType} Topic Ratings Submissions`}
                description="Select an Stakeholder and upload their CSV file with stakeholder ratings."
                allSuccessMessage="🎉 All team Stakeholders have submitted their ratings!"
            />
            <RatingsTableView 
                data={getTableDataWithoutDescription()} 
                uploaderLabel='Stakeholders' 
                showAverage={true} 
                title="Topics Ratings Table" 
            />
            {/* <StakeholderRatingsView ratings={getRatingsForView()} /> */}
        </Box>
    );
}