import { useApolloClient } from "@apollo/client";
import { useCallback, useState } from "react";
import { CREATE_STAKEHOLDER_SUBMISSION, DELETE_STAKEHOLDER_SUBMISSION, GET_MATERIALITY_MATRIX_BY_REPORT, GET_STAKEHOLDER_SUBMISSIONS_GROUPED_BY_REPORT_ANT_TYPE, GET_STAKEHOLDERS_BY_REPORT_FOR_SUBMISSIONS } from "@/graphql/queries";
import { StakeholderSubmissionGroupedData, StakeholderSubmission, Stakeholder, TopicRatingType, Topic, MaterialityMatrixItem } from "@/types";
import { TopicRating, CreateStakeholderSubmissionInput } from "@/types";

interface useStakeholderSubmissionReturn {
    stakeholderImpactSubmissions: StakeholderSubmissionGroupedData;
    stakeholderFinancialSubmissions: StakeholderSubmissionGroupedData;
    financialStakeholders: Stakeholder[]
    impactStakeholders: Stakeholder[]
    materialityMatrixData: MaterialityMatrixItem[];
    stakeholderSubmissionLoading: boolean;
    stakeholderSubmissionMessage: string | null;
    stakeholderSubmissionError: string | null;

    createStakeholderSubmission: (input: CreateStakeholderSubmissionInput) => Promise<StakeholderSubmission>;
    deleteStakeholderSubmission: (id: string) => Promise<boolean>;
    fetchStakeholderSubmissionsByReportAndType: (reportId: string, ratingsType: TopicRatingType) => Promise<StakeholderSubmissionGroupedData>;
    fetchStakeholdersByReport: (reportId: string) => Promise<Stakeholder[]>;
    fetchMaterialityMatrixData: (reportId: string) => Promise<MaterialityMatrixItem[]>
}

