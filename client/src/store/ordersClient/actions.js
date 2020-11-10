import {
  ADD_TO_ORDER_FORM
} from "./actionTypes";

export function addToOrderForm(data) {
  return {
    type: ADD_TO_ORDER_FORM,
    data
  }
}