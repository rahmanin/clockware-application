import React, {FunctionComponent} from "react";

import './index.scss';

export const Loader: FunctionComponent = () => {
  return <div className="isLoading">
    <div className="circle c_1"></div>
    <div className="circle c_2"></div>
    <div className="circle c_3"></div>
  </div>
}