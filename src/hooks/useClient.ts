import {
  ApolloClient,
  createHttpLink,
  fromPromise,
  InMemoryCache,
} from "@apollo/client";
import { GraphQLErrors } from "@apollo/client/errors";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { useMemo, useRef } from "react";
import { createAccessToken, getAccessToken, setAccessToken } from "../auth";
import useUri from "./useUri";

function useClient({ cache }: { cache: InMemoryCache }) {
  const httpLink = useHttpLink();
  const authLink = useAuthLink();
  const errorLink = useErrorLink();

  return useMemo(
    () =>
      httpLink &&
      new ApolloClient({
        link: errorLink.concat(authLink.concat(httpLink)),
        cache,
      }),
    [httpLink, errorLink, authLink, cache]
  );
}

function useHttpLink() {
  const uri = useUri();
  return useMemo(
    () =>
      uri &&
      createHttpLink({
        uri,
      }),
    [uri]
  );
}

function useAuthLink() {
  return useMemo(
    () =>
      setContext(async (_, { headers }) => {
        return {
          headers: {
            ...headers,
            authorization: `Bearer ${await getAccessToken()}`,
          },
        };
      }),
    []
  );
}

function useErrorLink() {
  const ref = useRef({
    working: false,
    resolvers: [] as (() => void)[],
  });

  return useMemo(
    () =>
      onError(({ networkError, graphQLErrors, operation, forward }) => {
        if (isAuthError(graphQLErrors)) {
          let forward$;

          if (!ref.current.working) {
            ref.current.working = true;

            forward$ = fromPromise(
              createAccessToken()
                .then((token) => {
                  setAccessToken(token);
                  ref.current.resolvers.forEach((resolve) => resolve());
                })
                .finally(() => {
                  ref.current.working = false;
                })
            ).filter((value) => Boolean(value));
          } else {
            forward$ = fromPromise(
              new Promise((resolve) => {
                ref.current.resolvers.push(resolve as never);
              })
            );
          }

          return forward$.flatMap(() => forward(operation));
        }

        if (networkError) {
          throw networkError;
        }
      }),
    []
  );
}

function isAuthError(graphQLErrors: GraphQLErrors | undefined) {
  return graphQLErrors?.find(({ extensions: { code } }) => {
    return code === "UNAUTHENTICATED";
  });
}

export default useClient;
