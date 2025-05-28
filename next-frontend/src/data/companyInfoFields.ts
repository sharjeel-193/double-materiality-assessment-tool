export interface CompanyInfoFieldType {
    name: string;
    label: string;
    type: 'text' | 'date' | 'select';
    options?: string[];
    multiline?: boolean
}

export const companyInfoFields: CompanyInfoFieldType[] = [
    {
        name: 'companyName',
        label: 'Company Name',
        type: 'text',
    },
    {
        name: 'date',
        label: 'Date',
        type: 'date',
    },
    {
        name: 'businessLocation',
        label: 'Business Location',
        type: 'select',
        options: ['Local', 'National', 'Continental', 'Global'],
    },
    {
        name: 'businessType',
        label: 'Business Type',
        type: 'select',
        options: ['Profit', 'Production', 'Trade', 'Service'],
    },
    {
        name: 'legalForm',
        label: 'Legal Form',
        type: 'select',
        options: ['Sole Proprietorship', 'Partnership', 'Corporation', 'Other'],
    },
    {
        name: 'companySizeEmployees',
        label: 'Company Size (Employees)',
        type: 'select',
        options: ['< 10', '< 50', '< 250', '≥ 250'],
    },
    {
        name: 'companySizeRevenue',
        label: 'Company Size (Revenue)',
        type: 'select',
        options: ['≤ 2 Mio. €', '≤ 10 Mio. €', '≤ 50 Mio. €', '> 50 Mio. €'],
},
    {
        name: 'productSpectrum',
        label: 'Product Spectrum',
        type: 'select',
        options: [
            'Individualized by customer request',
            'Typified by customer request',
            'Standardized with customization',
            'Standardized without customization'
        ],
    },
    {
        name: 'customerSpectrum',
        label: 'Customer Spectrum',
        type: 'select',
        options: ['Local', 'National', 'Continental', 'Global'],
    },
    {
        name: 'supplyChainScope',
        label: 'Supply Chain Scope',
        type: 'select',
        options: ['Local', 'National', 'Continental', 'Global'],
    },
    {
        name: 'materialSpectrum',
        label: 'Material Spectrum',
        type: 'select',
        options: ['Simple', 'Standardized', 'Comprehensive', 'Highly complex'],
    },
    {
        name: 'specialFeatures',
        label: 'Special Features',
        type: 'select',
        options: ['None', 'Some', 'Few', 'Many'],
    },
    {
        name: 'extraDetails',
        label: 'Extra Details',
        type: 'text',
        multiline: true
    }
];
