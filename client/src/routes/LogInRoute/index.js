import React, {useEffect} from 'react';
import { Form, Input, Button} from 'antd';
import { useHistory } from "react-router-dom";
import {routes} from "../../constants/routes";
import './index.scss';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useDispatch} from "react-redux";
import { useSelector } from "react-redux";
import {logIn} from "../../store/users/actions";
import {userParams} from "../../store/users/selectors";

export default function LogIn() {
  const dispatch = useDispatch();
  const history = useHistory();
  const userData = useSelector(userParams)
 
  useEffect(() => {
    userData && userData.msg && toast.info(userData.msg)
    userData && userData.userId && history.push(`${routes.orders}`)
  }, [userData])

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

  const onFinish = values => {
    dispatch(logIn(values))
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
