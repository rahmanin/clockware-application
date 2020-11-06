import { combineReducers } from "redux";
import pricesReducer from "./prices/reducer";
import usersReducer from "./users/reducer";
import citiesReducer from "./cities/reducer";

const rootReducer = combineReducers({
  prices: pricesReducer,
  user: usersReducer,
  cities: citiesReducer
});

export default rootReducer;