import {
  CHECK_USER_TOKEN_FAILURE, 
  UPDATE_USER_PARAMS,
  LOG_OUT
} from "./actionTypes";

const initialState = {
  list: []
}

export default function usersReducer(state = initialState, action) {
  const {user, error} = action || {}

  switch (action.type) {
    case CHECK_USER_TOKEN_FAILURE:
      return {
        ...state,
        error: error
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