export function useStakeholderSubmission(): useStakeholderSubmissionReturn {
    const [stakeholderImpactSubmissions, setStakeholderImpactSubmissions] = useState<StakeholderSubmissionGroupedData>({});
    const [stakeholderFinancialSubmissions, setStakeholderFinancialSubmissions] = useState<StakeholderSubmissionGroupedData>({});
    const [materialityMatrixData, setMaterialityMatrixData] = useState<MaterialityMatrixItem[]>([]);


    const [stakeholderSubmissionLoading, setStakeholderSubmissionLoading] = useState<boolean>(false);
    const [stakeholderSubmissionMessage, setStakeholderSubmissionMessage] = useState<string | null>(null);
    const [stakeholderSubmissionError, setStakeholderSubmissionError] = useState<string | null>(null);
    const [financialStakeholders, setFinancialStakeholders] = useState<Stakeholder[]>([])
    const [impactStakeholders, setImpactStakeholders] = useState<Stakeholder[]>([])

    const client = useApolloClient();
        
    const clearError = useCallback(() => {
        setStakeholderSubmissionError(null);
    }, []);

    const clearMessage = useCallback(() => {
        setStakeholderSubmissionMessage(null);
    }, []);

    const handleError = useCallback((error: string) => {
        setStakeholderSubmissionError(error);
    }, []);

    const handleMessage = useCallback((message: string) => {
        setStakeholderSubmissionMessage(message);
    }, []);

    const calculateAverages = useCallback((groupedData: StakeholderSubmissionGroupedData) => {
        const topicMap = new Map<string, {
            id: string;
            name: string;
            type: TopicRatingType;
            magnitudeSum: number;
            relevanceSum: number;
            count: number;
        }>()

        Object.values(groupedData).forEach(submission => {
            if (Array.isArray(submission.topicRatings)) {
                submission.topicRatings.forEach(rating => {
                    const tid = rating.topicId;
                    const name = rating.topic?.name || '';
                    const type = rating.ratingType as 'IMPACT' | 'FINANCIAL';
                    const magnitude = rating.magnitude ?? 0;
                    const relevance = rating.relevance ?? 0;

                    const existing = topicMap.get(tid);

                    if(existing){
                        existing.magnitudeSum += magnitude;
                        existing.relevanceSum += relevance;
                        existing.count += 1;
                    } else {
                        topicMap.set(tid, {
                            id: tid,
                            name,
                            type,
                            magnitudeSum: magnitude,
                            relevanceSum: relevance,
                            count: 1,
                        })
                    }
                });
            }
        });

        // Calculate averages for each type and topic
        const averages : TopicRating[] = Array.from(topicMap.values()).map(topic => ({
            id: `${topic.id}`,
            submissionId: `Average`,
            topicId: topic.id,
            ratingType: topic.type,
            magnitude: Math.round((topic.magnitudeSum / topic.count) * 100) / 100,
            relevance: Math.round((topic.relevanceSum / topic.count) * 100) / 100,
            score: Math.round(((topic.magnitudeSum / topic.count) + (topic.relevanceSum / topic.count)) / 2 * 100) / 100,
            topic: {
                id: topic.id,
                name: topic.name,
            } as Topic,
        }))

        return averages;
    }, []);



    // const addOrUpdateSubmission = useCallback((newSubmission: StakeholderSubmission, type: TopicRatingType) => {
    //     if(type === 'FINANCIAL'){
    //         setStakeholderFinancialSubmissions(prev => {
    //             const updated = {
    //                 ...prev,
    //                 [newSubmission.id]: {
    //                     stakeholderId: newSubmission.stakeholder?.id,
    //                     stakeholderName: newSubmission.stakeholder?.name,
    //                     topicRatings: newSubmission.topicRatings || []
    //                 }
    //             };

    //             console.log("Adding Updating Submissions in Hook")

    //             const averages = calculateAverages(updated);
    //             if (averages.length > 0) {
    //                 updated['Average'] = {
    //                     stakeholderId: 'system',
    //                     stakeholderName: 'Average',
    //                     topicRatings: averages,
    //                 };
    //             }

    //             return updated
    //         })
    //     } else if(type === 'IMPACT'){
    //         setStakeholderImpactSubmissions(prev => {
    //             const updated = {
    //                 ...prev,
    //                 [newSubmission.id]: {
    //                     stakeholderId: newSubmission.stakeholder?.id,
    //                     stakeholderName: newSubmission.stakeholder?.name,
    //                     topicRatings: newSubmission.topicRatings || []
    //                 }
    //             };

    //             console.log("Adding Updating Submissions in Hook")

    //             const averages = calculateAverages(updated);
    //             if (averages.length > 0) {
    //                 updated['Average'] = {
    //                     stakeholderId: 'system',
    //                     stakeholderName: 'Average',
    //                     topicRatings: averages,
    //                 };
    //             }

    //             return updated
    //         })
    //     } else {
    //         console.log("Rating Type not Recongnizable")
    //         return null
    //     }
        
        
    // }, [calculateAverages]);

        // Helper function to remove submission and recalculate averages
    const removeSubmission = useCallback((submissionId: string) => {
        const isFinancial = submissionId in stakeholderFinancialSubmissions;
        if(isFinancial){
            setStakeholderFinancialSubmissions(prev => {
                const updated = { ...prev };
                delete updated[submissionId];
                delete updated['Average']; 

                const averages = calculateAverages(updated);
                if (averages.length > 0) {
                    updated['Average'] = {
                        stakeholderId: 'system',
                        stakeholderName: 'Average',
                        topicRatings: averages,
                    };
                }

                return updated;
            })
        } else {
            setStakeholderImpactSubmissions(prev => {
                const updated = { ...prev };
                delete updated[submissionId];
                delete updated['Average']; 

                const averages = calculateAverages(updated);
                if (averages.length > 0) {
                    updated['Average'] = {
                        stakeholderId: 'system',
                        stakeholderName: 'Average',
                        topicRatings: averages,
                    };
                }

                return updated;
            })
        }
        
        
    }, [calculateAverages, stakeholderFinancialSubmissions]);

    const fetchStakeholderSubmissionsByReportAndType = useCallback(async (reportId: string, ratingsType: TopicRatingType) => {
        try {
            setStakeholderSubmissionLoading(true);
            clearError();
            clearMessage();

            const response = await client.query({
                query: GET_STAKEHOLDER_SUBMISSIONS_GROUPED_BY_REPORT_ANT_TYPE,
                variables: { reportId: reportId, ratingType: ratingsType },
                fetchPolicy: 'network-only',
            });

            const { success, data, message } = response.data.stakeholderSubmissionsByReportAndRatingTypeGrouped;

            if (success) {
                const parsedData: StakeholderSubmissionGroupedData = JSON.parse(data);
                // Calculate two averages
                const averages = calculateAverages(parsedData);
                if (averages.length > 0) {
                    parsedData['Average'] = {
                        stakeholderId: 'system',
                        stakeholderName: 'Average',
                        topicRatings: averages,
                    };
                }

                if(ratingsType === 'FINANCIAL'){
                    setStakeholderFinancialSubmissions(parsedData)
                } else if (ratingsType === 'IMPACT'){
                    setStakeholderImpactSubmissions(parsedData)
                } else {
                    throw new Error('Not Topic Rating Type Recognized');
                }
                console.log({"Fetched Submissions ": parsedData})
                handleMessage(message);
                return data;
            }
            throw new Error(message || 'Failed to fetch stakeholder submissions by Report');
        } catch (error) {
            console.error('Error fetching stakeholder submissions by Report:', error);
            handleError('Failed to fetch stakeholder submissions by Report');
            return {};
        } finally {
            setStakeholderSubmissionLoading(false);
        }
    }, [clearError, clearMessage, client, calculateAverages, handleMessage, handleError]);

    const fetchStakeholdersByReport = useCallback(async (reportId: string) => {
            try {
                setStakeholderSubmissionLoading(true);
                clearError();
                clearMessage();
    
                const response = await client.query({
                    query: GET_STAKEHOLDERS_BY_REPORT_FOR_SUBMISSIONS,
                    variables: { reportId }
                });
    
                const { success, data, message } = response.data.stakeholdersByReport;
                if (success) {
                    setFinancialStakeholders(data.filter((stk: Stakeholder) => stk.avgImpact! > 2.5))
                    setImpactStakeholders(data.filter((stk: Stakeholder) => stk.avgInfluence! > 2.5))
                    handleMessage(message);
                    return data;
                }
                return [];
            } catch (error) {
                console.log('Error in Fetching Users: ', error);
                handleError("Failed to fetch Users");
                return [];
            } finally {
                setStakeholderSubmissionLoading(false);
            }
        }, [clearError, clearMessage, client, handleError, handleMessage]);

    const createStakeholderSubmission = useCallback(async (
        input: CreateStakeholderSubmissionInput
    ): Promise<StakeholderSubmission> => {
        try {
            setStakeholderSubmissionLoading(true);
            clearError();
            clearMessage();

            const response = await client.mutate({
                mutation: CREATE_STAKEHOLDER_SUBMISSION,
                variables: {
                    createStakeholderSubmissionInput: input
                }
            });

            const { data, success, message } = response.data.createStakeholderSubmission;
            
            if (success) {
                handleMessage(message);
                const ratingType = data.topicRatings?.[0]?.ratingType;
                if (ratingType) {
                    // addOrUpdateSubmission(data, ratingType);
                    fetchStakeholderSubmissionsByReportAndType(data.reportId, ratingType)
                }
                return data;
            }
            
            throw new Error(message || 'Failed to create submission');
        } catch (error) {
            handleError('Failed to create stakeholder submission');
            console.log("Error in Stakeholder Submission Creation: ", error);
            throw error;
        } finally {
            setStakeholderSubmissionLoading(false);
        }
    }, [clearError, clearMessage, client, handleMessage, fetchStakeholderSubmissionsByReportAndType, handleError]);
    
    const deleteStakeholderSubmission = useCallback(async (id: string) => {
        try {
            setStakeholderSubmissionLoading(true);
            clearError();
            clearMessage();

            const response = await client.mutate({
                mutation: DELETE_STAKEHOLDER_SUBMISSION,
                variables: { id }
            });

            const { success, message } = response.data.removeStakeholderSubmission;
            if (success) {
                handleMessage(message);
                removeSubmission(id) ; // Use helper function
                return true;
            }
            return false;
        } catch (error) {
            console.log('Error in Deleting user submission: ', error);
            handleError("Failed to delete User Submission");
            return false;
        } finally {
            setStakeholderSubmissionLoading(false);
        }
    }, [clearError, clearMessage, client, handleError, handleMessage, removeSubmission]);

const fetchMaterialityMatrixData = useCallback(async (reportId: string) => {
        try {
            setStakeholderSubmissionLoading(true);
            clearError();
            clearMessage();

            const response = await client.query({
                query: GET_MATERIALITY_MATRIX_BY_REPORT,
                variables: { reportId },
                fetchPolicy: 'network-only',
            });

            const { success, data, message } = response.data.materialityMatrixByReport;

            if (success) {
                setMaterialityMatrixData(data);
                handleMessage(message);
                return data;
            }
            throw new Error(message || 'Failed to fetch materiality matrix data');
        } catch (error) {
            console.error('Error fetching materiality matrix data:', error);
            handleError('Failed to fetch materiality matrix data');
            return [];
        } finally {
            setStakeholderSubmissionLoading(false);
        }
    }, [client, clearError, clearMessage, handleError, handleMessage]);

    
    
    return {
        stakeholderSubmissionLoading,
        stakeholderSubmissionMessage,
        stakeholderSubmissionError,
        stakeholderFinancialSubmissions,
        stakeholderImpactSubmissions,
        financialStakeholders,
        impactStakeholders,
        materialityMatrixData,

        createStakeholderSubmission,
        deleteStakeholderSubmission,
        fetchStakeholderSubmissionsByReportAndType,
        fetchStakeholdersByReport,
        fetchMaterialityMatrixData
    }
}
