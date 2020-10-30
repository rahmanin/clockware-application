import React, { useState, useEffect, useCallback } from "react";

export const FinishedOrdersContext = React.createContext();

export default function FinishedOrdersProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  const useOrders = () => useEffect(() => {
    setIsLoading(true);
    fetch(
      `/api/orders_pagination`
    )
      .then(res => res.json())
      .then(json => {
        setOrders(json);
        setIsLoading(false);
      });
  }, []);

  const updateToContext = useCallback(
    (id, feedback_master, additional_price, is_done) => {
      orders.orders.find(el => el.order_id === id).feedback_master = feedback_master;
      orders.orders.find(el => el.order_id === id).additional_price = additional_price;
      orders.orders.find(el => el.order_id === id).is_done = is_done;
      setOrders(orders);
      setIsLoading(false);
    },
    [orders]
  );

  const updateFilteredOrders = useCallback(
    (result) => {
      setOrders(result);
      setIsLoading(false);
    },
    [orders]
  );

  const deleteFromContext = useCallback(
    id => {
      const newArray = orders.orders.filter(el => el.order_id !== id);
      orders.orders = newArray;
      setOrders(orders);
      setIsLoading(false);
    },
    [orders]
  );

  return (
    <FinishedOrdersContext.Provider
      value={{
        isLoading,
        orders,
        updateToContext,
        setIsLoading,
        useOrders,
        updateFilteredOrders,
        deleteFromContext
      }}
    >
      {children}
    </FinishedOrdersContext.Provider>
  );
}
