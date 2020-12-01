import {
  GET_ORDERS_STARTED,
  GET_ORDERS_SUCCESS,
  GET_ORDERS_FAILURE,
  UPDATE_ORDERS,
  DELETE_ORDERS,
} from "./actionTypes";
import {Action, OrdersPagination, Order} from "./actions";

export interface OrdersState {
  list: OrdersPagination,
  loading: boolean
}

const initialState: OrdersState = {
  list: {} as OrdersPagination,
  loading: false
}

export default function ordersReducer(state = initialState, action: Action) {
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
      const editableItem = copyList1.orders.find((el: Order) => el.order_id === id);
      if (editableItem) {
        editableItem.order_date = values?.order_date
        editableItem.size = values?.size
        editableItem.city = values?.city
        editableItem.order_price = values?.order_price
        editableItem.order_time_start = values?.order_time_start
        editableItem.order_time_end = values?.order_time_end
        editableItem.master_id = values?.master_id
        editableItem.order_master = values?.order_master
      }
      return {
        ...state,
        list: copyList1
      }
    case DELETE_ORDERS:
      let copyList2 = Object.assign({}, list)
      copyList2.orders = copyList2.orders.filter((el: Order) => el.order_id !== id)
      return {
        ...state,
        list: copyList2
      }
    default:
      return state
  }
}