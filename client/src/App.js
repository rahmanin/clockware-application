import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Header from './components/Header';
import Content from "./components/Content";
import AdminWrapper from './admin/Wrapper';
import Masters from "./admin/Masters";
import Orders from "./admin/Orders";
import Cities from "./admin/Cities";
import { routes } from "./constants/routes";
import MakingOrder from "./routes/OrderRoute";
import LogIn from './routes/LogInRoute';
import ChooseMaster from "./routes/ChooseMasterRoute";
import OrderProvider from "./providers/OrderProvider";

import './App.scss';

export default function App() {
  const {order, chooseMaster, login, main, masters, orders, cities} =  routes;
  return (
    <OrderProvider>
      <Router>
        <Header />
        <Content>
          <Switch>
            <Redirect exact from="/" to={order} />
            <Route path={order} exact component={MakingOrder}/>
            <Route path={chooseMaster} exact component={ChooseMaster}/>
            <Route path={login} exact component={LogIn}/>
            <Route path={main} render={({ match: { url } }) => (
                <AdminWrapper>
                  <Route path={`${url}/${masters}`} exact component={Masters}/>
                  <Route path={`${url}/${orders}`} exact component={Orders}/>
                  <Route path={`${url}/${cities}`} exact component={Cities}/>
                </AdminWrapper>
              )}
            />          
          </Switch>
        </Content>
      </Router>
    </OrderProvider>
);
}
