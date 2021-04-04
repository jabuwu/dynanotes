import '../../styles/style.css';
import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react';
import { createClient, dedupExchange, fetchExchange, Provider, subscriptionExchange } from 'urql';
import { cacheExchange, Cache, QueryInput } from '@urql/exchange-graphcache';
import theme from '../theme';
import { NavBar } from '../components/NavBar';
import {
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
  NoteQuery,
  NotesQuery,
  NoteAddedSubscription,
  NotesDocument,
} from '../generated/graphql';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import ws from 'ws';

function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query,
) {
  return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
}

const subscriptionClient = new SubscriptionClient(process.env.NEXT_PUBLIC_GRAPHQL_WS || 'wss://localhost/graphql', { reconnect: true }, typeof window == 'undefined' ? ws : undefined);


const client = createClient({
  url: process.env.NEXT_PUBLIC_GRAPHQL || '/graphql',
  fetchOptions: {
    credentials: 'include',
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          login: (...args) => {
            betterUpdateQuery<LoginMutation, MeQuery>(
              args[2],
              { query: MeDocument },
              args[0],
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  return {
                    me: result.login.user,
                  };
                }
              },
            );
          },
          register: (...args) => {
            betterUpdateQuery<RegisterMutation, MeQuery>(
              args[2],
              { query: MeDocument },
              args[0],
              (result, query) => {
                if (result.register.errors) {
                  return query;
                } else {
                  return {
                    me: result.register.user,
                  };
                }
              },
            );
          },
          logout: (...args) => {
            betterUpdateQuery<LogoutMutation, MeQuery>(
              args[2],
              { query: MeDocument },
              args[0],
              (result, query) => {
                if (result.logout) {
                  return {
                    me: null,
                  };
                } else {
                  return query;
                }
              },
            );
          },
          createNote: (...args) => {
            const cache = args[2];
            cache.invalidate('Query', 'notes');
          },
          deleteNote: (...args) => {
            const cache = args[2];
            cache.invalidate('Query', 'notes');
            cache.invalidate('Query', 'notes', { id: args[0].id! });
          },
        },
        Subscription: {
          noteAdded: (...args) => {
            betterUpdateQuery<NoteAddedSubscription, NotesQuery>(
              args[2],
              { query: NotesDocument },
              args[0],
              (result, query) => {
                query.notes = [result.noteAdded, ...query.notes];
                return query;
              },
            );
          },
        },
      },
    }),
    fetchExchange,
    subscriptionExchange({
      forwardSubscription(operation) {
        return subscriptionClient.request(operation);
      },
    }),
  ],
});

function MyApp({ Component, pageProps }: any) {
  return (
    <Provider value={client}>
      <ChakraProvider resetCSS theme={theme}>
        <ColorModeProvider
          options={{
            useSystemColorMode: true,
          }}
        >
          <NavBar />
          <Component {...pageProps} />
        </ColorModeProvider>
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;