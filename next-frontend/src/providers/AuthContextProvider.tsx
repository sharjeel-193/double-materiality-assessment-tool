'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { LOGIN_MUTATION, GET_CURRENT_USER } from '../graphql/queries';
import { tokenService } from '../auth/tokenService';
import { apolloClient } from '../graphql/apollo-client';
import { User } from '@/types';


interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    loading: boolean;
    isAuthenticated: boolean;
    getAuthToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthContextProviderProps {
    children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const [loginMutation] = useMutation(LOGIN_MUTATION);
    
    // Check if user is authenticated on mount
    const { data: currentUserData, loading: userLoading, refetch } = useQuery(GET_CURRENT_USER, {
        skip: !tokenService.isAuthenticated(),
        errorPolicy: 'ignore',
    });

    useEffect(() => {
        if (currentUserData?.me) {
            setUser(currentUserData.me);
        }
        setLoading(userLoading);
    }, [currentUserData, userLoading]);

    // Check authentication on mount
    useEffect(() => {
        if (tokenService.isAuthenticated()) {
            refetch();
        } else {
            setLoading(false);
        }
    }, [refetch]);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            setLoading(true);
            
            const { data } = await loginMutation({
                variables: {
                    loginInput: { email, password }
                }
            });

            console.log({'Success': data})

            if (data?.login?.accessToken) {
                // Store token in memory
                tokenService.setToken(data.login.accessToken);
                setUser(data.login.user);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
        return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        tokenService.clearToken();
        setUser(null);
        // Clear Apollo cache
        apolloClient.clearStore();
    };

    const getAuthToken = () => {
        return tokenService.getToken();
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            loading,
            isAuthenticated: !!user,
            getAuthToken,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
