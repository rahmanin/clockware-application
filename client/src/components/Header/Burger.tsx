import React, { useState, FunctionComponent } from "react";
import styled, { StyledComponent } from "styled-components";
import {RightNav} from "./RightNav";

interface Prop {
  open: boolean
}

const StyledBurger: StyledComponent<"div", any, Prop, never> = styled.div`
  width: 2rem;
  height: 2rem;
  position: fixed;
  top: 15px;
  right: 20px;
  z-index: 20;
  display: none;
  @media (max-width: 1016px) {
    display: flex;
    justify-content: space-around;
    flex-flow: column nowrap;
  }
  div {
    width: 2rem;
    height: 0.25rem;
    background-color: #333;
    border-radius: 10px;
    transform-origin: 1px;
    transition: all 0.3s linear;
    &:nth-child(1) {
      transform: ${({ open }: Prop) => (open ? "rotate(45deg)" : "rotate(0)")};
    }
    &:nth-child(2) {
      transform: ${({ open }: Prop) => (open ? "translateX(100%)" : "translateX(0)")};
      opacity: ${({ open }: Prop) => (open ? 0 : 1)};
    }
    &:nth-child(3) {
      transform: ${({ open }: Prop) => (open ? "rotate(-45deg)" : "rotate(0)")};
    }
  }
`;

export const Burger: FunctionComponent = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <StyledBurger open={open} onClick={() => setOpen(!open)}>
        <div />
        <div />
        <div />
      </StyledBurger>
      <RightNav open={open} onClick={() => setOpen(false)} />
    </>
  );
};
