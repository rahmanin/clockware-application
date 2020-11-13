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

export const checkToken = () => {
  return dispatch => {
    dispatch(checkTokenStarted());

    headers.authorization = localStorage.token;
    const options = {
      method: "POST",
      headers,
    };
    fetch(
      `/api/${fetchPath.checkToken}`, options
    )
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

export const logIn = (emailAndPass) => {
  return dispatch => {
    dispatch(logInStarted());

    const options = {
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
      .catch(error => {
        console.log("Error:", error);
        dispatch(logInFailure(error))
      });
  }
}

export const userSetPassword = (password, token) => {
  return dispatch => {
    dispatch(setPasswordStarted());

    headers.authorization = token;
    const options = {
      method: "POST",
      headers,
      body: JSON.stringify(password),
    };
    fetch(
      `/api/${fetchPath.userSetPassword}`, options
    )
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

const setPasswordStarted = () => {
  return {
    type: SET_PASSWORD_STARTED,
  }
}

const setPasswordSuccess = () => {
  return {
    type: SET_PASSWORD_SUCCESS,
  }
}

const setPasswordFailure = error => {
  return {
    type: SET_PASSWORD_FAILURE,
    error
  }
}

const checkTokenStarted = () => {
  return {
    type: CHECK_USER_TOKEN_STARTED,
  }
}

const checkTokenSuccess = () => {
  return {
    type: CHECK_USER_TOKEN_SUCCESS,
  }
}

const checkTokenFailure = error => {
  return {
    type: CHECK_USER_TOKEN_FAILURE,
    error
  }
}

const logInStarted = () => {
  return {
    type: LOG_IN_STARTED,
  }
}

const logInSuccess = () => {
  return {
    type: LOG_IN_SUCCESS,
  }
}

const logInFailure = error => {
  return {
    type: LOG_IN_FAILURE,
    error
  }
}

export function updateUserParams(user) {
  return {
    type: UPDATE_USER_PARAMS,
    user
  }
}

export function logOut() {
  return {
    type: LOG_OUT
  }
}