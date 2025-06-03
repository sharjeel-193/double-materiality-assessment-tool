"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useApolloClient } from "@apollo/client";
import { useAuthContext } from "@/providers";
import { GET_CURRENT_COMPANY } from "@/graphql/queries";

interface Company {
    id: string;
    name: string;
    address: string;
    reportYears: number[]
  // Add other company fields as needed
}

interface CompanyContextType {
    company: Company | null;
    setCompany: (company: Company | null) => void;
    loading: boolean;
    addReportYear: (year: number) => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyContextProvider({ children }: { children: ReactNode }) {
    const [company, setCompany] = useState<Company | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const { user } = useAuthContext();
    const client = useApolloClient();

    const fetchCompany = useCallback(async () => {
        setLoading(true);
        try {
            // Replace with your actual GraphQL query
            const { data } = await client.query({
                query: GET_CURRENT_COMPANY,
                // variables: { id: user.companyId },
            });
            console.log(data)
            setCompany(data.company);
        } catch (error) {
            console.error("Failed to fetch company:", error);
            setCompany(null);
        } finally {
            setLoading(false);
        }
    }, [client])

    // Fetch company data when user changes
    useEffect(() => {
        if (!user?.companyId) {
            setCompany(null);
            setLoading(false);
            return;
        }

        fetchCompany();
    }, [user?.companyId, client, fetchCompany]);

    const addReportYear = (year: number) => {
        if (!company) return;
        
        setCompany(prev => {
            if (!prev) return prev;
            
            // Check if year already exists
            if (prev.reportYears.includes(year)) {
                return prev;
            }
            
            return {
                ...prev,
                reportYears: [...prev.reportYears, year].sort((a, b) => b - a) // Sort descending
            };
        });
    };

    return (
        <CompanyContext.Provider value={{ company, setCompany, loading, addReportYear }}>
            {children}
        </CompanyContext.Provider>
    );
}

export function useCompanyContext() {
    const context = useContext(CompanyContext);
    if (!context) {
        throw new Error("useCompanyContext must be used within a CompanyProvider");
    }
    return context;
}
