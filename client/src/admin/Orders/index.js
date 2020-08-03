import React from "react";
import './index.scss';
import {useData} from "../../hooks/useData";
import { Card } from 'antd';

export default function Orders() {
  const orders = useData('orders');
  console.log(orders)
  return <div className="wrapper">
    {orders.data.map(order => <Card key={order.order_id} title={`Order id #${order.order_id}`} style={{ width: 300 }}>
      <p className="Order_content"><span className="order_header">Client id: </span>{order.client_id}</p>
      <p className="Order_content"><span className="order_header">Client: </span>{order.client_name}</p>
      <p className="Order_content"><span className="order_header">Email: </span>{order.client_email}</p>
      <p className="Order_content"><span className="order_header">City: </span>{order.city}</p>
      <p className="Order_content"><span className="order_header">Size: </span>{order.size}</p>
      <p className="Order_content"><span className="order_header">Date: </span>{order.order_date}</p>
      <p className="Order_content"><span className="order_header">Master: </span>{order.order_master}</p>
    </Card>)}
  </div>
}