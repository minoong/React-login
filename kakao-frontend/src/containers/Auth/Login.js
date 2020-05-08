import React, { useEffect } from "react";
import {
  AuthContent,
  InputWithLabel,
  AuthButton,
  RightAlignedLink,
} from "../../components/Auth";
import { useDispatch, useSelector } from "react-redux";
import { changeInput, initializeForm } from "../../redux/modules/auth";

const Login = () => {
  const { email, password } = useSelector(({ auth }) => {
    return auth.getIn(["login", "form"]).toJS();
  });

  const dispatch = useDispatch();
  const handleChange = (e) => {
    const { name, value } = e.target;

    dispatch(
      changeInput({
        name,
        value,
        form: "login",
      })
    );
  };
  useEffect(() => {
    return () => {
      dispatch(initializeForm("login"));
    };
  }, [dispatch]);
  return (
    <AuthContent title="로그인">
      <InputWithLabel
        label="이메일"
        name="email"
        placeholder="이메일"
        value={email}
        onChange={handleChange}
      />
      <InputWithLabel
        label="비밀번호"
        name="password"
        placeholder="비밀번호"
        type="password"
        value={password}
        onChange={handleChange}
      />
      <AuthButton>로그인</AuthButton>
      <RightAlignedLink to="/auth/register">회원가입</RightAlignedLink>
    </AuthContent>
  );
};

export default React.memo(Login);
