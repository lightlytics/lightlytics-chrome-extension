import { ApolloProvider, InMemoryCache } from "@apollo/client";
import { createTheme, ThemeProvider } from "@mui/material";
import React, { useMemo } from "react";
import context from "../context";
import useClient from "../hooks/useClient";

const theme = createTheme({
  typography: {
    subtitle1: {
      fontSize: 14,
      lineHeight: "unset",
    },
    subtitle2: {
      fontSize: 13,
      lineHeight: "unset",
    },
    body1: { fontSize: 12 },
    body2: { fontSize: 12 },
    caption: { fontSize: 11 },
  },
});

const ContextProvider: React.FC<any> = ({ cache, children }) => {
  const contextValue = useContextValue();

  return (
    <context.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <APIProvider cache={cache}>{children}</APIProvider>
      </ThemeProvider>
    </context.Provider>
  );
};

const APIProvider: React.FC<any> = ({ cache, children }) => {
  cache = useMemo(() => cache || new InMemoryCache(), [cache]);

  const client = useClient({
    cache,
  });

  return client ? (
    <ApolloProvider client={client}>{children}</ApolloProvider>
  ) : (
    <React.Fragment />
  );
};

function useContextValue() {
  return useMemo(() => ({}), []);
}

export default ContextProvider;
