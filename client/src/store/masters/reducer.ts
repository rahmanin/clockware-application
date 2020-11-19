import {
  GET_MASTERS_STARTED,
  GET_MASTERS_SUCCESS,
  GET_MASTERS_FAILURE,
  UPDATE_MASTERS,
  ADD_MASTER,
  DELETE_MASTER,
} from "./actionTypes";
import {Action, Master} from "./actions"

interface MastersState {
  list: Master[],
  loading: boolean
}

const initialState: MastersState = {
  list: [],
  loading: false
}

export default function mastersReducer(state = initialState, action: Action) {
  const {id, values, data, error, master} = action || {}
  const {list} = state;

  switch (action.type) {
    case GET_MASTERS_STARTED:
      return {
        ...state,
        loading: true
      }
    case GET_MASTERS_SUCCESS:
      data?.map(el => {
        el.master_name = el.user?.master_name
        el.email = el.user?.email
        delete el.user
        return {...el}
      })
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
      const editableItem = updatedMasters.find(el => el.id === id)
      if (editableItem) {
        editableItem.city = values?.city
        editableItem.master_name = values?.master_name
        editableItem.email = values?.email
    }
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