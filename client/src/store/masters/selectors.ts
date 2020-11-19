import { createSelector } from "reselect";

export const selectMasters = (state: any) => state.masters;

export const mastersList = createSelector(
  selectMasters,
  masters => masters.list
)

export const mastersLoading = createSelector(
  selectMasters,
  masters => masters.loading
)