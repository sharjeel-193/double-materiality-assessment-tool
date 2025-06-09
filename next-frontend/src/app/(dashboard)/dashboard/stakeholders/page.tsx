'use client';

import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import { PotentialStakeholders, StakeholderRatings, HRIAMap } from '@/sections';
import { useStakeholder } from '@/hooks';
import { useReportContext } from '@/providers';

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
    const { currentReport } = useReportContext();
    const {
        stakeholders,
        stakeholderLoading,
        stakeholderError,
        stakeholderMessage,
        createStakeholder,
        updateStakeholder,
        fetchStakeholdersByReport,
        deleteStakeholder
    } = useStakeholder()

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    useEffect(() => {
        if (currentReport?.id) {
            fetchStakeholdersByReport(currentReport.id)
        }
    }, [currentReport?.id, fetchStakeholdersByReport]);

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
                    updateStakeholder={updateStakeholder} 
                    createStakeholder={createStakeholder} 
                    deleteStakeholder={deleteStakeholder}
                />
            </TabPanel>

            <TabPanel value={value} index={1}>
                <StakeholderRatings />
            </TabPanel>

            <TabPanel value={value} index={2}>
                <HRIAMap ratings={{
                    'Average': [
                        {id:1, name: 'HY', influence: 4, impact: 5},
                        {id:2, name: 'HY', influence: 3, impact: 3},
                        {id:3, name: 'HY', influence: 2, impact: 5},
                        {id:4, name: 'HY', influence: 1, impact: 3}
                    ],
                    'Analyst A': [
                        {id:1, name: 'HY', influence: 4, impact: 5},
                        {id:2, name: 'HY', influence: 3, impact: 3},
                        {id:3, name: 'HY', influence: 2, impact: 5},
                        {id:4, name: 'HY', influence: 1, impact: 3}
                    ]
                }} />
            </TabPanel>
        </Box>
        </Box>
    );
}
