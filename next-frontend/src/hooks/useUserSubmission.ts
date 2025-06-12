import { CREATE_USER_SUBMISSION, DELETE_USER_SUBMISSION, GET_USER_SUBMISSIONS_BY_REPORT, GET_USERS_BY_COMPANY } from "@/graphql/queries";
import { User } from "@/types";
import { CreateUserSubmissionInput, UserSubmission } from "@/types/submission";
import { useApolloClient } from "@apollo/client";
import { useCallback, useState } from "react";

interface useUserSubmissionReturn {
    userSubmissions: UserSubmission[];
    users: User[],
    userSubmissionLoading: boolean;
    userSubmissionMessage: string | null;
    userSubmissionError: string | null;

    createUserSubmission:(input: CreateUserSubmissionInput) => Promise<UserSubmission>;
    deleteUserSubmission:(id: string) => Promise<boolean>;
    fetchUserSubmissionsByReport:(reportId: string) => Promise<UserSubmission[]>
    fetchUsersByCompany: (companyId: string) => Promise<User[]>
}

export function useUserSubmission(): useUserSubmissionReturn {
    const [userSubmissions, setUserSubmissions] = useState<UserSubmission[]>([]);
    const [userSubmissionLoading, setUserSubmissionLoading] = useState<boolean>(false);
    const [userSubmissionMessage, setUserSubmissionMessage] = useState<string | null>(null);
    const [userSubmissionError, setUserSubmissionError] = useState<string | null>(null)
    const [users, setUsers] = useState<User[]>([])

    const client = useApolloClient();
        
    const clearError = useCallback(() => {
        setUserSubmissionError(null);
    }, []);

    const clearMessage = useCallback(() => {
        setUserSubmissionMessage(null);
    }, []);

    const handleError = useCallback((error: string) => {
        setUserSubmissionError(error);
    }, []);

    const handleMessage = useCallback((message: string) => {
        setUserSubmissionMessage(message);
    }, []);

    const createUserSubmission = useCallback(async (
        input: CreateUserSubmissionInput
    ): Promise<UserSubmission> => {
        try {
            setUserSubmissionLoading(true);
            clearError()
            clearMessage()

            const response = await client.mutate({
                mutation: CREATE_USER_SUBMISSION,
                variables:{
                    createUserSubmissionInput: input
                }
            })

            const { data, success, message } = response.data.createUserSubmission;
            
            if(success){
                handleMessage(message)
                setUserSubmissions([
                    ...userSubmissions,
                    data
                ])
                return data
            }
            
            throw new Error(message || 'Failed to create submission');
        } catch (error) {
            handleError('Failed to create user submission')
            console.log("Error in User Submission Creation: ", error)
            throw error;
        } finally {
            setUserSubmissionLoading(false);
        }
    }, [clearError, clearMessage, client, handleError, handleMessage, userSubmissions]);

    const deleteUserSubmission = useCallback(async(id: string) => {
        try {
            setUserSubmissionLoading(false)
            clearError()
            clearMessage()

            const response = await client.mutate({
                mutation: DELETE_USER_SUBMISSION,
                variables: {
                    id: id
                }
            })

            const { success, message } = response.data.removeUserSubmission
            if(success){
                handleMessage(message)
                setUserSubmissions(prev => prev.filter(userSubmission => userSubmission.id !== id))
            }
            return true
        } catch (error){
            console.log('Error in Deleting user submission: ', error)
            handleError("Failed to delete User Submission")
            return false
        } finally {
            setUserSubmissionLoading(false)
        }
    }, [clearError, clearMessage, client, handleError, handleMessage])

    const fetchUserSubmissionsByReport = useCallback(async(reportId: string) => {
        try {
            setUserSubmissionLoading(true)
            clearError()
            clearMessage()

            const response = await client.query({
                query: GET_USER_SUBMISSIONS_BY_REPORT,
                variables:{
                    reportId: reportId
                }
            })

            const { success, data, message } = response.data.userSubmissionsByReport
            if(success){
                handleMessage(message)
                setUserSubmissions(data)
                return data
            }
            throw new Error(message || 'Failed to Fetch User Submissions');
        } catch (error){
            console.log("Fetching User Submissions Error: ", error)
            handleError('Failed to Fetch User Submissions')
        } finally {
            setUserSubmissionLoading(false)
        }
    }, [clearError, clearMessage, client, handleError, handleMessage])

    const fetchUsersByCompany = useCallback(async(companyId: string) => {
        try {
            setUserSubmissionLoading(true)
            clearError()
            clearMessage()

            const response = await client.query({
                query: GET_USERS_BY_COMPANY,
                variables: {
                    companyId: companyId
                }
            })

            const { success, data, message} = response.data.usersByCompany
            if(success){
                setUsers(data)
                handleMessage(message)
            }

            return data
        } catch (error){
            console.log('Error in Fetching Users: ', error)
            handleError("Failed to fetch Users")
            return false
        } finally {
            setUserSubmissionLoading(false)
        }
    }, [clearError, clearMessage, client, handleError, handleMessage])
    
    return {
        userSubmissions,
        userSubmissionLoading,
        userSubmissionMessage,
        userSubmissionError,
        users,

        createUserSubmission,
        deleteUserSubmission,
        fetchUserSubmissionsByReport,
        fetchUsersByCompany
    }
}