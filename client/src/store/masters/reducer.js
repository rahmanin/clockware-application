import {
  GET_MASTERS_STARTED,
  GET_MASTERS_SUCCESS,
  GET_MASTERS_FAILURE,
  UPDATE_MASTERS,
  ADD_MASTER,
  DELETE_MASTER,
} from "./actionTypes";

const initialState = {
  list: [],
  loading: false
}

export default function mastersReducer(state = initialState, action) {
  const {id, values, data, error, master} = action || {}
  const {list} = state;

  switch (action.type) {
    case GET_MASTERS_STARTED:
      return {
        ...state,
        loading: true
      }
    case GET_MASTERS_SUCCESS:
      return {
        ...state,
        list: data,
        loading: false
      }
    case GET_MASTERS_FAILURE:
      return {
        ...state,
        error: error,
        loading: false
      }
    case UPDATE_MASTERS:
      const updatedMasters = [...list]
      updatedMasters.find(el => el.id === id).city = values.city
      updatedMasters.find(el => el.id === id).master_name = values.master_name
      return {
        ...state,
        list: updatedMasters
      }
    case ADD_MASTER:
      const array1 = [...list, master]
      return {
        ...state,
        list: array1
      }
    case DELETE_MASTER:
      const array2 = [...list].filter(el => el.id !== id)
      return {
        ...state,
        list: array2
      }
    default:
      return state
  }
}