'use client';

import React, { useEffect, useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import { TopicRatings, TopicStandards, MaterialityMatrix } from '@/sections';
import { useQuery } from '@apollo/client';
import { GET_TOPICS_BY_STANDARD } from '@/graphql/queries';
import { useReportContext } from '@/providers';
import { Loader } from '@/components';
import { useStakeholderSubmission } from '@/hooks/useStakeholderSubmission';
import { CreateStakeholderSubmissionInput } from '@/types';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
    return (
        <div
        role="tabpanel"
        hidden={value !== index}
        id={`stakeholder-tabpanel-${index}`}
        aria-labelledby={`stakeholder-tab-${index}`}
        {...other}
        >
        {value === index && (
            <Box sx={{ py: 3 }}>
            {   children}
            </Box>
        )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `stakeholder-tab-${index}`,
        'aria-controls': `stakeholder-tabpanel-${index}`,
    };
}

export default function SustainabilityTopicsPage () {
    const [value, setValue] = useState(0);
    const { currentReport } = useReportContext()
    const {loading, error, data } = useQuery(GET_TOPICS_BY_STANDARD, {
        variables: {
            standardId: currentReport?.standardId
        }
    })

    const {
            stakeholderFinancialSubmissions,
            stakeholderImpactSubmissions,
            stakeholderSubmissionLoading,
            financialStakeholders,
            impactStakeholders,
            materialityMatrixData,
            fetchStakeholderSubmissionsByReportAndType,
            fetchStakeholdersByReport,
            createStakeholderSubmission,
            deleteStakeholderSubmission,
            fetchMaterialityMatrixData
        } = useStakeholderSubmission()

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleCreateStakeholderSubmission = async (input: CreateStakeholderSubmissionInput) => {
        await createStakeholderSubmission(input)
    }

    const handleDeleteStakeholderSubmission = async (id: string) => {
        await deleteStakeholderSubmission(id)
    }


    useEffect(() => {
        if(currentReport?.id){
            console.log("HERE FETCHING STAKEHOLDERS AND SUBMISSIONS")
            fetchStakeholdersByReport(currentReport.id)
            fetchStakeholderSubmissionsByReportAndType(currentReport.id, 'FINANCIAL')
            fetchStakeholderSubmissionsByReportAndType(currentReport.id, 'IMPACT')
        }
    }, [currentReport?.id, fetchStakeholderSubmissionsByReportAndType, fetchStakeholdersByReport])

    if(loading){
        return (
            <Box>
                <Loader variant='page' message='Loading Topics ...' />
            </Box>
        )
    }
    if(error){
        return (
            <Box>
                <Typography color='error'>Sorry, we ran into some error, plaease try again ...</Typography>
            </Box>
        )
    }
    return (
        <Box>
            <Typography
                className='gradient-color-heading'
                variant="h2"
                component="h2"
                sx={{ mb: 3 }} 
            >
                Sustainability Topics
            </Typography>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs 
                        value={value} 
                        onChange={handleChange} 
                        aria-label="Stakeholder management tabs"
                        sx={{
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontWeight: 500,
                                fontSize: '1rem',
                                minWidth: 120,
                            },
                        }}
                    >
                        <Tab label="Topics Standard" {...a11yProps(0)} />
                        <Tab label="Impact Ratings" {...a11yProps(1)} />
                        <Tab label="Financial Ratings" {...a11yProps(2)} />
                        <Tab label="Materiality Matrix" {...a11yProps(3)} />
                    </Tabs>
                </Box>

                <TabPanel value={value} index={0}>
                    <TopicStandards topics={data.topicsByStandard} standards={[{
                        id: 'f5c94a17-0c1a-499d-8f83-ef7e4d43e8c7',
                        name: "SusAF"
                    }]} />
                </TabPanel>

                <TabPanel value={value} index={1}>
                    <TopicRatings 
                        stakeholders={impactStakeholders}
                        stakeholderSubmissionsGrouped={stakeholderImpactSubmissions}
                        createStakeholderSubmission={handleCreateStakeholderSubmission}
                        deleteStakeholderSubmission={handleDeleteStakeholderSubmission}
                        loading={stakeholderSubmissionLoading}
                        report={currentReport!.id}
                        ratingsType={'IMPACT'}
                    />
                </TabPanel>

                <TabPanel value={value} index={2}>
                    <TopicRatings 
                        stakeholders={financialStakeholders}
                        stakeholderSubmissionsGrouped={stakeholderFinancialSubmissions}
                        createStakeholderSubmission={handleCreateStakeholderSubmission}
                        deleteStakeholderSubmission={handleDeleteStakeholderSubmission}
                        loading={stakeholderSubmissionLoading}
                        report={currentReport!.id}
                        ratingsType={'FINANCIAL'}
                    />
                </TabPanel>

                <TabPanel value={value} index={3}>
                    <MaterialityMatrix
                        materialityMatrixData={materialityMatrixData}
                        fetchMaterialityMatrixData={fetchMaterialityMatrixData}
                        reportId={currentReport!.id}
                        loading={stakeholderSubmissionLoading}
                    />
                </TabPanel>
            </Box>
        </Box>
    )
}