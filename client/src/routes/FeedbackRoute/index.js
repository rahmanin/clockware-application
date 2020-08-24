import React from 'react';
import { Form, Input, Button, Card} from 'antd';
import { useHistory } from "react-router-dom";
import { useLocation } from 'react-router';
import './index.scss';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RatingStars from "../../components/Rating";
import { useFormik } from 'formik';
import queryString from 'query-string';

export default function Feedback() {
  const history = useHistory();
  const location = useLocation();
  const paramsURL = queryString.parse(location.search);
  const order_params = JSON.parse(paramsURL.order)
  console.log(order_params);

  const submitFunction = values => {
    console.log(values);
  }

  const formik = useFormik({
    initialValues: {
      feedback_client: '',
      evaluation: "1"
     },
    
    onSubmit: values => submitFunction(values),
    enableReinitialize: true
  });

  const formSubmit = () => {
    formik.handleSubmit();
  };

  if (!paramsURL.token || !paramsURL.order) return <h1>404 PAGE NOT FOUND</h1>

  return (
    
    <Form
      className="feedback_form"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 14 }}
      layout="horizontal"
    >
      <Card 
        className="order_card is_done"
        title={`Order`} 
        style={{ width: 300 }}
      >
        <p className="order_content"><span className="order_header">City: </span>{order_params.city}</p>
        <p className="order_content"><span className="order_header">Size: </span>{order_params.size}</p>
        <p className="order_content"><span className="order_header">Date: </span>{order_params.order_date}</p>
        <p className="order_content"><span className="order_header">Master: </span>{order_params.order_master}</p>
        <p className="order_content"><span className="order_header">Master's feedback: </span>{order_params.feedback_master ? order_params.feedback_master : "No feedback"}</p>
        <p className="order_content"><span className="order_header">Additional price: </span>{order_params.additional_price} hrn</p>
        <p className="order_content"><span className="order_header">Total price: </span>{Number(order_params.order_price) + Number(order_params.additional_price)} hrn</p>
      </Card>
      <Form.Item className="form_item">
        <Input.TextArea
          name="feedback_client" 
          placeholder="100 symbols max"
          rows={4}
          onChange={formik.handleChange}
          value={formik.values.feedback_client}
        />
      </Form.Item>
      <RatingStars 
        defaultValue={1}
        className="rating_stars"
        value={formik.values.evaluation}
        readOnly={false}
        precision={1}
        onChange={formik.handleChange}
      />
      <Form.Item>
        <Button type="primary" onClick={formSubmit}>{"Ok"}</Button>
      </Form.Item>
      <ToastContainer
        position="top-center"
        autoClose={false}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Form>
  );
};
