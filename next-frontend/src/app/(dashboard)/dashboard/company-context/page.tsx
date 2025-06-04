"use client"
import React, { Suspense, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { CompanyCharacteristics, SupplyChain } from '@/sections';
import { useActivity, useContextContext } from '@/hooks';
import { useReportContext } from '@/providers';
import { Loader } from '@/components';

export default function CompanyContextPage() {
    const { 
        context,  
        fetchContextByReport, 
        createContext, 
        updateContext, 
    } = useContextContext();
    
    const { currentReport } = useReportContext();
    const {
        activities,
        getActivitiesByContext,
        createActivity,
        updateActivity,
        deleteActivity
    } = useActivity()

    // Fetch context when report changes
    useEffect(() => {
        if (currentReport?.id) {
            console.log("Fetching context for report:", currentReport.id);
            fetchContextByReport(currentReport.id);
        }
    }, [currentReport?.id, fetchContextByReport]);

    useEffect(() => {
        console.log('Checking', context)
        if(context){
            getActivitiesByContext(context?.id)
            console.log('Now', activities)
        }
    }, [context, getActivitiesByContext])

    const isNewContext = !context?.id;


    return (
        <Box>

            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography
                    className="gradient-color-heading"
                    variant="h2"
                    component="h2"
                    sx={{ mb: 1 }}
                >
                    Company Context
                </Typography>
                {isNewContext && (
                    <Typography variant="body2" color="text.secondary">
                        No context found for this report. Create one to get started.
                    </Typography>
                )}
            </Box>

            {/* Company Characteristics Section */}
            <CompanyCharacteristics 
                contextData={context}
                updateData={updateContext}
                createData={createContext}
                currentReportId={currentReport?.id}
            />

            {
                context &&
                <Suspense fallback={<Loader variant='inline' />}>
                    <SupplyChain
                        activities={activities}
                        createActivity={createActivity}
                        updateActivity={updateActivity}
                        deleteActivity={deleteActivity}
                        currentContextId={context?.id}
                    />
                </Suspense>
            }

            {/* Supply Chain Section */}
            {/* <SupplyChain 
                contextData={context}
                loading={loading}
            /> */}
        </Box>
    );
}
