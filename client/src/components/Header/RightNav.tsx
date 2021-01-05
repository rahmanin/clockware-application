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
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { switchLanguage } from '../../store/language/actions';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('common')
  const logOutAndDeleteSubscription = () => {
    updateElement({endpoint: localStorage.subscription}, "DELETE", "notifications/unsubscribe")
    dispatch(logOut())
    history.push(routes.login)
  }
  const logIn = () => {
    userData && userData.userId ? logOutAndDeleteSubscription() : history.push(routes.login);
    onClick()
  }

  const languageMenu = (
    <Menu>
      <Menu.Item key="0" onClick={() => dispatch(switchLanguage("en"))}>
        en
      </Menu.Item>
      <Menu.Item key="1" onClick={() => dispatch(switchLanguage("ru"))}>
        ru
      </Menu.Item>
    </Menu>
  );

  return (
    <Ul open={open}>
      <li hidden={!userData || !isAdmin}>
        <Link to={routes.calendar} onClick={onClick}>
          <div className="links">{t("Header.Calendar")}</div>
        </Link>
      </li>
      <li hidden={!userData || !isAdmin}>
        <Link to={routes.diagrams} onClick={onClick}>
          <div className="links">{t("Header.Statistics")}</div>
        </Link>
      </li>
      <li hidden={!userData || !isAdmin}>
        <Link to={routes.masters} onClick={onClick}>
          <div className="links">{t("Header.Masters")}</div>
        </Link>
      </li>
      <li hidden={!userData || !isAdmin}>
        <Link to={routes.cities} onClick={onClick}>
          <div className="links">{t("Header.Cities")}</div>
        </Link> 
      </li>
      <li hidden={!userData || !userData.role}>
        <Link to={routes.orders} onClick={onClick}>
          <div className="links">{t("Header.Orders")}</div>
        </Link> 
      </li>
      <li hidden={!userData || !isAdmin}>
        <Link to={routes.prices} onClick={onClick}>
          <div className="links">{t("Header.Prices")}</div>
        </Link>
      </li>
      <li>
        <Link to={routes.blog} onClick={onClick}>
          <div className="links">{t("Header.Blog")}</div>
        </Link>
      </li>
      <li>
        <div className="links">
        <Dropdown overlay={languageMenu} trigger={['click']}>
          <div>
            {t("Header.Language")} <DownOutlined />
          </div>
        </Dropdown>
        </div>
      </li>
      <li>
        <div className="links" onClick={logIn}>{userData && userData.role ? t("Header.Log out") : t("Header.Log in")}</div>
      </li>
    </Ul>
  )
}