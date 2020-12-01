import mastersReduser from "../reducer";
import {
  getMastersStarted,
  getMastersSuccess,
  getMastersFailure,
  updateMasters,
  addMaster,
  deleteMaster,
} from "../actions"

const initialState = {
  list: [],
  loading: false
}

it("should toggle loading on true", () => {
  const action = getMastersStarted();
  expect(mastersReduser(initialState, action))
    .toEqual({ ...initialState, loading: true });
});

it("should toggle loading on false and add data to state", () => {
  const data = [{id: 1}]
  const action = getMastersSuccess(data);
  expect(mastersReduser(initialState, action))
    .toEqual({ ...initialState, list: data});
});

it("should toggle loading on false and add error to state", () => {
  const error = {msg: "message"}
  const action = getMastersFailure(error);
  expect(mastersReduser(initialState, action))
    .toEqual({ ...initialState, error: error, loading: false });
});

it("should update master by id", () => {
  const editedMaster = {
    id: 1,
    value: "string"
  }
  const list = [editedMaster]
  const newValues = {
    id: 1,
    value: "new string"
  }
  const state = {...initialState, list: list}
  const action = updateMasters(1, newValues);
  expect(mastersReduser(state, action))
    .toEqual(state);
});

it("should delete master by id", () => {
  const editedMaster = {
    id: 1,
    value: "string"
  }
  const list = [editedMaster]
  const state = {...initialState, list: list}
  const action = deleteMaster(1);
  expect(mastersReduser(state, action))
    .toEqual(initialState);
});

it("should add data to state", () => {
  const data = {id: 1}
  const action = addMaster(data);
  expect(mastersReduser(initialState, action))
    .toEqual({ ...initialState, list: [data]});
});