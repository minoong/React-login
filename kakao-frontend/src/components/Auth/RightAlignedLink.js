import React from "react";
import { Link } from "react-router-dom";
import oc from "open-color";
import styled from "styled-components";

const Aligner = styled.div`
  margin-top: 1rem;
  text-align: right;
`;

const StyledLink = styled(Link)`
  color: ${oc.gray[6]};
  &:hover {
    color: ${oc.gray[7]};
  }
`;

const RightAlignedLink = ({ to, children }) => {
  return (
    <Aligner>
      <StyledLink to={to}>{children}</StyledLink>
    </Aligner>
  );
};

export default RightAlignedLink;
