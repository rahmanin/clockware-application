import ordersReducer, { OrdersState } from "../reducer";
import {
  getOrdersStarted,
  getOrdersSuccess,
  getOrdersFailure,
  updateOrder,
  deleteOrders,
  OrdersPagination,
} from "../actions"

const initialState: OrdersState = {
  list: {} as OrdersPagination,
  loading: false
}

it("should toggle loading on true", () => {
  const action = getOrdersStarted();
  expect(ordersReducer(initialState, action))
    .toEqual({ ...initialState, loading: true });
});

it("should toggle loading on false and add data to state", () => {
  const data: OrdersPagination = {
    totalOrders: 0,
    orders: [],
    totalPages: 0, 
    currentPage: 0,
  }
  const action = getOrdersSuccess(data);
  expect(ordersReducer(initialState, action))
    .toEqual({ ...initialState, list: data, loading: false });
});

it("should toggle loading on false and add error to state", () => {
  const error = {msg: "message"}
  const action = getOrdersFailure(error);
  expect(ordersReducer(initialState, action))
    .toEqual({ ...initialState, error: error, loading: false });
});

it("should update order by id", () => {
  const editedOrder = {
    order_id: 1,
    size: "string",
    city: "string",
    order_date: "string",
    order_master: "string",
    feedback_master: "string",
    order_price: 100,
    additional_price: 100,
    is_done: false,
    master_id: "string",
    order_time_start: "string",
    order_time_end: "string",
    client_id: 1,
    image: "string",
    user: {
      username: "string",
      email: "string"
    }
  }

  const list = {
    totalOrders: 0,
    orders: [editedOrder],
    totalPages: 0, 
    currentPage: 0,
  }

  const newValues = {
    order_id: 1,
    order_date: "9999",
    size: "9999",
    city: "9999",
    order_price: 9999,
    order_time_start: "9999",
    new_master: "9999",
    order_time_end: "9999",
    master_id: "9999",
    order_master: "9999",
  }
  const state = {...initialState, list: list}
  const action = updateOrder(1, newValues);
  expect(ordersReducer(state, action))
    .toEqual(state);
});

it("should delete order by id", () => {
  const editedOrder = {
    order_id: 1,
    size: "string",
    city: "string",
    order_date: "string",
    order_master: "string",
    feedback_master: "string",
    order_price: 100,
    additional_price: 100,
    is_done: false,
    master_id: "string",
    order_time_start: "string",
    order_time_end: "string",
    client_id: 1,
    image: "string",
    user: {
      username: "string",
      email: "string"
    }
  }

  const list = {
    totalOrders: 0,
    orders: [editedOrder],
    totalPages: 0, 
    currentPage: 0,
  }

  const state = {...initialState, list: list}
  const action = deleteOrders(1);
  expect(ordersReducer(state, action))
    .toEqual({
      list: {
        totalOrders: 0,
        orders: [],
        totalPages: 0, 
        currentPage: 0,
      },
      loading: false
    });
});