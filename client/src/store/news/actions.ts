import {
  GET_NEWS_STARTED,
  GET_NEWS_SUCCESS,
  GET_NEWS_FAILURE,
  DELETE_NEWS,
} from "./actionTypes";
import {fetchPath} from "../../constants/fetchPath";
import { Dispatch } from "redux";

export interface News {
  id?: number,
  title: string,
  content?: string,
  createdAt?: Date
}

export interface Action {
  type: string,
  error?: any,
  id?: number,
  data?: News[]
}

export const getNews = () => {
  return (dispatch: Dispatch) => {
    dispatch(getNewsStarted());

    fetch(`/api/${fetchPath.newsList}`)
      .then(response => response.json())
      .then(data => dispatch(getNewsSuccess(data)))
      .catch(error => {
        console.log("Error:", error);
        dispatch(getNewsFailure(error))
      });
  }
}

export const getNewsStarted = (): Action => {
  return {
    type: GET_NEWS_STARTED,
  }
}

export const getNewsSuccess = (data: News[]): Action => {
  return {
    type: GET_NEWS_SUCCESS,
    data
  }
}

export const getNewsFailure = (error: any): Action => {
  return {
    type: GET_NEWS_FAILURE,
    error
  }
}

export function deleteNews(id: number|undefined) {
  return {
    type: DELETE_NEWS,
    id
  }
}