import React, { FunctionComponent } from "react";
import classNames from 'classnames';
import './index.scss';

interface Props {
  id?: string,
  title: string,
  onClick?: () => void,
  type?: "submit"|"reset"|"button",
  disabled: boolean,
  color: string
}

export const Button: FunctionComponent<Props> = ({title, onClick, type, disabled, color}) => {
  return <button 
    className={classNames('button', {[`button--${color}`]: color})}
    disabled={disabled}
    type={type} 
    onClick={onClick}>{title}</button>
}