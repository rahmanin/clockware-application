import {
  GET_NEWS_STARTED,
  GET_NEWS_SUCCESS,
  GET_NEWS_FAILURE,
  DELETE_NEWS,
} from "./actionTypes";
import {Action, News} from "./actions"

interface NewsState {
  list: News[],
  loading: boolean
}

const initialState: NewsState = {
  list: [],
  loading: false
}

export default function newsReducer(state = initialState, action: Action) {
  const {id, data, error} = action || {}
  const {list} = state;

  switch (action.type) {
    case GET_NEWS_STARTED:
      return {
        ...state,
        loading: true
      }
    case GET_NEWS_SUCCESS:
      return {
        ...state,
        list: data,
        loading: false
      }
    case GET_NEWS_FAILURE:
      return {
        ...state,
        error: error,
        loading: false
      }
    case DELETE_NEWS:
      const array = [...list].filter(el => el.id !== id)
      return {
        ...state,
        list: array
      }
    default:
      return state
  }
}