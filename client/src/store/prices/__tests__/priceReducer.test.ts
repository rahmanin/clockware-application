import pricesReducer from "../reducer";
import {
  getPricesStarted, 
  getPricesSuccess, 
  getPricesFailure,
  updatePrices,
  PriceAndSize
} from "../actions"

const initialState = {
  loading: false,
  list: []
}

it("should toggle loading on true", () => {
  const action = getPricesStarted();
  expect(pricesReducer(initialState, action))
    .toEqual({ ...initialState, loading: true });
});

it("should toggle loading on false and add data to state", () => {
  const data: PriceAndSize[] = [{}]
  const action = getPricesSuccess(data);
  expect(pricesReducer(initialState, action))
    .toEqual({ ...initialState, list: data, loading: false });
});

it("should toggle loading on false and add error to state", () => {
  const error = {msg: "message"}
  const action = getPricesFailure(error);
  expect(pricesReducer(initialState, action))
    .toEqual({ ...initialState, error: error, loading: false });
});

it("should update price by id", () => {
  const list: PriceAndSize[] = [
    {id: 1, price: 100, size: "string"}, 
  ]
  const state = {...initialState, list: list, loading: false}
  const action = updatePrices(1, 666);
  expect(pricesReducer(state, action))
    .toEqual(state);
});