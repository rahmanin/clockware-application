import {
  CHECK_USER_TOKEN_STARTED,
  CHECK_USER_TOKEN_FAILURE, 
  CHECK_USER_TOKEN_SUCCESS,
  UPDATE_USER_PARAMS,
  LOG_OUT,
  SET_PASSWORD_STARTED,
  SET_PASSWORD_SUCCESS,
  SET_PASSWORD_FAILURE
} from "./actionTypes";
import {UserData, Action} from "./actions"

interface UserState {
  list: UserData[],
  loading: boolean
}

const initialState: UserState = {
  list: [],
  loading: false
}

export default function usersReducer(state = initialState, action: Action) {
  const {user, error} = action || {}

  switch (action.type) {
    case SET_PASSWORD_STARTED:
      return {
        ...state,
        loading: true
      }
    case SET_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false
      }
    case SET_PASSWORD_FAILURE:
      return {
        ...state,
        error: error,
        loading: false
      }
    case CHECK_USER_TOKEN_STARTED:
      return {
        ...state,
        loading: true
      }
    case CHECK_USER_TOKEN_SUCCESS:
      return {
        ...state,
        loading: false
      }
    case CHECK_USER_TOKEN_FAILURE:
      return {
        ...state,
        error: error,
        loading: false
      }
    case UPDATE_USER_PARAMS:
      const updatedUserParams = [user]
      return {
        ...state,
        list: updatedUserParams
      }
    case LOG_OUT:
      localStorage.clear()
      return {
        ...state,
        list: []
      }
    default:
      return state
  }
}