import {
  CHECK_USER_TOKEN_STARTED, 
  CHECK_USER_TOKEN_SUCCESS, 
  CHECK_USER_TOKEN_FAILURE, 
  UPDATE_USER_PARAMS,
  LOG_IN_STARTED,
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE,
  LOG_OUT,
  SET_PASSWORD_STARTED,
  SET_PASSWORD_SUCCESS,
  SET_PASSWORD_FAILURE
} from "./actionTypes";
import {fetchPath} from "../../constants/fetchPath";
import { headers } from "../../api/headers";
import { Dispatch } from "redux";
import { subscribeUser } from '../../subscription';

export interface UserData {
  userId: number,
  role?: "admin"|"client"|"master",
  email: string,
  username: string,
  registration?: boolean,
  token?: string,
  msg?: string
}

export interface Action {
  type: string,
  error?: any,
  user?: UserData
}

interface Options {
  method: string,
  headers: {},
  body?: string
}

export const checkToken = () => {
  return (dispatch: Dispatch) => {
    dispatch(checkTokenStarted());

    headers.authorization = localStorage.token;
    const options: Options = {
      method: "POST",
      headers,
    };
    fetch(`/api/${fetchPath.checkToken}`, options)
      .then(res => res.json())
      .then(user => {
        dispatch(checkTokenSuccess())
        dispatch(updateUserParams(user))
      })
      .catch(error => {
        console.log("Error:", error);
        dispatch(checkTokenFailure(error))
      });
  }
}

export const logIn = (emailAndPass: {password: string, email: string}) => {
  return (dispatch: Dispatch) => {
    dispatch(logInStarted());

    const options: Options = {
      method: "POST",
      headers,
      body: JSON.stringify(emailAndPass),
    };
    fetch(`/api/${fetchPath.logIn}`, options)
      .then(res => res.json())
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
}

export const userSetPassword = (password: {password: string}, token: string | string[] | null) => {
  return (dispatch: any) => {
    dispatch(setPasswordStarted());

    headers.authorization = token;
    const options: Options = {
      method: "POST",
      headers,
      body: JSON.stringify(password),
    };
    fetch(`/api/${fetchPath.userSetPassword}`, options)
      .then(res => res.json())
      .then(user => {
        dispatch(setPasswordSuccess())
        dispatch(logIn({...password, email: user[0].email}))
      })
      .catch(error => {
        console.log("Error:", error);
        dispatch(setPasswordFailure(error))
      });
  }
}

export const setPasswordStarted = (): Action => {
  return {
    type: SET_PASSWORD_STARTED,
  }
}

export const setPasswordSuccess = (): Action => {
  return {
    type: SET_PASSWORD_SUCCESS,
  }
}

export const setPasswordFailure = (error: any): Action => {
  return {
    type: SET_PASSWORD_FAILURE,
    error
  }
}

export const checkTokenStarted = (): Action => {
  return {
    type: CHECK_USER_TOKEN_STARTED,
  }
}

export const checkTokenSuccess = (): Action => {
  return {
    type: CHECK_USER_TOKEN_SUCCESS,
  }
}

export const checkTokenFailure = (error: any): Action => {
  return {
    type: CHECK_USER_TOKEN_FAILURE,
    error
  }
}

export const logInStarted = (): Action => {
  return {
    type: LOG_IN_STARTED,
  }
}

export const logInSuccess = (): Action => {
  return {
    type: LOG_IN_SUCCESS,
  }
}

export const logInFailure = (error: any): Action => {
  return {
    type: LOG_IN_FAILURE,
    error
  }
}

export function updateUserParams(user: UserData): Action {
  return {
    type: UPDATE_USER_PARAMS,
    user
  }
}

export function logOut(): Action {
  return {
    type: LOG_OUT
  }
}