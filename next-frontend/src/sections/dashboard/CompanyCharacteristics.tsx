'use client';

import React, { useState } from 'react';
import { Typography, Paper } from '@mui/material';
import { CompanyInfoForm } from '@/components';
import { CompanyInfoDisplay } from '@/components/dashboard/CompanyInfoDisplay';
import { getDummyCompanyData } from '@/lib/dummyData';

interface CompanyCharacteristicsProps {
    isEditMode: boolean;
}

export function CompanyCharacteristics({ isEditMode }: CompanyCharacteristicsProps) {
    const [companyData, setCompanyData] = useState(getDummyCompanyData);

    const handleCompanyDataChange = (field: string, value: string) => {
        setCompanyData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Paper sx={{ p: 4, mb: 6, borderRadius: 3 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                Company Characteristics
            </Typography>

            {
                isEditMode ? 
                <CompanyInfoForm 
                    data={companyData}
                    onChange={handleCompanyDataChange}
                />:
                <CompanyInfoDisplay data={companyData} />
            }

        
        </Paper>
    );
}
