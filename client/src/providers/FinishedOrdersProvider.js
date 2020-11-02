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

  const updateEditedOrder = useCallback(
    values => {
      orders.orders.find(el => el.order_id === values.order_id).order_date = values.order_date
      orders.orders.find(el => el.order_id === values.order_id).size = values.size
      orders.orders.find(el => el.order_id === values.order_id).city = values.city
      orders.orders.find(el => el.order_id === values.order_id).order_price = values.order_price
      orders.orders.find(el => el.order_id === values.order_id).order_time_start = values.order_time_start
      orders.orders.find(el => el.order_id === values.order_id).order_time_end = values.order_time_end
      orders.orders.find(el => el.order_id === values.order_id).master_id = values.master_id
      orders.orders.find(el => el.order_id === values.order_id).order_master = values.order_master
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
        setIsLoading,
        useOrders,
        updateFilteredOrders,
        deleteFromContext,
        updateEditedOrder
      }}
    >
      {children}
    </FinishedOrdersContext.Provider>
  );
}
