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
import IsLoggedProvider from "./providers/IsLoggedProvider";
import CitiesProvider from "./providers/CitiesProvider";
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


  const {order, chooseMaster, login, admin, masters, orders, cities} =  routes;
  
  return (
    <IsLoggedProvider>
      <OrderProvider>
        <CitiesProvider>
          <Router>
            <Header />
            <Content>
              <Switch>
                <Redirect exact from="/" to={order} />
                <Route path={order} exact component={MakingOrder}/>
                <Route path={chooseMaster} exact component={ChooseMaster}/>
                <Route path={login} exact component={LogIn}/>
                <Route path={admin} render={({ match: { url } }) => (
                    <AdminWrapper>
                      <Route path={`${url}/${masters}`} render={() => checkAuth() ? (<Masters />) : (<Redirect to={login}/>)}/>
                      <Route path={`${url}/${orders}`} render={() => checkAuth() ? (<Orders />) : (<Redirect to={login}/>)}/>
                      <Route path={`${url}/${cities}`} render={() => checkAuth() ? (<Cities />) : (<Redirect to={login}/>)}/>
                    </AdminWrapper>
                  )}
                />          
              </Switch>
            </Content>
          </Router>
        </CitiesProvider>
      </OrderProvider>
    </IsLoggedProvider>
);
}