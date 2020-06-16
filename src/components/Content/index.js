import React from "react";
import './index.scss';

export default function Content({children}) {
  return <div className="content">
    {children}
  </div>
}