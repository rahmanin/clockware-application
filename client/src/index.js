import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'antd/dist/antd.css';
import './index.scss';
import OrderProvider from "./providers/OrderProvider";
import MastersProvider from "./providers/MastersProvider";
import FinishedOrdersProvider from "./providers/FinishedOrdersProvider";
import { createStore, applyMiddleware } from "redux";
import {Provider} from "react-redux";
import rootReducer from "./store/reducer"
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension'

const composedEnhancer = composeWithDevTools(
  applyMiddleware(thunk)
)

let store = createStore(
  rootReducer,
  composedEnhancer
);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
        <OrderProvider>
            <MastersProvider>
                <FinishedOrdersProvider>
                    <App />
                </FinishedOrdersProvider>
            </MastersProvider>
        </OrderProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
