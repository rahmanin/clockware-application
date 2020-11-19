import { combineReducers } from "redux";
import pricesReducer from "./prices/reducer";
import usersReducer from "./users/reducer";
import citiesReducer from "./cities/reducer";
import mastersReducer from "./masters/reducer";
import ordersReducer from "./orders/reducer";
import ordersClientReducer from "./ordersClient/reducer";

const rootReducer = combineReducers({
  prices: pricesReducer,
  user: usersReducer,
  cities: citiesReducer,
  masters: mastersReducer,
  orders: ordersReducer,
  ordersClient: ordersClientReducer
});

export default rootReducer;