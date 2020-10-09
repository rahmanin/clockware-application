import React, {useState, useContext} from "react";
import './index.scss';
import { Card, Button, Modal, Form, Input } from 'antd';
import Loader from "../../components/Loader";
import RatingStars from "../../components/Rating";
import * as Yup from 'yup';
import updateElement from '../../api/updateElement';
import { useFormik } from 'formik';
import {FinishedOrdersContext} from '../../providers/FinishedOrdersProvider';
import {UsersContext} from "../../providers/UsersProvider";

export default function Orders() {

  const { userData } = useContext(UsersContext)
  const { setIsLoading, isLoading, orders, updateToContext, useOrders } = useContext(FinishedOrdersContext);
  const [showDoneOrders, setShow] = useState(false)
  useOrders()
  const [openedFinish, openModalFinish] = useState(false);
  const [openedFeedback, openModalFeedback] = useState(false);
  const [editableItem, setItem] = useState(null);

  const doOrder = values => {
    setIsLoading(true)
    values.client_email = editableItem.client.client_email
    updateElement(values, 'PUT', "orders", editableItem.order_id)
      .then(() => updateToContext(editableItem.order_id, values.feedback_master, values.additional_price, values.is_done))
      .then(handleCancel())
  }

  const handleOpenFinish = (order) => {
    setItem(order);
    openModalFinish(true);
  }

  const handleOpenFeedback = (order) => {
    setItem(order);
    openModalFeedback(true);
  }

  const submitFunction = values => {
    doOrder(values);
  }

  const formik = useFormik({
    initialValues: {
      feedback_master: '',
      additional_price: '0',
      is_done: true,
     },
    validationSchema: Yup.object({
      feedback_master: Yup.string()
        .max(100, 'Too Long!'),
      additional_price: Yup.number()
        .typeError("Price is incorrect")
        .integer("Must be integer")
    }),
    onSubmit: values => submitFunction(values),
    enableReinitialize: true
  });

  const formSubmit = () => {
    formik.handleSubmit();
  };

  const handleCancel = () => {
    openModalFinish(false);
    openModalFeedback(false);
    setItem(null);
  };

  if (isLoading) return <Loader />

  return <div>
    <Button
      className="showOrders"
      type="primary"
      onClick={() => setShow(!showDoneOrders)}
    >
      {showDoneOrders ? "Show unfinished" : "Show finished"}
    </Button>
    <div className="wrapper">
      {orders.map(order => {
        if (userData.is_admin || order.master_id === userData.usedId) return <Card 
          className={order.is_done ? "order_card is_done" : "order_card IsNotDone"} 
          key={order.order_id} 
          title={`Order id #${order.order_id}`} 
          style={{ width: 300 }}
          hidden={order.is_done ? !showDoneOrders : showDoneOrders}
        >
          <p className="order_content"><span className="order_header">Client id: </span>{order.client_id}</p>
          <p className="order_content"><span className="order_header">Client: </span>{order.client.client_name}</p>
          <p className="order_content"><span className="order_header">Email: </span>{order.client.client_email}</p>
          <p className="order_content"><span className="order_header">City: </span>{order.city}</p>
          <p className="order_content"><span className="order_header">Size: </span>{order.size}</p>
          <p className="order_content"><span className="order_header">Date: </span>{order.order_date}</p>
          <p className="order_content"><span className="order_header">Time: </span>{order.order_time_start}</p>
          <p className="order_content"><span className="order_header">Master: </span>{order.order_master}</p>
          <p className="order_content"><span className="order_header">Master ID: </span>{order.master_id}</p>
          <p className="order_content"><span className="order_header">Evaluation: </span>{order.evaluation ? <RatingStars value={order.evaluation} readOnly={true}/> : "N/A"}</p>
          <p className="order_content"><span className="order_header">Client's feedback: </span>{order.feedback_client ? <span className="feedback" onClick={() => handleOpenFeedback(order.feedback_client)}>Show feedback</span> : "N/A"}</p>
          <p className="order_content"><span className="order_header">Master's feedback: </span>{order.feedback_master ? <span className="feedback" onClick={() => handleOpenFeedback(order.feedback_master)}>Show feedback</span> : "N/A"}</p>
          <p className="order_content"><span className="order_header">Additional price: </span>{order.additional_price ? order.additional_price : "0"} hrn</p>
          <p className="order_content"><span className="order_header">Total price: </span>{Number(order.order_price) + Number(order.additional_price)} hrn</p>
          <Button type="primary" onClick={() => handleOpenFinish(order)} hidden={userData.is_admin || showDoneOrders}>Done</Button>
        </Card>
        })
      }
    </div>
    <Modal
      title={"Leave feedback and an additional price (not required)"}
      closable={true}
      onCancel={handleCancel}
      visible={openedFinish}
      footer={false}
    >
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
      >
        <Form.Item label="Text">
          <Input.TextArea
            name="feedback_master" 
            placeholder="100 symbols max"
            rows={4}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.feedback_master}/>
          {formik.touched.feedback_master && formik.errors.feedback_master ? (
            <div className="error">{formik.errors.feedback_master}</div>
          ) : null}
        </Form.Item>
        <Form.Item label="Price">
          <Input 
            name="additional_price" 
            placeholder="Enter additional price"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.additional_price}/>
          {formik.touched.additional_price && formik.errors.additional_price ? (
            <div className="error">{formik.errors.additional_price}</div>
          ) : null}
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={formSubmit}>{"Ok"}</Button>
        </Form.Item>
      </Form>
    </Modal>
    <Modal
      title={"Feedback"}
      closable={true}
      onCancel={handleCancel}
      visible={openedFeedback}
      footer={false}
    >
      <div>{editableItem}</div>
    </Modal>
  </div>
}