import {
  GET_CITIES_STARTED,
  GET_CITIES_SUCCESS,
  GET_CITIES_FAILURE,
  UPDATE_CITIES,
  ADD_CITY,
  DELETE_CITY,
} from "./actionTypes";
import {fetchPath} from "../../constants/fetchPath";
import { Dispatch } from "redux";

export interface City {
  id?: number,
  city?: string,
  delivery_area?: string
}

export interface Action {
  type: string,
  data?: City[],
  error?: any,
  id?: number,
  value?: string,
  city?: City
}

export const getCities = () => {
  return (dispatch: Dispatch) => {
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

export const getCitiesStarted = (): Action => {
  return {
    type: GET_CITIES_STARTED,
  }
}

export const getCitiesSuccess = (data: City[]): Action => {
  return {
    type: GET_CITIES_SUCCESS,
    data
  }
}

export const getCitiesFailure = (error: any): Action => {
  return {
    type: GET_CITIES_FAILURE,
    error
  }
}

export function updateCities(id: number|undefined, value: string|undefined): Action {
  return {
    type: UPDATE_CITIES,
    id,
    value
  }
}

export function addCity(city: City): Action {
  return {
    type: ADD_CITY,
    city
  }
}

export function deleteCity(id: number|undefined) {
  return {
    type: DELETE_CITY,
    id
  }
}