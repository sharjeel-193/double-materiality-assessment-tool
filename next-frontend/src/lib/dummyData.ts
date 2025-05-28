// src/utils/dummyData.ts
import dummyData from '@/data/dummyData.json';
import { CompanyCharacteristics, Activity } from '@/lib/types';

export const getDummyCompanyData = (): CompanyCharacteristics => {
    return dummyData.companyCharacteristics;
};

export const getDummyActivities = (): Activity[] => {
    return dummyData.activities;
};


