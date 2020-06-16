import React, {useState, useCallback} from 'react';

export const OrderContext = React.createContext([]);

export default function OrderProvider ({ children }) {
  const [order, setOrder] = useState([]);
  console.log("order in provider", order)

  const addToOrder = useCallback(
    i => {
      const nextAdded = [...order, i];
      setOrder(nextAdded);
    },
    [order]
  );

  return (
    <OrderContext.Provider
      value={{
      order,
      addToOrder
    }}
    >
      { children }
    </OrderContext.Provider>
  )
}