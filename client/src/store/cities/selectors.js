import { createSelector } from "reselect";

export const selectCities = state => state.cities;

export const citiesList = createSelector(
  selectCities,
  cities => cities.list
)