// data/contextFields.ts
export interface ContextInfoFieldType {
    name: string;
    label: string;
    type: 'text' | 'select';
    options?: { value: string; label: string }[];
    multiline?: boolean;
    required?: boolean;
}

export const contextInfoFields: ContextInfoFieldType[] = [
    {
        name: 'location',
        label: 'Business Location',
        type: 'select',
        options: [
            { value: 'LOCAL', label: 'Local' },
            { value: 'NATIONAL', label: 'National' },
            { value: 'CONTINENTAL', label: 'Continental' },
            { value: 'GLOBAL', label: 'Global' }
        ],
        required: true
    },
    {
        name: 'type',
        label: 'Business Type',
        type: 'select',
        options: [
            { value: 'PRODUCTION', label: 'Production' },
            { value: 'TRADE', label: 'Trade' },
            { value: 'SERVICE', label: 'Service' },
            { value: 'EXTRACTION', label: 'Extraction' }
        ],
        required: true
    },
    {
        name: 'form',
        label: 'Legal Form',
        type: 'select',
        options: [
            { value: 'SOLE_PROPRIETORSHIP', label: 'Sole Proprietorship' },
            { value: 'PARTNERSHIP', label: 'Partnership' },
            { value: 'CORPORATION', label: 'Corporation' }
        ],
        required: true
    },
    {
        name: 'size_employees',
        label: 'Company Size (Employees)',
        type: 'select',
        options: [
            { value: 'SMALLER', label: 'Smaller' },
            { value: 'SMALL', label: 'Small' },
            { value: 'MEDIUM', label: 'Medium' },
            { value: 'BIG', label: 'Big' }
        ],
        required: true
    },
    {
        name: 'size_revenue',
        label: 'Company Size (Revenue)',
        type: 'select',
        options: [
            { value: 'SMALLER', label: 'Smaller' },
            { value: 'SMALL', label: 'Small' },
            { value: 'MEDIUM', label: 'Medium' },
            { value: 'BIG', label: 'Big' }
        ],
        required: true
    },
    {
        name: 'customer_scope',
        label: 'Customer Scope',
        type: 'select',
        options: [
            { value: 'LOCAL', label: 'Local' },
            { value: 'NATIONAL', label: 'National' },
            { value: 'CONTINENTAL', label: 'Continental' },
            { value: 'GLOBAL', label: 'Global' }
        ],
        required: true
    },
    {
        name: 'supply_chain_scope',
        label: 'Supply Chain Scope',
        type: 'select',
        options: [
            { value: 'LOCAL', label: 'Local' },
            { value: 'NATIONAL', label: 'National' },
            { value: 'CONTINENTAL', label: 'Continental' },
            { value: 'GLOBAL', label: 'Global' }
        ],
        required: true
    },
    {
        name: 'extra_details',
        label: 'Extra Details',
        type: 'text',
        multiline: true,
        required: false
    }
];
