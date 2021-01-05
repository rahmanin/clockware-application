import { createSelector } from "reselect";

export const selectLanguage = (state: any) => state.language;

export const currentLanguage = createSelector(
  selectLanguage,
  language => language.language
)