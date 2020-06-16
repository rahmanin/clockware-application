import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Header from './components/Header';
import Content from "./components/Content";
import { routes } from "./constants/routes";
import MakingOrder from "./routes/OrderRoute";
import ChooseMaster from "./routes/ChooseMasterRoute";
import OrderProvider from "./providers/OrderProvider";

import './App.scss';

export default function App() {
  const {order, chooseMaster} =  routes;
  return (
    <OrderProvider>
      <Router>
        <Header />
        <Content>
          <Switch>
            <Redirect exact from="/" to={order} />
            <Route path={order} exact component={MakingOrder}/>
            <Route path={chooseMaster} exact component={ChooseMaster}/>          
          </Switch>
        </Content>
      </Router>
    </OrderProvider>
);
}
