import newsReduser from "../reducer";
import {
  getNewsStarted,
  getNewsSuccess,
  getNewsFailure,
  deleteNews,
} from "../actions"

const initialState = {
  list: [],
  loading: false
}

it("should toggle loading on true", () => {
  const action = getNewsStarted();
  expect(newsReduser(initialState, action))
    .toEqual({ ...initialState, loading: true });
});

it("should toggle loading on false and add data to state", () => {
  const data = [{title: "aaaaa"}]
  const action = getNewsSuccess(data);
  expect(newsReduser(initialState, action))
    .toEqual({ ...initialState, list: data});
});

it("should toggle loading on false and add error to state", () => {
  const error = {msg: "message"}
  const action = getNewsFailure(error);
  expect(newsReduser(initialState, action))
    .toEqual({ ...initialState, error: error, loading: false });
});

it("should delete news by id", () => {
  const editedMaster = {
    id: 1,
    title: "string"
  }
  const list = [editedMaster]
  const state = {...initialState, list: list}
  const action = deleteNews(1);
  expect(newsReduser(state, action))
    .toEqual(initialState);
});
