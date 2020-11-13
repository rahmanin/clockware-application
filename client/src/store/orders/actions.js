import {
  GET_ORDERS_STARTED,
  GET_ORDERS_SUCCESS,
  GET_ORDERS_FAILURE,
  UPDATE_ORDERS,
  DELETE_ORDERS,
} from "./actionTypes";
import {fetchPath} from "../../constants/fetchPath";
import { headers } from "../../api/headers";

export const getOrders = (data) => {
  return dispatch => {
    dispatch(getOrdersStarted());

    if (localStorage.token) headers.authorization = localStorage.token;

    const options = {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    };

    fetch(`/api/${fetchPath.orders}`, options)
      .then(response => response.json())
      .then(data => dispatch(getOrdersSuccess(data)))
      .catch(error => {
        console.log("Error:", error);
        dispatch(getOrdersFailure(error))
      });
  }
}

const getOrdersStarted = () => {
  return {
    type: GET_ORDERS_STARTED,
  }
}

const getOrdersSuccess = data => {
  return {
    type: GET_ORDERS_SUCCESS,
    data
  }
}

const getOrdersFailure = error => {
  return {
    type: GET_ORDERS_FAILURE,
    error
  }
}

export function updateOrder(id, values) {
  return {
    type: UPDATE_ORDERS,
    id,
    values
  }
}

export function deleteOrders(id) {
  return {
    type: DELETE_ORDERS,
    id
  }
}