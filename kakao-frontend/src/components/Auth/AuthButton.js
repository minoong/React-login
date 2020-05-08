import React from "react";
import styled from "styled-components";
import oc from "open-color";
import { shadow } from "../../lib/styleUtil";

const Wrapper = styled.div`
  margin-top: 1rem;
  padding-top: 0.6rem;
  padding-bottom: 0.5rem;

  background: ${oc.yellow[6]};
  color: white;

  text-align: center;
  font-size: 1.25rem;
  font-weight: 500;

  cursor: pointer;
  user-select: none;
  transition: 0.2s all;

  &:hover {
    background: ${oc.yellow[5]};
    ${shadow(0)}
  }

  &:active {
    background: ${oc.yellow[7]};
  }
`;

const AuthButton = ({ children, onClick }) => {
  return <Wrapper onClick={onClick}>{children}</Wrapper>;
};

export default AuthButton;
