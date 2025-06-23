'use client';

import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import { PotentialStakeholders, StakeholderRatings, HRIAMap } from '@/sections';
import { useStakeholder, useUserSubmission } from '@/hooks';
import { useReportContext } from '@/providers';
import { CreateUserSubmissionInput } from '@/types'
import { Loader, NoReportPrompt } from '@/components';

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

export default function StakeholdersPage() {
    const [value, setValue] = useState(0);
    const { reportLoading, currentReport } = useReportContext();
    const {
        stakeholders,
        stakeholderLoading,
        createStakeholder,
        updateStakeholder,
        fetchStakeholdersByReport,
        deleteStakeholder
    } = useStakeholder()

    const {
        userSubmissionsGrouped,
        userSubmissionLoading,
        users,
        fetchUserSubmissionsByReport,
        fetchUsersByCompany,
        createUserSubmission,
        deleteUserSubmission
    } = useUserSubmission()

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleCreateUserSubmission = async (input: CreateUserSubmissionInput) => {
        await createUserSubmission(input)
    }

    const handleDeleteUSerSubmission = async (id: string) => {
       await deleteUserSubmission(id)
    }

    useEffect(() => {
        if (currentReport?.id) {
            // console.log("HERE FETCHING STAKEHOLDERS")
            fetchStakeholdersByReport(currentReport.id)
        }
    }, [currentReport?.id, fetchStakeholdersByReport]);

    useEffect(() => {
        if(currentReport?.id){
            console.log("HERE FETCHING USERS AND SUBMISSIONS")
            fetchUsersByCompany(currentReport.companyId)
            fetchUserSubmissionsByReport(currentReport.id)
        }
    }, [currentReport?.companyId, currentReport?.id, fetchUserSubmissionsByReport, fetchUsersByCompany])

    if(reportLoading){
        return(
            <Loader variant='page' message='Loading Stakeholder Data ...' />
        )
    }

    if(!currentReport){
        return (
            <NoReportPrompt />
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
            Stakeholders Management
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
                <Tab label="Potential Stakeholders" {...a11yProps(0)} />
                <Tab label="Stakeholder Ratings" {...a11yProps(1)} />
                <Tab label="HRIA Map" {...a11yProps(2)} />
            </Tabs>
            </Box>

            <TabPanel value={value} index={0}>
                <PotentialStakeholders 
                    stakeholdersList={stakeholders}
                    loading={stakeholderLoading} 
                    updateStakeholder={updateStakeholder} 
                    createStakeholder={createStakeholder} 
                    deleteStakeholder={deleteStakeholder}
                />
            </TabPanel>

            <TabPanel value={value} index={1}>
                <StakeholderRatings 
                    users={users} 
                    userSubmissionsGrouped={userSubmissionsGrouped} 
                    loading={userSubmissionLoading}
                    report={currentReport!.id}
                    createUserSubmission={handleCreateUserSubmission}
                    deleteUserSubmission={handleDeleteUSerSubmission}
                />
            </TabPanel>

            <TabPanel value={value} index={2}>
                <HRIAMap ratings={userSubmissionsGrouped} />
            </TabPanel>
        </Box>
        </Box>
    );
}
