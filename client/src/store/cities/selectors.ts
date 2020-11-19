import { createSelector } from "reselect";

export const selectCities = (state: any) => state.cities;

export const citiesList = createSelector(
  selectCities,
  cities => cities.list
)

export const citiesLoading = createSelector(
  selectCities,
  cities => cities.loading
)