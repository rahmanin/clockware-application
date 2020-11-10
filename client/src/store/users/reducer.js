import {
  CHECK_USER_TOKEN_STARTED,
  CHECK_USER_TOKEN_FAILURE, 
  CHECK_USER_TOKEN_SUCCESS,
  UPDATE_USER_PARAMS,
  LOG_OUT
} from "./actionTypes";

const initialState = {
  list: [],
  loading: false
}

export default function usersReducer(state = initialState, action) {
  const {user, error} = action || {}

  switch (action.type) {
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
      return {
        ...state,
        list: []
      }
    default:
      return state
  }
}