import ordersClientReducer, { ClientOrderState } from "../reducer"
import {addToOrderForm, ClientOrderForm} from "../actions"

const initialState: ClientOrderState = {
  list: {} as ClientOrderForm
}

it("should add order props as object to state", () => {
  const data = {
    sizePrice: "string",
    size: "string",
    city: "string",
    order_date: "string",
    order_price: "string",
    order_time_start: "string",
    order_time_end: "string",
    client_id: 1,
    image: null,
    email: "string",
    username: "string"
  }
  
  const action = addToOrderForm(data);
  expect(ordersClientReducer(initialState, action))
    .toEqual({ ...initialState, list: data});
});