// hooks/useContextContext.ts
'use client';

import { useState, useCallback } from 'react';
import { useApolloClient } from '@apollo/client';
import {
    GET_CONTEXT_BY_REPORT,
    CREATE_CONTEXT,
    UPDATE_CONTEXT,
    DELETE_CONTEXT
} from '@/graphql/queries';
import {
    Context,
    CreateContextInput,
    UpdateContextInput
} from '@/types';

interface UseContextContextReturn {
    context: Context | null;
    loading: boolean;
    error: string | null;
    
    fetchContextByReport: (reportId: string) => Promise<Context | null>;
    createContext: (input: CreateContextInput) => Promise<Context | null>;
    updateContext: (input: UpdateContextInput) => Promise<Context | null>;
    deleteContext: () => Promise<boolean>;
    clearError: () => void;
    refetch: (reportId: string) => Promise<void>;
}

export function useContextContext(): UseContextContextReturn {
    const [context, setContext] = useState<Context | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const client = useApolloClient();

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const handleError = useCallback((errorMessage: string) => {
        setError(errorMessage);
    }, []);

    const fetchContextByReport = useCallback(async (reportId: string): Promise<Context | null> => {
        console.log('HERE ...')
        try {
            setLoading(true);
            setError(null);
            
            const { data } = await client.query({
                query: GET_CONTEXT_BY_REPORT,
                variables: { reportId }
            });

            const fetchedContext = data?.contextByReport || null;
            console.log(fetchedContext)
            setContext(fetchedContext);
            return fetchedContext;
        } catch (err) {
            console.log({Error: err})
            handleError('Try Again Later');
            return null;
        } finally {
            setLoading(false);
        }
    }, [client, handleError]);

    

    const createContext = useCallback(async (input: CreateContextInput): Promise<Context | null> => {
        try {
            setLoading(true);
            setError(null);
            
            const { data } = await client.mutate({
                mutation: CREATE_CONTEXT,
                variables: { createContextInput: input }
            });

            const createdContext = data?.createContext || null;
            if (createdContext) {
                setContext(createdContext);
            }
            return createdContext;
        } catch (err) {
            console.log({Error: err})
            handleError('Try Again Later');
            return null;
        } finally {
            setLoading(false);
        }
    }, [client, handleError]);

    const updateContext = useCallback(async (input: UpdateContextInput): Promise<Context | null> => {
        if (!context?.id) {
            setError('No context to update');
            return null;
        }

        try {
            setLoading(true);
            setError(null);
            
            const { data } = await client.mutate({
                mutation: UPDATE_CONTEXT,
                variables: { id: context.id, updateContextInput: input }
            });

            const updatedContext = data?.updateContext || null;
            if (updatedContext) {
                setContext(updatedContext);
            }
            return updatedContext;
        } catch (err) {
            console.log({Error: err})
            handleError('Try Again Later');
            return null;
        } finally {
            setLoading(false);
        }
    }, [client, handleError, context?.id]);

    const deleteContext = useCallback(async (): Promise<boolean> => {
        if (!context?.id) {
            setError('No context to delete');
            return false;
        }

        try {
            setLoading(true);
            setError(null);
            
            await client.mutate({
                mutation: DELETE_CONTEXT,
                variables: { id: context.id }
            });

            setContext(null);
            return true;
        } catch (err) {
            console.log({Error: err})
            handleError('Try Again Later');
            return false;
        } finally {
            setLoading(false);
        }
    }, [client, handleError, context?.id]);

    const refetch = useCallback(async (reportId: string) => {
        await fetchContextByReport(reportId);
    }, [fetchContextByReport]);

    return {
        context,
        loading,
        error,
        fetchContextByReport,
        createContext,
        updateContext,
        deleteContext,
        clearError,
        refetch
    };
}


// hooks/useContextValidation.ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contextSchema, ContextFormData } from '@/formValidations';

export function useContextValidation(data?: Partial<ContextFormData>) {
    const form = useForm<ContextFormData>({
        resolver: zodResolver(contextSchema),
        mode: 'onChange',
        defaultValues: data
    });

    const validateContext = async (formData: Partial<ContextFormData>) => {
        try {
            const validData = contextSchema.parse(formData);
            return { isValid: true, data: validData, errors: null };
        } catch (error) {
            return { isValid: false, data: null, errors: error };
        }
    };

    return {
        ...form,
        validateContext
    };
}
