import React, {useState} from "react";
import './index.scss';
import {useData} from "../../hooks/useData";
import { Card, Button, Modal } from 'antd';
import Loader from "../../components/Loader";
import RatingStars from "../../components/Rating";

export default function Orders() {

  const [showDoneOrders, setShow] = useState(false)
  const [opened, openModal] = useState(false);
  const [feedback, setFeedback] = useState(null);


  const handleCancel = () => {
    openModal(false);
    setFeedback(null);
  };

  const handleOpen = (fb) => {
    setFeedback(fb);
    openModal(true);
  }

  const orders = useData('orders');

  if (orders.isLoading) return <Loader />

  return <div>
    <Button
      className="showOrders"
      type="primary"
      onClick={() => setShow(!showDoneOrders)}
    >
      {showDoneOrders ? "Show unfinished" : "Show finished"}
    </Button>
    <div className="wrapper">
      {orders.data.map(order => 
        <Card 
          className={order.isDone ? "order_card isDone" : "order_card IsNotDone"} 
          key={order.order_id} 
          title={`Order id #${order.order_id}`} 
          style={{ width: 300 }}
          hidden={order.isDone ? !showDoneOrders : showDoneOrders}
        >
          <p className="order_content"><span className="order_header">Client id: </span>{order.client_id}</p>
          <p className="order_content"><span className="order_header">Client: </span>{order.client_name}</p>
          <p className="order_content"><span className="order_header">Email: </span>{order.client_email}</p>
          <p className="order_content"><span className="order_header">City: </span>{order.city}</p>
          <p className="order_content"><span className="order_header">Size: </span>{order.size}</p>
          <p className="order_content"><span className="order_header">Date: </span>{order.order_date}</p>
          <p className="order_content"><span className="order_header">Master: </span>{order.order_master}</p>
          <p className="order_content"><span className="order_header">Evaluation: </span>{order.evaluation ? <RatingStars value={order.evaluation} readOnly={true}/> : "N/A"}</p>
          <p className="order_content"><span className="order_header">Client's feedback: </span>{order.feedback_client ? <span className="feedback" onClick={() => handleOpen(order.feedback_client)}>Show feedback</span> : "N/A"}</p>
          <p className="order_content"><span className="order_header">Master's feedback: </span>{order.feedback_master ? <span className="feedback" onClick={() => handleOpen(order.feedback_master)}>Show feedback</span> : "N/A"}</p>
          <p className="order_content"><span className="order_header">Additional price: </span>{order.additional_price ? order.additional_price : "0"} hrn</p>
          <p className="order_content"><span className="order_header">Total price: </span>{order.additional_price ? order.order_price + order.additional_price : order.order_price} hrn</p>
        </Card>)}
    </div>
    <Modal
      title="Feedback"
      closable={true}
      onCancel={handleCancel}
      visible={opened}
      footer={false}
    >
    <div>{feedback}</div>
    </Modal>
  </div>
}