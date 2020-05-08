import React from "react";
import Header, { LoginButton } from "../../components/Base/Header";
import { useSelector } from "react-redux";

const HeaderContainer = () => {
  const { base } = useSelector(({ base }) => ({ base }));

  if (!base.getIn(["header", "visible"])) {
    return null;
  }
  return (
    <>
      <Header>
        <LoginButton />
      </Header>
    </>
  );
};

export default HeaderContainer;
