'use client';

import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';

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
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box>
        <Typography
            className='gradient-color-heading'
            variant="h2"
            component="h2"
            sx={{ mb: 3 }} 
        >
            DMA
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
                <Typography>Material Topics</Typography>
            </TabPanel>

            <TabPanel value={value} index={1}>
                <Typography>Impact Assessment</Typography>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <Typography>Financial Assessment</Typography>
            </TabPanel>

        </Box>
        </Box>
    );
}
