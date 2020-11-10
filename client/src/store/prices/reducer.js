import {
  UPDATE_PRICES, 
  GET_PRICES_STARTED, 
  GET_PRICES_SUCCESS, 
  GET_PRICES_FAILURE
} from "./actionTypes";

const initialState = {
  list: [],
  loading: false
}

export default function pricesReducer(state = initialState, action) {
  const {id, value, data, error} = action || {}
  const {list} = state;

  switch (action.type) {
    case GET_PRICES_STARTED:
      return {
        ...state,
        loading: true
      }
    case GET_PRICES_SUCCESS:
      return {
        ...state,
        list: data,
        loading: false
      }
    case GET_PRICES_FAILURE:
      return {
        ...state,
        error: error,
        loading: false
      }
    case UPDATE_PRICES:
      const updatedPrices = [...list]
      updatedPrices.find(el => el.id === id).price = value
      return {
        ...state,
        list: updatedPrices
      }
    default:
      return state
  }
}