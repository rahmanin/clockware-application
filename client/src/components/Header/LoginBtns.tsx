import React, {FunctionComponent} from 'react';
import { routes } from "../../constants/routes";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {userParams} from "../../store/users/selectors";
import {logOut} from "../../store/users/actions";
import {UserData} from "../../store/users/actions";
import { updateElement } from '../../api/updateElement';
import { useTranslation } from 'react-i18next';
import './index.scss';

interface Props {
  onClick: () => void,
  classNameSignIn: string
  classNameSignUp: string
}

export const LoginBtns: FunctionComponent<Props> = ({ onClick, classNameSignIn, classNameSignUp }) => {
  const userData: UserData = useSelector(userParams);
  const history = useHistory();
  const dispatch: Function = useDispatch();
  const { t } = useTranslation('common')

  const logIn = () => {
    userData && userData.userId ? logOutAndDeleteSubscription() : history.push(routes.login);
    onClick()
  }

  const logOutAndDeleteSubscription = () => {
    updateElement({endpoint: localStorage.subscription}, "DELETE", "notifications/unsubscribe")
    dispatch(logOut())
    history.push(routes.login)
  }

  return ( 
    <div className="login_btns_wrapper" style={{}}>
      <div 
        className={classNameSignIn} 
        onClick={logIn}>{userData && userData.role ? t("Header.Log out") : t("Header.Log in")}
      </div>
      <div 
        hidden={!!userData?.userId} 
        className={classNameSignUp} 
        onClick={() => {
          history.push(routes.login)
          onClick()
        }}
      >
        {t("Header.Sign up")}
      </div>
    </div>
  )
}