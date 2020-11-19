import { createSelector } from "reselect";

export const selectPrices = (state: any) => state.prices;

export const pricesList = createSelector(
  selectPrices,
  prices => prices.list
)

export const pricesLoading = createSelector(
  selectPrices,
  prices => prices.loading
)