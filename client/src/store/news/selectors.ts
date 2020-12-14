import { createSelector } from "reselect";

export const selectNews = (state: any) => state.news;

export const newsList = createSelector(
  selectNews,
  news => news.list
)

export const newsLoading = createSelector(
  selectNews,
  news => news.loading
)