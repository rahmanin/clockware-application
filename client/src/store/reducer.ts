import { combineReducers } from "redux";
import pricesReducer from "./prices/reducer";
import usersReducer from "./users/reducer";
import citiesReducer from "./cities/reducer";
import mastersReducer from "./masters/reducer";
import ordersReducer from "./orders/reducer";
import ordersClientReducer from "./ordersClient/reducer";
import { createStore, applyMiddleware } from "redux";
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension'
import newsReducer from "./news/reducer";

const rootReducer = combineReducers({
  prices: pricesReducer,
  user: usersReducer,
  cities: citiesReducer,
  masters: mastersReducer,
  orders: ordersReducer,
  ordersClient: ordersClientReducer,
  news: newsReducer
});

const composedEnhancer = composeWithDevTools(
  applyMiddleware(thunk)
)

const store = createStore(
  rootReducer,
  composedEnhancer
);

export default store
