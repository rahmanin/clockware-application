import React, { FunctionComponent } from "react";
import './index.scss';

interface Props {
  children: React.ReactNode
}

export const Content: FunctionComponent<Props> = ({children}) => {
  return <div className="content">
    {children}
  </div>
}