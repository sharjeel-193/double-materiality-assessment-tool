// contexts/ReportContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { useApolloClient } from '@apollo/client';
import { useCompanyContext } from '@/providers';
import { CREATE_REPORT, GET_REPORT_BY_COMPANY_AND_YEAR, UPDATE_REPORT } from '@/graphql/queries';
import { Report, updateReportInput } from '@/types'
import { UPDATE_REPORT_STATUS } from '@/graphql/queries/report';
// Updated Report interface to match new schema

interface ReportContextType {
    availableYears: number[];
    currentReport: Report | null;
    selectedYear: number | null;
    setSelectedYear: (year: number) => void;
    createReport: (year: number) => Promise<Report | null>;
    updateReport: (input: updateReportInput ) => Promise<Report | null>;
    updateReportStatus: (status: number ) => Promise<Report | null>;
    reportLoading: boolean;
    hasReports: boolean;
    reportMessage: string | null,
    reportError: string | null
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export function ReportContextProvider({ children }: { children: ReactNode }) {
    const [currentReport, setCurrentReport] = useState<Report | null>(null);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [reportLoading, setReportLoading] = useState<boolean>(false);
    const [reportMessage, setReportMessage] = useState<string | null>(null)
    const [reportError, setReportError] = useState<string | null>(null)
    
    const { company, loading: companyLoading, addReportYear } = useCompanyContext();
    const client = useApolloClient();

    const availableYears = useMemo(() => {
        return company?.reportYears || [];
    }, [company?.reportYears]);
    const hasReports = availableYears.length > 0;


    const fetchReportByYear = useCallback(async (year: number) => {
        if (!company?.id) return;

        try {
            setReportLoading(true);
            const response = await client.query({
                query: GET_REPORT_BY_COMPANY_AND_YEAR,
                variables: { 
                    companyId: company.id, 
                    year: year 
                }
            });
            const { data, success, message } = response.data.reportByCompanyAndYear;

            if(success && data){
                console.log({'Report Data': data})
                setCurrentReport(data)
                setReportMessage(message)
            }

            return data
        } catch (error) {
            console.error('Failed to fetch report:', error);
            setReportError('Failed to Fetch Report ...')
            setCurrentReport(null);
        } finally {
            setReportLoading(false);
        }
    }, [company?.id, client]);

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
    }, [selectedYear, company?.id, fetchReportByYear]);

    const createReport = useCallback(async (year: number): Promise<Report | null> => {
        if (!company?.id) return null;

        try {
            setReportLoading(true)
            const response = await client.mutate({
                mutation: CREATE_REPORT,
                variables: {
                    createReportInput: {
                        year,
                        companyId: company.id,
                        standardId: "f5c94a17-0c1a-499d-8f83-ef7e4d43e8c7", 
                        status: 1,
                    }
                }
            });

            const {data, success, message} = response.data.createReport

            if(success && data){
                setCurrentReport(data)
                addReportYear(data.year)
                setReportMessage(message)
            }
            return data
        } catch (error) {
            console.error('Failed to create report:', error);
            setReportError("Failed to Create Error")
            return null
        } finally {
            setReportLoading(false)
        }
    }, [addReportYear, client, company?.id])

    const updateReport = useCallback(async (input: updateReportInput): Promise <Report | null> => {
        try {
            console.log("In Update Report ...")
            setReportLoading(true)
            const response = await client.mutate({
                mutation: UPDATE_REPORT,
                variables: {
                    updateReportInput: input,
                    id: currentReport?.id
                }
            })

            const {data, success, message} = response.data.updateReport
            if(success && data){
                setCurrentReport(data)
                setReportMessage(message)
            }
            return data
        } catch (error) {
            console.log("Error Updating Report: ", error)
            setReportError("Failed to Update Report Status")
            return null
        } finally {
            setReportLoading(false)
        }
    }, [client, currentReport?.id])

    const updateReportStatus = useCallback(async (status: number): Promise <Report | null> => {
        try {
            setReportLoading(true)
            console.log("In Update Report Status ...")
            const response = await client.mutate({
                mutation: UPDATE_REPORT_STATUS,
                variables: {
                    status: status,
                    id: currentReport?.id
                }
            })

            const {data, success, message} = response.data.updateReportStatus
            console.log({'Data in Provider': data})
            if(success && data){
                setCurrentReport(data)
                setReportMessage(message)
            }
            return data
        } catch (error) {
            console.log("Error Updating Report: ", error)
            setReportError("Failed to Update Report Status")
            return null
        } finally {
            setReportLoading(false)
        }
    }, [client, currentReport?.id])

    const handleSetSelectedYear = (year: number) => {
        setSelectedYear(year);
    };

    return (
        <ReportContext.Provider value={{
            availableYears,
            currentReport,
            selectedYear,
            setSelectedYear: handleSetSelectedYear,
            createReport,
            updateReport,
            updateReportStatus,
            reportLoading: reportLoading || companyLoading,
            reportError,
            reportMessage,
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
