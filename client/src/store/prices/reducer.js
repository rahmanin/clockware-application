import {UPDATE_PRICES, GET_PRICES_SUCCESS, GET_PRICES_FAILURE} from "./actionTypes";

const initialState = {
  list: []
}

export default function pricesReducer(state = initialState, action) {
  const {id, value, data, error} = action || {}
  const {list} = state;

  switch (action.type) {
    case GET_PRICES_SUCCESS:
      return {
        ...state,
        list: data
      }
    case GET_PRICES_FAILURE:
      return {
        ...state,
        error: error
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