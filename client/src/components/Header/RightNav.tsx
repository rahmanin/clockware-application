import React, {FunctionComponent, useEffect} from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import { routes } from "../../constants/routes";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {userParams} from "../../store/users/selectors";
import {logOut} from "../../store/users/actions";
import {UserData} from "../../store/users/actions";
import { updateElement } from '../../api/updateElement';

interface Props {
  open: boolean,
  onClick: () => void
}

const Ul = styled.ul`
  list-style: none;
  display: flex;
  flex-flow: row nowrap;
  li {
    padding: 18px 10px;
  }
  z-index: 2;
  @media (max-width: 768px) {
    flex-flow: column nowrap;
    background: linear-gradient(0deg, rgba(191,190,200,1) 0%, rgba(188,193,204,0.4) 6%, rgba(152,165,199,1) 100%);
    position: fixed;
    transform: ${({ open }: {open: boolean}) => open ? 'translateX(0)' : 'translateX(100%)'};
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

export const RightNav: FunctionComponent<Props> = ({ open, onClick }) => {
  const userData: UserData = useSelector(userParams);
  const history = useHistory();
  const dispatch: Function = useDispatch();
  const isAdmin: boolean = userData && userData.role === "admin";
  const logOutAndDeleteSubscription = () => {
    updateElement({endpoint: localStorage.subscription}, "DELETE", "notifications/unsubscribe")
    dispatch(logOut())
  }
  const logIn = () => {
    userData && userData.userId ? logOutAndDeleteSubscription() : history.push(routes.login);
    onClick()
  }
  return (
    <Ul open={open}>
      <li hidden={!userData || !isAdmin}>
        <Link to={routes.calendar} onClick={onClick}>
          <div className="links">Calendar</div>
        </Link>
      </li>
      <li hidden={!userData || !isAdmin}>
        <Link to={routes.diagrams} onClick={onClick}>
          <div className="links">Statistics</div>
        </Link>
      </li>
      <li hidden={!userData || !isAdmin}>
        <Link to={routes.masters} onClick={onClick}>
          <div className="links">Masters</div>
        </Link>
      </li>
      <li hidden={!userData || !isAdmin}>
        <Link to={routes.cities} onClick={onClick}>
          <div className="links">Cities</div>
        </Link> 
      </li>
      <li hidden={!userData || !userData.role}>
        <Link to={routes.orders} onClick={onClick}>
          <div className="links" >Orders</div>
        </Link> 
      </li>
      <li hidden={!userData || !isAdmin}>
        <Link to={routes.prices} onClick={onClick}>
          <div className="links" >Prices</div>
        </Link>
      </li>
      <li>
        <Link to={routes.blog} onClick={onClick}>
          <div className="links" >Blog</div>
        </Link>
      </li>
      <li hidden={!userData || !isAdmin}>
        <Link to={routes.blogEditor} onClick={onClick}>
          <div className="links" >Blog editor</div>
        </Link>
      </li>
      <li>
        <div className="links" onClick={logIn}>{userData && userData.role ? "Log out" : "Log in"}</div>
      </li>
    </Ul>
  )
}