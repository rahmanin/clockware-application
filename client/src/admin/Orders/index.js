import React from "react";
import './index.scss';
import {useData} from "../../hooks/useData";
import { Card } from 'antd';
import Loader from "../../components/Loader";

export default function Orders() {

  const orders = useData('orders');
  if (orders.isLoading) return <Loader />

  return <div className="wrapper">
    {orders.data.map(order => <Card className="order_card" key={order.order_id} title={`Order id #${order.order_id}`} style={{ width: 300 }}>
      <p className="order_content"><span className="order_header">Client id: </span>{order.client_id}</p>
      <p className="order_content"><span className="order_header">Client: </span>{order.client_name}</p>
      <p className="order_content"><span className="order_header">Email: </span>{order.client_email}</p>
      <p className="order_content"><span className="order_header">City: </span>{order.city}</p>
      <p className="order_content"><span className="order_header">Size: </span>{order.size}</p>
      <p className="order_content"><span className="order_header">Date: </span>{order.order_date}</p>
      <p className="order_content"><span className="order_header">Master: </span>{order.order_master}</p>
      <p className="order_content"><span className="order_header">Evaluation: </span>{order.mark ? order.mark : "N/A"}</p>
      <p className="order_content"><span className="order_header">Client's feedback: </span>{order.feedback_client ? order.feedback_client : "N/A"}</p>
      <p className="order_content"><span className="order_header">Master's feedback: </span>{order.feedback_master ? order.feedback_master : "N/A"}</p>
      <p className="order_content"><span className="order_header">Cost: </span>{order.cost ? order.cost : "N/A"}</p>
    </Card>)}
  </div>
}