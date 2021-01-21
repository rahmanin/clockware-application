import {
  GET_ORDERS_STARTED,
  GET_ORDERS_SUCCESS,
  GET_ORDERS_FAILURE,
  UPDATE_ORDERS,
  FINISH_ORDER,
  DELETE_ORDERS,
} from "./actionTypes";
import {fetchPath} from "../../constants/fetchPath";
import { headers } from "../../api/headers";
import { Dispatch } from "redux";

export interface Order {
  order_id: number,
  size?: string,
  city?: string,
  order_date?: string,
  order_master?: string,
  feedback_master?: string,
  order_price?: number,
  additional_price?: number,
  is_done?: boolean,
  master_id?: string,
  order_time_start?: string,
  order_time_end?: string,
  client_id: number,
  image: string,
  user: {
    username: string,
    email: string
  },
  feedbacks_client?: {
    feedback: string, 
    evaluation: number,
    master_id: number,
    order_id: number,
    createdAt: string
  }
}

export interface OrdersPagination {
  totalOrders: number,
  orders: Order[],
  totalPages: number, 
  currentPage: number,
}

interface Options {
  method: string,
  headers: {},
  body?: string
}

interface DoOrderForm {
  email?: string,
  feedback_master?: string,
  additional_price?: number,
  is_done?: boolean,
}

export interface OrderEditForm {
  order_id: number,
  order_date: string,
  size: string,
  city: string,
  order_price: number,
  order_time_start: string,
  order_time_end?: string,
  master_id?: string,
  order_master?: string,
  email?: string
}

export interface Action {
  type: string,
  error?: any,
  data?: OrdersPagination,
  id?: number,
  values?: OrderEditForm,
  doOrderValues?: DoOrderForm
}

export interface OrdersFilterForm {
  order_date_start: string,
  order_date_end: string,
  master_params: string,
  city: string,
  sortByDate: boolean,
  sortBy: {[key: string]: boolean},
  show_all: false,
  page: number,
  size: number,
}


export const getOrders = (data: OrdersFilterForm) => {
  return (dispatch: Dispatch) => {
    dispatch(getOrdersStarted());

    if (localStorage.token) headers.authorization = localStorage.token;

    const options: Options = {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    };

    fetch(`/api/${fetchPath.orders}`, options)
      .then(response => response.json())
      .then((data: OrdersPagination) => dispatch(getOrdersSuccess(data)))
      .catch(error => {
        console.log("Error:", error);
        dispatch(getOrdersFailure(error))
      });
  }
}

export const getOrdersStarted = (): Action => {
  return {
    type: GET_ORDERS_STARTED,
  }
}

export const getOrdersSuccess = (data: OrdersPagination): Action => {
  return {
    type: GET_ORDERS_SUCCESS,
    data
  }
}

export const getOrdersFailure = (error: any): Action => {
  return {
    type: GET_ORDERS_FAILURE,
    error
  }
}

export function updateOrder(id: number, values: OrderEditForm): Action {
  return {
    type: UPDATE_ORDERS,
    id,
    values
  }
}

export function finishOrder(id: number, doOrderValues: DoOrderForm): Action {
  return {
    type: FINISH_ORDER,
    id,
    doOrderValues
  }
}

export function deleteOrders(id: number): Action {
  return {
    type: DELETE_ORDERS,
    id
  }
}