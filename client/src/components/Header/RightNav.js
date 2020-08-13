import React, { useContext } from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import { routes } from "../../constants/routes";
import { useHistory } from "react-router-dom";
import {IsLoggedContext} from "../../providers/IsLoggedProvider";

const Ul = styled.ul`
  list-style: none;
  display: flex;
  flex-flow: row nowrap;
  li {
    padding: 18px 10px;
  }
  z-index: 1;
  @media (max-width: 768px) {
    flex-flow: column nowrap;
    background-color: rgba(209, 209, 209, 0.9);
    position: fixed;
    transform: ${({ open }) => open ? 'translateX(0)' : 'translateX(100%)'};
    top: 0;
    right: 0;
    height: 100vh;
    width: 300px;
    padding-top: 3.5rem;
    transition: transform 0.3s ease-in-out;
    li {
      color: #fff;
    }
  }
`;

const RightNav = ({ open, onClick }) => {
  
  const { logInOut } = useContext(IsLoggedContext);
  const { isLogged } = useContext(IsLoggedContext);
  const history = useHistory();

  const log = () => {
    isLogged ? (history.push(routes.order) || localStorage.clear()) : history.push(routes.login);
    logInOut()
  }

  return (
    <Ul open={open}>
      <li hidden={!isLogged}>
        <Link to={routes.masters} onClick={onClick}>
          <div className="links">Masters</div>
        </Link>
      </li>
      <li hidden={!isLogged}>
        <Link to={routes.cities} onClick={onClick}>
          <div className="links">Cities</div>
        </Link> 
      </li>
      <li hidden={!isLogged}>
        <Link to={routes.orders} onClick={onClick}>
          <div className="links" >Orders</div>
        </Link> 
      </li>
      <li hidden={!isLogged}>
        <Link to={routes.prices} onClick={onClick}>
          <div className="links" >Prices</div>
        </Link>
      </li>
      <li>
        <div className="links" onClick={()=>log()}>{isLogged ? "Log out" : "Log in"}</div>
      </li>
    </Ul>
  )
}

export default RightNav