import React, {useContext} from 'react';
import { Form, Input, Button} from 'antd';
import { useHistory } from "react-router-dom";
import {routes} from "../../constants/routes";
import logIn from "../../api/logIn";
import './index.scss';
import { ToastContainer, toast } from 'react-toastify';
import {IsLoggedContext} from "../../providers/IsLoggedProvider";
import 'react-toastify/dist/ReactToastify.css';

export default function LogIn() {
  const history = useHistory();
  const { logInOut } = useContext(IsLoggedContext);
  
  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };
  const tailLayout = {
    wrapperCol: {
      offset: 8,
      span: 16,
    },
  };
  const notify = () => toast.info(localStorage.msg)

  const onFinish = values => {
    logIn(values)
      .then(() => notify())
      .then(() => {
        if (localStorage.token) history.push(`${routes.admin}/masters`)
      })
      .then(() => logInOut())
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  return (
      <Form
        className="login_form"
        {...layout}
        name="basic"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: 'Please input your username!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
        <ToastContainer
          position="top-center"
          autoClose={4000}
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
