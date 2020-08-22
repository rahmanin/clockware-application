import React from 'react';
import { Form, Input, Button} from 'antd';
import { useHistory } from "react-router-dom";
import './index.scss';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RatingStars from "../../components/Rating";
import { useFormik } from 'formik';

export default function Feedback() {
  const history = useHistory();
  
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

  return (
    <Form
      className="feedback_form"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 14 }}
      layout="horizontal"
    >
      <Form.Item label="Feedback" className="form_item">
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
