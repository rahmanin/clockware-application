import {
  GET_CITIES_STARTED,
  GET_CITIES_SUCCESS,
  GET_CITIES_FAILURE,
  UPDATE_CITIES,
  ADD_CITY,
  DELETE_CITY,
} from "./actionTypes";
import {fetchPath} from "../../constants/fetchPath";

export const getCities = () => {
  return dispatch => {
    dispatch(getCitiesStarted());

    fetch(`/api/${fetchPath.cities}`)
      .then(response => response.json())
      .then(data => dispatch(getCitiesSuccess(data)))
      .catch(error => {
        console.log("Error:", error);
        dispatch(getCitiesFailure(error))
      });
  }
}

const getCitiesStarted = () => {
  return {
    type: GET_CITIES_STARTED,
  }
}

const getCitiesSuccess = data => {
  return {
    type: GET_CITIES_SUCCESS,
    data
  }
}

const getCitiesFailure = error => {
  return {
    type: GET_CITIES_FAILURE,
    error
  }
}

export function updateCities(id, value) {
  return {
    type: UPDATE_CITIES,
    id,
    value
  }
}

export function addCity(city) {
  return {
    type: ADD_CITY,
    city
  }
}

export function deleteCity(id) {
  return {
    type: DELETE_CITY,
    id
  }
}