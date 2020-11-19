import {
  UPDATE_PRICES, 
  GET_PRICES_STARTED, 
  GET_PRICES_SUCCESS, 
  GET_PRICES_FAILURE
} from "./actionTypes";
import {fetchPath} from "../../constants/fetchPath";
import { Dispatch } from "redux";

export interface PriceAndSize {
  id?: number,
  price?: number,
  size?: string
}

export interface Action {
  type: string,
  error?: any,
  data?: PriceAndSize[],
  id?: number,
  value?: number
}

export const getPrices = () => {
  return (dispatch: Dispatch) => {
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

const getPricesStarted = (): Action => {
  return {
    type: GET_PRICES_STARTED,
  }
}

const getPricesSuccess = (data: PriceAndSize[]): Action => {
  return {
    type: GET_PRICES_SUCCESS,
    data
  }
}

const getPricesFailure = (error: any): Action => {
  return {
    type: GET_PRICES_FAILURE,
    error
  }
}

export function updatePrices(id: number|undefined, value: number|undefined): Action {
  return {
    type: UPDATE_PRICES,
    id,
    value
  }
}