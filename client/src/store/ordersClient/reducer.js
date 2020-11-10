import {
  ADD_TO_ORDER_FORM
} from "./actionTypes";

const initialState = {
  list: {}
}

export default function ordersClientReducer(state = initialState, action) {
  const {data} = action || {}

  switch (action.type) {
    case ADD_TO_ORDER_FORM:
      return {
        ...state,
        list: data
      }
    default:
      return state
  }
}