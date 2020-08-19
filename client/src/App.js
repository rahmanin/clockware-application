import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Header from './components/Header';
import Content from "./components/Content";
import Masters from "./admin/Masters";
import Orders from "./admin/Orders";
import Cities from "./admin/Cities";
import Prices from "./admin/Prices";
import { routes } from "./constants/routes";
import MakingOrder from "./routes/OrderRoute";
import LogIn from './routes/LogInRoute';
import ChooseMaster from "./routes/ChooseMasterRoute";
import OrderProvider from "./providers/OrderProvider";
import IsLoggedProvider from "./providers/IsLoggedProvider";
import CitiesProvider from "./providers/CitiesProvider";
import MastersProvider from "./providers/MastersProvider";
import PricesProvider from "./providers/PricesProvider";
import jwtDecode from 'jwt-decode';

import './App.scss';

export default function App() {

  const checkAuth = () => {
    const token = localStorage.token;
    var isLogged = false;

    if (token) {
      const tokenExpiration = jwtDecode(token).exp;
      const dateNow = new Date();
      if (tokenExpiration < dateNow.getTime()/1000) {
        isLogged = false;
      } else {
        isLogged = true;
      }
    } else {
      isLogged = false;
    }
    return isLogged;
  }


  const {order, chooseMaster, login, masters, orders, cities, prices} =  routes;
  
  return (
    <IsLoggedProvider>
      <OrderProvider>
        <CitiesProvider>
          <MastersProvider>
            <PricesProvider>
              <Router>
                <Header />
                <Content>
                  <Switch>
                    <Redirect exact from="/" to={checkAuth() ? orders : order} />
                    <Route path={order} exact component={MakingOrder}/>
                    <Route path={chooseMaster} exact component={ChooseMaster}/>
                    <Route path={login} exact component={LogIn}/>
                    <Route path={masters} render={() => checkAuth() && JSON.parse(localStorage.is_admin) ? (<Masters />) : (<Redirect to={login}/>)}/>
                    <Route path={orders} render={() => checkAuth() ? (<Orders />) : (<Redirect to={login}/>)}/>
                    <Route path={cities} render={() => checkAuth() && JSON.parse(localStorage.is_admin) ? (<Cities />) : (<Redirect to={login}/>)}/>
                    <Route path={prices} render={() => checkAuth() && JSON.parse(localStorage.is_admin) ? (<Prices />) : (<Redirect to={login}/>)}/>
                  </Switch>
                </Content>
              </Router>
            </PricesProvider>
          </MastersProvider>
        </CitiesProvider>
      </OrderProvider>
    </IsLoggedProvider>
);
}