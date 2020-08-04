import React, {useState, useCallback} from 'react';

export const ResponseContext = React.createContext([]);

export default function ResponseProvider ({ children }) {
  const [response, setResponse] = useState([]);
  
  
  const rewriteResponse = useCallback(
    res => {
      const lastAdded = [res];
      setResponse(lastAdded);
    },
    [response]
  );

  return (
    <ResponseContext.Provider
      value={{
      response,
      rewriteResponse
    }}
    >
      { children }
    </ResponseContext.Provider>
  )
}