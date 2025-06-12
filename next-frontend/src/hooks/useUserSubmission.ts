import { CREATE_USER_SUBMISSION, DELETE_USER_SUBMISSION, GET_USER_SUBMISSIONS_GROUPED_BY_REPORT, GET_USERS_BY_COMPANY } from "@/graphql/queries";
import { Stakeholder, User } from "@/types";
import { CreateUserSubmissionInput, UserSubmission, StakeholderRating } from "@/types/submission";
import { useApolloClient } from "@apollo/client";
import { useCallback, useState } from "react";

// Updated grouped format
export interface UserSubmissionGroupedData {
  [submissionId: string]: {
    userId: string;
    userName: string;
    stakeholderRatings: StakeholderRating[];
  };
}

interface useUserSubmissionReturn {
    userSubmissionsGrouped: UserSubmissionGroupedData; // Changed from array to grouped format
    users: User[];
    userSubmissionLoading: boolean;
    userSubmissionMessage: string | null;
    userSubmissionError: string | null;

    createUserSubmission: (input: CreateUserSubmissionInput) => Promise<UserSubmission>;
    deleteUserSubmission: (id: string) => Promise<boolean>;
    fetchUserSubmissionsByReport: (reportId: string) => Promise<UserSubmissionGroupedData>;
    fetchUsersByCompany: (companyId: string) => Promise<User[]>;
}

