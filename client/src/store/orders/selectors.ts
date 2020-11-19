import { createSelector } from "reselect";

export const selectOrders = (state: any) => state.orders;

export const ordersList = createSelector(
  selectOrders,
  order => order.list
)

export const ordersLoading = createSelector(
  selectOrders,
  order => order.loading
)