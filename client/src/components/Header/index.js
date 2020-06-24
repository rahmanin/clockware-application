import React from "react";
import {Link} from 'react-router-dom';
import { routes } from "../../constants/routes";
import './index.scss';

export default function Header() {

  return <div className="header">
    <Link to={routes.order}>
      <div className="logo">CLOCKWARE</div>
    </Link>
    <Link to={routes.login}>
      <div className="login">Log in</div>
    </Link>
  </div>
}