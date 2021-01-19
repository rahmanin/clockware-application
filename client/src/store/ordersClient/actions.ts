import {
  ADD_TO_ORDER_FORM
} from "./actionTypes";

export interface ClientOrderForm {
  sizePrice: string,
  size?: string,
  city?: string,
  order_date: string,
  order_price?: string,
  order_time_start?: string,
  order_time_end?: string,
  client_id?: number,
  image: string|null,
  email: string,
  username: string,
  id?: number|null,
  address?: string
}

export interface Action {
  type: string,
  data: ClientOrderForm|{}
}

export function addToOrderForm(data: ClientOrderForm|{}) {
  return {
    type: ADD_TO_ORDER_FORM,
    data
  }
}