import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'antd/dist/antd.css';
import './index.scss';
import UsersProvider from "./providers/UsersProvider";
import OrderProvider from "./providers/OrderProvider";
import IsLoggedProvider from "./providers/IsLoggedProvider";
import CitiesProvider from "./providers/CitiesProvider";
import MastersProvider from "./providers/MastersProvider";
import FinishedOrdersProvider from "./providers/FinishedOrdersProvider";


import { createStore } from "redux";
import {Provider} from "react-redux";
import rootReducer from "./store/reducer"

let store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <IsLoggedProvider>
        <OrderProvider>
          <CitiesProvider>
            <MastersProvider>
                <FinishedOrdersProvider>
                  <UsersProvider>
                    <App />
                  </UsersProvider>
                </FinishedOrdersProvider>
            </MastersProvider>
          </CitiesProvider>
        </OrderProvider>
      </IsLoggedProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