export function useUserSubmission(): useUserSubmissionReturn {
    const [userSubmissionsGrouped, setUserSubmissionsGrouped] = useState<UserSubmissionGroupedData>({});
    const [userSubmissionLoading, setUserSubmissionLoading] = useState<boolean>(false);
    const [userSubmissionMessage, setUserSubmissionMessage] = useState<string | null>(null);
    const [userSubmissionError, setUserSubmissionError] = useState<string | null>(null);
    const [users, setUsers] = useState<User[]>([]);

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

    // Helper function to calculate averages
    const calculateAverages = useCallback((groupedData: UserSubmissionGroupedData) => {
        const stakeholderMap = new Map<string, {
            id: string;
            name: string;
            influenceSum: number;
            impactSum: number;
            count: number;
        }>();

        // Aggregate all ratings from all submissions
        Object.values(groupedData).forEach(submission => {
            if (Array.isArray(submission.stakeholderRatings)) {
                submission.stakeholderRatings.forEach(rating => {
                    const sid = rating.stakeholderId;
                    const name = rating.stakeholder?.name || '';
                    const influence = rating.influence || 0;
                    const impact = rating.impact || 0;

                    const existing = stakeholderMap.get(sid);
                    if (existing) {
                        existing.influenceSum += influence;
                        existing.impactSum += impact;
                        existing.count += 1;
                    } else {
                        stakeholderMap.set(sid, {
                            id: sid,
                            name,
                            influenceSum: influence,
                            impactSum: impact,
                            count: 1,
                        });
                    }
                });
            }
        });

        // Calculate averages
        const averages: StakeholderRating[] = Array.from(stakeholderMap.values()).map(stakeholder => ({
            id: `${stakeholder.id}`,
            submissionId: 'Average',
            stakeholderId: stakeholder.id,
            influence: Math.round((stakeholder.influenceSum / stakeholder.count) * 100) / 100,
            impact: Math.round((stakeholder.impactSum / stakeholder.count) * 100) / 100,
            stakeholder: {
                id: stakeholder.id,
                name: stakeholder.name,
            } as Stakeholder,
        }));

        return averages;
    }, []);

    // Helper function to add/update submission and recalculate averages
    const addOrUpdateSubmission = useCallback((newSubmission: UserSubmission) => {
        setUserSubmissionsGrouped(prev => {
            const updated = {
                ...prev,
                [newSubmission.id]: {
                    userId: newSubmission.user?.id || '',
                    userName: newSubmission.user?.name || '',
                    stakeholderRatings: newSubmission.stakeholderRatings || [],
                }
            };

            console.log("Adding Updating Submissions in Hook")

            // Calculate and add averages
            const averages = calculateAverages(updated);
            if (averages.length > 0) {
                updated['Average'] = {
                    userId: 'system',
                    userName: 'Average',
                    stakeholderRatings: averages,
                };
            }

            return updated;
        });
    }, [calculateAverages]);

    // Helper function to remove submission and recalculate averages
    const removeSubmission = useCallback((submissionId: string) => {
        setUserSubmissionsGrouped(prev => {
            const updated = { ...prev };
            delete updated[submissionId];
            delete updated['Average']; // Remove old average

            // Recalculate averages
            const averages = calculateAverages(updated);
            if (averages.length > 0) {
                updated['Average'] = {
                    userId: 'system',
                    userName: 'Average',
                    stakeholderRatings: averages,
                };
            }

            return updated;
        });
    }, [calculateAverages]);

    const createUserSubmission = useCallback(async (
        input: CreateUserSubmissionInput
    ): Promise<UserSubmission> => {
        try {
            setUserSubmissionLoading(true);
            clearError();
            clearMessage();

            const response = await client.mutate({
                mutation: CREATE_USER_SUBMISSION,
                variables: {
                    createUserSubmissionInput: input
                }
            });

            const { data, success, message } = response.data.createUserSubmission;
            
            if (success) {
                handleMessage(message);
                addOrUpdateSubmission(data); // Use helper function
                return data;
            }
            
            throw new Error(message || 'Failed to create submission');
        } catch (error) {
            handleError('Failed to create user submission');
            console.log("Error in User Submission Creation: ", error);
            throw error;
        } finally {
            setUserSubmissionLoading(false);
        }
    }, [clearError, clearMessage, client, handleError, handleMessage, addOrUpdateSubmission]);

    const deleteUserSubmission = useCallback(async (id: string) => {
        try {
            setUserSubmissionLoading(true);
            clearError();
            clearMessage();

            const response = await client.mutate({
                mutation: DELETE_USER_SUBMISSION,
                variables: { id }
            });

            const { success, message } = response.data.removeUserSubmission;
            if (success) {
                handleMessage(message);
                removeSubmission(id); // Use helper function
                return true;
            }
            return false;
        } catch (error) {
            console.log('Error in Deleting user submission: ', error);
            handleError("Failed to delete User Submission");
            return false;
        } finally {
            setUserSubmissionLoading(false);
        }
    }, [clearError, clearMessage, client, handleError, handleMessage, removeSubmission]);

    const fetchUserSubmissionsByReport = useCallback(async (reportId: string) => {
        try {
            setUserSubmissionLoading(true);
            clearError();
            clearMessage();

            const response = await client.query({
                query: GET_USER_SUBMISSIONS_GROUPED_BY_REPORT,
                variables: { reportId },
                fetchPolicy: 'network-only',
            });

            const { success, data, message } = response.data.userSubmissionsByReportGrouped;
            if (success) {
                const parsedData: UserSubmissionGroupedData = JSON.parse(data);
                
                // Calculate and add averages
                const averages = calculateAverages(parsedData);
                if (averages.length > 0) {
                    parsedData['Average'] = {
                        userId: 'system',
                        userName: 'Average',
                        stakeholderRatings: averages,
                    };
                }

                setUserSubmissionsGrouped(parsedData);
                handleMessage(message);
                return parsedData;
            }
            throw new Error(message || 'Failed to Fetch User Submissions');
        } catch (error) {
            console.log("Fetching User Submissions Error: ", error);
            handleError('Failed to Fetch User Submissions');
            return {};
        } finally {
            setUserSubmissionLoading(false);
        }
    }, [clearError, clearMessage, client, handleError, handleMessage, calculateAverages]);

    const fetchUsersByCompany = useCallback(async (companyId: string) => {
        try {
            setUserSubmissionLoading(true);
            clearError();
            clearMessage();

            const response = await client.query({
                query: GET_USERS_BY_COMPANY,
                variables: { companyId }
            });

            const { success, data, message } = response.data.usersByCompany;
            if (success) {
                setUsers(data);
                handleMessage(message);
                return data;
            }
            return [];
        } catch (error) {
            console.log('Error in Fetching Users: ', error);
            handleError("Failed to fetch Users");
            return [];
        } finally {
            setUserSubmissionLoading(false);
        }
    }, [clearError, clearMessage, client, handleError, handleMessage]);
    
    return {
        userSubmissionsGrouped, // Changed from userSubmissions
        userSubmissionLoading,
        userSubmissionMessage,
        userSubmissionError,
        users,

        createUserSubmission,
        deleteUserSubmission,
        fetchUserSubmissionsByReport,
        fetchUsersByCompany
    };
}
