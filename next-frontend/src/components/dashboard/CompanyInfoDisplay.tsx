'use client';

import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import { Context } from '@/types';


interface CompanyInfoDisplayProps {
    data: Context;
    companyName: string;
}

export function CompanyInfoDisplay({ data, companyName }: CompanyInfoDisplayProps) {
    const displayFields = [
        { label: 'Company Name', value: companyName, highlight: true },
        { label: 'Date', value: data.createdAt },
        { label: 'Business Location', value: data.location },
        { label: 'Business Type', value: data.type },
        { label: 'Legal Form', value: data.form },
        { label: 'Company Size (Employees)', value: data.size_employees },
        { label: 'Company Size (Revenue)', value: data.size_revenue },
        { label: 'Customer Spectrum', value: data.customer_scope },
        { label: 'Supply Chain Scope', value: data.supply_chain_scope },
        { label: 'Extra Details', value: data.extra_details },
    ];

    return (
        <Grid container spacing={3}>
            {displayFields.map((field) => (
                <Grid size={field.label === 'Extra Details' ? {xs: 12}: { xs: 12, sm: 6, md: 4 }} key={field.label}>
                    <Box sx={{ 
                            p: 2, 
                            borderRadius: 2, 
                            bgcolor: 'action.hover',
                            height: '100%'
                        }}
                    >
                        <Typography 
                            variant="caption" 
                            sx={{ 
                                fontWeight: 600, 
                                color: 'text.secondary',
                                textTransform: 'uppercase',
                                letterSpacing: 0.5
                            }}
                        >
                            {field.label}
                        </Typography>
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                mt: 0.5,
                                fontWeight: field.highlight ? 600 : 400,
                                color: field.highlight ? 'primary.main' : 'text.primary'
                            }}
                        >
                            {field.value || 'Not specified'}
                        </Typography>
                    </Box>
                </Grid>
            ))}
        </Grid>
    );
}
