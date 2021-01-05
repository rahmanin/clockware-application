import {
  SWITCH_LANGUAGE, 
} from "./actionTypes";

export interface Action {
  type: string,
  value: string
}

export function switchLanguage(value: string): Action {
  return {
    type: SWITCH_LANGUAGE,
    value
  }
}