import {
  SWITCH_LANGUAGE, 
} from "./actionTypes";
import {Action} from "./actions"

interface LanguageState {
  language: string,
}

const initialState: LanguageState = {
  language: "en",
}

export default function languageReducer(state = initialState, action: Action) {
  const {value} = action

  switch (action.type) {
    case SWITCH_LANGUAGE:
      return {
        ...state,
        language: value
      }
    default:
      return state
  }
}