import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { tokenService } from '../auth/tokenService';

const httpLink = createHttpLink({
    uri: 'http://localhost:4000/graphql',
    credentials: 'include'
});

const authLink = setContext((_, { headers }) => {
    const token = tokenService.getToken();
    
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        },
    };
});

export const apolloClient = new ApolloClient({
    link: from([authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            errorPolicy: 'all',
        },
        query: {
            errorPolicy: 'all',
        },
    },
});
