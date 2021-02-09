import React, {FunctionComponent} from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import { routes } from "../../constants/routes";
import { useSelector, useDispatch } from "react-redux";
import {userParams} from "../../store/users/selectors";
import {UserData} from "../../store/users/actions";
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { switchLanguage } from '../../store/language/actions';
import { useTranslation } from 'react-i18next';
import { currentLanguage } from '../../store/language/selectors';
import { LoginBtns } from './LoginBtns';

interface Props {
  open: boolean,
  onClick: () => void
}

const Ul = styled.ul`
  list-style: none;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  margin: 0;
  .language_menu {
    display: flex;
    align-items: center;
    >* {
      margin-left: 10px;
    }
  }
  li {
    margin: 0 10px 0 10px;
  }
  .login_btn, .sign_up_btn {
    display: none
  }
  z-index: 9999;
  @media (max-width: 1080px) {
    align-items: flex-start;
    flex-flow: column nowrap;
    background: #F2F2F2;
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
      margin: 14px;
    }
    .login_btn, .sign_up_btn {
      display: block
    }
  }
`;

export const RightNav: FunctionComponent<Props> = ({ open, onClick }) => {
  const language: string = useSelector(currentLanguage)
  const userData: UserData = useSelector(userParams);
  const dispatch: Function = useDispatch();
  const isAdmin: boolean = userData && userData.role === "admin";
  const { t } = useTranslation('common')

  const languageMenu = (
    <Menu>
      <Menu.Item 
        key="0" 
        onClick={() => dispatch(switchLanguage("en"))} 
        className={language === "en" ? "selected_language" : ""}
      >
        <img className="country_flag" src="http://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg"/>
      </Menu.Item>
      <Menu.Item 
        key="1" 
        onClick={() => dispatch(switchLanguage("ru"))}
        className={language === "ru" ? "selected_language" : ""}
      >
        <img className="country_flag" src="http://purecatamphetamine.github.io/country-flag-icons/3x2/RU.svg"/>
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
      <li hidden={!userData || !isAdmin}>
        <Link to={routes.map} onClick={onClick}>
          <div className="links">{t("Header.Map")}</div>
        </Link>
      </li>
      <li>
        <div className="links">
        <Dropdown overlay={languageMenu} trigger={['click']}>
          <div className="language_menu">
            {t("Header.Language")} <DownOutlined/>
          </div>
        </Dropdown>
        </div>
      </li>
      <li>
      <Link to={routes.about} onClick={onClick}>
        <div className="links">{t("Header.About")}</div>
      </Link>
      </li>
      <li>
        <LoginBtns classNameSignIn="login_btn" classNameSignUp="sign_up_btn" onClick={onClick}/>
      </li>
    </Ul>
  )
}