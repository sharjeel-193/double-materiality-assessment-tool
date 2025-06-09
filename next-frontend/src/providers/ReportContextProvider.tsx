// contexts/ReportContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { useApolloClient } from '@apollo/client';
import { useCompanyContext } from '@/providers';
import { GET_REPORT_BY_YEAR, CREATE_REPORT } from '@/graphql/queries';
import { Context } from '@/types';

interface Report {
    id: string;
    year: number;
    companyId: string;
    standardId: string;
    totalTopics: number;
    materialTopics: number;
    totalImpacts: number;
    materialImpacts: number;
    createdAt: string;
    updatedAt: string;
    context: Context
}

interface ReportContextType {
    availableYears: number[];
    currentReport: Report | null;
    selectedYear: number | null;
    setSelectedYear: (year: number) => void;
    createReport: (year: number) => Promise<Report | null>; // ✅ Renamed
    loading: boolean;
    hasReports: boolean;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export function ReportContextProvider({ children }: { children: ReactNode }) {
    const [currentReport, setCurrentReport] = useState<Report | null>(null);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    
    const { company, loading: companyLoading, addReportYear } = useCompanyContext();
    const client = useApolloClient();

    // Get available years from company context
    const availableYears = useMemo(() => {
        return company?.reportYears || [];
    }, [company?.reportYears]);
    const hasReports = availableYears.length > 0;

    const fetchReportByYear = useCallback(async (year: number) => {
            if (!company?.id) return;

            try {
                setLoading(true);
                const result = await client.query({
                    query: GET_REPORT_BY_YEAR,
                    variables: { 
                        companyId: company.id, 
                        year: year 
                    }
                });
                const {data} = result
                console.log({Data: result})

                if (data?.reportByYear) {
                    setCurrentReport(data.reportByYear);
                } else {
                    setCurrentReport(null);
                }
            } catch (error) {
                console.error('Failed to fetch report:', error);
                setCurrentReport(null);
            } finally {
                setLoading(false);
            }
    }, [company?.id, client])

    // Auto-select latest year when company data loads
    useEffect(() => {
        if (hasReports && !selectedYear) {
            const latestYear = Math.max(...availableYears);
            setSelectedYear(latestYear);
        }
    }, [availableYears, hasReports, selectedYear]);

    // Fetch report when year changes
    useEffect(() => {
        
        if (selectedYear && company?.id) {
            fetchReportByYear(selectedYear);
        }
    }, [selectedYear, company?.id, client, fetchReportByYear]);

    

    const createReport = async (year: number): Promise<Report | null> => { // ✅ Renamed function
        if (!company?.id) return null;

        try {
            const { data } = await client.mutate({
                mutation: CREATE_REPORT,
                variables: {
                    createReportInput: {
                        year,
                        companyId: company.id,
                        standardId: "f5c94a17-0c1a-499d-8f83-ef7e4d43e8c7", // Handle this appropriately
                    }
                }
            });

            if (data?.createReport) {
                const newReport = data.createReport;
                setCurrentReport(newReport);
                setSelectedYear(year);
                addReportYear(year)
                return newReport;
            }
            return null;
        } catch (error) {
            console.error('Failed to create report:', error);
            return null;
        }
    };

    const handleSetSelectedYear = (year: number) => {
        setSelectedYear(year);
    };

    return (
        <ReportContext.Provider value={{
            availableYears,
            currentReport,
            selectedYear,
            setSelectedYear: handleSetSelectedYear,
            createReport, // ✅ Updated provider value
            loading: loading || companyLoading,
            hasReports,
        }}>
            {children}
        </ReportContext.Provider>
    );
}

export function useReportContext() {
    const context = useContext(ReportContext);
    if (!context) {
        throw new Error('useReportContext must be used within a ReportProvider');
    }
    return context;
}
