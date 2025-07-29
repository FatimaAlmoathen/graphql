import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { isAuthenticated, logout } from './auth';

//tells apollo client where the graphql server is
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
});

//adds jwt to graphql requests, bearer used to proof user already authenticated (authorize)
const authLink = setContext((_, { headers }) => {
  //// Only attempt to get the token if window is defined from client-side
 if (typeof window !== 'undefined') {
   if (!isAuthenticated()) {
      logout();
      return { headers };
    }

    const token = localStorage.getItem('jwt');
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      }
    };
  }
  return { headers };
});



//combines links and sets up caching
//creates apollo client instance which : 1.sends request to graphql api, 2.attach jwt , 3.cache responses for performance
export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(), //enable cache
  // default options to prevent cache issues
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
  },
});