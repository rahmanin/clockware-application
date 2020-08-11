import React, { useContext } from "react";
import {Link} from 'react-router-dom';
import { routes } from "../../constants/routes";
import { useHistory } from "react-router-dom";
import {IsLoggedContext} from "../../providers/IsLoggedProvider";
import { slide as Menu } from "react-burger-menu";

import './index.scss';

export default function Header() {
  const { logInOut } = useContext(IsLoggedContext);
  const { isLogged } = useContext(IsLoggedContext);
  const history = useHistory();
  
  const log = () => {
    isLogged ? (history.push(routes.order) || localStorage.clear()) : history.push(routes.login);
    logInOut()
  }

  return <div className="header" id="header">
    <Link to={routes.order}>
      <div className="logo">CLOCKWARE</div>
    </Link>
    <div className="links_wrapper">
      <Link to={routes.masters}>
        <div className="links" hidden={!isLogged}>Masters</div>
      </Link> 
      <Link to={routes.cities}>
        <div className="links" hidden={!isLogged}>Cities</div>
      </Link> 
      <Link to={routes.orders}>
        <div className="links" hidden={!isLogged}>Orders</div>
      </Link> 
      <div onClick={()=>log()} className="links">{isLogged ? "Log out" : "Log in"}</div>
    </div>
    <div className="burger">  
      <Menu pageWrapId={"page-wrap"} outerContainerId={"header"} >
        <Link to={routes.masters}>
          <div className="links" hidden={!isLogged}>Masters</div>
        </Link> 
        <Link to={routes.cities}>
          <div className="links" hidden={!isLogged}>Cities</div>
        </Link> 
        <Link to={routes.orders}>
          <div className="links" hidden={!isLogged}>Orders</div>
        </Link> 
        <div onClick={()=>log()} className="links">{isLogged ? "Log out" : "Log in"}</div>
      </Menu>
    </div>
  </div>
}