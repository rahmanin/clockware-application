import {
  GET_CITIES_STARTED,
  GET_CITIES_SUCCESS,
  GET_CITIES_FAILURE,
  UPDATE_CITIES,
  ADD_CITY,
  DELETE_CITY,
} from "./actionTypes";

const initialState = {
  list: [],
  loading: false
}

export default function citiesReducer(state = initialState, action) {
  const {id, value, data, error, city} = action || {}
  const {list} = state;

  switch (action.type) {
    case GET_CITIES_STARTED:
      return {
        ...state,
        loading: true
      }
    case GET_CITIES_SUCCESS:
      return {
        ...state,
        list: data,
        loading: false
      }
    case GET_CITIES_FAILURE:
      return {
        ...state,
        error: error,
        loading: false
      }
    case UPDATE_CITIES:
      const updatedCities = [...list]
      updatedCities.find(el => el.id === id).city = value
      return {
        ...state,
        list: updatedCities
      }
    case ADD_CITY:
      const array1 = [...list, city]
      return {
        ...state,
        list: array1
      }
    case DELETE_CITY:
      const array2 = [...list].filter(el => el.id !== id)
      return {
        ...state,
        list: array2
      }
    default:
      return state
  }
}