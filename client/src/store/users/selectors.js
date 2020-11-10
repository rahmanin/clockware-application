import { createSelector } from "reselect";

export const selectUser = state => state.user;

export const userParams = createSelector(
  selectUser,
  user => user.list[0]
)

export const userLoading = createSelector(
  selectUser,
  user => user.loading
)