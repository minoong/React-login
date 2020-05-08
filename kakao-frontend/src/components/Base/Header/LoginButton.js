import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import oc from "open-color";
import { shadow } from "../../../lib/styleUtil";

const BorderButton = styled(Link)`
  font-weight: 600;
  color: ${oc.yellow[6]};
  border: 1px solid ${oc.yellow[6]};
  padding: 0.5rem;
  padding-bottom: 0.4rem;
  cursor: pointer;
  border-radius: 2px;
  text-decoration: none;
  transition: 0.2s all;

  &:hover {
    background: ${oc.yellow[6]};
    color: white;
    ${shadow(1)}
  }

  &:active {
    transform: translateY(3px);
  }
`;

const LoginButton = () => {
  return <BorderButton to="/auth/login">로그인 / 가입</BorderButton>;
};

export default LoginButton;
