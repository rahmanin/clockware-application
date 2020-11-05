import {UPDATE_PRICES, GET_PRICES} from "./actionTypes";

export function getPrices(data) {
  return {
    type: GET_PRICES,
    data
  }
}

export function updatePrices(id, value) {
  return {
    type: UPDATE_PRICES,
    id,
    value
  }
}