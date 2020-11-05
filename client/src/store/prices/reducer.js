import {UPDATE_PRICES, GET_PRICES} from "./actionTypes";

const initialState = {
  list: []
}

export default function pricesReducer(state = initialState, action) {
  const {id, value, data} = action || {}
  const {list} = state;

  switch (action.type) {
    case GET_PRICES:
      return {
        list: data
      }
    case UPDATE_PRICES:
      const updatedPrices = [...list]
      updatedPrices.find(el => el.id === id).price = value
      return {
        list: updatedPrices
      }
    default:
      return state
  }
}