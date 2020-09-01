import React, {useState, useCallback} from 'react';

export const OrderContext = React.createContext([]);

export default function OrderProvider ({ children }) {
  const [order, setOrder] = useState([]);
  const [msg, setMsg] = useState([]);
  
  
  const addToOrder = useCallback(
    newPartOfOrder => {
      setOrder([newPartOfOrder]);
    },
    [order]
  );

  const addMsgToContext = useCallback(
    newMsg => {
      setMsg([newMsg]);
    },
    [msg]
  );

  return (
    <OrderContext.Provider
      value={{
      order,
      addToOrder,
      msg,
      addMsgToContext
    }}
    >
      { children }
    </OrderContext.Provider>
  )
}