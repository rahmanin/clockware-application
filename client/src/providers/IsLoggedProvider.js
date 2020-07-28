import React, {useState} from 'react';

export const IsLoggedContext = React.createContext();

export default function IsLoggedProvider ({ children }) {
  const [isLogged, setIsLogged] = useState(!!localStorage.token);


  const logInOut = () => {
      setIsLogged(!!localStorage.token)
      console.log("log in out")
  }

  console.log("isLogged context", isLogged)

  return (
    <IsLoggedContext.Provider
      value={{
      isLogged,
      logInOut
    }}
    >
      { children }
    </IsLoggedContext.Provider>
  )
}