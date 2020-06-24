import React from "react";
import './index.scss';
import {useData} from "../../hooks/useData";
import { Card } from 'antd';

export default function Orders() {
  const orders = useData('orders');
  console.log(orders)
  return <div className="wrapper">
    {orders.data.map(order => <Card key={order.id} title={order.id} style={{ width: 300 }}>
      <p>{order.client_name}</p>
      <p>{order.client_email}</p>
      <p>{order.city}</p>
      <p>{order.size}</p>
      <p>{order.order_date}</p>
      <p>{order.order_master}</p>
    </Card>)}
  </div>
}