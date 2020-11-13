import {
  GET_ORDERS_STARTED,
  GET_ORDERS_SUCCESS,
  GET_ORDERS_FAILURE,
  UPDATE_ORDERS,
  DELETE_ORDERS,
} from "./actionTypes";

const initialState = {
  list: [],
  loading: false
}

export default function ordersReducer(state = initialState, action) {
  const {id, values, data, error} = action || {}
  const {list} = state;

  switch (action.type) {
    case GET_ORDERS_STARTED:
      return {
        ...state,
        loading: true
      }
    case GET_ORDERS_SUCCESS:
      return {
        ...state,
        list: data,
        loading: false
      }
    case GET_ORDERS_FAILURE:
      return {
        ...state,
        error: error,
        loading: false
      }
    case UPDATE_ORDERS:
      const copyList1 = Object.assign({}, list)
      copyList1.orders.find(el => el.order_id === id).order_date = values.order_date
      copyList1.orders.find(el => el.order_id === id).size = values.size
      copyList1.orders.find(el => el.order_id === id).city = values.city
      copyList1.orders.find(el => el.order_id === id).order_price = values.order_price
      copyList1.orders.find(el => el.order_id === id).order_time_start = values.order_time_start
      copyList1.orders.find(el => el.order_id === id).order_time_end = values.order_time_end
      copyList1.orders.find(el => el.order_id === id).master_id = values.master_id
      copyList1.orders.find(el => el.order_id === id).order_master = values.order_master
      return {
        ...state,
        list: copyList1
      }
    case DELETE_ORDERS:
      let copyList2 = Object.assign({}, list)
      copyList2.orders = copyList2.orders.filter(el => el.order_id !== id)
      return {
        ...state,
        list: copyList2
      }
    default:
      return state
  }
}