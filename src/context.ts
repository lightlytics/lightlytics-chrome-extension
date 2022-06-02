import React from "react";

const context = React.createContext<{}>({});

export function useContext() {
  return React.useContext(context);
}

export default context;
