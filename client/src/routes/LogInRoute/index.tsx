import React, {useEffect} from 'react';
import { Form, Input, Button} from 'antd';
import { useHistory } from "react-router-dom";
import {routes} from "../../constants/routes";
import { useLocation } from 'react-router';
import './index.scss';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useDispatch} from "react-redux";
import { useSelector } from "react-redux";
import {
  logIn, 
  userSetPassword, 
  logInFailure, 
  logInStarted, 
  logInSuccess,
  updateUserParams
} from "../../store/users/actions";
import {userParams} from "../../store/users/selectors";
import queryString from 'query-string';
import {UserData} from "../../store/users/actions"
import { GoogleLogin } from 'react-google-login';
import { postData } from '../../api/postData';
import FacebookLogin from 'react-facebook-login'

export default function LogIn() {
  const dispatch = useDispatch();
  const history = useHistory();
  const userData: UserData = useSelector(userParams)
  const location = useLocation();
  const paramsURL = queryString.parse(location.search);
  let token: string | string[] | null = paramsURL.token;
  
  useEffect(() => {
    userData && userData.msg && toast.info(userData.msg)
    !token && userData && userData.role && history.push(`${routes.orders}`)
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

  const onFinishLogIn = (values: {password: string, email: string}) => {
    dispatch(logIn(values))
  };

  const onFinishSetPassword = (values: {password: string}) => {
    dispatch(userSetPassword(values, token))
    history.push(`${routes.orders}`)
  };

  const onFinishFailed = (errorInfo: Object) => {
    console.log('Failed:', errorInfo);
  };

  const responseGoogleSuccess = (response: any) => {
    const id_token = response.getAuthResponse().id_token;
    const data = {
      id_token: id_token,
    }
    dispatch(logInStarted())
    postData(data, "googleLogin")
      .then(user => {
        localStorage.clear();
        user.token && localStorage.setItem("token", user.token);
        dispatch(logInSuccess())
        dispatch(updateUserParams(user))
      })
      .catch(error => {
        console.log("Error:", error);
        dispatch(logInFailure(error))
      });
  }

  const responseGoogleFailure = (response: any) => {
    dispatch(logInFailure(response))
  }

  const responseFacebook = (response: any) => {
    const data = {
      accessToken: response.accessToken,
      email: response.email
    }
    dispatch(logInStarted())
    postData(data, "facebookLogin")
      .then(user => {
        localStorage.clear();
        user.token && localStorage.setItem("token", user.token);
        dispatch(logInSuccess())
        dispatch(updateUserParams(user))
      })
      .catch(error => {
        console.log("Error:", error);
        dispatch(logInFailure(error))
      });
  }

  return (
    <>
      <div className="social_login_buttons">
        <h4 className="header_login_buttons">Log in with</h4>
        <GoogleLogin
          clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}
          buttonText="Google"
          onSuccess={responseGoogleSuccess}
          onFailure={responseGoogleFailure}
          cookiePolicy={'single_host_origin'}
        />
        <FacebookLogin
          appId={`${process.env.REACT_APP_FACEBOOK_APP_ID}`}
          size="small"
          autoLoad={false}
          textButton="Facebook"
          fields="name,email"
          onClick={() => true}
          callback={responseFacebook} 
        />
      </div>
      <Form
        className="login_form"
        {...layout}
        name="basic"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinishLogIn}
        onFinishFailed={onFinishFailed}
        hidden={!!token}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              type: "email",
              required: true,
              message: 'Please input your email!',
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
      </Form>
      <Form
        className="login_form"
        {...layout}
        name="basic"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinishSetPassword}
        onFinishFailed={onFinishFailed}
        hidden={!token}
      >
        <h3 className="pass_header">Create your own password to continue</h3>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Min 4 symbols',
              min: 4
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
      </Form>
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
    </>
  );
};
