import React, {useState, useCallback} from 'react';

export const OrderContext = React.createContext([]);

export default function OrderProvider ({ children }) {
  const [order, setOrder] = useState([]);
  const orderComplete = {...order[0], ...order[1]};
  console.log("order in provider", JSON.stringify(orderComplete, null, 2));

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