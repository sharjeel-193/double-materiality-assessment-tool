import { Activity, ActivityType, CreateActivityInput, UpdateActivityInput, ActivityLabel } from '@/types';
import { useState, useCallback } from 'react';
import { useApolloClient } from '@apollo/client';
import {
    GET_ACTIVITIES_BY_CONTEXT,
    GET_ACTIVITY,
    CREATE_ACTIVITY,
    UPDATE_ACTIVITY,
    DELETE_ACTIVITY
} from '@/graphql/queries';

interface UseActivityReturn {
    // Data
    activities: Activity[];
    loading: boolean;
    error: string | null;
    
    // Actions
    getActivitiesByContext: (contextId: string) => Promise<Activity[]>;
    getActivityLabels: (contextId: string) => ActivityLabel[];
    getActivitiesByType: (type: ActivityType) => Activity[];
    getActivity: (id: string) => Promise<Activity | null>;
    createActivity: (input: CreateActivityInput) => Promise<Activity | null>;
    updateActivity: (id: string, input: UpdateActivityInput) => Promise<Activity | null>;
    deleteActivity: (id: string) => Promise<boolean>;
    clearError: () => void;
    refetch: (contextId: string) => Promise<void>;
}

export function useActivity(): UseActivityReturn {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const client = useApolloClient();

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const handleError = useCallback((errorMessage: string) => {
        setError(errorMessage);
    }, []);

    const getActivitiesByContext = useCallback(async (contextId: string): Promise<Activity[]> => {
        try {
            setLoading(true);
            setError(null);
            
            const result = await client.query({
                query: GET_ACTIVITIES_BY_CONTEXT,
                variables: { contextId },
                fetchPolicy: 'network-only'
            });

            console.log({Context: contextId})
            const { data} = result
            console.log({Result: result})
            const fetchedActivities = data?.activitiesByContext || [];
            setActivities(fetchedActivities);
            return fetchedActivities;
        } catch (err) {
            console.error('Get activities by context error:', err);
            handleError('Failed to fetch activities');
            return [];
        } finally {
            setLoading(false);
        }
    }, [client, handleError]);

    const getActivityLabels = (constextId: string): ActivityLabel[] => {
        if(!activities){
            getActivitiesByContext(constextId)
        }
        const activityLabels = activities.map((activity) => ({
            id: activity.id,
            name: activity.name,
            type: activity.type
        }))

        return activityLabels
    }

    const getActivitiesByType = useCallback((type: ActivityType): Activity[] => {
        try {
            setError(null);
            
            return activities.filter(activity => 
                activity.type === type
            );
        } catch (err) {
            console.error('Filter activities by type error:', err);
            handleError('Failed to filter activities by type');
            return [];
        }
    }, [activities, handleError]);


    const getActivity = useCallback(async (id: string): Promise<Activity | null> => {
        try {
            setLoading(true);
            setError(null);
            
            const { data } = await client.query({
                query: GET_ACTIVITY,
                variables: { id },
            });

            const fetchedActivity = data?.activity || null;
            return fetchedActivity;
        } catch (err) {
            console.error('Get activity error:', err);
            handleError('Failed to fetch activity');
            return null;
        } finally {
            setLoading(false);
        }
    }, [client, handleError]);

    const createActivity = useCallback(async (input: CreateActivityInput): Promise<Activity | null> => {
        try {
            setLoading(true);
            setError(null);
            
            const { data } = await client.mutate({
                mutation: CREATE_ACTIVITY,
                variables: { createActivityInput: input }
            });

            const createdActivity = data?.createActivity || null;
            if (createdActivity) {
                setActivities(prev => [...prev, createdActivity]);
            }
            return createdActivity;
        } catch (err) {
            console.error('Create activity error:', err);
            handleError('Failed to create activity');
            return null;
        } finally {
            setLoading(false);
        }
    }, [client, handleError]);

    const updateActivity = useCallback(async (id: string, input: UpdateActivityInput): Promise<Activity | null> => {
        try {
            setLoading(true);
            setError(null);
            
            const { data } = await client.mutate({
                mutation: UPDATE_ACTIVITY,
                variables: { id, updateActivityInput: input }
            });

            const updatedActivity = data?.updateActivity || null;
            if (updatedActivity) {
                setActivities(prev => 
                    prev.map(activity => 
                        activity.id === id ? updatedActivity : activity
                    )
                );
            }
            return updatedActivity;
        } catch (err) {
            console.error('Update activity error:', err);
            handleError('Failed to update activity');
            return null;
        } finally {
            setLoading(false);
        }
    }, [client, handleError]);

    const deleteActivity = useCallback(async (id: string): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            
            await client.mutate({
                mutation: DELETE_ACTIVITY,
                variables: { id }
            });

            setActivities(prev => prev.filter(activity => activity.id !== id));
            return true;
        } catch (err) {
            console.error('Delete activity error:', err);
            handleError('Failed to delete activity');
            return false;
        } finally {
            setLoading(false);
        }
    }, [client, handleError]);

    const refetch = useCallback(async (contextId: string) => {
        await getActivitiesByContext(contextId);
    }, [getActivitiesByContext]);

    return {
        activities,
        loading,
        error,
        getActivitiesByContext,
        getActivityLabels,
        getActivitiesByType,
        getActivity,
        createActivity,
        updateActivity,
        deleteActivity,
        clearError,
        refetch
    };
}
