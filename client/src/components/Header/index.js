import React from "react";
import {Link} from 'react-router-dom';
import { routes } from "../../constants/routes";
import { useHistory } from "react-router-dom";

import './index.scss';

export default function Header() {

  const history = useHistory();
  const logInOut = () => {
    localStorage.token ? (history.push(routes.order) || localStorage.clear()) : history.push(routes.login);
  }
 
  return <div className="header">
    <Link to={routes.order}>
      <div className="logo">CLOCKWARE</div>
    </Link>
    <div onClick={()=>logInOut()} className="login">{localStorage.token ? "Log out" : "Log in"}</div>
  </div>
}