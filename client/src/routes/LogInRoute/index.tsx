import React, {useEffect, useState} from 'react';
import { 
  Form, 
  Input, 
  Button,
  Modal,
} from 'antd';
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
import FacebookLogin from 'react-facebook-login';
import { subscribeUser } from '../../subscription';
import { Loader } from '../../components/Loader';
import { useTranslation } from 'react-i18next';

export default function LogIn() {
  const [opened, openModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const userData: UserData = useSelector(userParams)
  const location = useLocation();
  const paramsURL = queryString.parse(location.search);
  let token: string | string[] | null = paramsURL.token;
  const { t } = useTranslation('common')
  
  useEffect(() => {
    userData?.msg && toast.info(userData.msg)
    !token && userData?.role === "client" && history.push(`${routes.order}`)
    !token && (userData?.role === "admin" || userData?.role === "master") && history.push(`${routes.orders}`)
  }, [userData])
  
  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };

  const handleCancel = () => {
    openModal(false);
  };

  const onFinishLogIn = (values: {password: string, email: string}) => {
    dispatch(logIn(values))
  };

  const onFinishSetPassword = (values: {password: string}) => {
    dispatch(userSetPassword(values, token))
    history.push(`${routes.orders}`)
  };

  const onFinishForgotPassword = (values: {email: string}) => {
    setIsLoading(true)
    postData(values, "reset_password")
      .then(result => {
        openModal(false)
        setIsLoading(false)
        toast.info(result.msg)
      })
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
      .then(() => subscribeUser())
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
      .then(() => subscribeUser())
      .catch(error => {
        console.log("Error:", error);
        dispatch(logInFailure(error))
      });
  }
  if (isLoading) return <Loader />
  return (
    <>
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
        <h1 className="login_form_header">{t("Login.Login")}</h1>
        <Form.Item
          name="email"
          rules={[
            {
              type: "email",
              required: true,
              message: t('Login.errors.Please input your valid email'),
            },
          ]}
        >
          <Input 
            className="login_form_input"
            placeholder="Email" 
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: t('Login.errors.Please input your password'),
            },
          ]}
        >
          <Input.Password 
            className="login_form_input"
            placeholder={t("Login.placeholders.Password")}
          />
        </Form.Item>
        <div>
          <Button 
            type="link" 
            className="forgot_password"
            onClick={() => openModal(true)}
          >
            {t("Login.Forgot Password?")}
          </Button>
        </div>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login_form_input">
          {t("Login.Login")}
          </Button>
        </Form.Item>
        <h4 className="header_login_buttons">{t("Login.Or log in using")}</h4>
        <div className="social_login_buttons">
          <GoogleLogin
            clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}
            render={renderProps => (
              <button className="custom_btn google" onClick={renderProps.onClick} disabled={renderProps.disabled}></button>
            )}
            onSuccess={responseGoogleSuccess}
            onFailure={responseGoogleFailure}
            cookiePolicy={'single_host_origin'}
          />
          <FacebookLogin
            appId={`${process.env.REACT_APP_FACEBOOK_APP_ID}`}
            cssClass="custom_btn facebook"
            size="small"
            autoLoad={false}
            textButton=""
            fields="name,email"
            onClick={() => true}
            callback={responseFacebook} 
          />
        </div>
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
        <h3 className="header_login_buttons">{t("Login.Create password to continue")}</h3>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Min 4 symbols',
              min: 4
            },
          ]}
        >
          <Input.Password 
            className="login_form_input"
            placeholder={t("Login.placeholders.Password")}  
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login_form_input">
          {t("Login.Create password")}
          </Button>
        </Form.Item>
      </Form>
      <Modal
        title={t("Login.Reset password")}
        closable={true}
        onCancel={handleCancel}
        visible={opened}
        footer={false}
      >
        <Form
          {...layout}
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinishForgotPassword}
          onFinishFailed={onFinishFailed}
        >
          <p className="header_login_buttons">{t("Login.Input your address, You will recieve an email")}</p>
          <Form.Item
            name="email"
            rules={[
              {
                type: "email",
                required: true,
                message: t('Login.errors.Please input your valid email'),
              },
            ]}
          >
            <Input 
              placeholder="Email" 
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login_form_input">
              Ok
            </Button>
          </Form.Item>
        </Form>
      </Modal>
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
