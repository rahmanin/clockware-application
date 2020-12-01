import {
  ADD_TO_ORDER_FORM
} from "./actionTypes";
import {ClientOrderForm, Action} from "./actions"

export interface ClientOrderState {
  list: ClientOrderForm
}

const initialState: ClientOrderState = {
  list: {} as ClientOrderForm
}

export default function ordersClientReducer(state = initialState, action: Action) {
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