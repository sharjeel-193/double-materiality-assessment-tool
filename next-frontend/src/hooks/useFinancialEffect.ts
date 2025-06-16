import { useApolloClient } from '@apollo/client';
import { useCallback, useState } from 'react';
import { 
    CREATE_FINANCIAL_EFFECT, 
    DELETE_FINANCIAL_EFFECT, 
    GET_FINANCIAL_EFFECTS_BY_REPORT,
    GET_FINANCIAL_EFFECTS_BY_REPORT_AND_TYPE
} from '@/graphql/queries';
import { 
    FinancialEffect, 
    CreateFinancialEffectInput,
    FinancialType 
} from '@/types';

interface UseFinancialEffectReturn {
    financialEffects: FinancialEffect[];
    financialEffectLoading: boolean;
    financialEffectError: string | null;
    financialEffectMessage: string | null;
    
    createFinancialEffect: (input: CreateFinancialEffectInput) => Promise<FinancialEffect | null>;
    deleteFinancialEffect: (id: string) => Promise<boolean>;
    fetchFinancialEffectsByReport: (reportId: string) => Promise<FinancialEffect[]>;
    fetchFinancialEffectsByReportAndType: (reportId: string, type: FinancialType) => Promise<FinancialEffect[]>;
}

export function useFinancialEffect(): UseFinancialEffectReturn {
    const [financialEffects, setFinancialEffects] = useState<FinancialEffect[]>([]);
    const [financialEffectLoading, setFinancialEffectLoading] = useState<boolean>(false);
    const [financialEffectError, setFinancialEffectError] = useState<string | null>(null);
    const [financialEffectMessage, setFinancialEffectMessage] = useState<string | null>(null);
    
    const client = useApolloClient();
    
    const clearError = useCallback(() => setFinancialEffectError(null), []);
    const clearMessage = useCallback(() => setFinancialEffectMessage(null), []);
    const handleError = useCallback((error: string) => setFinancialEffectError(error), []);
    const handleMessage = useCallback((message: string) => setFinancialEffectMessage(message), []);
    
    const createFinancialEffect = useCallback(async (input: CreateFinancialEffectInput): Promise<FinancialEffect | null> => {
        try {
            setFinancialEffectLoading(true);
            clearError();
            clearMessage();
            
            const response = await client.mutate({
                mutation: CREATE_FINANCIAL_EFFECT,
                variables: { createFinancialEffectInput: input },
                fetchPolicy: 'network-only'
            });
            
            const { success, message, data } = response.data.createFinancialEffect;
            
            if (success && data) {
                handleMessage(message);
                // Update local state
                setFinancialEffects(prev => [data, ...prev]);
                return data;
            }
            
            throw new Error(message || 'Failed to create financial effect');
        } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred creating financial effect';
            handleError(errorMessage);
            console.error('Error creating financial effect:', error);
            return null;
        } finally {
        setFinancialEffectLoading(false);
        }
    }, [client, clearError, clearMessage, handleError, handleMessage]);
    
    const deleteFinancialEffect = useCallback(async (id: string): Promise<boolean> => {
        try {
            setFinancialEffectLoading(true);
            clearError();
            clearMessage();
            
            const response = await client.mutate({
                mutation: DELETE_FINANCIAL_EFFECT,
                variables: { id }
            });
            
            const { success, message } = response.data.removeFinancialEffect;
            
            if (success) {
                handleMessage(message);
                // Update local state
                setFinancialEffects(prev => prev.filter(effect => effect.id !== id));
                return true;
            }
            
            throw new Error(message || 'Failed to delete financial effect');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred deleting financial effect';
            handleError(errorMessage);
            console.error('Error deleting financial effect:', error);
            return false;
        } finally {
            setFinancialEffectLoading(false);
        }
    }, [client, clearError, clearMessage, handleError, handleMessage]);
    
    const fetchFinancialEffectsByReport = useCallback(async (reportId: string): Promise<FinancialEffect[]> => {
        try {
            setFinancialEffectLoading(true);
            clearError();
            clearMessage();
            
            const response = await client.query({
                query: GET_FINANCIAL_EFFECTS_BY_REPORT,
                variables: { reportId },
                fetchPolicy: 'network-only'
            });
            
            const { success, message, data } = response.data.financialEffectsByReport;
            
            if (success) {
                handleMessage(message);
                setFinancialEffects(data);
                return data;
            }
            
            throw new Error(message || 'Failed to fetch financial effects');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred fetching financial effects';
            handleError(errorMessage);
            console.error('Error fetching financial effects:', error);
            return [];
        } finally {
            setFinancialEffectLoading(false);
        }
    }, [client, clearError, clearMessage, handleError, handleMessage]);

    const fetchFinancialEffectsByReportAndType = useCallback(async (reportId: string, type: FinancialType): Promise<FinancialEffect[]> => {
        try {
            setFinancialEffectLoading(true);
            clearError();
            clearMessage();
            
            const response = await client.query({
                query: GET_FINANCIAL_EFFECTS_BY_REPORT_AND_TYPE,
                variables: { reportId, type },
                fetchPolicy: 'network-only'
            });
            
            const { success, message, data } = response.data.financialEffectsByReportAndType;
            
            if (success) {
                handleMessage(message);
                setFinancialEffects(data);
                return data;
            }
            
            throw new Error(message || 'Failed to fetch financial effects by type');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred fetching financial effects by type';
            handleError(errorMessage);
            console.error('Error fetching financial effects by type:', error);
            return [];
        } finally {
            setFinancialEffectLoading(false);
        }
    }, [client, clearError, clearMessage, handleError, handleMessage]);
    
    return {
        financialEffects,
        financialEffectLoading,
        financialEffectError,
        financialEffectMessage,
        
        createFinancialEffect,
        deleteFinancialEffect,
        fetchFinancialEffectsByReport,
        fetchFinancialEffectsByReportAndType
    };
}
