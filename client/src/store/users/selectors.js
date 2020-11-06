import { createSelector } from "reselect";

export const selectUser = state => state.user;

export const userParams = createSelector(
  selectUser,
  user => user.list[0]
)