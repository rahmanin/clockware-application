import citiesReduser from "../reducer";
import {
  getCitiesStarted,
  getCitiesSuccess,
  getCitiesFailure,
  updateCities,
  addCity,
  deleteCity,
} from "../actions"

const initialState = {
  list: [],
  loading: false
}

it("should toggle loading on true", () => {
  const action = getCitiesStarted();
  expect(citiesReduser(initialState, action))
    .toEqual({ ...initialState, loading: true });
});

it("should toggle loading on false and add data to state", () => {
  const data = [{id: 1}]
  const action = getCitiesSuccess(data);
  expect(citiesReduser(initialState, action))
    .toEqual({ ...initialState, list: data});
});

it("should toggle loading on false and add error to state", () => {
  const error = {msg: "message"}
  const action = getCitiesFailure(error);
  expect(citiesReduser(initialState, action))
    .toEqual({ ...initialState, error: error, loading: false });
});

it("should update master by id", () => {
  const editedMaster = {
    id: 1,
    city: "string"
  }
  const list = [editedMaster]
  const newValues = "new string"
  const state = {...initialState, list: list}
  const action = updateCities(1, newValues);
  expect(citiesReduser(state, action))
    .toEqual(state);
});

it("should delete master by id", () => {
  const editedMaster = {
    id: 1,
    value: "string"
  }
  const list = [editedMaster]
  const state = {...initialState, list: list}
  const action = deleteCity(1);
  expect(citiesReduser(state, action))
    .toEqual(initialState);
});

it("should add data to state", () => {
  const data = {id: 1}
  const action = addCity(data);
  expect(citiesReduser(initialState, action))
    .toEqual({ ...initialState, list: [data]});
});