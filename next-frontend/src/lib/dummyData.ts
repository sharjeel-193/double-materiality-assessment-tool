// src/utils/dummyData.ts
import dummyData from '@/data/dummyData.json';
import { CompanyCharacteristics, Activity, Stakeholder } from '@/lib/types';

export const getDummyCompanyData = (): CompanyCharacteristics => {
    return dummyData.companyCharacteristics;
};

export const getDummyActivities = (): Activity[] => {
    return dummyData.activities;
};

export const getDummyStakeholders = (): Stakeholder[] => {
    return dummyData.stakeholders;
};


