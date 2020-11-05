import { createSelector } from "reselect";

export const selectPrices = state => state.prices;

export const pricesList = createSelector(
  selectPrices,
  prices => prices.list
)