import React, { useState, useEffect, useCallback } from "react";

export const CitiesContext = React.createContext();

export default function CitiesProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    fetch(
      `/cities`
    )
      .then(res => res.json())
      .then(json => {
        setCities(json);
        setIsLoading(false);
      });
  }, []);

  const addToContext = useCallback(
    el => {
      cities.push(el);
      console.log(cities);
      setCities(cities);
    },
    [cities]
  );

  const updateToContext = useCallback(
    (id, title) => {
      setIsLoading(true);
      cities.find(el => el.id === id).city = title
      setCities(cities);
      setIsLoading(false);
    },
    [cities]
  );

  const deleteFromContext = useCallback(
    id => {
      setIsLoading(true);
      const newArray = cities.filter(el => el.id !== id);
      setCities(newArray);
      setIsLoading(false);
    },
    [cities]
  );

  return (
    <CitiesContext.Provider
      value={{
        isLoading,
        cities,
        addToContext,
        updateToContext,
        deleteFromContext
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}
