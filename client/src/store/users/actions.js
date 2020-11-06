import {
  CHECK_USER_TOKEN_STARTED, 
  CHECK_USER_TOKEN_SUCCESS, 
  CHECK_USER_TOKEN_FAILURE, 
  UPDATE_USER_PARAMS,
  LOG_IN_STARTED,
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE,
  LOG_OUT
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

export const logIn = (nameAndPass) => {
  return dispatch => {
    dispatch(logInStarted());

    const options = {
      method: "POST",
      headers,
      body: JSON.stringify(nameAndPass),
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