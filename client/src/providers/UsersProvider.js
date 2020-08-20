import React, { useCallback } from "react";

export const UsersContext = React.createContext();

export default function UsersProvider({ children }) {
  
  const userData = {}

  const updateToContext = useCallback(
    (id, isAdm) => {
      userData.usedId = id;
      userData.is_admin = isAdm
    },
    []
  );

  return (
    <UsersContext.Provider
      value={{
        userData,
        updateToContext,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
}
