export type LocationScope = 'LOCAL' | 'NATIONAL' | 'CONTINENTAL' | 'GLOBAL';
export type ContextType = 'PRODUCTION' | 'TRADE' | 'SERVICE' | 'EXTRACTION';
export type BusinessForm = 'SOLE_PROPRIETORSHIP' | 'PARTNERSHIP' | 'CORPORATION';
export type CompanySize = 'SMALLER' | 'SMALL' | 'MEDIUM' | 'BIG';

// types/context.types.ts
export interface Context {
    id: string;
    location: LocationScope;           // ✅ Instead of string
    type: ContextType;                 // ✅ Instead of string
    form: BusinessForm;                // ✅ Instead of string
    size_employees: CompanySize;       // ✅ Instead of string
    size_revenue: CompanySize;         // ✅ Instead of string
    customer_scope: LocationScope;     // ✅ Instead of string
    supply_chain_scope: LocationScope; // ✅ Instead of string
    extra_details?: string | null;
    reportId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateContextInput {
    location: string;
    type: string;
    form: string;
    size_employees: string;
    size_revenue: string;
    customer_scope: string;
    supply_chain_scope: string;
    extra_details?: string;
    reportId: string;
}

export interface UpdateContextInput {
    location?: string;
    type?: string;
    form?: string;
    size_employees?: string;
    size_revenue?: string;
    customer_scope?: string;
    supply_chain_scope?: string;
    extra_details?: string;
}

export interface UseContextContextReturn {
    // Data
    context: Context | null;
    contexts: Context[];
    loading: boolean;
    error: string | null;
    
    // Actions
    getContextByReport: (reportId: string) => Promise<Context | null>;
    getAllContexts: () => Promise<Context[]>;
    getContext: (id: string) => Promise<Context | null>;
    createContext: (input: CreateContextInput) => Promise<Context | null>;
    updateContext: (id: string, input: UpdateContextInput) => Promise<Context | null>;
    deleteContext: (id: string) => Promise<boolean>;
    clearError: () => void;
    refetch: () => Promise<void>;
}
