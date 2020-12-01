import {
  GET_MASTERS_STARTED,
  GET_MASTERS_SUCCESS,
  GET_MASTERS_FAILURE,
  UPDATE_MASTERS,
  ADD_MASTER,
  DELETE_MASTER,
} from "./actionTypes";
import {fetchPath} from "../../constants/fetchPath";
import { Dispatch } from "redux";

export interface Master {
  id?: number,
  user?: {
    master_name?: string,
    email?: string,
  },
  master_name?: string,
  email?: string,
  city?: string,
  rating?: number,
}

export interface Action {
  type: string,
  data?: Master[],
  error?: any,
  id?: number,
  values?: Master,
  master?: Master
}

export const getMasters = () => {
  return (dispatch: Dispatch) => {
    dispatch(getMastersStarted());

    fetch(`/api/${fetchPath.masters}`)
      .then(response => response.json())
      .then(data => dispatch(getMastersSuccess(data)))
      .catch(error => {
        console.log("Error:", error);
        dispatch(getMastersFailure(error))
      });
  }
}

export const getMastersStarted = (): Action => {
  return {
    type: GET_MASTERS_STARTED,
  }
}

export const getMastersSuccess = (data: Master[]): Action => {
  return {
    type: GET_MASTERS_SUCCESS,
    data
  }
}

export const getMastersFailure = (error: any): Action => {
  return {
    type: GET_MASTERS_FAILURE,
    error
  }
}

export function updateMasters(id: number|undefined, values: Master): Action {
  return {
    type: UPDATE_MASTERS,
    id,
    values
  }
}

export function addMaster(master: Master): Action {
  return {
    type: ADD_MASTER,
    master
  }
}

export function deleteMaster(id: number|undefined): Action {
  return {
    type: DELETE_MASTER,
    id
  }
}