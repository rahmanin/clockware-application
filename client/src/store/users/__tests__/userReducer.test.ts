import usersReducer from "../reducer";
import {
  setPasswordStarted,
  setPasswordSuccess,
  setPasswordFailure,
  checkTokenStarted,
  checkTokenSuccess,
  checkTokenFailure,
  updateUserParams,
  logOut
} from "../actions"

const initialState = {
  loading: false,
  list: []
}

it("should toggle loading on true", () => {
  const action = setPasswordStarted();
  expect(usersReducer(initialState, action))
    .toEqual({ ...initialState, loading: true });
});

it("should toggle loading on false", () => {
  const action = setPasswordSuccess();
  expect(usersReducer(initialState, action))
    .toEqual({ ...initialState, loading: false });
});

it("should toggle loading on false and add error to state", () => {
  const error = {msg: "message"}
  const action = setPasswordFailure(error);
  expect(usersReducer(initialState, action))
    .toEqual({ ...initialState, error: error, loading: false });
});

it("should toggle loading on true", () => {
  const action = checkTokenStarted();
  expect(usersReducer(initialState, action))
    .toEqual({ ...initialState, loading: true });
});

it("should toggle loading on false", () => {
  const action = checkTokenSuccess();
  expect(usersReducer(initialState, action))
    .toEqual({ ...initialState, loading: false });
});

it("should toggle loading on false and add error to state", () => {
  const error = {msg: "message"}
  const action = checkTokenFailure(error);
  expect(usersReducer(initialState, action))
    .toEqual({ ...initialState, error: error, loading: false });
});

it("should add user params to state", () => {
  const user = {
    userId: 1,
    email: "string@mail.com",
    username: "string",
  }
  const action = updateUserParams(user);
  expect(usersReducer(initialState, action))
    .toEqual({ ...initialState, list: [user], loading: false });
});

it("should delete user from state", () => {
  const user = {
    userId: 1,
    email: "string@mail.com",
    username: "string",
  }
  const state = {
    list: [user],
    loading: false
  }
  const action = logOut();
  expect(usersReducer(state, action))
    .toEqual({ ...initialState, loading: false });
});