import {
  GET_MASTERS_STARTED,
  GET_MASTERS_SUCCESS,
  GET_MASTERS_FAILURE,
  UPDATE_MASTERS,
  ADD_MASTER,
  DELETE_MASTER,
} from "./actionTypes";
import {fetchPath} from "../../constants/fetchPath";

export const getMasters = () => {
  return dispatch => {
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

const getMastersStarted = () => {
  return {
    type: GET_MASTERS_STARTED,
  }
}

const getMastersSuccess = data => {
  return {
    type: GET_MASTERS_SUCCESS,
    data
  }
}

const getMastersFailure = error => {
  return {
    type: GET_MASTERS_FAILURE,
    error
  }
}

export function updateMasters(id, values) {
  return {
    type: UPDATE_MASTERS,
    id,
    values
  }
}

export function addMaster(master) {
  return {
    type: ADD_MASTER,
    master
  }
}

export function deleteMaster(id) {
  return {
    type: DELETE_MASTER,
    id
  }
}