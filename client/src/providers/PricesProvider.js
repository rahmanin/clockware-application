import React, { useState, useEffect, useCallback } from "react";

export const PricesContext = React.createContext();

export default function PricesProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    fetch(
      `/api/sizes`
    )
      .then(res => res.json())
      .then(json => {
        setPrices(json);
        setIsLoading(false);
      });
  }, []);

  const updateToContext = useCallback(
    (id, price) => {
      prices.find(el => el.id === id).price = price;
      setPrices(prices);
      setIsLoading(false);
    },
    [prices]
  );

  return (
    <PricesContext.Provider
      value={{
        isLoading,
        prices,
        updateToContext,
        setIsLoading
      }}
    >
      {children}
    </PricesContext.Provider>
  );
}
