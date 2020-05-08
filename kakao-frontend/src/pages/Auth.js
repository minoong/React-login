import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import * as baseActions from "redux/modules/base";
import { AuthWrapper } from "../components/Auth";
import { Route } from "react-router-dom";
import { Login, Register } from "../containers/Auth";

const Auth = () => {
  const dispatch = useDispatch();
  const { base } = useSelector(({ base }) => ({
    base,
  }));

  useEffect(() => {
    dispatch(baseActions.setHeaderVisibility(false));

    return () => {
      dispatch(baseActions.setHeaderVisibility(true));
    };
  }, [dispatch]);

  return (
    <>
      <AuthWrapper>
        <Route path="/auth/login" component={Login} />
        <Route path="/auth/register" component={Register} />
      </AuthWrapper>
    </>
  );
};

export default Auth;
