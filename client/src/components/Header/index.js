import React, { useContext } from "react";
import {Link} from 'react-router-dom';
import { routes } from "../../constants/routes";
import { useHistory } from "react-router-dom";
import {IsLoggedContext} from "../../providers/IsLoggedProvider";


import './index.scss';

export default function Header() {
  const { logInOut } = useContext(IsLoggedContext);
  const { isLogged } = useContext(IsLoggedContext);
  const history = useHistory();
  
  const log = () => {
    isLogged ? (history.push(routes.order) || localStorage.clear()) : history.push(routes.login);
    logInOut()
  }

  return <div className="header">
    <Link to={routes.order}>
      <div className="logo">CLOCKWARE</div>
    </Link>
    <div onClick={()=>log()} className="login">{isLogged ? "Log out" : "Log in"}</div>
  </div>
}