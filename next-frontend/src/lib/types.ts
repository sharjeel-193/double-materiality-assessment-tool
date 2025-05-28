export interface CompanyCharacteristics {
    companyName: string;
    date: string;
    businessLocation: string;
    businessType: string;
    legalForm: string;
    companySizeEmployees: string;
    companySizeRevenue: string;
    productSpectrum: string;
    customerSpectrum: string;
    supplyChainScope: string;
    materialSpectrum: string;
    specialFeatures: string;
    extraDetails: string;
}

export interface Activity {
    id: number;
    type: string;
    name: string;
    description: string;
}

export type ActivityType = 'Upstream' | 'Downstream';
