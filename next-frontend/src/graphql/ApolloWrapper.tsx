'use client';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '../graphql/apollo-client';

interface ApolloWrapperProps {
    children: React.ReactNode;
}

export const ApolloWrapper: React.FC<ApolloWrapperProps> = ({ children }) => {
    return (
        <ApolloProvider client={apolloClient}>
            {children}
        </ApolloProvider>
    );
};
