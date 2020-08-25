import React, { useState } from 'react';
import { Form, Input, Button, Card} from 'antd';
import { useLocation } from 'react-router';
import postData from "../../api/postData";
import './index.scss';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RatingStars from "../../components/Rating";
import { useFormik } from 'formik';
import queryString from 'query-string';

export default function Feedback() {
  const [disabled, setDisabled] = useState(false)
  const location = useLocation();
  const paramsURL = queryString.parse(location.search);
  const order_params = JSON.parse(paramsURL.order)
  if (paramsURL.token) localStorage.setItem("clientToken", paramsURL.token);

  const submitFunction = values => {
    setDisabled(true)
    postData(values, 'feedback')
      .then(res => toast.info(res.msg))
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
    <div className="wrapper_feedback">
      <Card 
        className="order"
        title={`Order`} 
        style={{ width: 300 }}
      >
        <p className="order_content"><span className="order_header">City: </span>{order_params.city}</p>
        <p className="order_content"><span className="order_header">Size: </span>{order_params.size}</p>
        <p className="order_content"><span className="order_header">Date: </span>{order_params.order_date}</p>
        <p className="order_content"><span className="order_header">Time: </span>{order_params.order_time_start}</p>
        <p className="order_content"><span className="order_header">Master: </span>{order_params.order_master}</p>
        <p className="order_content"><span className="order_header">Master's feedback: </span>{order_params.feedback_master ? order_params.feedback_master : "No feedback"}</p>
        <p className="order_content"><span className="order_header">Additional price: </span>{order_params.additional_price} hrn</p>
        <p className="order_content"><span className="order_header">Total price: </span>{Number(order_params.order_price) + Number(order_params.additional_price)} hrn</p>
      </Card>
      <Form
        className="feedback_form"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
      >
        <Input.TextArea
          className="form_item"
          name="feedback_client" 
          placeholder="100 symbols max"
          disabled={disabled}
          rows={4}
          onChange={formik.handleChange}
          value={formik.values.feedback_client}
        />
        <RatingStars 
          defaultValue={1}
          className="rating_stars"
          value={formik.values.evaluation}
          readOnly={disabled}
          precision={1}
          onChange={formik.handleChange}
        />
          <Button 
            type="primary" 
            onClick={formSubmit}
            disabled={disabled}
          >
            {"Ok"}
          </Button>
      </Form>
      <ToastContainer
        className="toast"
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
    </div>
  );
};
