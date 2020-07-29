import React, { useState, useEffect, useCallback } from "react";

export const MastersContext = React.createContext();

export default function MastersProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [masters, setMasters] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    fetch(
      `/masters`
    )
      .then(res => res.json())
      .then(json => {
        setMasters(json);
        setIsLoading(false);
      });
  }, []);

  const addToContext = useCallback(
    el => {
      setIsLoading(true);
      masters.push(el);
      setMasters(masters);
      setIsLoading(false);
    },
    [masters]
  );

  const updateToContext = useCallback(
    (id, master_name, city, rating) => {
      setIsLoading(true);
      masters.find(el => el.id === id).master_name = master_name;
      masters.find(el => el.id === id).city = city;
      masters.find(el => el.id === id).rating = rating;
      setMasters(masters);
      setIsLoading(false);
    },
    [masters]
  );

  const deleteFromContext = useCallback(
    id => {
      setIsLoading(true);
      const newArray = masters.filter(el => el.id !== id);
      setMasters(newArray);
      setIsLoading(false);
    },
    [masters]
  );

  return (
    <MastersContext.Provider
      value={{
        isLoading,
        masters,
        addToContext,
        updateToContext,
        deleteFromContext
      }}
    >
      {children}
    </MastersContext.Provider>
  );
}
