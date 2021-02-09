import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import {Burger} from './Burger';
import { routes } from "../../constants/routes";
import {Link} from 'react-router-dom';

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  .logo {
    margin-left: 5px;
    font-size: 40px;
    color: rgb(0, 0, 0);
  }
`

export const Navbar: FunctionComponent = () => {
  return (
    <div className="header_background">
      <Nav className="header_wrapper">
        <Link to={routes.order} className="header_logo">
          <div className="logo_png"></div>
          <p>Clockware</p>
        </Link>
        <Burger />
      </Nav>
    </div>
  )
}