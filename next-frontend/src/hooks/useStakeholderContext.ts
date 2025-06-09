import { CreateStakeholderInput, Stakeholder, UpdateStakeholderInput } from "@/types";
import { useCallback, useState } from "react";
import { CREATE_STAKEHOLDER, DELETE_STAKEHOLDER, GET_STAKEHOLDERS_BY_REPORT, UPDATE_STAKEHOLDER } from "@/graphql/queries";
import { useApolloClient } from "@apollo/client";

interface useStakeholderReturn {
    stakeholders: Stakeholder[],
    stakeholderLoading: boolean,
    stakeholderError: string | null,
    stakeholderMessage: string | null,

    clearError: () => void;
    clearMessage: () => void;
    createStakeholder: (input: CreateStakeholderInput) => Promise<Stakeholder | null>;
    updateStakeholder: (id: string, input: UpdateStakeholderInput) => Promise<Stakeholder | null>
    fetchStakeholdersByReport: (reportId: string) => Promise<Stakeholder[] | null>
    deleteStakeholder: (id: string) => Promise<boolean>
}

export function useStakeholder (): useStakeholderReturn {
    const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
    const [stakeholderLoading, setStakeholderLoading] = useState<boolean>(false);
    const [stakeholderError, setStakeholderError] = useState<string | null>(null);
    const [stakeholderMessage, setStakeholderMessage] = useState<string | null>(null)

    const client = useApolloClient();
    
    const clearError = useCallback(() => {
        setStakeholderError(null);
    }, []);

    const clearMessage = useCallback(() => {
        setStakeholderMessage(null);
    }, []);

    const handleError = useCallback((error: string) => {
        setStakeholderError(error);
    }, []);

    const handleMessage = useCallback((message: string) => {
        setStakeholderMessage(message);
    }, []);

    const createStakeholder = useCallback(async (input: CreateStakeholderInput): Promise<Stakeholder | null> => {
        try {
            setStakeholderLoading(true)
            setStakeholderError(null)
            const response = await client.mutate({
                mutation: CREATE_STAKEHOLDER,
                variables: {createStakeholderInput: input}
            })

            const { data, success, message } = response.data.createStakeholder
            handleMessage(message)
            if(success){
                setStakeholders([
                    ...stakeholders,
                    data
                ])
            }
            return data
        } catch(error){
            console.error('Create stakeholder error:', error);
            handleError('Failed to create stakeholder');
            return null
        } finally {
            setStakeholderLoading(false)
        }
    }, [client, handleError, handleMessage, stakeholders])

    const updateStakeholder = useCallback(async (id: string, input: UpdateStakeholderInput) => {
        try {
            setStakeholderLoading(true)
            const response = await client.mutate({
                mutation: UPDATE_STAKEHOLDER,
                variables:{
                    id: id,
                    updateStakeholderInput: input
                }
            })

            const { data, success, message } = response.data.updateStakeholder
            if(success){
                handleMessage(message)
                setStakeholders(prev => 
                    prev.map(stakeholer => 
                        stakeholer.id === id ? data : stakeholer
                    )
                )
            }

            return data

        } catch (error) {
            console.log('Update Stakeholder Error: ', error)
            handleError('Failed to Update Stakeholder')
            return null
        } finally {
            setStakeholderLoading(false)
        }
    }, [client, handleError, handleMessage])

    const fetchStakeholdersByReport = useCallback(async(reportId: string) => {
        try {
            setStakeholderLoading(true)
            const response = await client.query({
                query: GET_STAKEHOLDERS_BY_REPORT,
                variables:{
                    reportId: reportId
                }
            })
            const { data, success, message } = response.data.stakeholdersByReport
            console.log(response)
            if(success){
                setStakeholders(data)
                handleMessage(message)
            }
            return data
        } catch (error) {
            console.log("Fetching Stakeholder Error: ", error)
            handleError("Failed to fetch the Stakeholders")
        } finally {
            setStakeholderLoading(false)
        }
    }, [client, handleError, handleMessage])

    const deleteStakeholder = useCallback(async (id: string): Promise<boolean> => {
            try {
                setStakeholderLoading(true);
                setStakeholderError(null);
                
                const response = await client.mutate({
                    mutation: DELETE_STAKEHOLDER,
                    variables: { id }
                });

                const { success, message } = response.data.removeStakeholder
                if(success){
                    setStakeholders(prev => prev.filter(stakeholder => stakeholder.id !== id))
                    setStakeholderMessage(message)
                }
                return true;
            } catch (err) {
                console.error('Delete Stakeholder error:', err);
                handleError('Failed to delete Stakeholder');
                return false;
            } finally {
                setStakeholderLoading(false);
            }
        }, [client, handleError]);

    return {
        stakeholders,
        stakeholderLoading,
        stakeholderError,
        stakeholderMessage,

        clearError,
        clearMessage,
        createStakeholder,
        updateStakeholder,
        fetchStakeholdersByReport,
        deleteStakeholder
    }
}

