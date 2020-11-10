import React, {useEffect} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Loader from "./components/Loader";
import Header from './components/Header';
import Content from "./components/Content";
import Masters from "./admin/Masters";
import Orders from "./admin/Orders";
import Cities from "./admin/Cities";
import Prices from "./admin/Prices";
import Diagrams from "./admin/Diagrams";
import { routes } from "./constants/routes";
import MakingOrder from "./routes/OrderRoute";
import LogIn from './routes/LogInRoute';
import Feedback from './routes/FeedbackRoute';
import ChooseMaster from "./routes/ChooseMasterRoute";
import jwtDecode from 'jwt-decode';
import {useDispatch} from "react-redux";
import { useSelector } from "react-redux";
import {checkToken} from "./store/users/actions";
import {userParams, userLoading} from "./store/users/selectors";

import './App.scss';

export default function App() {
  const dispatch = useDispatch();
  const userData = useSelector(userParams)
  const userIsLoading = useSelector(userLoading)

  useEffect(() => {
    localStorage.token && dispatch(checkToken())
  }, []);
  
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

  const {
    order, 
    chooseMaster, 
    login, 
    masters, 
    orders, 
    cities, 
    prices, 
    feedback, 
    diagrams
  } =  routes;
  
  if (userIsLoading) return <Loader />

  return (
    <Router>
      <Header />
      <Content>
        <Switch>
          <Redirect exact from="/" to={checkAuth() ? orders : order} />
          <Route path={order} exact component={MakingOrder}/>
          <Route path={chooseMaster} exact component={ChooseMaster}/>
          <Route path={feedback} exact component={Feedback}/>
          <Route path={login} exact component={LogIn}/>
          <Route path={masters} render={() => checkAuth() && userData && userData.is_admin ? (<Masters />) : (<Redirect to={orders}/>)}/>
          <Route path={orders} render={() => checkAuth() ? (<Orders />) : (<Redirect to={login}/>)}/>
          <Route path={cities} render={() => checkAuth() && userData && userData.is_admin ? (<Cities />) : (<Redirect to={orders}/>)}/>
          <Route path={diagrams} render={() => checkAuth() && userData && userData.is_admin ? (<Diagrams />) : (<Redirect to={orders}/>)}/>
          <Route path={prices} render={() => checkAuth() && userData && userData.is_admin ? (<Prices />) : (<Redirect to={orders}/>)}/>
        </Switch>
      </Content>
    </Router>
);
}