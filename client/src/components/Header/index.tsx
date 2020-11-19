import React, {FunctionComponent} from "react";
import {Navbar} from './Navbar';

import './index.scss';

export const Header: FunctionComponent = () => {
  return ( 
  <div className="header" id="header">
    <Navbar />
  </div>
  )
}