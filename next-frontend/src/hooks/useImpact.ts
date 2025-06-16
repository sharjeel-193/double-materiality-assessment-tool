import { useApolloClient } from '@apollo/client';
import { useCallback, useState } from 'react';
import { 
    CREATE_IMPACT, 
    DELETE_IMPACT, 
    GET_IMPACTS_BY_REPORT 
} from '@/graphql/queries';
import { 
    Impact, 
    CreateImpactInput, 
} from '@/types';

interface UseImpactReturn {
  impacts: Impact[];
  impactLoading: boolean;
  impactError: string | null;
  impactMessage: string | null;
  
  createImpact: (input: CreateImpactInput) => Promise<Impact | null>;
  deleteImpact: (id: string) => Promise<boolean>;
  fetchImpactsByReport: (reportId: string) => Promise<Impact[]>;
}

export function useImpact(): UseImpactReturn {
    const [impacts, setImpacts] = useState<Impact[]>([]);
    const [impactLoading, setImpactLoading] = useState<boolean>(false);
    const [impactError, setImpactError] = useState<string | null>(null);
    const [impactMessage, setImpactMessage] = useState<string | null>(null);
    
    const client = useApolloClient();
    
    const clearError = useCallback(() => setImpactError(null), []);
    const clearMessage = useCallback(() => setImpactMessage(null), []);
    const handleError = useCallback((error: string) => setImpactError(error), []);
    const handleMessage = useCallback((message: string) => setImpactMessage(message), []);
    
    const createImpact = useCallback(async (input: CreateImpactInput): Promise<Impact | null> => {
        try {
            setImpactLoading(true);
            clearError();
            clearMessage();
            
            const response = await client.mutate({
                mutation: CREATE_IMPACT,
                variables: { createImpactInput: input },
                refetchQueries: [
                {
                    query: GET_IMPACTS_BY_REPORT,
                    variables: { reportId: input.reportId }
                }
                ]
            });
            
            const { success, message, data } = response.data.createImpact;
            
            if (success && data) {
                handleMessage(message);
                setImpacts(prev => [data, ...prev]);
                return data;
            }
        
            throw new Error(message || 'Failed to create impact');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred creating impact';
            handleError(errorMessage);
            console.error('Error creating impact:', error);
            return null;
        } finally {
            setImpactLoading(false);
        }
    }, [client, clearError, clearMessage, handleError, handleMessage]);
    
    const deleteImpact = useCallback(async (id: string): Promise<boolean> => {
        try {
            setImpactLoading(true);
            clearError();
            clearMessage();
            
            const response = await client.mutate({
                mutation: DELETE_IMPACT,
                variables: { id }
            });
            
            const { success, message } = response.data.removeImpact;
            
            if (success) {
                handleMessage(message);
                // Update local state
                setImpacts(prev => prev.filter(impact => impact.id !== id));
                return true;
            }
            
            throw new Error(message || 'Failed to delete impact');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred deleting impact';
            handleError(errorMessage);
            console.error('Error deleting impact:', error);
            return false;
        } finally {
            setImpactLoading(false);
        }
    }, [client, clearError, clearMessage, handleError, handleMessage]);
    
    const fetchImpactsByReport = useCallback(async (reportId: string): Promise<Impact[]> => {
        try {
            setImpactLoading(true);
            clearError();
            clearMessage();
            
            const response = await client.query({
                query: GET_IMPACTS_BY_REPORT,
                variables: { reportId },
                fetchPolicy: 'network-only'
            });
            
            const { success, message, data } = response.data.impactsByReport;
            
            if (success) {
                handleMessage(message);
                setImpacts(data);
                return data;
            }
            
            throw new Error(message || 'Failed to fetch impacts');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred fetching impacts';
            handleError(errorMessage);
            console.error('Error fetching impacts:', error);
            return [];
        } finally {
            setImpactLoading(false);
        }
    }, [client, clearError, clearMessage, handleError, handleMessage]);
    
    return {
        impacts,
        impactLoading,
        impactError,
        impactMessage,
        
        createImpact,
        deleteImpact,
        fetchImpactsByReport
    };
}
