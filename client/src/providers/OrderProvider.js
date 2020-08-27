import React, {useState, useCallback} from 'react';

export const OrderContext = React.createContext([]);

export default function OrderProvider ({ children }) {
  const [order, setOrder] = useState([]);
  
  
  const addToOrder = useCallback(
    newPartOfOrder => {
      setOrder([newPartOfOrder]);
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