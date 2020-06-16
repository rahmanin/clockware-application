import React from "react";
import classNames from 'classnames';
import './index.scss';

export default function Button({title, onClick, type, disabled, color}) {
  return <button 
    className={classNames('button', {[`button--${color}`]: color})}
    disabled={disabled}
    type={type} 
    onClick={onClick}>{title}</button>
}