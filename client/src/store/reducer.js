import { combineReducers } from "redux";
import pricesReducer from "./prices/reducer";

const rootReducer = combineReducers({
  prices: pricesReducer,
});

export default rootReducer;