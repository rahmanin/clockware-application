import {UPDATE_PRICES, GET_PRICES_STARTED, GET_PRICES_SUCCESS, GET_PRICES_FAILURE} from "./actionTypes";
import {fetchPath} from "../../constants/fetchPath";

export const getPrices = () => {
  return dispatch => {
    dispatch(getPricesStarted());

    fetch(`/api/${fetchPath.prices}`)
      .then(response => response.json())
      .then(data => dispatch(getPricesSuccess(data)))
      .catch(error => {
        console.log("Error:", error);
        dispatch(getPricesFailure(error))
      });
  }
}

const getPricesStarted = () => {
  return {
    type: GET_PRICES_STARTED,
  }
}

const getPricesSuccess = data => {
  return {
    type: GET_PRICES_SUCCESS,
    data
  }
}

const getPricesFailure = error => {
  return {
    type: GET_PRICES_FAILURE,
    error
  }
}

export function updatePrices(id, value) {
  return {
    type: UPDATE_PRICES,
    id,
    value
  }
}