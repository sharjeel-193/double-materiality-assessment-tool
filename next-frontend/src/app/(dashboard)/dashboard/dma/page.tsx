'use client';

import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import { FinancialEffectList, ImpactList } from '@/sections';
import { useReportContext } from '@/providers';
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

export default function DMAPage() {
    const [value, setValue] = useState(1);
    const { reportLoading, currentReport } = useReportContext();

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    if(reportLoading){
        return(
            <Loader variant='page' message='Loading DMA Data ...' />
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
            Double Materiality Assessment
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
                <Tab label="Material Topic" {...a11yProps(0)} />
                <Tab label="Impact Assessment" {...a11yProps(1)} />
                <Tab label="Financial Assessment" {...a11yProps(2)} />
            </Tabs>
            </Box>

            <TabPanel value={value} index={0}>
                <Typography>Topics</Typography>
            </TabPanel>

            <TabPanel value={value} index={1}>
                <ImpactList reportId={currentReport!.id} />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <FinancialEffectList reportId={currentReport!.id} />
            </TabPanel>

        </Box>
        </Box>
    );
}
