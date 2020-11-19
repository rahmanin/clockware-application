import { createSelector } from "reselect";

export const selectOrderClient = (state: any) => state.ordersClient;

export const orderForm = createSelector(
  selectOrderClient,
  ordersClient => ordersClient.list
)