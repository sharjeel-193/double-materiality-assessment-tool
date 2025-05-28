'use client';

import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import { CompanyCharacteristics } from '@/lib/types';


interface CompanyInfoDisplayProps {
    data: CompanyCharacteristics;
}

export function CompanyInfoDisplay({ data }: CompanyInfoDisplayProps) {
    const displayFields = [
        { label: 'Company Name', value: data.companyName, highlight: true },
        { label: 'Date', value: data.date },
        { label: 'Business Location', value: data.businessLocation },
        { label: 'Business Type', value: data.businessType },
        { label: 'Legal Form', value: data.legalForm },
        { label: 'Company Size (Employees)', value: data.companySizeEmployees },
        { label: 'Company Size (Revenue)', value: data.companySizeRevenue },
        { label: 'Product Spectrum', value: data.productSpectrum },
        { label: 'Customer Spectrum', value: data.customerSpectrum },
        { label: 'Supply Chain Scope', value: data.supplyChainScope },
        { label: 'Material Spectrum', value: data.materialSpectrum },
        { label: 'Special Features', value: data.specialFeatures },
        { label: 'Extra Details', value: data.extraDetails },
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
