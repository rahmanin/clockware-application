import { createSelector } from "reselect";

export const selectOrderClient = state => state.ordersClient;

export const orderForm = createSelector(
  selectOrderClient,
  ordersClient => ordersClient.list
)