import React, { useState, useEffect, useCallback } from "react";

export const FinishedOrdersContext = React.createContext();

export default function FinishedOrdersProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    fetch(
      `/api/orders`
    )
      .then(res => res.json())
      .then(json => {
        setOrders(json);
        setIsLoading(false);
      });
  }, []);

  const updateToContext = useCallback(
    (id, feedback_master, additional_price, is_done) => {
      orders.find(el => el.order_id === id).feedback_master = feedback_master;
      orders.find(el => el.order_id === id).additional_price = additional_price;
      orders.find(el => el.order_id === id).is_done = is_done;
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
      }}
    >
      {children}
    </FinishedOrdersContext.Provider>
  );
}
